// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ExchangeRateOracle
 * @dev Manages exchange rates for multiple currencies with staleness protection
 */
contract ExchangeRateOracle {
    address public owner;
    address public rateUpdater;
    bool public frozen;

    enum Currency { USD, MXN, BRL, ARS, COP, GTQ }

    struct RateData {
        uint256 rate; // Rate in 18 decimals (1 USD = rate * 10^18)
        uint256 timestamp;
        bool exists;
    }

    // Exchange rates relative to USD
    mapping(Currency => RateData) private rates;

    // Historical rates (limited storage)
    mapping(Currency => mapping(uint256 => uint256)) private historicalRates;

    // Staleness threshold (1 hour)
    uint256 public constant STALENESS_THRESHOLD = 3600;

    // Maximum rate age for transactions (24 hours)
    uint256 public constant MAX_RATE_AGE = 86400;

    // Events
    event RateUpdated(Currency indexed currency, uint256 rate, uint256 timestamp);
    event BatchRatesUpdated(uint256 count, uint256 timestamp);
    event RateUpdaterChanged(address indexed oldUpdater, address indexed newUpdater);
    event OracleFrozen(address indexed by, uint256 timestamp);
    event OracleUnfrozen(address indexed by, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRateUpdater() {
        require(msg.sender == rateUpdater || msg.sender == owner, "Not authorized");
        _;
    }

    modifier notFrozen() {
        require(!frozen, "Oracle frozen");
        _;
    }

    constructor() {
        owner = msg.sender;
        rateUpdater = msg.sender;

        // Initialize USD as base currency (1:1)
        rates[Currency.USD] = RateData({
            rate: 1 * 10**18,
            timestamp: block.timestamp,
            exists: true
        });
    }

    /**
     * @dev Update exchange rate for a single currency
     */
    function updateRate(
        Currency currency,
        uint256 rate,
        uint256 timestamp
    ) external onlyRateUpdater notFrozen {
        require(rate > 0, "Rate must be > 0");
        require(timestamp <= block.timestamp, "Future timestamp");
        require(timestamp >= block.timestamp - 300, "Timestamp too old"); // Max 5 min old

        rates[currency] = RateData({
            rate: rate,
            timestamp: timestamp,
            exists: true
        });

        // Store historical rate (daily snapshots)
        uint256 dayKey = timestamp / 86400;
        historicalRates[currency][dayKey] = rate;

        emit RateUpdated(currency, rate, timestamp);
    }

    /**
     * @dev Batch update rates for efficiency
     */
    function batchUpdateRates(
        Currency[] calldata currencies,
        uint256[] calldata rateValues
    ) external onlyRateUpdater notFrozen {
        require(currencies.length == rateValues.length, "Length mismatch");
        require(currencies.length > 0, "Empty arrays");

        for (uint256 i = 0; i < currencies.length; i++) {
            require(rateValues[i] > 0, "Rate must be > 0");

            rates[currencies[i]] = RateData({
                rate: rateValues[i],
                timestamp: block.timestamp,
                exists: true
            });

            // Store historical rate
            uint256 dayKey = block.timestamp / 86400;
            historicalRates[currencies[i]][dayKey] = rateValues[i];
        }

        emit BatchRatesUpdated(currencies.length, block.timestamp);
    }

    /**
     * @dev Get current rate for a currency
     */
    function getRate(Currency currency) external view returns (uint256) {
        require(rates[currency].exists, "Rate not set");
        require(!isStale(currency), "Rate is stale");

        return rates[currency].rate;
    }

    /**
     * @dev Get rate with age information
     */
    function getRateWithAge(Currency currency) external view returns (
        uint256 rate,
        uint256 age,
        bool isStaleRate
    ) {
        require(rates[currency].exists, "Rate not set");

        RateData memory data = rates[currency];
        uint256 rateAge = block.timestamp - data.timestamp;

        return (
            data.rate,
            rateAge,
            rateAge > STALENESS_THRESHOLD
        );
    }

    /**
     * @dev Calculate conversion between two currencies
     */
    function calculateConversion(
        Currency fromCurrency,
        Currency toCurrency,
        uint256 amount
    ) external view returns (uint256) {
        require(rates[fromCurrency].exists, "From rate not set");
        require(rates[toCurrency].exists, "To rate not set");
        require(!isStale(fromCurrency), "From rate stale");
        require(!isStale(toCurrency), "To rate stale");

        // If same currency, no conversion
        if (fromCurrency == toCurrency) {
            return amount;
        }

        // Convert to USD first, then to target currency
        uint256 usdAmount = (amount * 10**18) / rates[fromCurrency].rate;
        uint256 targetAmount = (usdAmount * rates[toCurrency].rate) / 10**18;

        return targetAmount;
    }

    /**
     * @dev Get historical rate for a specific day
     */
    function getHistoricalRate(Currency currency, uint256 timestamp) external view returns (uint256) {
        uint256 dayKey = timestamp / 86400;
        uint256 historicalRate = historicalRates[currency][dayKey];
        require(historicalRate > 0, "Historical rate not found");

        return historicalRate;
    }

    /**
     * @dev Check if a rate is stale
     */
    function isStale(Currency currency) public view returns (bool) {
        if (!rates[currency].exists) return true;

        uint256 age = block.timestamp - rates[currency].timestamp;
        return age > STALENESS_THRESHOLD;
    }

    /**
     * @dev Check if rate is too old for transactions
     */
    function isRateTooOld(Currency currency) public view returns (bool) {
        if (!rates[currency].exists) return true;

        uint256 age = block.timestamp - rates[currency].timestamp;
        return age > MAX_RATE_AGE;
    }

    /**
     * @dev Get all current rates
     */
    function getAllRates() external view returns (
        uint256[6] memory rateValues,
        uint256[6] memory timestamps,
        bool[6] memory staleFlags
    ) {
        Currency[6] memory currencies = [
            Currency.USD,
            Currency.MXN,
            Currency.BRL,
            Currency.ARS,
            Currency.COP,
            Currency.GTQ
        ];

        for (uint256 i = 0; i < 6; i++) {
            rateValues[i] = rates[currencies[i]].rate;
            timestamps[i] = rates[currencies[i]].timestamp;
            staleFlags[i] = isStale(currencies[i]);
        }

        return (rateValues, timestamps, staleFlags);
    }

    /**
     * @dev Set rate updater address
     */
    function setRateUpdater(address newUpdater) external onlyOwner {
        require(newUpdater != address(0), "Invalid address");
        address oldUpdater = rateUpdater;
        rateUpdater = newUpdater;

        emit RateUpdaterChanged(oldUpdater, newUpdater);
    }

    /**
     * @dev Freeze oracle (emergency)
     */
    function freeze() external onlyOwner {
        require(!frozen, "Already frozen");
        frozen = true;
        emit OracleFrozen(msg.sender, block.timestamp);
    }

    /**
     * @dev Unfreeze oracle
     */
    function unfreeze() external onlyOwner {
        require(frozen, "Not frozen");
        frozen = false;
        emit OracleUnfrozen(msg.sender, block.timestamp);
    }

    /**
     * @dev Get rate timestamp
     */
    function getRateTimestamp(Currency currency) external view returns (uint256) {
        require(rates[currency].exists, "Rate not set");
        return rates[currency].timestamp;
    }

    /**
     * @dev Check if rate exists
     */
    function rateExists(Currency currency) external view returns (bool) {
        return rates[currency].exists;
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title RemittanceVault
 * @dev Core remittance contract with multi-currency support and fee management
 */
contract RemittanceVault {
    // Custom reentrancy guard
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address public owner;
    address public oracleAddress;
    bool public paused;

    // Fee in basis points (50 = 0.5%)
    uint256 public constant FEE_BASIS_POINTS = 50;
    uint256 public constant BASIS_POINTS_DIVISOR = 10000;

    // Supported currencies
    enum Currency { USD, MXN, BRL, ARS, COP, GTQ }

    // User balances: user => currency => amount
    mapping(address => mapping(Currency => uint256)) private balances;

    // Total fees collected per currency
    mapping(Currency => uint256) public collectedFees;

    // Transaction history
    struct Transaction {
        address sender;
        address recipient;
        Currency fromCurrency;
        Currency toCurrency;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
    }

    Transaction[] public transactions;
    mapping(address => uint256[]) public userTransactions;

    // Events
    event Deposit(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event RemittanceSent(
        address indexed sender,
        address indexed recipient,
        Currency fromCurrency,
        Currency toCurrency,
        uint256 amountSent,
        uint256 amountReceived,
        uint256 fee,
        uint256 timestamp,
        uint256 transactionId
    );
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event Paused(address indexed by);
    event Unpaused(address indexed by);
    event FeeWithdrawn(Currency currency, uint256 amount, address indexed to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Not oracle");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrancy");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
        paused = false;
    }

    /**
     * @dev Set the oracle address for exchange rate updates
     */
    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Invalid oracle");
        address oldOracle = oracleAddress;
        oracleAddress = _oracle;
        emit OracleUpdated(oldOracle, _oracle);
    }

    /**
     * @dev Deposit funds into the vault
     */
    function depositFunds(Currency currency, uint256 amount) external payable whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");

        balances[msg.sender][currency] += amount;
        emit Deposit(msg.sender, currency, amount, block.timestamp);
    }

    /**
     * @dev Withdraw funds from the vault
     */
    function withdrawFunds(Currency currency, uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender][currency] >= amount, "Insufficient balance");

        balances[msg.sender][currency] -= amount;
        emit Withdrawal(msg.sender, currency, amount, block.timestamp);
    }

    /**
     * @dev Send remittance from one user to another with currency conversion
     */
    function sendRemittance(
        address recipient,
        Currency fromCurrency,
        Currency toCurrency,
        uint256 amount
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot send to self");
        require(amount > 0, "Amount must be > 0");
        require(balances[msg.sender][fromCurrency] >= amount, "Insufficient balance");

        // Calculate fee
        uint256 fee = calculateFee(amount);
        uint256 amountAfterFee = amount - fee;

        // For same currency, no conversion needed
        uint256 convertedAmount = amountAfterFee;

        // If currencies differ, conversion would happen via oracle
        // For now, assuming 1:1 conversion rate (will be updated by oracle integration)
        if (fromCurrency != toCurrency) {
            convertedAmount = amountAfterFee; // Simplified for now
        }

        // Update balances
        balances[msg.sender][fromCurrency] -= amount;
        balances[recipient][toCurrency] += convertedAmount;
        collectedFees[fromCurrency] += fee;

        // Record transaction
        uint256 txId = transactions.length;
        transactions.push(Transaction({
            sender: msg.sender,
            recipient: recipient,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            amount: amount,
            fee: fee,
            timestamp: block.timestamp
        }));

        userTransactions[msg.sender].push(txId);
        userTransactions[recipient].push(txId);

        emit RemittanceSent(
            msg.sender,
            recipient,
            fromCurrency,
            toCurrency,
            amount,
            convertedAmount,
            fee,
            block.timestamp,
            txId
        );

        return txId;
    }

    /**
     * @dev Calculate fee for a given amount
     */
    function calculateFee(uint256 amount) public pure returns (uint256) {
        return (amount * FEE_BASIS_POINTS) / BASIS_POINTS_DIVISOR;
    }

    /**
     * @dev Get user balance for a specific currency
     */
    function getBalance(address user, Currency currency) external view returns (uint256) {
        return balances[user][currency];
    }

    /**
     * @dev Get all balances for a user
     */
    function getAllBalances(address user) external view returns (uint256[6] memory) {
        return [
            balances[user][Currency.USD],
            balances[user][Currency.MXN],
            balances[user][Currency.BRL],
            balances[user][Currency.ARS],
            balances[user][Currency.COP],
            balances[user][Currency.GTQ]
        ];
    }

    /**
     * @dev Get transaction count
     */
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    /**
     * @dev Get user transaction IDs
     */
    function getUserTransactions(address user) external view returns (uint256[] memory) {
        return userTransactions[user];
    }

    /**
     * @dev Get transaction details
     */
    function getTransaction(uint256 txId) external view returns (
        address sender,
        address recipient,
        Currency fromCurrency,
        Currency toCurrency,
        uint256 amount,
        uint256 fee,
        uint256 timestamp
    ) {
        require(txId < transactions.length, "Invalid txId");
        Transaction memory txn = transactions[txId];
        return (
            txn.sender,
            txn.recipient,
            txn.fromCurrency,
            txn.toCurrency,
            txn.amount,
            txn.fee,
            txn.timestamp
        );
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        require(!paused, "Already paused");
        paused = true;
        emit Paused(msg.sender);
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        require(paused, "Not paused");
        paused = false;
        emit Unpaused(msg.sender);
    }

    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees(Currency currency, uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(collectedFees[currency] >= amount, "Insufficient fees");

        collectedFees[currency] -= amount;
        balances[owner][currency] += amount;

        emit FeeWithdrawn(currency, amount, owner);
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

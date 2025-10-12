// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IRemittanceVault {
    enum Currency { USD, MXN, BRL, ARS, COP, GTQ }
    function getBalance(address user, Currency currency) external view returns (uint256);
    function transferFrom(address from, address to, Currency currency, uint256 amount) external returns (bool);
}

/**
 * @title SavingsPool
 * @dev Yield farming system with interest calculation and savings goals
 * NOW INTEGRATED with RemittanceVault
 */
contract SavingsPool {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address public owner;
    IRemittanceVault public remittanceVault;

    enum Currency { USD, MXN, BRL, ARS, COP, GTQ }

    struct SavingsAccount {
        uint256 principal;
        uint256 lastUpdateTime;
        uint256 accumulatedYield;
        uint256 totalYieldClaimed;
        uint256 savingsGoal;
    }

    // User savings: user => currency => SavingsAccount
    mapping(address => mapping(Currency => SavingsAccount)) private savings;

    // APY per currency (in basis points, 500 = 5%)
    mapping(Currency => uint256) public apy;

    // Total deposited per currency
    mapping(Currency => uint256) public totalDeposited;

    // Constants
    uint256 public constant DEFAULT_APY = 500; // 5%
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;

    // Events
    event Deposited(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event YieldClaimed(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event YieldCompounded(address indexed user, Currency currency, uint256 amount, uint256 timestamp);
    event APYUpdated(Currency currency, uint256 oldAPY, uint256 newAPY, uint256 timestamp);
    event SavingsGoalSet(address indexed user, Currency currency, uint256 goalAmount, uint256 timestamp);
    event SavingsGoalReached(address indexed user, Currency currency, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "Reentrancy");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }

    constructor(address _remittanceVault) {
        owner = msg.sender;
        _status = _NOT_ENTERED;
        remittanceVault = IRemittanceVault(_remittanceVault);

        // Initialize default APY for all currencies
        apy[Currency.USD] = DEFAULT_APY;
        apy[Currency.MXN] = DEFAULT_APY;
        apy[Currency.BRL] = DEFAULT_APY;
        apy[Currency.ARS] = DEFAULT_APY;
        apy[Currency.COP] = DEFAULT_APY;
        apy[Currency.GTQ] = DEFAULT_APY;
    }

    /**
     * @dev Deposit funds to savings FROM RemittanceVault balance
     * CRITICAL: This now actually transfers from your LatinBridge balance
     */
    function depositToSavings(Currency currency, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        // CHECK: User must have balance in RemittanceVault
        require(remittanceVault.getBalance(msg.sender, currency) >= amount, "Insufficient RemittanceVault balance");

        // TRANSFER: Move funds from RemittanceVault to SavingsPool
        require(remittanceVault.transferFrom(msg.sender, address(this), currency, amount), "Transfer failed");

        // Update yield before deposit
        _updateYield(msg.sender, currency);

        SavingsAccount storage account = savings[msg.sender][currency];
        account.principal += amount;
        totalDeposited[currency] += amount;

        emit Deposited(msg.sender, currency, amount, block.timestamp);

        // Check if goal reached
        if (account.savingsGoal > 0 && account.principal >= account.savingsGoal) {
            emit SavingsGoalReached(msg.sender, currency, account.principal, block.timestamp);
        }
    }

    /**
     * @dev Withdraw funds from savings BACK TO RemittanceVault
     * CRITICAL: This returns money to your LatinBridge balance
     */
    function withdrawFromSavings(Currency currency, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        // Update yield before withdrawal
        _updateYield(msg.sender, currency);

        SavingsAccount storage account = savings[msg.sender][currency];
        require(account.principal >= amount, "Insufficient balance");

        account.principal -= amount;
        totalDeposited[currency] -= amount;

        // TRANSFER BACK: Move funds from SavingsPool to RemittanceVault
        require(remittanceVault.transferFrom(address(this), msg.sender, currency, amount), "Transfer back failed");

        emit Withdrawn(msg.sender, currency, amount, block.timestamp);
    }

    /**
     * @dev Calculate pending yield for a user
     */
    function calculateYield(address user, Currency currency) public view returns (uint256) {
        SavingsAccount memory account = savings[user][currency];

        if (account.principal == 0) {
            return account.accumulatedYield;
        }

        uint256 timeElapsed = block.timestamp - account.lastUpdateTime;
        uint256 interest = _calculateInterest(account.principal, apy[currency], timeElapsed);

        return account.accumulatedYield + interest;
    }

    /**
     * @dev Claim accumulated yield
     */
    function claimYield(Currency currency) external nonReentrant {
        _updateYield(msg.sender, currency);

        SavingsAccount storage account = savings[msg.sender][currency];
        uint256 yieldAmount = account.accumulatedYield;

        require(yieldAmount > 0, "No yield to claim");

        account.accumulatedYield = 0;
        account.totalYieldClaimed += yieldAmount;

        emit YieldClaimed(msg.sender, currency, yieldAmount, block.timestamp);
    }

    /**
     * @dev Compound interest (add yield to principal)
     */
    function compoundInterest(Currency currency) external nonReentrant {
        _updateYield(msg.sender, currency);

        SavingsAccount storage account = savings[msg.sender][currency];
        uint256 yieldAmount = account.accumulatedYield;

        require(yieldAmount > 0, "No yield to compound");

        account.principal += yieldAmount;
        account.accumulatedYield = 0;
        account.totalYieldClaimed += yieldAmount;
        totalDeposited[currency] += yieldAmount;

        emit YieldCompounded(msg.sender, currency, yieldAmount, block.timestamp);

        // Check if goal reached
        if (account.savingsGoal > 0 && account.principal >= account.savingsGoal) {
            emit SavingsGoalReached(msg.sender, currency, account.principal, block.timestamp);
        }
    }

    /**
     * @dev Set savings goal for a currency
     */
    function setSavingsGoal(Currency currency, uint256 targetAmount) external {
        require(targetAmount > 0, "Goal must be > 0");

        SavingsAccount storage account = savings[msg.sender][currency];
        account.savingsGoal = targetAmount;

        emit SavingsGoalSet(msg.sender, currency, targetAmount, block.timestamp);
    }

    /**
     * @dev Get savings balance
     */
    function getSavingsBalance(address user, Currency currency) external view returns (uint256) {
        return savings[user][currency].principal;
    }

    /**
     * @dev Get total yield earned (claimed + pending)
     */
    function getTotalYieldEarned(address user, Currency currency) external view returns (uint256) {
        uint256 pendingYield = calculateYield(user, currency);
        uint256 claimedYield = savings[user][currency].totalYieldClaimed;

        return pendingYield + claimedYield;
    }

    /**
     * @dev Get savings account details
     */
    function getSavingsAccount(address user, Currency currency) external view returns (
        uint256 principal,
        uint256 pendingYield,
        uint256 totalClaimed,
        uint256 goal,
        uint256 currentAPY
    ) {
        SavingsAccount memory account = savings[user][currency];

        return (
            account.principal,
            calculateYield(user, currency),
            account.totalYieldClaimed,
            account.savingsGoal,
            apy[currency]
        );
    }

    /**
     * @dev Get all savings balances for a user
     */
    function getAllSavingsBalances(address user) external view returns (uint256[6] memory) {
        return [
            savings[user][Currency.USD].principal,
            savings[user][Currency.MXN].principal,
            savings[user][Currency.BRL].principal,
            savings[user][Currency.ARS].principal,
            savings[user][Currency.COP].principal,
            savings[user][Currency.GTQ].principal
        ];
    }

    /**
     * @dev Update APY for a currency
     */
    function updateAPY(Currency currency, uint256 newAPY) external onlyOwner {
        require(newAPY > 0 && newAPY <= 10000, "Invalid APY"); // Max 100%

        uint256 oldAPY = apy[currency];
        apy[currency] = newAPY;

        emit APYUpdated(currency, oldAPY, newAPY, block.timestamp);
    }

    /**
     * @dev Emergency withdrawal (no yield)
     */
    function emergencyWithdraw(Currency currency) external nonReentrant {
        SavingsAccount storage account = savings[msg.sender][currency];
        uint256 amount = account.principal;

        require(amount > 0, "No balance");

        account.principal = 0;
        account.accumulatedYield = 0;
        account.lastUpdateTime = block.timestamp;
        totalDeposited[currency] -= amount;

        emit Withdrawn(msg.sender, currency, amount, block.timestamp);
    }

    /**
     * @dev Internal function to update yield
     */
    function _updateYield(address user, Currency currency) private {
        SavingsAccount storage account = savings[user][currency];

        if (account.principal > 0) {
            uint256 timeElapsed = block.timestamp - account.lastUpdateTime;
            uint256 interest = _calculateInterest(account.principal, apy[currency], timeElapsed);
            account.accumulatedYield += interest;
        }

        account.lastUpdateTime = block.timestamp;
    }

    /**
     * @dev Calculate interest using simple interest formula
     * Interest = Principal * Rate * Time / (BASIS_POINTS * SECONDS_PER_YEAR)
     */
    function _calculateInterest(
        uint256 principal,
        uint256 rate,
        uint256 timeElapsed
    ) private pure returns (uint256) {
        return (principal * rate * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

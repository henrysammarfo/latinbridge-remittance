// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title MicroloanManager
 * @dev Credit-based lending system with repayment tracking
 */
contract MicroloanManager {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address public owner;
    address public userRegistryAddress;

    enum Currency { USD, MXN, BRL, ARS, COP, GTQ }
    enum LoanStatus { Pending, Approved, Active, Repaid, Defaulted, Rejected }

    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 amount;
        Currency currency;
        uint256 duration; // in days
        uint256 interestRate; // basis points
        LoanStatus status;
        uint256 amountRepaid;
        uint256 requestTime;
        uint256 approvalTime;
        uint256 dueDate;
        string purpose;
    }

    struct RepaymentSchedule {
        uint256 totalDue;
        uint256 interestDue;
        uint256 principalDue;
        uint256 nextPaymentDate;
        uint256 paymentsRemaining;
    }

    // Loan storage
    Loan[] public loans;
    mapping(address => uint256[]) public userLoans;
    mapping(uint256 => RepaymentSchedule) public repaymentSchedules;

    // Interest rate parameters
    uint256 public constant MIN_INTEREST_RATE = 500; // 5%
    uint256 public constant MAX_INTEREST_RATE = 1500; // 15%
    uint256 public constant BASIS_POINTS = 10000;

    // Credit score thresholds
    uint256 public constant EXCELLENT_CREDIT = 750;
    uint256 public constant GOOD_CREDIT = 650;
    uint256 public constant FAIR_CREDIT = 550;

    // Loan limits
    uint256 public constant MAX_LOAN_DURATION = 365; // days
    uint256 public constant MIN_LOAN_AMOUNT = 100 * 10**18; // $100 equivalent

    // Events
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, Currency currency, uint256 timestamp);
    event LoanApproved(uint256 indexed loanId, address indexed borrower, uint256 timestamp);
    event LoanRejected(uint256 indexed loanId, address indexed borrower, string reason, uint256 timestamp);
    event LoanRepayment(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 timestamp);
    event LoanFullyRepaid(uint256 indexed loanId, address indexed borrower, uint256 timestamp);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower, uint256 timestamp);
    event LoanTermExtended(uint256 indexed loanId, uint256 newDuration, uint256 newDueDate, uint256 timestamp);

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

    constructor() {
        owner = msg.sender;
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Set user registry contract address
     */
    function setUserRegistry(address _userRegistry) external onlyOwner {
        require(_userRegistry != address(0), "Invalid address");
        userRegistryAddress = _userRegistry;
    }

    /**
     * @dev Request a new loan
     */
    function requestLoan(
        uint256 amount,
        Currency currency,
        uint256 duration,
        string memory purpose
    ) external nonReentrant returns (uint256) {
        require(amount >= MIN_LOAN_AMOUNT, "Amount too small");
        require(duration > 0 && duration <= MAX_LOAN_DURATION, "Invalid duration");
        require(bytes(purpose).length > 0, "Purpose required");

        uint256 loanId = loans.length;

        Loan memory newLoan = Loan({
            loanId: loanId,
            borrower: msg.sender,
            amount: amount,
            currency: currency,
            duration: duration,
            interestRate: 0, // Will be set on approval
            status: LoanStatus.Pending,
            amountRepaid: 0,
            requestTime: block.timestamp,
            approvalTime: 0,
            dueDate: 0,
            purpose: purpose
        });

        loans.push(newLoan);
        userLoans[msg.sender].push(loanId);

        emit LoanRequested(loanId, msg.sender, amount, currency, block.timestamp);

        return loanId;
    }

    /**
     * @dev Approve a loan
     */
    function approveLoan(uint256 loanId) external onlyOwner nonReentrant {
        require(loanId < loans.length, "Invalid loan ID");

        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");

        // Calculate interest rate based on credit score
        uint256 interestRate = calculateInterestRate(loan.borrower);

        loan.status = LoanStatus.Active;
        loan.interestRate = interestRate;
        loan.approvalTime = block.timestamp;
        loan.dueDate = block.timestamp + (loan.duration * 1 days);

        // Setup repayment schedule
        uint256 interest = (loan.amount * interestRate * loan.duration) / (BASIS_POINTS * 365);
        uint256 totalDue = loan.amount + interest;

        repaymentSchedules[loanId] = RepaymentSchedule({
            totalDue: totalDue,
            interestDue: interest,
            principalDue: loan.amount,
            nextPaymentDate: block.timestamp + 30 days,
            paymentsRemaining: (loan.duration + 29) / 30 // Monthly payments
        });

        emit LoanApproved(loanId, loan.borrower, block.timestamp);
    }

    /**
     * @dev Reject a loan
     */
    function rejectLoan(uint256 loanId, string memory reason) external onlyOwner {
        require(loanId < loans.length, "Invalid loan ID");

        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");

        loan.status = LoanStatus.Rejected;

        emit LoanRejected(loanId, loan.borrower, reason, block.timestamp);
    }

    /**
     * @dev Repay a loan (partial or full)
     */
    function repayLoan(uint256 loanId, uint256 amount) external nonReentrant {
        require(loanId < loans.length, "Invalid loan ID");
        require(amount > 0, "Amount must be > 0");

        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not borrower");
        require(loan.status == LoanStatus.Active, "Loan not active");

        RepaymentSchedule storage schedule = repaymentSchedules[loanId];
        uint256 remainingDue = schedule.totalDue - loan.amountRepaid;

        require(amount <= remainingDue, "Amount exceeds due");

        loan.amountRepaid += amount;

        emit LoanRepayment(loanId, msg.sender, amount, block.timestamp);

        // Check if fully repaid
        if (loan.amountRepaid >= schedule.totalDue) {
            loan.status = LoanStatus.Repaid;
            emit LoanFullyRepaid(loanId, msg.sender, block.timestamp);
        }
    }

    /**
     * @dev Calculate interest rate based on credit score
     */
    function calculateInterestRate(address user) public view returns (uint256) {
        // If user registry not set, use default rate
        if (userRegistryAddress == address(0)) {
            return 1000; // 10%
        }

        // In production, this would query the UserRegistry contract
        // For now, using a simplified calculation
        // Excellent: 5%, Good: 8%, Fair: 12%, Poor: 15%

        // Placeholder: Return default rate
        // In real implementation: UserRegistry(userRegistryAddress).getCreditScore(user)
        return 1000; // 10%
    }

    /**
     * @dev Get loan details
     */
    function getLoanDetails(uint256 loanId) external view returns (
        address borrower,
        uint256 amount,
        Currency currency,
        uint256 duration,
        uint256 interestRate,
        LoanStatus status,
        uint256 amountRepaid,
        uint256 dueDate,
        string memory purpose
    ) {
        require(loanId < loans.length, "Invalid loan ID");

        Loan memory loan = loans[loanId];

        return (
            loan.borrower,
            loan.amount,
            loan.currency,
            loan.duration,
            loan.interestRate,
            loan.status,
            loan.amountRepaid,
            loan.dueDate,
            loan.purpose
        );
    }

    /**
     * @dev Get all loans for a user
     */
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    /**
     * @dev Get repayment schedule
     */
    function getRepaymentSchedule(uint256 loanId) external view returns (
        uint256 totalDue,
        uint256 interestDue,
        uint256 principalDue,
        uint256 amountRepaid,
        uint256 remainingDue,
        uint256 nextPaymentDate
    ) {
        require(loanId < loans.length, "Invalid loan ID");

        RepaymentSchedule memory schedule = repaymentSchedules[loanId];
        Loan memory loan = loans[loanId];

        return (
            schedule.totalDue,
            schedule.interestDue,
            schedule.principalDue,
            loan.amountRepaid,
            schedule.totalDue - loan.amountRepaid,
            schedule.nextPaymentDate
        );
    }

    /**
     * @dev Liquidate defaulted loan
     */
    function liquidateLoan(uint256 loanId) external onlyOwner {
        require(loanId < loans.length, "Invalid loan ID");

        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(block.timestamp > loan.dueDate, "Not overdue");

        loan.status = LoanStatus.Defaulted;

        emit LoanDefaulted(loanId, loan.borrower, block.timestamp);
    }

    /**
     * @dev Extend loan term
     */
    function extendLoanTerm(uint256 loanId, uint256 additionalDays) external nonReentrant {
        require(loanId < loans.length, "Invalid loan ID");
        require(additionalDays > 0 && additionalDays <= 90, "Invalid extension");

        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Not borrower");
        require(loan.status == LoanStatus.Active, "Loan not active");

        uint256 newDuration = loan.duration + additionalDays;
        require(newDuration <= MAX_LOAN_DURATION, "Exceeds max duration");

        loan.duration = newDuration;
        loan.dueDate += (additionalDays * 1 days);

        // Recalculate total due with extended duration
        RepaymentSchedule storage schedule = repaymentSchedules[loanId];
        uint256 additionalInterest = (loan.amount * loan.interestRate * additionalDays) / (BASIS_POINTS * 365);
        schedule.totalDue += additionalInterest;
        schedule.interestDue += additionalInterest;

        emit LoanTermExtended(loanId, newDuration, loan.dueDate, block.timestamp);
    }

    /**
     * @dev Get total loans count
     */
    function getTotalLoans() external view returns (uint256) {
        return loans.length;
    }

    /**
     * @dev Get active loans for a user
     */
    function getActiveLoansCount(address user) external view returns (uint256) {
        uint256 count = 0;
        uint256[] memory loanIds = userLoans[user];

        for (uint256 i = 0; i < loanIds.length; i++) {
            if (loans[loanIds[i]].status == LoanStatus.Active) {
                count++;
            }
        }

        return count;
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

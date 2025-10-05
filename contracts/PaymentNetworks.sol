// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title PaymentNetworks
 * @dev Integration layer for local payment networks (PIX, SPEI, PSE, CoDi, ACH)
 */
contract PaymentNetworks {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address public owner;

    enum Network { PIX, SPEI, CODI, PSE, ACH }
    enum PaymentStatus { Pending, Processing, Completed, Failed, Cancelled }

    struct Payment {
        uint256 paymentId;
        address sender;
        string recipient; // External account identifier
        Network network;
        uint256 amount;
        PaymentStatus status;
        uint256 timestamp;
        uint256 completionTime;
        string transactionHash;
    }

    // Payment storage
    Payment[] public payments;
    mapping(address => uint256[]) public userPayments;

    // Network fees (in basis points)
    mapping(Network => uint256) public networkFees;

    // Network availability
    mapping(Network => bool) public networkEnabled;

    // Events
    event PaymentInitiated(
        uint256 indexed paymentId,
        address indexed sender,
        string recipient,
        Network network,
        uint256 amount,
        uint256 timestamp
    );
    event PaymentCompleted(uint256 indexed paymentId, string transactionHash, uint256 timestamp);
    event PaymentFailed(uint256 indexed paymentId, string reason, uint256 timestamp);
    event PaymentCancelled(uint256 indexed paymentId, uint256 timestamp);
    event NetworkFeeUpdated(Network network, uint256 oldFee, uint256 newFee);
    event NetworkToggled(Network network, bool enabled);

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

        // Initialize network fees (basis points)
        networkFees[Network.PIX] = 50; // 0.5%
        networkFees[Network.SPEI] = 75; // 0.75%
        networkFees[Network.CODI] = 50; // 0.5%
        networkFees[Network.PSE] = 100; // 1%
        networkFees[Network.ACH] = 150; // 1.5%

        // Enable all networks by default
        networkEnabled[Network.PIX] = true;
        networkEnabled[Network.SPEI] = true;
        networkEnabled[Network.CODI] = true;
        networkEnabled[Network.PSE] = true;
        networkEnabled[Network.ACH] = true;
    }

    /**
     * @dev Integrate with PIX (Brazil)
     */
    function integratePIX(
        string memory pixKey,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(networkEnabled[Network.PIX], "PIX not enabled");
        require(amount > 0, "Amount must be > 0");
        require(bytes(pixKey).length > 0, "PIX key required");

        return _createPayment(pixKey, Network.PIX, amount);
    }

    /**
     * @dev Integrate with SPEI (Mexico)
     */
    function integrateSPEI(
        string memory clabe,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(networkEnabled[Network.SPEI], "SPEI not enabled");
        require(amount > 0, "Amount must be > 0");
        require(bytes(clabe).length == 18, "Invalid CLABE"); // CLABE is 18 digits

        return _createPayment(clabe, Network.SPEI, amount);
    }

    /**
     * @dev Integrate with CoDi (Mexico QR)
     */
    function integrateCoDi(
        string memory qrCode,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(networkEnabled[Network.CODI], "CoDi not enabled");
        require(amount > 0, "Amount must be > 0");
        require(bytes(qrCode).length > 0, "QR code required");

        return _createPayment(qrCode, Network.CODI, amount);
    }

    /**
     * @dev Integrate with PSE (Colombia)
     */
    function integratePSE(
        string memory bankCode,
        string memory accountNumber,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(networkEnabled[Network.PSE], "PSE not enabled");
        require(amount > 0, "Amount must be > 0");
        require(bytes(bankCode).length > 0, "Bank code required");
        require(bytes(accountNumber).length > 0, "Account number required");

        string memory recipient = string(abi.encodePacked(bankCode, ":", accountNumber));
        return _createPayment(recipient, Network.PSE, amount);
    }

    /**
     * @dev Integrate with ACH (Guatemala/Central America)
     */
    function integrateACH(
        string memory accountDetails,
        uint256 amount
    ) external nonReentrant returns (uint256) {
        require(networkEnabled[Network.ACH], "ACH not enabled");
        require(amount > 0, "Amount must be > 0");
        require(bytes(accountDetails).length > 0, "Account details required");

        return _createPayment(accountDetails, Network.ACH, amount);
    }

    /**
     * @dev Internal function to create payment
     */
    function _createPayment(
        string memory recipient,
        Network network,
        uint256 amount
    ) private returns (uint256) {
        uint256 paymentId = payments.length;

        Payment memory newPayment = Payment({
            paymentId: paymentId,
            sender: msg.sender,
            recipient: recipient,
            network: network,
            amount: amount,
            status: PaymentStatus.Pending,
            timestamp: block.timestamp,
            completionTime: 0,
            transactionHash: ""
        });

        payments.push(newPayment);
        userPayments[msg.sender].push(paymentId);

        emit PaymentInitiated(paymentId, msg.sender, recipient, network, amount, block.timestamp);

        return paymentId;
    }

    /**
     * @dev Get network fees for a payment
     */
    function getNetworkFees(Network network, uint256 amount) external view returns (uint256) {
        return (amount * networkFees[network]) / 10000;
    }

    /**
     * @dev Validate payment method details
     */
    function validatePaymentMethod(
        Network network,
        string memory details
    ) external pure returns (bool) {
        if (network == Network.SPEI) {
            // CLABE must be 18 digits
            return bytes(details).length == 18;
        }

        // Basic validation for other networks
        return bytes(details).length > 0;
    }

    /**
     * @dev Track payment status
     */
    function trackPaymentStatus(uint256 paymentId) external view returns (
        PaymentStatus status,
        uint256 timestamp,
        uint256 completionTime,
        string memory transactionHash
    ) {
        require(paymentId < payments.length, "Invalid payment ID");

        Payment memory payment = payments[paymentId];

        return (
            payment.status,
            payment.timestamp,
            payment.completionTime,
            payment.transactionHash
        );
    }

    /**
     * @dev Get payment details
     */
    function getPaymentDetails(uint256 paymentId) external view returns (
        address sender,
        string memory recipient,
        Network network,
        uint256 amount,
        PaymentStatus status,
        uint256 timestamp
    ) {
        require(paymentId < payments.length, "Invalid payment ID");

        Payment memory payment = payments[paymentId];

        return (
            payment.sender,
            payment.recipient,
            payment.network,
            payment.amount,
            payment.status,
            payment.timestamp
        );
    }

    /**
     * @dev Get user payments
     */
    function getUserPayments(address user) external view returns (uint256[] memory) {
        return userPayments[user];
    }

    /**
     * @dev Update payment status (owner only - simulates external confirmation)
     */
    function updatePaymentStatus(
        uint256 paymentId,
        PaymentStatus newStatus,
        string memory txHash
    ) external onlyOwner {
        require(paymentId < payments.length, "Invalid payment ID");

        Payment storage payment = payments[paymentId];
        payment.status = newStatus;

        if (newStatus == PaymentStatus.Completed) {
            payment.completionTime = block.timestamp;
            payment.transactionHash = txHash;
            emit PaymentCompleted(paymentId, txHash, block.timestamp);
        } else if (newStatus == PaymentStatus.Failed) {
            emit PaymentFailed(paymentId, "External processing failed", block.timestamp);
        } else if (newStatus == PaymentStatus.Cancelled) {
            emit PaymentCancelled(paymentId, block.timestamp);
        }
    }

    /**
     * @dev Update network fee
     */
    function updateNetworkFee(Network network, uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%

        uint256 oldFee = networkFees[network];
        networkFees[network] = newFee;

        emit NetworkFeeUpdated(network, oldFee, newFee);
    }

    /**
     * @dev Enable or disable a network
     */
    function toggleNetwork(Network network, bool enabled) external onlyOwner {
        networkEnabled[network] = enabled;
        emit NetworkToggled(network, enabled);
    }

    /**
     * @dev Get total payments count
     */
    function getTotalPayments() external view returns (uint256) {
        return payments.length;
    }

    /**
     * @dev Get pending payments count for user
     */
    function getPendingPaymentsCount(address user) external view returns (uint256) {
        uint256 count = 0;
        uint256[] memory paymentIds = userPayments[user];

        for (uint256 i = 0; i < paymentIds.length; i++) {
            if (payments[paymentIds[i]].status == PaymentStatus.Pending ||
                payments[paymentIds[i]].status == PaymentStatus.Processing) {
                count++;
            }
        }

        return count;
    }

    /**
     * @dev Get network name as string
     */
    function getNetworkName(Network network) external pure returns (string memory) {
        if (network == Network.PIX) return "PIX";
        if (network == Network.SPEI) return "SPEI";
        if (network == Network.CODI) return "CoDi";
        if (network == Network.PSE) return "PSE";
        if (network == Network.ACH) return "ACH";
        return "Unknown";
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

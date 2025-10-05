// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title UserRegistry
 * @dev User management with KYC levels and compliance
 */
contract UserRegistry {
    address public owner;

    enum KYCLevel { None, Basic, Enhanced, Premium }

    struct UserProfile {
        bool registered;
        string name;
        string email;
        uint256 registrationDate;
        KYCLevel kycLevel;
        bool verified;
        bool blacklisted;
        uint256 creditScore;
        string documentHash;
    }

    // KYC transaction limits (in USD equivalent)
    mapping(KYCLevel => uint256) public transactionLimits;

    // User profiles
    mapping(address => UserProfile) private profiles;

    // Activity tracking
    mapping(address => uint256) public totalTransactions;
    mapping(address => uint256) public totalVolume;

    // Events
    event UserRegistered(address indexed user, uint256 timestamp);
    event ProfileUpdated(address indexed user, uint256 timestamp);
    event KYCVerified(address indexed user, KYCLevel level, uint256 timestamp);
    event KYCLevelUpdated(address indexed user, KYCLevel oldLevel, KYCLevel newLevel, uint256 timestamp);
    event UserBlacklisted(address indexed user, string reason, uint256 timestamp);
    event UserUnblacklisted(address indexed user, uint256 timestamp);
    event CreditScoreUpdated(address indexed user, uint256 oldScore, uint256 newScore, uint256 timestamp);
    event SuspiciousActivity(address indexed user, string reason, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyRegistered() {
        require(profiles[msg.sender].registered, "Not registered");
        _;
    }

    modifier notBlacklisted(address user) {
        require(!profiles[user].blacklisted, "User blacklisted");
        _;
    }

    constructor() {
        owner = msg.sender;

        // Set transaction limits (in USD equivalent)
        transactionLimits[KYCLevel.None] = 0;
        transactionLimits[KYCLevel.Basic] = 1000 * 10**18; // $1,000
        transactionLimits[KYCLevel.Enhanced] = 10000 * 10**18; // $10,000
        transactionLimits[KYCLevel.Premium] = 50000 * 10**18; // $50,000
    }

    /**
     * @dev Register a new user
     */
    function registerUser(
        address walletAddress,
        string memory name,
        string memory email
    ) external {
        require(walletAddress != address(0), "Invalid address");
        require(!profiles[walletAddress].registered, "Already registered");
        require(bytes(name).length > 0, "Name required");
        require(bytes(email).length > 0, "Email required");

        profiles[walletAddress] = UserProfile({
            registered: true,
            name: name,
            email: email,
            registrationDate: block.timestamp,
            kycLevel: KYCLevel.None,
            verified: false,
            blacklisted: false,
            creditScore: 500, // Default credit score
            documentHash: ""
        });

        emit UserRegistered(walletAddress, block.timestamp);
    }

    /**
     * @dev Auto-register on first interaction
     */
    function autoRegister() external {
        if (!profiles[msg.sender].registered) {
            profiles[msg.sender] = UserProfile({
                registered: true,
                name: "",
                email: "",
                registrationDate: block.timestamp,
                kycLevel: KYCLevel.None,
                verified: false,
                blacklisted: false,
                creditScore: 500,
                documentHash: ""
            });

            emit UserRegistered(msg.sender, block.timestamp);
        }
    }

    /**
     * @dev Update user profile
     */
    function updateProfile(
        string memory name,
        string memory email
    ) external onlyRegistered notBlacklisted(msg.sender) {
        UserProfile storage profile = profiles[msg.sender];
        profile.name = name;
        profile.email = email;

        emit ProfileUpdated(msg.sender, block.timestamp);
    }

    /**
     * @dev Verify user identity with KYC
     */
    function verifyIdentity(
        address user,
        string memory documentHash,
        KYCLevel level
    ) external onlyOwner notBlacklisted(user) {
        require(profiles[user].registered, "User not registered");
        require(level != KYCLevel.None, "Invalid KYC level");

        UserProfile storage profile = profiles[user];
        KYCLevel oldLevel = profile.kycLevel;

        profile.verified = true;
        profile.kycLevel = level;
        profile.documentHash = documentHash;

        emit KYCVerified(user, level, block.timestamp);
        emit KYCLevelUpdated(user, oldLevel, level, block.timestamp);
    }

    /**
     * @dev Set KYC level for a user
     */
    function setKYCLevel(address user, KYCLevel level) external onlyOwner notBlacklisted(user) {
        require(profiles[user].registered, "User not registered");

        KYCLevel oldLevel = profiles[user].kycLevel;
        profiles[user].kycLevel = level;

        emit KYCLevelUpdated(user, oldLevel, level, block.timestamp);
    }

    /**
     * @dev Check if transaction amount is within user's limit
     */
    function checkTransactionLimit(address user, uint256 amount) external view returns (bool) {
        if (profiles[user].blacklisted) return false;
        if (!profiles[user].registered) return false;

        uint256 limit = transactionLimits[profiles[user].kycLevel];
        return amount <= limit;
    }

    /**
     * @dev Get transaction limit for user
     */
    function getTransactionLimit(address user) external view returns (uint256) {
        return transactionLimits[profiles[user].kycLevel];
    }

    /**
     * @dev Update transaction limits for a KYC level
     */
    function updateTransactionLimit(KYCLevel level, uint256 newLimit) external onlyOwner {
        require(level != KYCLevel.None, "Cannot set limit for None");
        transactionLimits[level] = newLimit;
    }

    /**
     * @dev Flag suspicious activity
     */
    function flagSuspiciousActivity(address user, string memory reason) external onlyOwner {
        require(profiles[user].registered, "User not registered");
        emit SuspiciousActivity(user, reason, block.timestamp);
    }

    /**
     * @dev Blacklist a user
     */
    function blacklistUser(address user, string memory reason) external onlyOwner {
        require(profiles[user].registered, "User not registered");
        require(!profiles[user].blacklisted, "Already blacklisted");

        profiles[user].blacklisted = true;
        emit UserBlacklisted(user, reason, block.timestamp);
    }

    /**
     * @dev Remove user from blacklist
     */
    function unblacklistUser(address user) external onlyOwner {
        require(profiles[user].blacklisted, "Not blacklisted");

        profiles[user].blacklisted = false;
        emit UserUnblacklisted(user, block.timestamp);
    }

    /**
     * @dev Update user credit score
     */
    function updateCreditScore(address user, uint256 newScore) external onlyOwner {
        require(profiles[user].registered, "User not registered");
        require(newScore >= 300 && newScore <= 850, "Invalid score range");

        uint256 oldScore = profiles[user].creditScore;
        profiles[user].creditScore = newScore;

        emit CreditScoreUpdated(user, oldScore, newScore, block.timestamp);
    }

    /**
     * @dev Record transaction activity
     */
    function recordTransaction(address user, uint256 amount) external {
        if (profiles[user].registered) {
            totalTransactions[user]++;
            totalVolume[user] += amount;
        }
    }

    /**
     * @dev Get user profile
     */
    function getUserProfile(address user) external view returns (
        bool registered,
        string memory name,
        string memory email,
        uint256 registrationDate,
        KYCLevel kycLevel,
        bool verified,
        bool blacklisted,
        uint256 creditScore
    ) {
        UserProfile memory profile = profiles[user];
        return (
            profile.registered,
            profile.name,
            profile.email,
            profile.registrationDate,
            profile.kycLevel,
            profile.verified,
            profile.blacklisted,
            profile.creditScore
        );
    }

    /**
     * @dev Get KYC status
     */
    function getKYCStatus(address user) external view returns (
        bool verified,
        KYCLevel level,
        uint256 limit
    ) {
        UserProfile memory profile = profiles[user];
        return (
            profile.verified,
            profile.kycLevel,
            transactionLimits[profile.kycLevel]
        );
    }

    /**
     * @dev Check if user is registered
     */
    function isRegistered(address user) external view returns (bool) {
        return profiles[user].registered;
    }

    /**
     * @dev Check if user is verified
     */
    function isVerified(address user) external view returns (bool) {
        return profiles[user].verified;
    }

    /**
     * @dev Check if user is blacklisted
     */
    function isBlacklisted(address user) external view returns (bool) {
        return profiles[user].blacklisted;
    }

    /**
     * @dev Get credit score
     */
    function getCreditScore(address user) external view returns (uint256) {
        return profiles[user].creditScore;
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}

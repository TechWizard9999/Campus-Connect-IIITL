// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenGame {
    string public constant tokenName = "HSR";
    uint256 public tokenPrice = 1e13; 
    uint256 public characterPrice = 5; 
    uint256 public startingBalance = 20;

    mapping(bytes32 => uint256) private balances;
    mapping(address => bytes32) private playerToPlayerId;
    mapping(bytes32 => bool) public isPlayerIdTaken; 
    mapping(bytes32 => uint256) private stakedBalances;
    mapping(bytes32 => uint256) private playerPower;

    mapping(address => Challenge) public challenges;
    mapping(address => bool) public challengeCompleted;
    mapping(address => uint256) public completedChallengesCount;
    mapping(bytes32 => uint256) private characterAbilities;

    struct Challenge {
        string description;
        uint256 reward;
        bool active;
    }
     struct Mission {
        string description;
        uint256 targetWinCount;
        uint256 completedWinCount;
        bool completed;
    }
     enum SpinResult { TokenPrize, ItemPrize, NoPrize }//spin wheel
     enum RPSChoice { None, Rock, Paper, Scissors }//we can play rock paper scissors too!!
    enum RPSResult { Draw, Player1Wins, Player2Wins }

    mapping(address => RPSChoice) private playerToRPSChoice;
mapping(address => bool) private hasSubmittedChoice;
address private player1;
address private player2;

    mapping(address => uint256) public lastSpinTimestamp;
    uint256 public spinCooldown = 1 days;

    event WheelSpun(address indexed player, SpinResult result);

    event RPSResultAnnounced(address indexed player1, address indexed player2, RPSChoice choice1, RPSChoice choice2, RPSResult result);

    modifier canSpinWheel() {
        require(block.timestamp - lastSpinTimestamp[msg.sender] >= spinCooldown, "Spin cooldown in effect");
        _;
    }

    enum Weather { Normal, Rainy, Stormy } //we can change the weather to!!

    mapping(address => Mission) public playerMissions;
    uint256 public missionReward = 5;

    event MissionCompleted(address indexed player, string description, uint256 reward);

    event TokensBought(address indexed player, uint256 tokensBought);
    event TokensSent(address indexed sender, bytes32 receiverIdHash, uint256 amount);
    event PlayerInitialized(address indexed player, bytes32 playerIdHash);
    event CharacterBought(address indexed player, uint256 price);
    event TokensStaked(address indexed player, uint256 amount);
    event TokensUnstaked(address indexed player, uint256 amount);
    event PowerIncreased(address indexed player, uint256 newPower);
    event ChallengeCreated(address indexed creator, string description, uint256 reward);
    event ChallengeCompleted(address indexed player, string description, uint256 reward);

    modifier onlyPlayer() {
        require(isPlayerIdTaken[playerToPlayerId[msg.sender]], "Player not initialized");
        _;
    }

    Weather public currentWeather = Weather.Normal;

    modifier onlyNormalWeather() {
        require(currentWeather == Weather.Normal, "Weather conditions are not normal");
        _;
    }


    constructor() {
        bytes32 initialPlayerIdHash = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        balances[initialPlayerIdHash] = startingBalance;
        playerToPlayerId[msg.sender] = initialPlayerIdHash;
        isPlayerIdTaken[initialPlayerIdHash] = true;

        emit PlayerInitialized(msg.sender, initialPlayerIdHash);
    }

    function setWeather(Weather _weather) external {
        currentWeather = _weather;
    }

    function initializePlayer(bytes32 _playerIdHash) external {
        require(!isPlayerIdTaken[_playerIdHash], "Player ID already taken");
        
        balances[_playerIdHash] = startingBalance; 
        playerToPlayerId[msg.sender] = _playerIdHash;
        isPlayerIdTaken[_playerIdHash] = true;

        emit PlayerInitialized(msg.sender, _playerIdHash);
    }

    function buyTokens(uint256 _amount) external payable {
        require(msg.value > 0, "No ETH sent");
        uint256 tokensToBuy = _amount == 0 ? msg.value / tokenPrice : _amount;
        require(tokensToBuy > 0, "Insufficient ETH sent");

        balances[playerToPlayerId[msg.sender]] += tokensToBuy;

        emit TokensBought(msg.sender, tokensToBuy);
    }

    function sendTokens(bytes32 _receiverIdHash, uint256 _amount) external onlyPlayer {
        require(isPlayerIdTaken[_receiverIdHash], "Invalid receiver playerId hash");
        require(playerToPlayerId[msg.sender] != _receiverIdHash, "Cannot send tokens to yourself");
        require(balances[playerToPlayerId[msg.sender]] >= _amount, "Insufficient tokens");

        balances[playerToPlayerId[msg.sender]] -= _amount;
        balances[_receiverIdHash] += _amount;

        emit TokensSent(msg.sender, _receiverIdHash, _amount);
    }

    function getPlayerIdHash(address _player) external view returns (bytes32) {
        return playerToPlayerId[_player];
    }

    function getBalance(bytes32 _playerIdHash) external view returns (uint256) {
        return balances[_playerIdHash];
    }

    function buyCharacter() external onlyPlayer {
        bytes32 playerIdHash = playerToPlayerId[msg.sender];
        require(balances[playerIdHash] >= characterPrice, "Insufficient tokens to buy character");
        
        balances[playerIdHash] -= characterPrice;

        emit CharacterBought(msg.sender, characterPrice);
    }
    function spinWheel() external onlyPlayer canSpinWheel {
    require(block.number > 1, "Not enough blocks mined");

    bytes32 blockHash = blockhash(block.number - 1);
    require(blockHash != bytes32(0), "Blockhash not available");

    uint256 seed = uint256(keccak256(abi.encodePacked(
        blockHash,
        block.coinbase,
        block.timestamp,
        msg.sender,
        block.gaslimit
    )));

    uint256 randomValue = (seed + uint256(keccak256(abi.encodePacked(
        msg.sender,
        block.timestamp,
        block.number
    )))) % 100; // Range from 0 to 99

    SpinResult result;
    if (randomValue < 30) {
        result = SpinResult.TokenPrize;
        uint256 tokenReward = 10;
        balances[playerToPlayerId[msg.sender]] += tokenReward;
    } else {
        result = SpinResult.NoPrize;
    }

    lastSpinTimestamp[msg.sender] = block.timestamp;

    emit WheelSpun(msg.sender, result);
}
    function submitRPSChoice(RPSChoice choice) external onlyPlayer {
    require(!hasSubmittedChoice[msg.sender], "You have already submitted your choice");
    require(choice >= RPSChoice.Rock && choice <= RPSChoice.Scissors, "Invalid choice");

    hasSubmittedChoice[msg.sender] = true;
    playerToRPSChoice[msg.sender] = choice;

    if (player1 == address(0)) {
        player1 = msg.sender;
    } else if (player2 == address(0) && msg.sender != player1) {
        player2 = msg.sender;
        RPSChoice choice1 = playerToRPSChoice[player1];
        RPSChoice choice2 = playerToRPSChoice[player2];
        RPSResult result = determineRPSResult(choice1, choice2);
        emit RPSResultAnnounced(player1, player2, choice1, choice2, result);
        player1 = address(0);
        player2 = address(0);
        hasSubmittedChoice[player1] = false;
        hasSubmittedChoice[player2] = false;
        playerToRPSChoice[player1] = RPSChoice.None;
        playerToRPSChoice[player2] = RPSChoice.None;
    }
}
    function determineRPSResult(RPSChoice choice1, RPSChoice choice2) private pure returns (RPSResult) {
    if (choice1 == choice2) {
        return RPSResult.Draw;
    } else if ((choice1 == RPSChoice.Rock && choice2 == RPSChoice.Scissors) ||
               (choice1 == RPSChoice.Paper && choice2 == RPSChoice.Rock) ||
               (choice1 == RPSChoice.Scissors && choice2 == RPSChoice.Paper)) {
        return RPSResult.Player1Wins;
    } else {
        return RPSResult.Player2Wins;
    }
}

    function increasePower(uint256 _powerIncrease) external onlyPlayer {
        bytes32 playerIdHash = playerToPlayerId[msg.sender];
        require(balances[playerIdHash] >= _powerIncrease, "Insufficient tokens to increase power");

        balances[playerIdHash] -= _powerIncrease;
        playerPower[playerIdHash] += _powerIncrease;

        emit PowerIncreased(msg.sender, playerPower[playerIdHash]);
    }

    function getPower(bytes32 _playerIdHash) external view returns (uint256) {
        return playerPower[_playerIdHash];
    }

    function stakeTokens(uint256 _amount) external onlyPlayer {
        require(balances[playerToPlayerId[msg.sender]] >= _amount, "Insufficient tokens to stake");

        balances[playerToPlayerId[msg.sender]] -= _amount;
        stakedBalances[playerToPlayerId[msg.sender]] += _amount;

        emit TokensStaked(msg.sender, _amount);
    }

    function unstakeTokens(uint256 _amount) external onlyPlayer {
        require(stakedBalances[playerToPlayerId[msg.sender]] >= _amount, "Insufficient staked tokens");
        
        stakedBalances[playerToPlayerId[msg.sender]] -= _amount;
        balances[playerToPlayerId[msg.sender]] += _amount;

        emit TokensUnstaked(msg.sender, _amount);
    }

    function createChallenge(string memory _description, uint256 _reward) external onlyPlayer {
        challenges[msg.sender] = Challenge(_description, _reward, true);
        emit ChallengeCreated(msg.sender, _description, _reward);
    }

    function completeChallenge() external onlyPlayer {
        require(challenges[msg.sender].active, "No active challenge found");
        require(!challengeCompleted[msg.sender], "Challenge already completed");

        bytes32 playerIdHash = playerToPlayerId[msg.sender];
        balances[playerIdHash] += challenges[msg.sender].reward;
        challengeCompleted[msg.sender] = true;
        completedChallengesCount[msg.sender]++;

        emit ChallengeCompleted(msg.sender, challenges[msg.sender].description, challenges[msg.sender].reward);

        if (completedChallengesCount[msg.sender] >= 3) {
            playerPower[playerIdHash] += 10;
        }
    }

    function upgradeCharacterAbilities(uint256 _newPower) external onlyPlayer {
    bytes32 playerIdHash = playerToPlayerId[msg.sender];
    require(balances[playerIdHash] >= _newPower, "Insufficient tokens for upgrade");

    balances[playerIdHash] -= _newPower;
    characterAbilities[playerIdHash] += _newPower;

    emit PowerIncreased(msg.sender, characterAbilities[playerIdHash]);
}

  function completeMission(string calldata /*_description*/) external onlyPlayer {
    Mission storage mission = playerMissions[msg.sender];
    require(!mission.completed, "Mission already completed");
    require(playerPower[playerToPlayerId[msg.sender]] >= mission.targetWinCount, "Mission conditions not met");

    mission.completed = true;

    bytes32 playerIdHash = playerToPlayerId[msg.sender];
    balances[playerIdHash] += missionReward;

    emit MissionCompleted(msg.sender, mission.description, missionReward);
  }
}


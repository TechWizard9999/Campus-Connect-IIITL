// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenGame {
    string public tokenName = "HSR";
    uint256 public tokenPrice = 1e13; 
    uint256 public characterPrice = 5; 
    uint256 public startingBalance = 20;

    mapping(bytes32 => uint256) public balances;
    mapping(address => bytes32) public playerToPlayerId;
    mapping(bytes32 => bool) public isPlayerIdTaken; 

    constructor() {
        bytes32 initialPlayerIdHash = keccak256(abi.encodePacked("initial"));
        balances[initialPlayerIdHash] = startingBalance;
        playerToPlayerId[msg.sender] = initialPlayerIdHash;
        isPlayerIdTaken[initialPlayerIdHash] = true;
    }

    function initializePlayer(bytes32 _playerIdHash) external {
        require(!isPlayerIdTaken[_playerIdHash], "Player ID already taken");
        
        balances[_playerIdHash] = startingBalance; 
        playerToPlayerId[msg.sender] = _playerIdHash;
        isPlayerIdTaken[_playerIdHash] = true;
    }

    function buyTokens() external payable {
        require(msg.value >= tokenPrice, "Insufficient ETH sent");

        uint256 tokensToBuy = msg.value / tokenPrice;
        balances[playerToPlayerId[msg.sender]] += tokensToBuy;
    }

    function sendTokens(bytes32 _receiverIdHash, uint256 _amount) external {
        require(isPlayerIdTaken[_receiverIdHash], "Invalid receiver playerId hash");
        require(playerToPlayerId[msg.sender] != _receiverIdHash, "Cannot send tokens to yourself");
        require(balances[playerToPlayerId[msg.sender]] >= _amount, "Insufficient tokens");

        balances[playerToPlayerId[msg.sender]] -= _amount;
        balances[_receiverIdHash] += _amount;
    }

    function getPlayerIdHash(address _player) external view returns (bytes32) {
        return playerToPlayerId[_player];
    }

    function getBalance(bytes32 _playerIdHash) external view returns (uint256) {
        return balances[_playerIdHash];
    }

    function buyCharacter() external {
        bytes32 playerIdHash = playerToPlayerId[msg.sender];
        require(balances[playerIdHash] >= characterPrice, "Insufficient tokens to buy character");
        
        balances[playerIdHash] -= characterPrice;
    }
}


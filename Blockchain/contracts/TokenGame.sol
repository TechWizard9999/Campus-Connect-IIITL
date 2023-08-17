// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenGame is Initializable, ERC721Upgradeable {
    address public owner;

    struct Task {
        address creator;
        uint256 reward;
        bool completed;
    }

    Task[] public tasks;
    mapping(address => bool) public hasClaimedTokensMap;

    event TokensBought(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);

    function initialize() external initializer {
        __ERC721_init("HSR Token", "HSR");
        owner = msg.sender;
    }

    function createTask(uint256 _reward) external {
        require(_reward > 0, "Reward must be greater than 0");
        tasks.push(Task(msg.sender, _reward, false));
    }

    function completeTask(uint256 _taskId) external {
        require(_taskId < tasks.length, "Task ID is invalid");
        Task storage task = tasks[_taskId];
        require(task.creator != address(0), "Task does not exist");
        require(!task.completed, "Task already completed");

        task.completed = true;
        _mint(msg.sender, tasks.length); 
    }

    function claimTokens() external {
        require(!hasClaimedTokensMap[msg.sender], "Tokens already claimed");
        hasClaimedTokensMap[msg.sender] = true;
        _mint(msg.sender, tasks.length + 1); 
    }

    function buyTokens() external payable {
        require(msg.value >= 0.1 ether, "ETH amount must be at least 0.1 ETH");

        uint256 tokensToBuy = 1; 
        _mint(msg.sender, tasks.length + 2); 

        emit TokensBought(msg.sender, msg.value, tokensToBuy);
    }

    function getTaskCount() external view returns (uint256) {
        return tasks.length;
    }

    function getTask(uint256 _taskId) external view returns (address, uint256, bool) {
        require(_taskId < tasks.length, "Task ID is invalid");
        Task storage task = tasks[_taskId];
        return (task.creator, task.reward, task.completed);
    }

    function hasClaimedTokens(address _user) external view returns (bool) {
        return hasClaimedTokensMap[_user];
    }

    function loginAndReceiveTokens() external {
        require(!hasClaimedTokensMap[msg.sender], "Tokens already claimed");
        hasClaimedTokensMap[msg.sender] = true;
        _mint(msg.sender, tasks.length + 3);
    }
}

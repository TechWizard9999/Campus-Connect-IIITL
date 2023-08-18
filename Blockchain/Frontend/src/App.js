import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { contractAbi } from "./Utils/components";

const contractAddress = "0x37F9BF77dc944c509a039AF18f9088834F7b0342";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [taskReward, setTaskReward] = useState("");
  const [hasClaimedTokens, setHasClaimedTokens] = useState(false);

  useEffect(() => {
    async function initEthers() {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);

        const signer = ethProvider.getSigner();
        setAccount(await signer.getAddress());

        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        setContract(contractInstance);

        updateEthBalance(signer);
        updateTokenBalance();
        updateTasks();
        checkClaimedTokens();
      } catch (error) {
        console.error("Error while connecting to Metamask:", error);
      }
    }

    if (window.ethereum) {
      initEthers();
    }
  }, []);

  const updateEthBalance = async (signer) => {
    const balance = await signer.getBalance();
    setEthBalance(ethers.utils.formatEther(balance));
  };

  const buyTokens = async () => {
    if (contract && account) {
      try {
        const ethAmount = 0.1; // Amount of ETH to send for buying tokens
        const transaction = await contract.buyTokens({ value: ethers.utils.parseEther(ethAmount.toString()) });
        await transaction.wait();

        updateTokenBalance();
        updateEthBalance(contract.signer);

        console.log(`Successfully bought ${ethAmount} tokens.`);
      } catch (error) {
        console.error("Error while buying tokens:", error);
      }
    }
  };

  const updateTokenBalance = async () => {
    if (contract && account) {
      const balance = await contract.balanceOf(account);
      setTokenBalance(balance.toString());
    }
  };

  const updateTasks = async () => {
    if (contract) {
      const taskCount = await contract.taskCount();
      const taskList = [];
      for (let i = 0; i < taskCount; i++) {
        const taskInfo = await contract.getTask(i);
        taskList.push({
          id: i,
          creator: taskInfo.creator,
          reward: taskInfo.reward,
          completed: taskInfo.completed,
        });
      }
      setTasks(taskList);
    }
  };

  const checkClaimedTokens = async () => {
    if (contract && account) {
      const claimed = await contract.hasClaimedTokens(account);
      setHasClaimedTokens(claimed);
    }
  };

  const claimTokens = async () => {
    if (contract && account) {
      try {
        const transaction = await contract.claimTokens();
        await transaction.wait();

        updateTokenBalance();
        setHasClaimedTokens(true);
      } catch (error) {
        console.error("Error while claiming tokens:", error);
      }
    }
  };

  const loginAndReceiveTokens = async () => {
    if (contract && account) {
      try {
        const transaction = await contract.loginAndReceiveTokens();
        await transaction.wait();

        updateTokenBalance();
        setHasClaimedTokens(true);
        console.log("Successfully received login tokens.");
      } catch (error) {
        console.error("Error while receiving login tokens:", error);
      }
    }
  };

  const createTask = async () => {
    if (contract && account && taskReward) {
      try {
        const transaction = await contract.createTask(ethers.utils.parseEther(taskReward));
        await transaction.wait();

        updateTasks();
      } catch (error) {
        console.error("Error while creating task:", error);
      }
    }
  };

  const completeTask = async (taskId) => {
    if (contract && account) {
      try {
        const transaction = await contract.completeTask(taskId);
        await transaction.wait();

        updateTokenBalance();
        updateTasks();
      } catch (error) {
        console.error("Error while completing task:", error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="wallet">
          {account ? (
            <>
              <div className="wallet-info">
                <span className="wallet-icon">🪙</span>
                <p>
                  Connected Wallet: {account}
                  <br />
                  ETH Balance: {ethBalance} ETH
                  <br />
                  Token Balance: {tokenBalance} HSR
                </p>
              </div>
              <button onClick={buyTokens}>Buy Tokens</button>
            </>
          ) : (
            <p>Please connect your Metamask account</p>
          )}
        </div>
        <h1>Token Game</h1>
      </header>
      <main>
        {account && (
          <div>
            <p>Your Token Balance: {tokenBalance} HSR</p>
            {!hasClaimedTokens && (
              <div>
                <button onClick={loginAndReceiveTokens}>Login and Receive Tokens</button>
                <button onClick={claimTokens}>Claim Tokens</button>
              </div>
            )}
          </div>
        )}
        {account && (
          <div>
            <h2>Create Task</h2>
            <input
              type="number"
              placeholder="Reward Tokens"
              value={taskReward}
              onChange={(e) => setTaskReward(e.target.value)}
            />
            <button onClick={createTask}>Create Task</button>
          </div>
        )}
        {account && (
          <div>
            <h2>Tasks</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  Task by {task.creator}, Reward: {ethers.utils.formatEther(task.reward)} HSR{" "}
                  {!task.completed && <button onClick={() => completeTask(task.id)}>Complete</button>}
                  {task.completed && <span>Completed</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}





export default App;
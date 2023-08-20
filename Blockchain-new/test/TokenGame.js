const { expect } = require("chai");

describe("TokenGame", function () {
  let TokenGame;
  let tokenGame;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    TokenGame = await ethers.getContractFactory("TokenGame");
    tokenGame = await TokenGame.deploy();
    await tokenGame.deployed();
  });

  it("Should initialize with the correct owner", async function () {
    expect(await tokenGame.owner()).to.equal(owner.address);
  });

  it("Should buy tokens ", async function () {
    const ethAmount = ethers.utils.parseEther("0.5");
    const initialPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));

    await expect(async () => {
        await tokenGame.connect(player1).buyTokens({ value: ethAmount });
    }).to.changeEtherBalances([player1], [ethAmount.mul(-1)]);

    const finalPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(finalPlayer1Balance).to.equal(initialPlayer1Balance.add(1));

    const player1Tokens = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(player1Tokens).to.equal(2);

    const player2EthAmount = ethers.utils.parseEther("0.7");
    const initialPlayer2Balance = await player2.getBalance();

    await expect(async () => {
        await tokenGame.connect(player2).buyTokens({ value: player2EthAmount });
    }).to.changeEtherBalances([player2], [player2EthAmount.mul(-1)]);

    const finalPlayer2Balance = await player2.getBalance();
    expect(finalPlayer2Balance).to.equal(initialPlayer2Balance.sub(player2EthAmount));

    const player2Tokens = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));
    expect(player2Tokens).to.equal(2);

    const initialOwnerBalance = await player1.getBalance();

    await expect(async () => {
        await tokenGame.connect(player1).buyTokens({ value: ethAmount });
    }).to.changeEtherBalances([player1], [ethAmount.mul(-1)]);

    const finalOwnerBalance = await player1.getBalance();
    expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethAmount));
});

  it("Should send tokens", async function () {
    const initialBalance = 10;
    await tokenGame.connect(player1).initializePlayer(ethers.utils.formatBytes32String("player1"));
    await tokenGame.connect(player2).initializePlayer(ethers.utils.formatBytes32String("player2"));

    await tokenGame.connect(player1).buyTokens(initialBalance);
    const initialPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const initialPlayer2Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    const sendAmount = 3;
    await tokenGame.connect(player1).sendTokens(await tokenGame.getPlayerIdHash(player2.address), sendAmount);

    const finalPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const finalPlayer2Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    expect(finalPlayer1Balance).to.equal(initialPlayer1Balance - sendAmount);
    expect(finalPlayer2Balance).to.equal(initialPlayer2Balance + sendAmount);
  });

  it("Should stake and unstake tokens", async function () {
    const initialBalance = 10;
    await tokenGame.connect(player1).initializePlayer(ethers.utils.formatBytes32String("player1"));

    await tokenGame.connect(player1).buyTokens(initialBalance);
    const initialPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));

    const stakedAmount = 5;
    await tokenGame.connect(player1).stakeTokens(stakedAmount);

    const stakedPlayer1Balance = await tokenGame.getStakedBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(stakedPlayer1Balance).to.equal(stakedAmount);

    await tokenGame.connect(player1).unstakeTokens(stakedAmount);

    const finalPlayer1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(finalPlayer1Balance).to.equal(initialPlayer1Balance);
  });
  it("Should create and complete challenges", async function () {
    const description = "Complete the mission!";
    const reward = 10;

    await tokenGame.connect(player1).createChallenge(description, reward);
    const challenge = await tokenGame.challenges(player1.address);
    expect(challenge.description).to.equal(description);
    expect(challenge.reward).to.equal(reward);
    expect(challenge.active).to.equal(true);

    await tokenGame.connect(player1).completeChallenge();
    const player1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(player1Balance).to.equal(initialBalance + reward);
    const playerPower = await tokenGame.getPower(await tokenGame.getPlayerIdHash(player1.address));
    expect(playerPower).to.equal(10);

    const completedChallengeCount = await tokenGame.completedChallengesCount(player1.address);
    expect(completedChallengeCount).to.equal(1);
  });

  it("Should upgrade character abilities", async function () {
    const initialPower = 20;
    await tokenGame.connect(player1).initializePlayer(ethers.utils.formatBytes32String("player1"));
    await tokenGame.connect(player1).buyTokens(initialPower);

    const upgradeAmount = 5;
    await tokenGame.connect(player1).upgradeCharacterAbilities(upgradeAmount);

    const player1Power = await tokenGame.getPower(await tokenGame.getPlayerIdHash(player1.address));
    expect(player1Power).to.equal(initialPower + upgradeAmount);
  });

  it("Should complete missions", async function () {
    const initialPower = 5;
    await tokenGame.connect(player1).initializePlayer(ethers.utils.formatBytes32String("player1"));
    await tokenGame.connect(player1).buyTokens(initialPower);

    await tokenGame.connect(player1).increasePower(5);

    const description = "Win 3 games!";
    const targetWinCount = 3;
    await tokenGame.connect(player1).createMission(description, targetWinCount);

    await tokenGame.connect(player1).completeMission(description);
    const player1Balance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(player1Balance).to.equal(initialBalance + missionReward);
  });

  it("Should spin the wheel and win rewards", async function () {
    const ethAmount = ethers.utils.parseEther("0.1");
    await tokenGame.connect(player1).buyTokens({ value: ethAmount });

    const player1InitialBalance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));

    await tokenGame.connect(player1).spinWheel();

    const player1FinalBalance = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    expect(player1FinalBalance).to.be.above(player1InitialBalance);
  });

  it("Should play Rock-Paper-Scissors ", async function () {
    await tokenGame.connect(player1).buyTokens(10);
    await tokenGame.connect(player2).buyTokens(10);

    await tokenGame.connect(player1).submitRPSChoice(0);
    await tokenGame.connect(player2).submitRPSChoice(2);

    const player1BalanceBefore = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const player2BalanceBefore = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    await tokenGame.connect(player1).revealRPSChoice(0);
    await tokenGame.connect(player2).revealRPSChoice(2);

    const player1BalanceAfter = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const player2BalanceAfter = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    expect(player1BalanceAfter).to.equal(player1BalanceBefore + 2);
    expect(player2BalanceAfter).to.equal(player2BalanceBefore - 2);

    await tokenGame.connect(player1).submitRPSChoice(1);
    await tokenGame.connect(player2).submitRPSChoice(1);

    const player1BalanceBeforeTie = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const player2BalanceBeforeTie = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    await tokenGame.connect(player1).revealRPSChoice(1);
    await tokenGame.connect(player2).revealRPSChoice(1);

    const player1BalanceAfterTie = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player1.address));
    const player2BalanceAfterTie = await tokenGame.getBalance(await tokenGame.getPlayerIdHash(player2.address));

    expect(player1BalanceAfterTie).to.equal(player1BalanceBeforeTie);
    expect(player2BalanceAfterTie).to.equal(player2BalanceBeforeTie);

    await expect(tokenGame.connect(player1).submitRPSChoice(3)).to.be.revertedWith("Invalid choice");
    await expect(tokenGame.connect(player2).submitRPSChoice(3)).to.be.revertedWith("Invalid choice");

    await tokenGame.connect(player1).revealRPSChoice(0);

    await expect(tokenGame.connect(player1).revealRPSChoice(0)).to.be.revertedWith("Choice already revealed");

    await expect(tokenGame.connect(player2).revealRPSChoice(1)).to.be.revertedWith("Choice not submitted");
});
});
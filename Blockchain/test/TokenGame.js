const { expect } = require("chai");

describe("TokenGame", function () {
  let TokenGame;
  let tokenGame;
  let owner;
  let addr1;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    addr1 = signers[1];

    TokenGame = await ethers.getContractFactory("TokenGame");
    tokenGame = await TokenGame.deploy();
    await tokenGame.deployed();
  });

  it("Should initialize with the correct owner", async function () {
    expect(await tokenGame.owner()).to.equal(owner.address);
  });

  it("Should create a task", async function () {
    await tokenGame.connect(addr1).createTask(100);
    const task = await tokenGame.getTask(0);
    expect(task.creator).to.equal(addr1.address);
    expect(task.reward).to.equal(100);
    expect(task.completed).to.equal(false);
  });

  it("Should complete a task and mint a token", async function () {
    await tokenGame.connect(addr1).createTask(100);
    await tokenGame.connect(addr2).completeTask(0);
    const task = await tokenGame.getTask(0);
    expect(task.completed).to.equal(true);

    const ownerBalanceBefore = await tokenGame.balanceOf(owner.address);
    await tokenGame.connect(addr2).claimTokens();
    const ownerBalanceAfter = await tokenGame.balanceOf(owner.address);

    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore.add(1));
  });

  it("Should buy tokens", async function () {
    const ethAmount = ethers.utils.parseEther("0.1");
    const buyerBalanceBefore = await owner.getBalance();

    await expect(() =>
      tokenGame.connect(addr1).buyTokens({ value: ethAmount })
    ).to.changeEtherBalance(owner, ethAmount.neg());

    const buyerBalanceAfter = await owner.getBalance();
    expect(buyerBalanceAfter).to.equal(buyerBalanceBefore.sub(ethAmount));

    const buyerTokens = await tokenGame.balanceOf(owner.address);
    expect(buyerTokens).to.equal(1);
  });

  it("Should prevent multiple claims", async function () {
    await tokenGame.connect(addr1).claimTokens();
    await expect(tokenGame.connect(addr1).claimTokens()).to.be.revertedWith(
      "Tokens already claimed"
    );
  });

  it("Should prevent multiple completions of the same task", async function () {
    await tokenGame.connect(addr1).createTask(100);
    await tokenGame.connect(addr2).completeTask(0);
    await expect(tokenGame.connect(addr2).completeTask(0)).to.be.revertedWith(
      "Task already completed"
    );
  });
});

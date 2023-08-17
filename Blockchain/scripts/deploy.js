const hre = require("hardhat");


async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying TokenGame contract...");
  try {
  const TokenGame = await hre.ethers.getContractFactory("TokenGame");
  const tokenGame = await TokenGame.deploy();

  console.log("TokenGame deployed to:", tokenGame.address);
  }
  catch (error) {
    console.error("Error deploying contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

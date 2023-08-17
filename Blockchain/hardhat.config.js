const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) { 
    const address = await account.getAddress();
    const balance = await account.getBalance();
    console.log(address + " : " + hre.ethers.utils.formatEther(balance));
  }
  }
);

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "zkEVM",
  networks: {
    hardhat: {},
    zkEVM: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/JcI0o3MTFYndqFCqE-NHM_0Enufa845s",
      accounts: ["08e79ddce309558afabca0f4cdd3e26bc902d194f6c299c7df23e42ca7005ec0"]
    }
  }, 
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

};

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
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: API_MUMBAI,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }, 
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },

};

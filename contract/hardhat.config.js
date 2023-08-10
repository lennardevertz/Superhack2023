require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
require("@truffle/dashboard-hardhat-plugin");

module.exports = {
  solidity: "0.8.17",
  networks: {
    truffledashboard: {
      url: "http://localhost:24012/rpc"
    },
    // for mainnet
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [""],
    },
    // for testnet
    'base-goerli': {
      url: 'https://goerli.base.org',
      accounts: [""],
    },
  },
  etherscan: {
    apiKey: {
     "base-goerli": "PLACEHOLDER_STRING"
    },
    customChains: [
      {
        network: "base-goerli",
        chainId: 84531,
        urls: {
         apiURL: "https://api-goerli.basescan.org/api",
         browserURL: "https://goerli.basescan.org"
        }
      }
    ]
  },
};

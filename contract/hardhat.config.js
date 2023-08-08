require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
require("@truffle/dashboard-hardhat-plugin");

module.exports = {
  solidity: "0.8.17",
  networks: {
    truffledashboard: {
      url: "http://localhost:24012/rpc"
    },
  },
};

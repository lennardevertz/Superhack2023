const { ethers } = require("hardhat");
// npm link typescript
//npx hardhat run --network truffledashboard deploy/deploy.ts

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Contract = await ethers.getContractFactory("PlayPal");

    const contract = await Contract.deploy();
    await contract.deployed();
    console.log("Contract deployed to:", contract.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

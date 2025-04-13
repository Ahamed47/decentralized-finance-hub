const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const EthTransfer = await hre.ethers.getContractFactory("EthTransfer");

  // Deploy the contract
  const ethTransfer = await EthTransfer.deploy();

  // Wait for deployment to complete
  await ethTransfer.waitForDeployment();

  // Get the contract address
  const contractAddress = await ethTransfer.getAddress();

  console.log("Contract deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// const hre = require("hardhat");

// async function main() {
//   const [deployer] = await hre.ethers.getSigners();
//   console.log("Deploying contracts with the account:", deployer.address);

//   // Get the contract factory
//   const EthTransfer = await hre.ethers.getContractFactory("EthTransfer");

//   try {
//     // Deploy the contract
//     console.log("Deploying contract...");
//     const ethTransfer = await EthTransfer.deploy();

//     // Wait for the contract to be deployed
//     await ethTransfer.waitForDeployment();

//     // Get the contract address
//     const contractAddress = await ethTransfer.getAddress();

//     console.log("Contract deployed to:", contractAddress);

//     // If you need the deployment transaction details, you can get them from the deployment
//     const deploymentTransaction = ethTransfer.deploymentTransaction();
//     if (deploymentTransaction) {
//       console.log("Deployment transaction hash:", deploymentTransaction.hash);
//     } else {
//       console.log("No deployment transaction available (may be already mined)");
//     }
//   } catch (error) {
//     console.error("Error during deployment:", error);
//     process.exit(1);
//   }
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("Deployment failed:", error);
//     process.exit(1);
//   });

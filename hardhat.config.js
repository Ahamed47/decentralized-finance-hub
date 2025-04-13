require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, INFURA_API_KEY } = process.env;

console.log("INFURA:", INFURA_API_KEY ? "Loaded" : "undefined");
console.log("PRIVATE_KEY:", PRIVATE_KEY ? "Loaded" : "undefined");

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

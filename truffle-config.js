require('babel-register');
require('babel-polyfill');
const fs = require('fs');

const HDWalletProvider = require('@truffle/hdwallet-provider');


const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/4df44be8a3bb49529ab925c3c135106d`),
      network_id: 4,
      gas: 9000000,
      gasPrice: 21000000000
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

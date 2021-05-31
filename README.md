# C Run

## Let's Run
### run locally
* Put your account public key and private key in `.env`
* Install ganache-cli `npm install -g ganache-cli`
* Run `npm install`
* Run `ganache-cli`
* Run `truffle migrate --reset` to deploy smart contract into local blockchain
* Copy the contract address and paste it in `.env`
* Run `node scripts/minter.js` to mint tokens from the csv
* Start the app `npm run start`
* Connect wallet to ganache local network
### Show on Infura
* Run `npm install`
* Start the app `npm run start`
* View the minted tokens
## Infura
* The contract on etherscan
- https://rinkeby.etherscan.io/address/0x1cFee6cA611D1cf5289aA35FbDd4FcD7B34dA829 
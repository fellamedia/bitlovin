const fs = require('fs');
const readline = require('readline');
const Tx = require('ethereumjs-tx').Transaction;


const contract = require('../src/abis/CRun.json');
const abi = contract.abi;

let Web3 = require('web3'); // https://www.npmjs.com/package/web3
let utils = Web3.utils;

let delay = async (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

let txCount = async (account) => new Promise( (resolve, reject) => web3.eth.getTransactionCount(account, (err, txCount) => resolve(txCount)) ); 

let web3 = new Web3();
let httpProvider = "";
if (process.argv.length == 2) {
  httpProvider = "http://localhost:8545";
} else if (process.argv[2] == "rinkeby") {
  httpProvider = "https://rinkeby.infura.io/v3/4df44be8a3bb49529ab925c3c135106d";
} else {
  throw "invalid argument";
}
web3.setProvider(new web3.providers.HttpProvider(httpProvider));

const accounts = [
  process.env.ACCOUNT_ADDRESS || null
];

const contractAddress = process.env.CONTRACT_ADDRESS || null;
if (accounts[0] == null || contractAddress == null ) throw "Run source .env first"

const tokeny = new web3.eth.Contract(abi, contractAddress)


const minter = async function(heritage, ranking, stock, talent, gender, skinName) {
  try {
    let count = await txCount(accounts[0]);
    const contractCallData = tokeny.methods.mint(utils.fromUtf8(heritage), ranking,
    utils.fromUtf8(stock), utils.fromUtf8(talent), 
    utils.fromUtf8(gender), utils.fromUtf8("Chicken"), 
    utils.fromUtf8(skinName), utils.fromUtf8('Unclassed')).encodeABI();

    const txObject = {
      nonce:    utils.toHex(count),
      to:       contractAddress,
      value:    utils.toHex(utils.toWei('0', 'ether')),
      gasLimit: utils.toHex(2100000),
      gasPrice: utils.toHex(utils.toWei('6', 'gwei')),
      data: contractCallData  
    }
      // Sign the transaction
      const tx = new Tx(txObject, {chain:'rinkeby'});
      tx.sign(Buffer.from(process.env.PRIVATE_KEY, 'hex'));
  
      const serializedTx = tx.serialize();
      const raw = '0x' + serializedTx.toString('hex');
  
      // Broadcast the transaction
      web3.eth.sendSignedTransaction(raw, (err, tx) => {
          console.log(tx);
          console.log(err);
      });
  } catch(e) {
    console.log("Error adding token: ", e)
  }
};

const readInterface = readline.createInterface({
  input: fs.createReadStream('scripts/crun-data.csv'),
  console: false
});

(
  async () => {
    for await (const line of readInterface) {
      row = line.split(",");
      heritage = row[1];
      ranking = row[2];
      stock = row[3];
      talent = row[4];
      gender = row[5];
      skinName = row[7];
      await minter(heritage, ranking, stock, talent, gender, skinName);
      await delay(15000);
    }
  }
)();
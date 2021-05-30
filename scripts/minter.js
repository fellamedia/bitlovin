// // import {object as data} from "../script/SolnSquareVerifier.json";
const contract = require('../src/abis/CRun.json');
const abi = contract.abi;

let Web3 = require('web3'); // https://www.npmjs.com/package/web3

// // Create a web3 connection to a running geth node over JSON-RPC running at
// // http://localhost:8545
// // For geth VPS server + SSH tunneling see
// // https://gist.github.com/miohtama/ce612b35415e74268ff243af645048f4
// const web3 = new Web3("wss://rinkeby.infura.io/ws/v3/e2dd783c595b4c458cc0278886a11764");
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

const accounts = [
  "0xD04FB1a81c9252b02e137AE3A75610172B7355Dd"
];

const CONTRACT_ADDRESS = "0xdC7423eB30F4897Da5640f9Bf05E4a7f92c7256c";
const tokeny = new web3.eth.Contract(abi, CONTRACT_ADDRESS)

tokeny.events.SolutionAdded({
fromBlock:'latest',
toBlock:'latest'
}).on("",  function(error, event){
console.log(event);
});

const runner = async function() {
  try {
    await tokeny.methods.addSolution(
      proof.proof.a,
      proof.proof.b,
      proof.proof.c,
      proof.inputs)
      .send({from: accounts[0], gasLimit: 1000000});
  } catch(e) {
    console.log("Error adding solution: ", e)
  } finally {
    let events = await tokeny.getPastEvents( 'SolutionAdded', { fromBlock: 'latest', toBlock: 'latest' } );
    console.log(events);
  }
};

runner();

setTimeout(()=>console.log("Exiting .... "),  5000);
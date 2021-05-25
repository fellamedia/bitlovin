var Blazer = artifacts.require("./Blazer.sol");


 module.exports = function(deployer) {
    deployer.deploy(Blazer)
      .then(() => console.log(Blazer.address))
      .then(() => Blazer.deployed())
      .then(_instance => console.log(_instance.address));
};
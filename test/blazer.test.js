const BlazerToken = artifacts.require("Blazer");

contract("BlazerToken", function (accounts) {
  it("it should assert blazer creation", async function () {
    await BlazerToken.deployed();
    return assert.isTrue(true);
  });

  
  it("it should assert total supply", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
        blazer = instance;
        return blazer.totalSupply.call();
    }).then(function(result){
     assert.equal(web3.utils.fromWei(result,"ether"), 3000000000, 'total supply is wrong');
    })
  });

  it("it should assert token name", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
        blazer = instance;
        return blazer.name.call();
    }).then(function(result){
     assert.equal(result, "Blazer", 'token name is wrong');
    })
  });

  it("it should assert token owner", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
        blazer = instance;
        return blazer.owner();
    }).then(function(result){
     assert.equal(result, accounts[0], 'token owner is wrong');
    })
  });

  it("it should return the correct balance of blazer owner", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
      blazer = instance;
      return blazer.balanceOf.call(accounts[0]);
    }).then(function(result){
      assert.equal(web3.utils.fromWei(result,"ether"), 3000000000, 'owner balance is wrong');
    })
  });

  it("it should throw exception if try to transfer blazer in initial offering", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
      blazer = instance;
      return blazer.transfer(accounts[1], 1000000);
    }).then(function(){
      return blazer.balanceOf.call(accounts[0]);
    }).then(function(result){
      assert.equals(web3.utils.fromWei(result,"ether"), 2999900000, 'accounts[0] balance is wrong');
    }).catch(function(error) {
      assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert',
          'transfer tokens before ICO completed will throw exception.'
      )})
  });

  it("it should throw exception if try to extract Ethers before ICO completed", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
      blazer = instance;
      return blazer.extractEther();
    }).then(function(result){
      return web3.eth.getBalance(blazer.address);
    }).catch(function(error) {
      assert.include(
          error.message,
          'Returned error: VM Exception while processing transaction: revert',
          'ethers transfer to account before ICO completed will throw exception.'
      )})
  });
  

  it("it should let user transfer blazer after ICO Completed only", function() {
    var blazer;
    return BlazerToken.deployed().then(function(instance){
      blazer = instance;
      return blazer.setBlazerCompleted(true);
    }).then(function(result){      
      return blazer.transfer(accounts[1], 1000000);
    }).then(function(){
      return blazer.balanceOf.call(accounts[0]);
    }).then(function(result){
      assert.equal(web3.utils.fromWei(result,"ether"), 2999999999.999999999999, 'accounts[0] balance is wrong');
    })
  });

 
it("it should let user buy tokens using ether and return valid token balance", function() {
  var blazer;
  return BlazerToken.deployed().then(function(instance){
    blazer = instance;
    return blazer.sendTransaction({from: accounts[1], value:web3.utils.toWei("1","ether")})
  }).then(function(){
    return blazer.balanceOf(accounts[1]);
  }).then(function(result){
    assert.equal(web3.utils.fromWei(result,"ether"), 270270.000000000001, 'accounts[1] balance is wrong');
  })
});


it("it should transfer ether to contract and return valid Ether balance in contract address", function() {
  var blazer;
  return BlazerToken.deployed().then(function(instance){
    blazer = instance;
    return blazer.sendTransaction({from: accounts[1], value:web3.utils.toWei("1","ether")})
  }).then(function(){
    return web3.eth.getBalance(blazer.address);
  }).then(function(result){
    assert.equal(web3.utils.fromWei(result,"ether"), 2, 'accounts[0] balance is wrong');
  })
});

it("it should give owner authority to spend owners blazer to other accounts", function() {
  var blazer;
  return BlazerToken.deployed().then(function(instance){
    blazer = instance;
   return blazer.approve(accounts[1], 200000);
  }).then(function(){
   return blazer.allowance.call(accounts[0], accounts[1]);
  }).then(function(result){
   assert.equal(web3.utils.fromWei(result,"ether"), 0.0000000000002, 'allowance is wrong');
   return blazer.transferFrom(accounts[0], accounts[2], 200000, {from: accounts[1]});
  }).then(function(){
   return blazer.balanceOf.call(accounts[0]);
  }).then(function(result){
   assert.equal(web3.utils.fromWei(result,"ether"), 2999459459.9999999999988, 'accounts[0] balance is wrong');
   return blazer.balanceOf.call(accounts[1]);
  }).then(function(result){
   assert.equal(web3.utils.fromWei(result,"ether"), 540540.000000000001, 'accounts[1] balance is wrong');
   return blazer.balanceOf.call(accounts[2]);
  }).then(function(result){
   assert.equal(web3.utils.fromWei(result,"ether"), 0.0000000000002, 'accounts[2] balance is wrong');
  })
});

it("it should extract Ethers after ICO completed", function() {
  var blazer;
  return BlazerToken.deployed().then(function(instance){
    blazer = instance;
    return blazer.setBlazerCompleted(true);
  }).then(function(result){
    return blazer.sendTransaction({from: accounts[1], value:web3.utils.toWei("1","ether")})
  }).then(function(result){
    return web3.eth.getBalance(blazer.address);
  }).then(function(result){
    assert.equal(web3.utils.fromWei(result,"ether"), 3, 'accounts[2] balance is wrong');
    return blazer.extractEther();
  }).then(function(result){
    return web3.eth.getBalance(blazer.address);
  }).then(function(result){
    assert.equal(web3.utils.fromWei(result,"ether"), 0, 'accounts[2] balance is wrong');
  })
});

it("it should set ICO contract owner address", function() {
  var blazer;
  return BlazerToken.deployed().then(function(instance){
      blazer = instance;
      return blazer.setBlazerDex(accounts[1]);
    }).then(function(result){
      return blazer.BlazerICODex();
    }).then(function(result){
   assert.equal(result, accounts[1], 'Blazer ICO contract address is wrong');
  })
});



})

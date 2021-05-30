const utils = require('web3').utils
const CRun = artifacts.require('./CRun.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CRun', (accounts) => {
  let contract

  before(async () => {
    contract = await CRun.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'CRun')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'CHICK')
    })

  });

  describe('mint test', async () => {

    it('create token', async () => {
      const result = await contract.mint(utils.fromUtf8("Serama"), 1,
         utils.fromUtf8("Crisp"), utils.fromUtf8("Flight"), 
         utils.fromUtf8("Hen"), utils.fromUtf8("Chicken"), 
         utils.fromUtf8("commonColourB"), utils.fromUtf8('Unclassed'));
      const totalSupply = await contract.totalSupply()
      // SUCCESS
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct');
    })
  })

  describe('token storage test', async () => {
    it('lists tokens correctly', async () => {
      // Mint 3 more tokens
      await contract.mint(utils.fromUtf8("Serama"), 1,
      utils.fromUtf8("Robust"), utils.fromUtf8("Growth"), 
      utils.fromUtf8("Rooster"), utils.fromUtf8("Chicken"), 
      utils.fromUtf8("commonColourA"), utils.fromUtf8('Unclassed'));

      await contract.mint(utils.fromUtf8("Serama"), 2,
      utils.fromUtf8("Fresh"), utils.fromUtf8("Anvil"), 
      utils.fromUtf8("Hen"), utils.fromUtf8("Chicken"), 
      utils.fromUtf8("UncommonColourA"), utils.fromUtf8('Unclassed'));

      const totalSupply = await contract.totalSupply()

      let chick
      let result = []

      for (var i = 1; i <= totalSupply; i++) {
        chick = await contract.chicks(i - 1)
        result.push(chick)
      }

      let expected = [{heritage: "Serama", 
      stock: "Crisp", talent: "Flight"},
        {heritage: "Serama", 
         stock: "Robust", talent: "Growth"},
         {heritage: "Serama", 
         stock: "Fresh", talent: "Anvil"}
         ];
      result = result.map((r) => {
        return {heritage: utils.toUtf8( r.heritage), 
          stock: utils.toUtf8(r.stock), 
          talent: utils.toUtf8(r.talent)};
      });
      assert.deepEqual(result, expected)
    })
  });

})

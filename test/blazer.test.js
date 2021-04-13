const Web3Utils = require('web3-utils');
const {
  BN,           // Big Number support
  time,
  balance,
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const BlazerArtifact = artifacts.require('Blazer');

contract("Blazer", accounts => {
  let Blazer;
  let [admin, user1, user2, user3] = accounts;

  beforeEach(async () => {
    /**
     * cap 2,100,000
     * rate: 1 Blazer = 10 wei
     * wallet: admin
     */
    Blazer = await BlazerArtifact.new(new BN(2100000 * 10 ** 8), 10, admin);
  })

  describe('buyTokens:', () => {
    it('mint new token on rate', async() => {
      let pre_balance = await balance.current(admin, unit = 'wei');
      await Blazer.buyTokens(user1, {
        from: user1,
        value: new BN(100)
      });
      let suf_balance = await balance.current(admin, unit = 'wei');
      assert(suf_balance.sub(pre_balance).eq(new BN(100)), 'fund transfer amount incorrect');

      let b = await Blazer.balanceOf(user1);
      assert(b.eq(new BN(10 * 10 ** 8)), 'incorrect amount minted');
    })

    it('should not mint more than cap', async() => {
      await Blazer.buyTokens(user1, {
        from: user1,
        value: new BN(21000000)
      });
      await expectRevert(
        Blazer.buyTokens(user1, {
          from: user1,
          value: new BN(10)
        }), 'Blazer: cap exceeded'
      );
    })
  })
})
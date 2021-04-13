pragma solidity 0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Blazer is ERC20, Ownable{
  using SafeMath for uint256;
  uint256 immutable public cap;
  address payable immutable public wallet;
  // how many wei units a buyer pay per token
	uint256 public rate;
  uint8 public decimal = 8;
  

  constructor(uint256 _cap, uint256 _rate, address payable _wallet) public ERC20('BLAZER', 'B') {
    cap = _cap;
    wallet = _wallet;
    rate = _rate;
  }

  function decimals() public view override returns (uint8) {
    return decimal;
  }

  function buyTokens(address beneficiary) public payable {
    require(beneficiary != address(0), "can't transfer to the zero address");
    
    uint256 weiAmount = msg.value;
    uint256 tokens = convertWeiToTokens(weiAmount);
    _mint(beneficiary, tokens);
    wallet.transfer(msg.value);
  }

  function convertWeiToTokens(uint256 weiAmount) public view returns (uint256) {
	  uint256 tokens = weiAmount.mul(10**decimal);
	  tokens = tokens.div(rate);
	  return tokens;
	}

  function _mint(address account, uint256 amount) internal virtual override {
    require(totalSupply() + amount <= cap, "Blazer: cap exceeded");
    super._mint(account, amount);
  }
}
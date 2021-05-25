pragma solidity 0.5.16;


library SafeMath {

  /**
  * Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return a / b;
  }

  /**
  * Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}

contract IBlazer {
    using SafeMath for uint256;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => uint256) balances;

    uint256 totalSupply_;
    uint256 initialSupply  =  3*(10**9)* (10**18);    // 30 billion Tokens;
	  address payable public owner;
    /**
    * Total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
    * Transfer token for a specified address
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[msg.sender]);
        require(_to != address(0));

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
    * Gets the balance of the specified address.
    */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

      mapping (address => mapping (address => uint256)) internal allowed;


    /**
    * Transfer tokens from one address to another
    */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_value <= balances[_from], "insufficient balance");
        require(_value <= allowed[_from][msg.sender],"");
        require(_to != address(0));

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);
        return true;
    }

    /**
    * Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
    */
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
    * To check the amount of tokens that an owner allowed to a spender.
    */
    function allowance(address _owner,address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
    * Increase the amount of tokens that an owner allowed to a spender.
    */
    function increaseApproval(address _spender, uint256 _addedValue) public returns (bool) {
        allowed[msg.sender][_spender] = (allowed[msg.sender][_spender].add(_addedValue));
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }

    /**
    * Decrease the amount of tokens that an owner allowed to a spender.
    */
    function decreaseApproval(address _spender, uint256 _subtractedValue) public returns (bool) {
        uint256 oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue >= oldValue) {
          allowed[msg.sender][_spender] = 0;
        } else {
          allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
        return true;
    }
}

contract Blazer is IBlazer {
	string public name = 'Blazer';
	string public symbol = 'BLZ';
	uint256 public decimals = 18;
	address public BlazerICODex;
  
	uint internal ICOStartTime;
	uint internal ICOEndTime;
  uint internal tokenrateinwei=3700000000000;
  bool internal investors=true;
  bool internal BlazerICOCompleted = false;
  address payable internal _self;

  event Receive(uint value);

	modifier onlyBlazerDex {
		require(msg.sender == BlazerICODex);
		_;
	}

	modifier onlyOwner {
		require(msg.sender == owner);
		_;
	}

  	modifier onlyInvestors {
		require(investors == true);
		_;
	}

	modifier afterBlazerDex {
	require(BlazerICOCompleted == true);
		_;
	}

	constructor () public IBlazer() {
    totalSupply_ = initialSupply;
		owner = msg.sender;
    _self = address(this);
    balances[owner] = totalSupply_;
	}

	function setInvestor(bool _value) public onlyOwner {
		investors = _value;
	}

	function setBlazerCompleted(bool _value) public onlyOwner {
		BlazerICOCompleted = _value;
	}

	function setICOTime(uint _start, uint _end) public onlyOwner {
		ICOStartTime = _start;
		ICOEndTime = _end;
	}
	function setBlazerDex(address _BlazerDexAddress) public onlyOwner {
		require(_BlazerDexAddress != address(0));
		BlazerICODex = _BlazerDexAddress;
	}

	function buy(address _to, uint256 _value) internal {
		require(_to != address(0),"reciever address is of owner");
		require(_value > 0,"amount cannot be 0");
		balances[owner] = balances[owner].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(owner, _to, _value);
	}

 function () external payable onlyInvestors{
      uint tokensToBuy;
      tokensToBuy = msg.value / tokenrateinwei;
      tokensToBuy = tokensToBuy * 1e18;
      require(tokensToBuy<=totalSupply());
      emit Receive(tokensToBuy);
      buy(msg.sender, uint256(tokensToBuy));
   }

   function transfer(address _to, uint256 _value) public afterBlazerDex returns(bool) {
      return super.transfer(_to, _value);
   }

   function transferFrom(address _from, address _to, uint256 _value) public afterBlazerDex returns(bool) {
      return super.transferFrom(_from, _to, _value);
   }
   function approve(address _spender, uint256 _value) public afterBlazerDex returns(bool) {
      return super.approve(_spender, _value);
   }

   function increaseApproval(address _spender, uint _addedValue) public afterBlazerDex returns(bool success) {
      return super.increaseApproval(_spender, _addedValue);
   }
   function decreaseApproval(address _spender, uint _subtractedValue) public afterBlazerDex returns(bool success) {
      return super.decreaseApproval(_spender, _subtractedValue);
   }

    function extractEther() external afterBlazerDex onlyOwner {
        uint256 balance = _self.balance;
        owner.transfer(balance);
    }
}


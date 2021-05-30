pragma solidity >=0.5.0;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract CRun is ERC721Full {
  struct Chick {
    bytes32 heritage;
    uint64 ranking;
    bytes32 stock;
    bytes32 talent;
    bytes32 gender;
    bytes32 animal;
    bytes32 skinName;
    bytes32 class;
  }

  Chick[] public chicks;
  mapping(uint256 => Chick) _chickIdMap;

  constructor() ERC721Full("CRun", "CHICK") public {
  }

  function mint(bytes32  heritage, uint64 ranking, 
      bytes32  stock, bytes32  talent, 
      bytes32  gender, bytes32  animal,
      bytes32  skinName, bytes32  class) public {
    Chick memory  _chick = Chick(heritage, ranking, stock, talent, gender, animal, skinName, class);
    uint256 _id = chicks.push(_chick);

    _mint(msg.sender, _id);
    _chickIdMap[_id] = _chick;
    // push new chick to server
  }

  // function addAttributes

}

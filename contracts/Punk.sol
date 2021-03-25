pragma solidity 0.8.2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Punk is ERC721Enumerable{
  constructor(string memory baseURI) public ERC721("Punk", "@") {
    
  }
}
// SPDX-License-Identifier: MIT


pragma solidity >=0.8.0 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";


contract Room is ERC721Enumerable, Ownable {

    
  using Strings for uint256;
  uint256 public constant MAX_SUPPLY = 10000;
  
  constructor() ERC721("Room", "ROOM") {}
  
  
  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function mint() public payable {
    uint256 supply = totalSupply() +1;
    require(supply < MAX_SUPPLY);
    if ( supply > 99 && supply < 1000 ) {
      require(msg.value == 0.0075 ether, "Must be exactly 0.0075 ETH");
    }
    if (supply >= 1000){
      require(msg.value == 0.015 ether, "Must be exactly 0.015 ETH");
    }
    _safeMint(msg.sender, supply);
  }
  

  
  function buildMetadata(uint256 _tokenId) private pure returns(string memory) {
      return string(abi.encodePacked(
              'data:application/json;base64,', Base64.encode(bytes(abi.encodePacked(
                          '{"name":"', 
                          'Room #', _tokenId.toString(), 
                          '", "description":"', 
                          "Rooms are fully on-chain core primitives of the Roomverse. These primitives will live eternally on the Ethereum blockchain.",
                          '", "image": "', 
                          'data:image/svg+xml;base64,', 
                          Base64.encode(bytes(
                          abi.encodePacked(
                            '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">',
                             '<g id="Layer_1">',
                              '<title>Layer 1</title>',
                              '<rect id="svg_1" height="165" width="175" y="151.33333" x="160.33499" stroke="#000" fill="#B8874D"/>',
                             '</g>',
                            '</svg>'))),   
                          '"}')))));
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
      require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
      return buildMetadata(_tokenId);
  }


  function withdraw() public payable onlyOwner {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success);
  }
}


/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64

library Base64 {
    string internal constant TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';
        
        // load the table into memory
        string memory table = TABLE;

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((data.length + 2) / 3);

        // add some extra buffer at the end required for the writing
        string memory result = new string(encodedLen + 32);

        assembly {
            // set the actual output length
            mstore(result, encodedLen)
            
            // prepare the lookup table
            let tablePtr := add(table, 1)
            
            // input ptr
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            
            // result ptr, jump over length
            let resultPtr := add(result, 32)
            
            // run over the input, 3 bytes at a time
            for {} lt(dataPtr, endPtr) {}
            {
               dataPtr := add(dataPtr, 3)
               
               // read 3 bytes
               let input := mload(dataPtr)
               
               // write 4 characters
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(18, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr(12, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(shr( 6, input), 0x3F)))))
               resultPtr := add(resultPtr, 1)
               mstore(resultPtr, shl(248, mload(add(tablePtr, and(        input,  0x3F)))))
               resultPtr := add(resultPtr, 1)
            }
            
            // padding with '='
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        
        return result;
    }
}
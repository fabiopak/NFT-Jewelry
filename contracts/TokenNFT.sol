// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./TokenNFTStorage.sol";

contract TokenNFT is TokenNFTStorage, OwnableUpgradeable, ERC721EnumerableUpgradeable {
    using StringsUpgradeable for uint256;
    // using CountersUpgradeable for CountersUpgradeable.Counter;

    function initialize(string memory _name, 
            string memory _symbol, 
            string memory _imageUri,
            string memory _metadataName,
            string memory _metadataDescription,
            address _creatorAddress) public initializer {
        OwnableUpgradeable.__Ownable_init();
        __ERC721_init(_name, _symbol);
        imageUri = _imageUri;
        metadataName = _metadataName;
        metadataDescription = _metadataDescription;
        creatorAddress = _creatorAddress;
    }

    receive() external payable{ }

    modifier creatorOnly() {
        require(creatorAddress == msg.sender, "Not a creator");
        _;
    }

    /**
     * @dev Indicates weither any token exist with a given id, or not.
     * @param id token id
     */
    function exists(uint256 id) public view returns (bool) {
        return bytes(tokenURI(id)).length > 0;
    }

    /**
     * @dev change image URI 
     * @param _imageURI URI string
     */
    function setImageURI(string memory _imageURI) external creatorOnly {
        imageUri = _imageURI;
    }

    /**
     * @dev change collection name
     * @param _name New name
     */
    function setMetadataName(string memory _name) external creatorOnly {
        metadataName = _name;
    }

    /**
     * @dev change collection description
     * @param _description New description
     */
    function setMetadataDescription(string memory _description) external creatorOnly {
        metadataDescription = _description;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}. Read tokenURI in a tokenID
     * @param _tokenId token ID
     * @return token URI string
     */
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        // require(exists(_tokenId), "URI query for nonexistent token");
        if (_exists(_tokenId)) {
            return string(
                abi.encodePacked(
                    'data:application/json;text,{"name":"',
                    metadataName,
                    ' #',
                    StringsUpgradeable.toString(_tokenId),
                    '","description":"',
                    metadataDescription,
                    '","image":"',
                    imageUri,
                    '"}'
                )  
            );
        } else 
            return "";
    }

    /**
    * @dev mint a token based on current enumeration and sends it to a recipient, with tokenURI formed by baseURI + counter
    * @param to recipient address
    * @param _startId minting start id
    * @param _idAmount amount of consecutive id to mint
    */
    function mintBatch(address to, uint256 _startId, uint256 _idAmount) external creatorOnly returns (bool) {
        require(_idAmount > 0, "TokenNFT: amount must be greater than 0");
        bool elementExistant;

        for (uint i = 0; i < _idAmount; i++) {
            // tokenIdTracker.increment();
            // _safeMint(to, tokenIdTracker.current());
            
            uint256 idToMint = _startId + i;
            // check if an id already exists, and mint it or not
            if (exists(idToMint)) {
                elementExistant = true;
                continue;
            }

            _safeMint(to, idToMint);
        }
        if (elementExistant)
            return false;
        
        return true;        
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        require(exists(tokenId), "TokenNFT: id does not exist");
        
        _burn(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setCreatorAddress(address _newCreator) external creatorOnly {
        require(_newCreator != address(0), "TokenNFT: new recipient is the zero address");
        creatorAddress = _newCreator;
    }

    /**
    * @dev withdraws ethers in contract
    */
    function ethWithdraw() external payable {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ethers to withdraw");
        bool success;
        // creator fees
        (success, ) = payable(creatorAddress).call{value: balance}("");
        require(success, "Transfer failed.");
    }

    /**
    * @dev withdraws tokens in contract
    */
    function tokenWithdraw(address _token) external {
        uint256 balance = IERC20Upgradeable(_token).balanceOf(address(this));
        require(balance > 0, "No token to withdraw");
        SafeERC20Upgradeable.safeTransfer(IERC20Upgradeable(_token), creatorAddress, balance);
    }

}
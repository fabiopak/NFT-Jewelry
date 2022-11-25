// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract TokenNFTStorage {
    CountersUpgradeable.Counter public tokenIdTracker;

    string public baseTokenURI;

    address public creatorAddress;

    // Optional mapping for token URIs
    mapping (uint256 => string) public tokenURIs;
}
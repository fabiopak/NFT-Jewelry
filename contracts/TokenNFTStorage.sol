// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

contract TokenNFTStorage {
    // CountersUpgradeable.Counter public tokenIdTracker;

    string public imageUri;
    string public metadataName;
    string public metadataDescription;
    address public creatorAddress;
}
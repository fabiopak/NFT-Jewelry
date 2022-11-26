require('dotenv').config();
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const TokenNFT = artifacts.require("TokenNFT");

const name = 'GoldMedals';
const symbol = 'GMT';
const metadataName = "Valore Unico";
const metadataDescription = "Medaglia oro 750 - 4 gr";
const imageuri = "https://nft-jewelry-poc.web.app/gold.jpg";

// const ADMIN_ROLE = 'a49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775'; //keccak256("ADMIN_ROLE");

module.exports = async (deployer, network, accounts) => {

  if (network == "development") {
    const factoryOwner = accounts[0];
    const creator = accounts[1];

    const NFTinstance = await deployProxy(TokenNFT, [name, symbol, imageuri, metadataName, metadataDescription, creator], { from: factoryOwner });
    console.log('NFTinstance Deployed: ', NFTinstance.address);
    
  } else if (network == "mumbai") {

    let { IS_UPGRADE, PROXY_ADMIN_ADDRESS, TOKEN_FACTORY_NFT } = process.env;

    const accounts = await web3.eth.getAccounts();
    const factoryOwner = accounts[0];

    if (IS_UPGRADE == 'true') {
      // console.log('contracts are being upgraded');
      // const NFTinstance = await upgradeProxy(TOKEN_FACTORY_NFT, TokenFactoryNFT, { from: factoryOwner });
    } else {
      // deploy new contract
      try {
        const NFTinstance = await deployProxy(TokenNFT, [name, symbol, imageuri, metadataName, metadataDescription, factoryOwner], { from: factoryOwner });
        console.log('NFTinstance Deployed: ', NFTinstance.address);
      } catch (error) {
        console.log(error);
      }
    } 
    
  }
};


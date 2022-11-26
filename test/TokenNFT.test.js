const { BN, constants, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { shouldSupportInterfaces } = require('./SupportsInterface.behavior');

const { expect } = require('chai');

const timeMachine = require('ganache-time-traveler');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

// const fs = require('fs');
// const deployedAddresses = JSON.parse(fs.readFileSync('./test/addresses.json', 'utf8'));

const TokenNFT = artifacts.require('TokenNFT');

const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());
const fromWei8Dec = (x) => x / Math.pow(10, 8);
const toWei8Dec = (x) => x * Math.pow(10, 8);

let nftToken;

contract('TokenNFT', function (accounts) {
  const [ deployer, creator, other1, other2 ] = accounts;

  const name = 'MinterAutoIDToken';
  const symbol = 'MAIT';
  const baseURI = 'my.app/';
  const baseURI2 = 'my.app2/';

  // beforeEach(async function () {
  it('token setup', async function () {
    nftToken = await TokenNFT.deployed();
    expect(nftToken.address).to.be.not.equal(ZERO_ADDRESS);
    expect(nftToken.address).to.match(/0x[0-9a-fA-F]{40}/);  

    this.token = nftToken
  });

  shouldSupportInterfaces(['ERC721']);

  it('token has correct name', async function () {
    expect(await nftToken.name()).to.equal(name);
  });

  it('token has correct symbol', async function () {
    expect(await nftToken.symbol()).to.equal(symbol);
  });

  it('creator has the default admin role', async function () {
    expect(await nftToken.creatorAddress()).to.equal(creator);
  });

  describe('minting', function () {
    it('users can NOT mint tokens', async function () {
      await expectRevert(nftToken.mintBatch(other1, 0, 1, {from: other1 }), "Not a creator");
    });

    it('creator can mint 1 token for other account', async function () {
      tx = await nftToken.mintBatch(other1, 1, 1, {from: creator });
      expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: other1});

      expect(await nftToken.balanceOf(other1)).to.be.bignumber.equal('1');

      expect(await nftToken.ownerOf(1)).to.be.equal(other1);
      expect(await nftToken.tokenURI(1)).to.be.equal(baseURI + (1));
    });

    it('creator can mint 4 tokens for other2 account', async function () {
      tx = await nftToken.mintBatch(other2, 2, 4, {from: creator });
      expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: other2});

      expect(await nftToken.balanceOf(other2)).to.be.bignumber.equal('4');

      expect(await nftToken.totalSupply()).to.be.bignumber.equal('5');

      for (let i = 2; i < 6; i++) {
        expect(await nftToken.ownerOf(i)).to.be.equal(other2);
        expect(await nftToken.tokenURI(i)).to.be.equal(baseURI + (i));
        // console.log(await nftToken.tokenURIs(i));
        // console.log(await nftToken.tokenURI(i));
      }
    });

  });

  describe('transfer', function () {
    it('other2 can transfer their tokens', async function () {
      await nftToken.transferFrom(other2, other1, 4, { from: other2 });

      expect(await nftToken.balanceOf(other2)).to.be.bignumber.equal('3');
      expect(await nftToken.balanceOf(other1)).to.be.bignumber.equal('2');
      expect(await nftToken.totalSupply()).to.be.bignumber.equal('5');
      expect(await nftToken.ownerOf(4)).to.equal(other1);
    });

  });

  describe('burning', function () {
    it('holders can burn their tokens', async function () {
      tx = await nftToken.burn(4, { from: other1 });

      expectEvent(tx, 'Transfer', { from: other1, to: ZERO_ADDRESS });

      expect(await nftToken.balanceOf(other1)).to.be.bignumber.equal('1');
      expect(await nftToken.totalSupply()).to.be.bignumber.equal('4');
      expect(await  nftToken.tokenURI(4)).to.be.equal("");
    });
  });

  describe('change token URI', function () {
    it('change URI for already minted and future nft tokens', async function () {
      tx = await nftToken.setNewTokenBaseURI(baseURI2, { from: creator });

      expect(await nftToken.baseTokenURI()).to.be.equal(baseURI2);

      tx = await nftToken.mintBatch(other1, 5, 1, {from: creator });
      res = await nftToken.mintBatch.call(other1, 5, 1, {from: creator });
      expect(res).to.be.false;

      tx = await nftToken.mintBatch(other1, 6, 1, {from: creator });
      expectEvent(tx, 'Transfer', { from: ZERO_ADDRESS, to: other1});

      expect(await nftToken.balanceOf(other1)).to.be.bignumber.equal('2');

      expect(await nftToken.ownerOf(6)).to.be.equal(other1);
      expect(await nftToken.tokenURI(6)).to.be.equal(baseURI2 + (6));
      for (let i = 1; i < 7; i++) {
        if (i != 4) {
          // console.log(await nftToken.tokenURIs(i));
          // console.log(await nftToken.tokenURI(i));
          expect(await nftToken.tokenURI(i)).to.be.equal(baseURI2 + (i));
        }
      }
    });
  });

  describe('some tests to increase coverage percentage', function () {
    it('check other functions', async function () {
      await expectRevert(nftToken.ethWithdraw(), "No ethers to withdraw");
      // await expectRevert(nftToken.tokenWithdraw(ZERO_ADDRESS), "No token to withdraw");

      await nftToken.setEmittedTokenURI(1, "abc.json", {from: creator})
      expect(await nftToken.tokenURI(1)).to.be.equal(baseURI2 + "abc.json")

      await nftToken.setCreatorAddress(accounts[9], {from: creator});
      expect(await nftToken.creatorAddress()).to.be.equal(accounts[9])

      tx = await nftToken.sendTransaction({from: deployer, value: toWei(1)})
      await nftToken.ethWithdraw();
    });
  });
});

const Auction = artifacts.require("Auction");
const TestToken = artifacts.require("TestToken");
const TestNFT = artifacts.require("TestNFT");

module.exports = async function (deployer) {
    const accounts = await web3.eth.getAccounts()
    await deployer.deploy(TestNFT);
    await deployer.deploy(TestToken);

    testnft = await TestNFT.new()
    testtoken = await TestToken.new()
   

    const nftAddress = testnft.address;
    const nftId = 1;
    const tokenAddress = testtoken.address;
    const startingBid = 1000;
    const bidStep = 500;
    const auctionPeriod = 3600;

    await deployer.deploy(Auction, nftAddress, nftId, tokenAddress,startingBid, bidStep, auctionPeriod);
};

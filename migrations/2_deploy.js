const AuctionFactory = artifacts.require("AuctionFactory");
const Auction = artifacts.require("Auction");
const TestToken = artifacts.require("TestToken");
const TestNFT = artifacts.require("TestNFT");

module.exports = async function (deployer) {
    const accounts = await web3.eth.getAccounts()
    await deployer.deploy(TestNFT);
    await deployer.deploy(TestToken);
    await deployer.deploy(AuctionFactory);

    testtoken = await TestToken.new()
    testnft = await TestNFT.new()      
    auctionfactory = await AuctionFactory.new()
};

const AuctionFactory = artifacts.require("AuctionFactory");
const Auction = artifacts.require("Auction");
const TestToken = artifacts.require("TestToken");
const TestNFT = artifacts.require("TestNFT");

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('AuctionFactory', () => {
    let auctionfactory
    let auction
    let testtoken
    
    beforeEach(async () => {
        testtoken = await TestToken.new()
        testnft = await TestNFT.new()
        auctionfactory = await AuctionFactory.new()
        auction = await auctionfactory.createAuction(testnft.address, 1, testtoken.address, 1000, 500, 3600)
    })
})
const Auction = artifacts.require("Auction");
const TestToken = artifacts.require("TestToken");
const TestNFT = artifacts.require("TestNFT");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Auction', ([owner, user1, user2]) => {
    let auction
    let testtoken
    let testnft

    let startTime
    let stopTime
    let started
    let ended    

    beforeEach(async () => {
        testtoken = await TestToken.new()
        testnft = await TestNFT.new()        

        auction = await Auction.new(testnft.address, 1, testtoken.address, 1000, 500, 50000)

        testtoken.transfer(user1, 10000, { from: owner })
        testtoken.transfer(user2, 15000, { from: owner })       

        await testnft.approve(auction.address, 1, { from: owner })
        })
    describe('Start', () => {

            beforeEach(async () => {
                start = await auction.start()
            })

            describe('Bid', () => {

                beforeEach( async () => {
                    await testtoken.approve(auction.address, 1500, { from: user1 })
                    bid = await auction.bid(1500, { from: user1 })
                    await testtoken.approve(auction.address, 2200, { from: user2 })
                    await auction.bid(2200, { from: user2 })
                    await testtoken.approve(auction.address, 1800, { from: user1 })
                    await auction.bid(1800, { from: user1 })    
                })

                describe('Withdraw', () => {
                    beforeEach( async () => {
                        withdraw = await auction.withdraw({ from: user1 })
                    })
    
                    it('getBalance', async () => {
                        result = await auction.getBalance(user1)  
                        result.toString().should.equal("0")          
                    })
    
                    it('newHighestBidder', async () => {
                        result = await auction.highestBidder()  
                        result.should.equal(user2)
                    })
    
                    it('newHighestBid', async () => {
                        result = await auction.highestBid()  
                        result.toString().should.equal("2200")   
                    })
    
                    it('newPrice', async () => {
                        result = await auction.price()
                        result.toString().should.equal("2000")
                    })
    
                    it('Withdraw event', async () => {
                        const log = withdraw.logs[0]
                        log.event.should.eq('Withdraw')
                        const event = log.args
                        event.bidder.should.equal(user1)
                        event.amount.toString().should.equal("3300")
                    })
                })
            })
        })
    })
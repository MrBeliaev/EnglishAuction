const Auction = artifacts.require("Auction");
const TestToken = artifacts.require("TestToken");
const TestNFT = artifacts.require("TestNFT");
const AuctionFactory = artifacts.require("AuctionFactory");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Auction', ([owner, user1, user2, user3]) => {
    let auctionfactory
    let auction
    let testtoken
    let testnft

    beforeEach(async () => {
        testtoken = await TestToken.new()
        testnft = await TestNFT.new()      
        auctionfactory = await AuctionFactory.new()
        await auctionfactory.createAuction(testnft.address, 1, testtoken.address, 1000, 500, 100000, {from: owner})
        auctions = await auctionfactory.getAuctions()
        auction = await Auction.at(auctions[0]) 
        
        testtoken.transfer(user1, 10000, { from: owner })
        testtoken.transfer(user2, 15000, { from: owner })
        testtoken.transfer(user3, 15000, { from: owner })       

        await testnft.approve(auction.address, 1, { from: owner })
        })
    
    describe('Start', () => {
        beforeEach(async () => {
            await auction.start()
        })

        // it('nft owner', async () => {
        //     const result = await testnft.ownerOf(1)
        //     result.should.equal(auction.address)           
        // })

        // it('started', async () => {
        //     result = await auction.started()
        //     result.should.to.be.true           
        // })

        // it('stopTime', async () => {
        //     stopTime = await auction.stopTime()
        //     startTime = await auction.startTime()
        //     auctionPeriod = await auction.auctionPeriod()
        //     parseInt(stopTime).should.equal((parseInt(startTime) + parseInt(auctionPeriod)))
        // })

            describe('Bid', () => {

                beforeEach( async () => {
                    await testtoken.approve(auction.address, 1500, { from: user1 })
                    bid = await auction.bid(1500, { from: user1 })
                    await testtoken.approve(auction.address, 2200, { from: user2 })
                    await auction.bid(2200, { from: user2 })
                    await testtoken.approve(auction.address, 2500, { from: user3 })
                    await auction.bid(2500, { from: user3 })
                    await testtoken.approve(auction.address, 1800, { from: user1 })
                    await auction.bid(1800, { from: user1 })    
                })

                // it('getBalance', async () => {
                //     result = await auction.getBalance(user1)
                //     result.toString().should.equal("3300")    
                //     result2 = await auction.getBalance(user2)
                //     result2.toString().should.equal("2200")    
                //     result2 = await auction.getBalance(user3)
                //     result2.toString().should.equal("2500")    
                // })

                // it('highestBidder', async () => {
                //     result = await auction.highestBidder()
                //     result.should.equal(user1)    
                // })

                // it('price', async () => {
                //     result = await auction.price()
                //     result.toString().should.equal("2500")   
                // })

                // it('highestBid', async () => {
                //     result = await auction.highestBid()
                //     result.toString().should.equal("3300")    
                // })

                // it('Bid event', async () => {
                //     const log = bid.logs[0]
                //     log.event.should.eq('Bid')
                //     const event = log.args
                //     event.sender.should.equal(user1)
                //     event.amount.toString().should.equal('1500')
                // })        

            describe('Withdraw', () => {
                beforeEach( async () => {
                    withdraw = await auction.withdraw({ from: user2})
                })
                
                // it('fail withdraw', async () => {
                //     await auction.withdraw({ from: user1 }).should.be.rejectedWith("highest bid")
                // })

                // it('getBalance', async () => {
                //     result = await auction.getBalance(user1)  
                //     result.toString().should.equal("3300")   
                //     result = await auction.getBalance(user2)  
                //     result.toString().should.equal("0")            
                // })

                // it('Withdraw event', async () => {
                //     const log = withdraw.logs[0]
                //     log.event.should.eq('Withdraw')
                //     const event = log.args
                //     event.bidder.should.equal(user2)
                //     event.amount.toString().should.equal("2200")
                // })

                describe('End', () => {
                    beforeEach( async () => {
                        end = await auction.stop()
                    })

                    // it('ended', async () => {
                    //     result = await auction.ended()
                    //     result.should.to.be.true           
                    // })

                    // it('nft owner', async () => {
                    //     const result = await testnft.ownerOf(1)
                    //     result.should.equal(user1)           
                    // })

                    it('get balance', async () => {
                        result = await auction.getBalance(user3)  
                        // result.toString().should.equal("0") //800
                        console.log(result.toString())
                    })

                    it('withdraw', async () => {
                        await auction.withdraw({from: user3}) // Error: Returned error: VM Exception while processing transaction: revert
                        result = await auction.getBalance(user3)  
                        // result.toString().should.equal("0")
                        console.log(result.toString())
                    })

                    // it('End event', () => {
                    //     const log = end.logs[0]
                    //     log.event.should.eq('End')
                    //     const event = log.args
                    //     event.winner.should.equal(user1)
                    //     event.amount.toString().should.equal("2500")
                    // })
                })        
            })    
        })
    })
})
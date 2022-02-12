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

        auction = await Auction.new(testnft.address, 1, testtoken.address, 1000, 500, 3600)

        testtoken.transfer(user1, 10000, { from: owner })
        testtoken.transfer(user2, 15000, { from: owner })       

        await testnft.approve(auction.address, 1, { from: owner })
        })
    
    describe('Start', () => {

        beforeEach(async () => {
            start = await auction.start()
        })

        it('nft owner', async () => {
            const result = await testnft.ownerOf(1)
            result.should.equal(auction.address)           
        })

        it('started', async () => {
            result = await auction.started()
            result.should.to.be.true           
        })

        it('stopTime', async () => {
            stopTime = await auction.stopTime()
            startTime = await auction.startTime()
            auctionPeriod = await auction.auctionPeriod()
            parseInt(stopTime).should.equal((parseInt(startTime) + parseInt(auctionPeriod)))
        })

    it('Start event', async () => {
        const log = start.logs[0]
        log.event.should.eq('Start')
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

                it('getBalance', async () => {
                    result = await auction.getBalance(user1)
                    result.toString().should.equal("3300")    
                    result2 = await auction.getBalance(user2)
                    result2.toString().should.equal("2200")    
                })

                it('highestBidder', async () => {
                    result = await auction.highestBidder()
                    result.should.equal(user1)    
                })

                it('price', async () => {
                    result = await auction.price()
                    result.toString().should.equal("2500")   
                    // console.log(result) 
                })

                it('highestBid', async () => {
                    result = await auction.highestBid()
                    result.toString().should.equal("3300")    
                })

            it('Bid event', async () => {
                const log = bid.logs[0]
                log.event.should.eq('Bid')
                const event = log.args
                event.sender.should.equal(user1)
                event.amount.toString().should.equal('1500')
            })        

            describe('Withdraw', () => {
                beforeEach( async () => {
                    withdraw = await auction.withdraw({ from: user1 })
                })

                it('getBalance', async () => {
                    result = await auction.getBalance(user1)  
                    result.toString().should.equal("1500")          
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
                    event.amount.toString().should.equal("1800")
                })

                describe('End', () => {
                    beforeEach( async () => {
                        end = await auction.stop()
                    })

                    it('ended', async () => {
                        result = await auction.ended()
                        result.should.to.be.true           
                    })

                    it('nft owner', async () => {
                        const result = await testnft.ownerOf(1)
                        result.should.equal(user2)           
                    })

                    it('get balance', async () => {
                        result = await auction.getBalance(user2)  
                        result.toString().should.equal("0") 
                    })

                    it('End event', () => {
                        const log = end.logs[0]
                        log.event.should.eq('End')
                        const event = log.args
                        event.winner.should.equal(user2)
                        event.amount.toString().should.equal("2000")
                    })
                })        
            })    
        })
    })
})
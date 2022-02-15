// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Auction.sol";

contract AuctionFactory {
    
    Auction[] public auctions;

    function createAuction(
        address _nftAddress,
        uint _nftId,
        address _tokenAddress,
        uint _startingBid,
        uint _bidStep,        
        uint _auctionPeriod
        ) public {
            Auction auction = new Auction(
                msg.sender,
                _nftAddress,
                _nftId,
                _tokenAddress,
                _startingBid,
                _bidStep,
                _auctionPeriod);
            auctions.push(auction);
    }
    function getAuctions() external view returns(Auction[] memory){
         return auctions;
     }
}
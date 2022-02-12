// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

interface IERC20 {
    function transfer(
        address,
        uint
    ) external;

    function transferFrom(
        address, 
        address, 
        uint
        ) external 
        returns 
        (bool);

     function approve(
        address, 
        uint256
        ) external 
        returns 
        (bool);
}

contract Auction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    address public owner;    
    IERC721 public nftAddress;
    uint public nftId;
    address public tokenAddress;
    uint public stopTime;
    uint public startTime;
    uint public auctionPeriod;     
    bool public started;
    bool public ended;
    uint public bidID;
    uint public bidStep;
    address public highestBidder;
    uint public highestBid;
    uint public price;
    mapping(uint => address) public usersAddr;
    mapping(uint => uint) public usersBids;
    uint public test;
    

    constructor(
        address _nftAddress,
        uint _nftId,
        address _tokenAddress,
        uint _startingBid,
        uint _bidStep,        
        uint _auctionPeriod
    ) {
        nftAddress = IERC721(_nftAddress);
        nftId = _nftId;
        owner = msg.sender;
        highestBid = _startingBid;
        price = _startingBid;
        bidStep = _bidStep;
        tokenAddress = _tokenAddress;
        auctionPeriod = _auctionPeriod;
    }

    function start() public {
        require(!started, "started");
        require(msg.sender == owner, "not seller");

        nftAddress.transferFrom(msg.sender, address(this), nftId);
        started = true;
        startTime = block.timestamp;
        stopTime = startTime + auctionPeriod;

        emit Start();
    }

    function bid(uint _amount) public {
        require(started, "not started");
        require(block.timestamp < stopTime, "ended");
        uint totalBids = (getBalance(msg.sender) + _amount) - (getBalance(msg.sender) + _amount)%bidStep;
        require((totalBids + bidStep) > highestBid, "value < highest");

        highestBidder = msg.sender;
        if (highestBidder != address(0)) {
            
            usersAddr[bidID] = msg.sender;
            usersBids[bidID] = _amount;
            bidID++;
        }
        price = (highestBid - highestBid%bidStep) + bidStep;
        highestBid = getBalance(msg.sender);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);

        emit Bid(msg.sender, _amount);
    }

    function getBalance(address _address) public view returns(uint) {
        uint balance;
        for (uint256 index = 0; index < bidID; index++) {
            if (usersAddr[index] == _address) {
                balance += usersBids[index];
            }
        }
        return balance;
    }

    function withdraw() public {
        if ((stopTime - block.timestamp) > 12 hours) {
            IERC20(tokenAddress).transfer(msg.sender, getBalance(msg.sender)); 
            emit Withdraw(msg.sender, getBalance(msg.sender));           
            for (uint256 index = 0; index < bidID; index++) {
                if (usersAddr[index] == msg.sender) {
                    usersBids[index] = 0;
                }
            }
            if (msg.sender == highestBidder) {
                address newHighestBidder;
                uint newHighestBid;
                for (uint256 index = 0; index < bidID; index++) {
                    if (newHighestBid < getBalance(usersAddr[index])){
                        newHighestBid = getBalance(usersAddr[index]);
                        newHighestBidder = usersAddr[index];
                    }
                }
                highestBidder = newHighestBidder;
                highestBid = newHighestBid;
                price = highestBid - highestBid%bidStep;
            }         
        } else {
            uint amount;
            for (uint256 index = bidID; index >= 0; index--) {                
                if (usersAddr[index] == msg.sender) {
                amount = usersBids[index];
                usersBids[index] = 0;
                break;
            }
            }            
            IERC20(tokenAddress).transfer(msg.sender, amount);
            emit Withdraw(msg.sender, amount);
            if (msg.sender == highestBidder) {
                address newHighestBidder;
                uint newHighestBid;
                for (uint256 index = 0; index < bidID; index++) {
                    if (newHighestBid < getBalance(usersAddr[index])){
                        newHighestBid = getBalance(usersAddr[index]);
                        newHighestBidder = usersAddr[index];
                    }
                }
                highestBidder = newHighestBidder;
                highestBid = newHighestBid;
                price = highestBid - highestBid%bidStep;
            }         
        }
        
    }

    function end() public {
        require(started, "not started");
        require(block.timestamp >= stopTime, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nftAddress.safeTransferFrom(address(this), highestBidder, nftId);
            IERC20(tokenAddress).transfer(owner, price);
            for (uint256 index = 0; index < bidID; index++) {
                if (usersAddr[index] == highestBidder) {
                    usersBids[index] = 0;
                }
            }
        } else {
            nftAddress.safeTransferFrom(address(this), owner, nftId);
        }
        emit End(highestBidder, price);
    }

    function stop() public {
        require(owner == msg.sender, "Only owner");
        stopTime = block.timestamp;
        end();
    }
}
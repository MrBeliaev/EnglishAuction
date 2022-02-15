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

    function approve(
        address, 
        uint256
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
    event Bid(address indexed sender, uint amount, uint bidTime);
    event Withdraw(address indexed bidder, uint amount, uint withdrawTime);
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
    uint public bidStep;
    address public highestBidder;
    uint public highestBid;
    uint public price;
    mapping(address => uint) public balances;    

    constructor(
        address _owner,
        address _nftAddress,
        uint _nftId,
        address _tokenAddress,
        uint _startingBid,
        uint _bidStep,        
        uint _auctionPeriod
    ) {
        nftAddress = IERC721(_nftAddress);
        nftId = _nftId;
        owner = _owner;
        highestBid = _startingBid;
        price = _startingBid;
        bidStep = _bidStep;
        tokenAddress = _tokenAddress;
        auctionPeriod = _auctionPeriod;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == owner, "not seller");

        nftAddress.transferFrom(msg.sender, address(this), nftId);
        started = true;
        startTime = block.timestamp;
        stopTime = startTime + auctionPeriod;

    }

    function bid(uint _amount) external {
        require(started, "not started");
        require(block.timestamp < stopTime, "ended");
        uint totalBids = (balances[msg.sender] + _amount) - (balances[msg.sender] + _amount)%bidStep;
        require(totalBids > highestBid, "value < highest");

        highestBidder = msg.sender;
        if (highestBidder != address(0)) {
            
            balances[msg.sender] += _amount;
        }
        price = (highestBid - highestBid%bidStep) + bidStep;
        highestBid = balances[msg.sender];
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount);
        uint bidTime = block.timestamp;

        emit Bid(msg.sender, _amount, bidTime);
    }

    function getBalance(address _address) public view returns(uint) {
        return balances[_address];
    }

    function withdraw() external {
        require(msg.sender != highestBidder || block.timestamp >= stopTime, "highest bid");
        require((stopTime - block.timestamp) > 24 hours || block.timestamp >= stopTime, "stopTime < 24 hours");
            IERC20(tokenAddress).transfer(msg.sender, balances[msg.sender]); 
            uint withdrawTime = block.timestamp;
            emit Withdraw(msg.sender, balances[msg.sender], withdrawTime);
            balances[msg.sender] = 0;           
    }

    function end() public {
        require(started, "not started");
        require(block.timestamp >= stopTime, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != owner) {
            nftAddress.safeTransferFrom(address(this), highestBidder, nftId);
            IERC20(tokenAddress).transfer(owner, price);
            balances[highestBidder] -= price;
            if (balances[highestBidder] > 0) {
                IERC20(tokenAddress).transfer(highestBidder, balances[highestBidder]);
            }
        } else {
            nftAddress.safeTransferFrom(address(this), owner, nftId);
        }
        emit End(highestBidder, price);
    }

    function stop() external {
        require(owner == msg.sender, "Only owner");
        stopTime = block.timestamp;
        end();
    }
}
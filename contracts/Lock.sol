// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract SmartSaver {
    struct Deposit {
        uint amount;
        uint unlockTime;
    }

    mapping(address => Deposit) public deposits;

    event Deposited(address indexed user, uint amount, uint unlockTime);
    event Withdrawn(address indexed user, uint amount);

    function depositFunds(uint _lockTimeInSeconds) external payable {
        require(msg.value > 0, "Send ETH to save");
        require(deposits[msg.sender].amount == 0, "Already deposited");

        uint unlockTime = block.timestamp + _lockTimeInSeconds;
        deposits[msg.sender] = Deposit(msg.value, unlockTime);

        emit Deposited(msg.sender, msg.value, unlockTime);
    }

    function withdrawFunds() external {
        Deposit memory userDeposit = deposits[msg.sender];
        require(userDeposit.amount > 0, "Nothing to withdraw");
        require(block.timestamp >= userDeposit.unlockTime, "Funds still locked");

        delete deposits[msg.sender];
        payable(msg.sender).transfer(userDeposit.amount);

        emit Withdrawn(msg.sender, userDeposit.amount);
    }

    function getMyDeposit() public view returns (uint amount, uint unlockTime) {
        Deposit memory userDeposit = deposits[msg.sender];
        return (userDeposit.amount, userDeposit.unlockTime);
    }
}

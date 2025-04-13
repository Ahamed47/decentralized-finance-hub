// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EthTransfer {
    event Transferred(address indexed sender, address indexed to, uint256 amount);

    // Make the function payable to accept ETH transfers
    function transferETH(address payable _to) external payable {
        require(msg.value > 0, "Must send ETH");
        require(_to != address(0), "Invalid recipient");

        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Transfer failed");
        
        emit Transferred(msg.sender, _to, msg.value);
    }

    // Keep existing functions
    receive() external payable {}
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
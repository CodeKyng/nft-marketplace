// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MonarchToken
 * @notice Utility token for The Monarch Guild Marketplace
 */
contract MonarchToken is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("Monarch Token", "MONARCH") 
        Ownable(initialOwner) 
    {
        // Mint 1,000,000 tokens to the deployer
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    // Owner can mint more tokens later if needed
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

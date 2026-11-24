// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title The Monarch Guild (TMG)
 * @notice ERC-721 NFT with paid public minting + ERC-2981 royalties (10%)
 */
contract NFT is ERC721URIStorage, Ownable, Pausable, ERC2981, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.01 ether; // Change later with setMintPrice()

    event Minted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MintPriceUpdated(uint256 newPrice);

    constructor() ERC721("The Monarch Guild", "TMG") Ownable(msg.sender) {
        // Default 10% royalty to the contract owner
        _setDefaultRoyalty(msg.sender, 1000); // 1000 = 10%
    }

    // ============ Minting ============

    function mint(string memory tokenURI_) external payable whenNotPaused nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit Minted(msg.sender, tokenId, tokenURI_);
    }

    // Owner can mint for free (useful for yourself / team)
    function ownerMint(address to, string memory tokenURI_) external onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit Minted(to, tokenId, tokenURI_);
    }

    // ============ Admin ============

    function setMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // ============ Required Overrides ============

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title The Monarch Guild (TMG)
 * @notice 30 unique 1-of-1 NFTs. Buyers pick a specific tokenId (1-30) to mint.
 *         Metadata: ipfs://.../{tokenId}.json
 */
contract NFT is ERC721URIStorage, Ownable, Pausable, ERC2981, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 30;
    uint256 public mintPrice = 0.01 ether;
    uint256 private _mintedCount;

    string private _baseTokenURI = "ipfs://bafybeihlrs7qhfgdzqw66evvin6vd5du5pw7f2b42z5avufmkdvmhymeyu/";

    event Minted(address indexed to, uint256 indexed tokenId);
    event MintPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);

    constructor() ERC721("The Monarch Guild", "TMG") Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, 1000); // 10%
    }

    // ============ Minting ============

    /**
     * @notice Mint a specific NFT by ID (1-30). Reverts if already minted.
     */
    function mint(uint256 tokenId) external payable whenNotPaused nonReentrant {
        require(tokenId >= 1 && tokenId <= MAX_SUPPLY, "Invalid token ID");
        require(!_exists(tokenId), "Already minted");
        require(msg.value >= mintPrice, "Insufficient payment");

        _mintedCount++;
        _safeMint(msg.sender, tokenId);

        emit Minted(msg.sender, tokenId);
    }

    /**
     * @notice Owner can mint a specific ID for free (team / reserves).
     */
    function ownerMint(address to, uint256 tokenId) external onlyOwner {
        require(tokenId >= 1 && tokenId <= MAX_SUPPLY, "Invalid token ID");
        require(!_exists(tokenId), "Already minted");

        _mintedCount++;
        _safeMint(to, tokenId);

        emit Minted(to, tokenId);
    }

    // ============ URI ============

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /// @dev tokenId 1 → 1.json, tokenId 2 → 2.json, ...
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    // ============ Views ============

    function totalSupply() external view returns (uint256) {
        return _mintedCount;
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    // OpenZeppelin v5 uses _ownerOf; keep a small helper for older-style checks
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // ============ Admin ============

    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

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

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

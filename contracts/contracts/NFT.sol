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
 * @notice ERC-721 NFT with paid public minting + automatic baseURI + ERC-2981 royalties (10%)
 */
contract NFT is ERC721URIStorage, Ownable, Pausable, ERC2981, ReentrancyGuard {
    using Strings for uint256;

    uint256 private _nextTokenId;
    uint256 public mintPrice = 0.01 ether;
    uint256 public maxSupply = 30;

    // Base URI pointing to your Pinata metadata folder
    string private _baseTokenURI = "ipfs://bafybeihlrs7qhfgdzqw66evvin6vd5du5pw7f2b42z5avufmkdvmhymeyu/";

    event Minted(address indexed to, uint256 indexed tokenId);
    event MintPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);

    constructor() ERC721("The Monarch Guild", "TMG") Ownable(msg.sender) {
        // Default 10% royalty to the contract owner
        _setDefaultRoyalty(msg.sender, 1000); // 1000 = 10%
    }

    // ============ Minting ============

    /**
     * @notice Public mint - URI is set automatically from baseURI
     * Token ID 0 → 1.json, Token ID 1 → 2.json, etc.
     */
    function mint() external payable whenNotPaused nonReentrant {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_nextTokenId < maxSupply, "Max supply reached");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        emit Minted(msg.sender, tokenId);
    }

    /**
     * @notice Owner can mint for free (still uses automatic baseURI)
     */
    function ownerMint(address to) external onlyOwner {
        require(_nextTokenId < maxSupply, "Max supply reached");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);

        emit Minted(to, tokenId);
    }

    // ============ URI Logic ============

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the full token URI.
     * Maps tokenId 0 → 1.json, tokenId 1 → 2.json, etc.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory base = _baseURI();
        // tokenId 0 becomes "1.json", tokenId 1 becomes "2.json", etc.
        uint256 metadataId = tokenId + 1;

        return string(abi.encodePacked(base, metadataId.toString(), ".json"));
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

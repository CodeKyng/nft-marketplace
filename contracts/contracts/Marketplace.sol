// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC2981} from "@openzeppelin/contracts/interfaces/IERC2981.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Marketplace for The Monarch Guild
 * @notice Fixed-price marketplace with royalty support + pause
 */
contract Marketplace is Ownable, Pausable, ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    event Listed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event Sale(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    event ListingCancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller
    );

    constructor() Ownable(msg.sender) {}

    // ============ Core Functions ============

    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused nonReentrant {
        require(price > 0, "Price must be > 0");
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            IERC721(nftContract).getApproved(tokenId) == address(this) ||
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit Listed(nftContract, tokenId, msg.sender, price);
    }

    function buyItem(
        address nftContract,
        uint256 tokenId
    ) external payable whenNotPaused nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        // Mark as sold first (CEI pattern)
        listings[nftContract][tokenId].active = false;

        // Handle royalties (ERC-2981)
        uint256 royaltyAmount = 0;
        address royaltyReceiver;

        try IERC2981(nftContract).royaltyInfo(tokenId, listing.price) returns (
            address receiver,
            uint256 amount
        ) {
            royaltyReceiver = receiver;
            royaltyAmount = amount;
        } catch {}

        uint256 sellerAmount = listing.price - royaltyAmount;

        // Pay royalty
        if (royaltyAmount > 0 && royaltyReceiver != address(0)) {
            (bool royaltySuccess, ) = payable(royaltyReceiver).call{value: royaltyAmount}("");
            require(royaltySuccess, "Royalty transfer failed");
        }

        // Pay seller
        (bool sellerSuccess, ) = payable(listing.seller).call{value: sellerAmount}("");
        require(sellerSuccess, "Seller transfer failed");

        // Transfer NFT
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }

        emit Sale(nftContract, tokenId, listing.seller, msg.sender, listing.price);
    }

    function cancelListing(
        address nftContract,
        uint256 tokenId
    ) external nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender || msg.sender == owner(), "Not authorized");

        listings[nftContract][tokenId].active = false;

        emit ListingCancelled(nftContract, tokenId, listing.seller);
    }

    // ============ Admin ============

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency withdraw (in case any ETH gets stuck)
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // View helper
    function getListing(address nftContract, uint256 tokenId)
        external
        view
        returns (address seller, uint256 price, bool active)
    {
        Listing memory listing = listings[nftContract][tokenId];
        return (listing.seller, listing.price, listing.active);
    }
}

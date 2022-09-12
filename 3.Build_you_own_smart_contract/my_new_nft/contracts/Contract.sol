// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";
import "@thirdweb-dev/contracts/extension/DelayedReveal.sol";

contract NyNewNFT is ERC721Base, DelayedReveal {

     address public deployer;

      constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC721Base(
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
    {
         deployer = msg.sender;
    }

    function mintDelayedRevealNFT(
            address to,
            string memory beforeRevealURI,
            bytes memory encryptedPostRevealURI
        ) public {
            // We'll use the NFT's `tokenId` as an identifier for the NFT, in the delayed reveal process.
            uint256 tokenId = nextTokenIdToMint();

            // Store the encrypted true metadata for the NFT.
            // _setEncryptedBaseURI(tokenId, encryptedPostRevealURI);
            _setEncryptedData(tokenId, encryptedPostRevealURI);

            // Mint the NFT in its un-revealed state using `mintTo`, made available by `ERC721Base`.
            mintTo(to, beforeRevealURI);
    }

    mapping(uint256 => string) private postRevealURI;

    function reveal(uint256 tokenId, bytes calldata key)
        external
        override
        returns (string memory revealedURI)
    {
        // Get the true metadata of the NFT using the `getRevealURI` function made available by the
        // `DelayedReveal` contract extension.
        revealedURI = getRevealURI(tokenId, key);

        // We'll delete the encrypted metadata URI of the NFT which we're revealing.
        delete encryptedData[tokenId];

        // Now store the revealed, true metadata URI for the NFT.
        postRevealURI[tokenId] = revealedURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (bytes(postRevealURI[tokenId]).length > 0) {
            return postRevealURI[tokenId];
        }

        return super.tokenURI(tokenId);
    }
}
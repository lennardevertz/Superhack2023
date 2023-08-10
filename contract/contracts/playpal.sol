// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";


/**
 * @title PlayPal 
 * @author Lennard (lennardevertz)
 * @notice Tipping contract to support tips on twitch (and other platforms in the future)
 */
contract PlayPal {

    event DonationSent(
        address indexed recipientAddress,
        string message,
        address indexed sender,
        address indexed tokenAddress,
        uint256 amount
    );

    /** Probably delete **/
    constructor(){
    }


    function donate (
        address _streamer,
        string memory _message
    ) external payable {

        (bool sent, ) = payable(_streamer).call{value: msg.value}("");
        require(sent, "Failed to send");

        emit DonationSent(_streamer, _message, msg.sender, address(0), msg.value);
    }


    function donateToken (
        address _streamer,
        uint256 _amount,
        address _tokenAddr,
        string memory _message
    ) external payable {

        IERC20 token = IERC20(_tokenAddr);

        bool sent = token.transferFrom(msg.sender, _streamer, _amount);
        require(sent, "Failed to transfer token");

        emit DonationSent(_streamer, _message, msg.sender, _tokenAddr, _amount);
    }


    function donateERC721(
        address _streamer,
        uint256 _assetId,
        address _nftAddress,
        string memory _message
    ) external payable {

        IERC721 nft = IERC721(_nftAddress);
        nft.safeTransferFrom(msg.sender, _streamer, _assetId, "");

        emit DonationSent(_streamer, _message, msg.sender, _nftAddress, 1);
    }


    function donateERC1155 (
        address _streamer,
        uint256 _assetId,
        uint256 _amount,
        address _nftAddress,
        string memory _message
    ) external payable {

        IERC1155 nft = IERC1155(_nftAddress);
        nft.safeTransferFrom(msg.sender, _streamer, _assetId, _amount, "");

        emit DonationSent(_streamer, _message, msg.sender, _nftAddress, _amount);
    }

}
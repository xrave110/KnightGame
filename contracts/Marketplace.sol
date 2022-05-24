//SPDX license identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Marketplace is ERC1155Holder {
    IERC1155 private knightToken;

    mapping(uint256 => uint256) price;

    constructor(IERC1155 _token) public {
        require(address(_token) != address(0));
        knightToken = _token;
        price[0] = 10**14;
        price[1] = 1.5 * (10**14);
        price[2] = 2 * (10**14);
        price[3] = 3 * (10**14);
    }

    /*     fallback() external payable {
        buyToken(1);
    } */

    function buyToken(uint256 tokenId) public payable {
        uint256 weiAmount = msg.value;
        require(
            weiAmount >= price[tokenId] && price[tokenId] != 0,
            "Too low amount of eth or token does not exist"
        );
        knightToken.safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
    }

    /* Function used to confirm that the current contract is able to handle ERC1155 standard it is built in current ERC1155
    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external returns (bytes4) {
        return
            bytes4(
                keccak256(
                    "onERC1155Received(address,address,uint256,uint256,bytes)"
                )
            );
    }*/
}

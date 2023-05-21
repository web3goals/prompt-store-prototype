// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";

/**
 * A contract that stores prompts.
 */
contract Prompt is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    event URISet(uint256 indexed tokenId, string tokenURI);

    address private _promptAddress;
    Counters.Counter private _counter;
    mapping(address => uint256) private _owners;
    uint256 public _tableId;
    string private constant _TABLE_PREFIX = "prompt_table";

    constructor() ERC721("Prompt Store - Prompts", "PSP") {
        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key,"
                "mintingTimestamp integer,"
                "uri text",
                _TABLE_PREFIX
            )
        );
    }

    /**
     * Get token id by owner.
     */
    function getTokenId(address owner) external view returns (uint) {
        return _owners[owner];
    }

    /**
     * Get uri by owner.
     */
    function getURI(address owner) external view returns (string memory) {
        uint256 tokenId = _owners[owner];
        if (_exists(tokenId)) {
            return tokenURI(tokenId);
        } else {
            return "";
        }
    }

    /**
     * Mint token with specified uri.
     */
    function mint(string memory tokenURI) public {
        // Update counter
        _counter.increment();
        // Mint token
        uint256 tokenId = _counter.current();
        _mint(msg.sender, tokenId);
        _owners[msg.sender] = tokenId;
        // Set URI
        _setURI(tokenId, tokenURI);
        // Add token to table
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "id,mintingTimestamp,uri",
                string.concat(
                    Strings.toString(tokenId),
                    ",",
                    Strings.toString(block.timestamp),
                    ",",
                    SQLHelpers.quote(tokenURI)
                )
            )
        );
    }

    /**
     * Set uri.
     */
    function _setURI(uint256 tokenId, string memory tokenURI) private {
        _setTokenURI(tokenId, tokenURI);
        emit URISet(tokenId, tokenURI);
    }
}

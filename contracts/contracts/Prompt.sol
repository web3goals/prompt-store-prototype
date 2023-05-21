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

    Counters.Counter private _counter;
    uint256 public _tableId;
    string private constant _TABLE_PREFIX = "prompt_table";

    constructor() ERC721("Prompt Store - Prompts", "PSP") {
        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key,"
                "minter text,"
                "mintingTimestamp integer,"
                "uri text",
                _TABLE_PREFIX
            )
        );
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
        // Set URI
        _setTokenURI(tokenId, tokenURI);
        emit URISet(tokenId, tokenURI);
        // Add token to table
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "id,minter,mintingTimestamp,uri",
                string.concat(
                    Strings.toString(tokenId),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    Strings.toString(block.timestamp),
                    ",",
                    SQLHelpers.quote(tokenURI)
                )
            )
        );
    }
}

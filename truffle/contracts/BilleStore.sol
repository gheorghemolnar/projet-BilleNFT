// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

import "./BilleEvent.sol";

contract BilleStore is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _eventId;

    event EventCreated (
        uint id,
        uint date,
        string name,
        string description,
        string uri
    );

    ///@dev Mapping for Event contracts
    mapping(uint => BilleEvent) private _idToEvent;

    string name = "Bille NFT";
    string symbol = "BNF";

    ///@notice Permet la création d'un Evenement
    ///@dev Allows the creation of an Event
    function createEvent(uint _date, 
        ///dev TODO: v2 uint[3] memory _prices, 
        uint[3] memory _ticketSupplies, string memory _name, string memory _symbol, string memory _description, string memory _uri) onlyOwner public {

        uint _id = _eventId.current();
        _eventId.increment();

        BilleEvent tmp = new BilleEvent(_id, _date, _name, _symbol, _description, _uri, 
        ///@dev TODO: v2
        ///_prices, 
        _ticketSupplies);

        ///@dev change TEMPORARLY the ownership of the contract
        tmp.transferOwnership(owner());

        _idToEvent[_id] = tmp;

        emit EventCreated(_id, _date, _name, _description, _uri);
    }

    ///@notice Permet la récupération de l'addres d'un contrat Evenement
    ///@dev Allows o retrieve the address of an Event contract
    function getEventAddress (uint _id) public view returns(address) {
        return address(_idToEvent[_id]);
    }

    ///@notice Permet la récupération du nombre d'Evenements créés
    ///@dev Allows the creation of an Event
    function getEventCount () public view returns(uint) {
        return _eventId.current();
    }
}

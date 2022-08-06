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

    string name = "Bille NFT";
    string symbol = "BNF";

    ///@dev Mapping for Event contracts
    mapping(uint => BilleEvent) private _idToEvent;

    ///@dev Event emitted when a new BilleEvent is created
    event EventCreated (
        uint id,
        uint date,
        string name,
        string description,
        string uri,
        address eventAddress
    );

    ///@notice Permet la création d'un Evenement
    ///@dev Allows the creation of an Event
    function createEvent(uint _date, 
        ///dev TODO: v2 uint[3] memory _prices, 
        string calldata _name, string memory _symbol, string memory _description, string memory _uri, uint[] memory _ticketSupplies) onlyOwner public {
        
        require(_date != 0, "Date is required");
        require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Name is required");
        require(keccak256(abi.encode(_symbol)) != keccak256(abi.encode("")), "Symbol is required");
        require(keccak256(abi.encode(_description)) != keccak256(abi.encode("")), "Description is required");
        require(keccak256(abi.encode(_uri)) != keccak256(abi.encode("")), "Uri is required");
        require(_ticketSupplies[0] != 0, "Supply is required for 'Fosse' Tickets");
        require(_ticketSupplies[1] != 0, "Supply is required for 'Gradin' Tickets");
        require(_ticketSupplies[2] != 0, "Supply is required for 'VIP' Tickets");

        uint _id = _eventId.current();
        _eventId.increment();

        BilleEvent tmp = new BilleEvent(_id, _date, _name, _symbol, _description, _uri, 
        ///@dev TODO: v2
        ///_prices, 
        _ticketSupplies);

        ///@dev change TEMPORARLY the ownership of the contract
        tmp.transferOwnership(owner());

        _idToEvent[_id] = tmp;

        emit EventCreated(_id, _date, _name, _description, _uri, address(tmp));
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

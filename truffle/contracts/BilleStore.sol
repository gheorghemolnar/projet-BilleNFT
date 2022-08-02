// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract BilleStore is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _eventId;

    event EventDetails (
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
    function createEvent(uint _date, uint[3] memory _prices, uint[3] memory _ticketSupplies, string memory _name, string memory _symbol, string memory _description, string memory _uri) onlyOwner public {
        uint _id = _eventId.current();
        _eventId.increment();

        BilleEvent tmp = new BilleEvent(_id, _date, _name, _symbol, _description, _uri, _prices, _ticketSupplies);
    
        _idToEvent[_id] = tmp;

        emit EventDetails(_id, _date, _name, _description, _uri);
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

contract BilleEvent is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _ticketId;

    uint id;
    uint date;
    uint[3] prices;
    uint[3] ticketSupplies;
    uint[3] ticketSold;
    string name;
    string symbol;
    string description;

    /// @dev TypeTicket: DOE: fosse, STD: gradins, VIP: vip
    enum TicketType {
        DOE,
        STD,
        VIP
    }

    /// @dev TicketInfo
    struct TicketInfo {
        uint id;
        uint place;
        bool isSold;
        bool isUsed;
        TicketType category;
    }

    /// @notice Mapping Tickets emis; l'id du Ticket => et le Ticket
    /// @dev Mapping Id Ticket => Ticket Info
    mapping(uint => TicketInfo) public _tickesList;

    /// @notice Mapping Tickets Vendus => address de l'acheteur
    /// @dev Mapping Sold tickets: Id ticket => Address of the buyer
    mapping(uint => address) public _tickesSold;

    /// @dev Event emitted when a ticket is sold
    event TicketSold(uint indexed id, TicketType _type, address _buyer, uint _amount);

    constructor(uint _idEvent, uint _date, string memory _name, string memory _symbol, 
        string memory _description, string memory _uri, uint[3] memory _prices, uint[3] memory _supplies
    ) ERC1155(_uri) {
        id = _idEvent;
        date = _date;
        name = _name;
        symbol = _symbol;
        description = _description;
        prices = _prices;
        ticketSupplies = _supplies;

        ///@dev Tickets Minting

        ///@dev Ticket Categories
        for(uint i=0; i <=2; i++) {

            ///@dev Ticket Category
            for(uint n=0; n<_supplies[i]; n++){
                uint idTicket = _ticketId.current();
                _ticketId.increment();

                _mint(address(this), idTicket, 1, "");
                _tickesList[idTicket] = TicketInfo({id: idTicket, place: n + 1, isSold: false, isUsed: false, category: TicketType(i)});
            }
        }
    }

    function buyOneTicket(uint _id) public payable {
        require(_id >= 0 && _id <= _ticketId.current(), "Ticket unkown");
        uint _category = uint(_tickesList[_id].category);
        require(msg.value == prices[_category] * 1, "Transaction value not equal to price required");

        _safeTransferFrom(address(this), msg.sender, _id, 1, "");
        
        _tickesList[_id].isSold = true;
        _tickesSold[_id] = msg.sender;
        ticketSold[_category] += 1;

        emit TicketSold(_id, TicketType(_category), msg.sender, 1);
    }

    /* TODO:
    function buyMoreTickets(uint[] _ticketIds) public payable {
        require(ticketSupplies[_category] > 0 && (_amount <= (ticketSupplies[_category] - ticketSold[_category] )), "Supply for this ticket is not enough");
        require(msg.value == prices[_category] * _amount, "Transaction value not equal to price required");

        _safeTransferFrom(address(this), msg.sender, _id, _amount, "");
        ticketSold[_category] += _amount;

        emit TicketSold(_id, TicketType(_index), msg.sender, _amount);
    }
    */

    function getBalance() public view onlyOwner returns(uint) {
        return address(this).balance;
    }

    function withdraw() public payable onlyOwner {
        require(payable(owner()).send(address(this).balance));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, ERC1155Receiver)
        returns (bool) {
            return super.supportsInterface(interfaceId);
    }
}
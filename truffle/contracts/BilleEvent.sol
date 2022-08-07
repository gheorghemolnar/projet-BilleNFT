// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract BilleEvent is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;

    uint public idEvent;
    uint public date;

    string public name;
    string public symbol;
    string public description;

    ///@dev Ticket Categories
    uint constant NB_TICKET_CATEGORIES = 3;

    ///@dev TODO: v2
    ///    uint[] prices;
    uint mintRate = 0.02 ether;


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
    mapping(uint => TicketInfo) public _ticketsList;

    /// @notice Mapping Compteur Categorie Ticket => Nombre de tickets disponibles
    /// @dev Mapping Ticket Category => Number of Tickets available (supplies)
    mapping(uint => uint) public _ticketsSupplies;

    /// @notice Mapping Compteur Categorie Ticket => Nombre de tickets vendus
    /// @dev Mapping Ticket Category => Number of Tickets sold
    mapping(uint => Counters.Counter) public _ticketsSold;

    /// @notice Mapping Tickets Vendus => address de l'acheteur
    /// @dev Mapping Sold tickets: Id ticket => Address of the buyer
    mapping(uint => address) public _ticketsSoldTo;

    /// @dev Event emitted when a ticket is sold
    event TicketSold(uint idEvent, uint idTicket, uint category, address owner, uint quantity);

    constructor(uint _idEvent, uint _date, string memory _name, string memory _symbol, string memory _description, 
        string memory _uri, 
        ///@dev TODO: v2
        //uint[] memory _prices, 
        uint[] memory _supplies) ERC1155(_uri) {
            idEvent     = _idEvent;
            date        = _date;
            name        = _name;
            symbol      = _symbol;
            description = _description;
            
            ///@dev Initialisations
            for(uint i = 0; i < NB_TICKET_CATEGORIES; i++) {
                ///@dev Initialise supplies for each ticket category
                _ticketsSupplies[i] = _supplies[i];
                ///@dev TODO: v2
                ///prices = _prices;
            }
            
    }

    function buyTickets(uint _category, uint _quantity) public payable {
        require(_category >= uint(TicketType.DOE) && _category <= uint(TicketType.VIP), "Ticket category unkown");
        require(_ticketsSupplies[_category] > 0 && (_quantity <= (_ticketsSupplies[_category] - _ticketsSold[_category].current() )), "Supply for this ticket is not enough");
        require(msg.value == mintRate * _quantity, "Transaction value not equal to price required");

        ///@dev TODO: v2
        ///require(msg.value == prices[_category] * 1, "Transaction value not equal to price required");

        ///@dev Tickets Minting

        ///@dev Ticket by Category
        for(uint i = 0; i < _quantity; i++) {
            uint idTicket = _ticketsSold[_category].current();
            _ticketsSold[_category].increment();

            _mint(msg.sender, idTicket, 1, "");
            _ticketsList[idTicket] = TicketInfo({id: idTicket, place: idTicket + 1, isSold: true, isUsed: false, category: TicketType(_category)});
            _ticketsSoldTo[idTicket] = msg.sender;

            emit TicketSold(idEvent, idTicket, _category, msg.sender, 1);
        }
    }

    function getBalance() public view onlyOwner returns(uint) {
        return address(this).balance;
    }

    ///@notice used to get the BilleEvent stats
    ///@dev used to get the BilleEvent stats: TODO: find a better approach
    function getEventStats() public view onlyOwner returns(uint, uint, uint,uint, uint, uint, uint) {
        return (
            _ticketsSold[0].current(),_ticketsSold[1].current(), _ticketsSold[2].current(), 
            _ticketsSupplies[0], _ticketsSupplies[1], _ticketsSupplies[2], address(this).balance
        );
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

    ///@dev used to change the owner of this contract
    function transferOwnership (address newOwner) override public onlyOwner {
        require(owner() != newOwner, "Owner is the same !");
        _transferOwnership(newOwner);
    }
}
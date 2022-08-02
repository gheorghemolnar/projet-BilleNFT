// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract BilleEvent is ERC1155, ERC1155Holder, Ownable {
    using Counters for Counters.Counter;

    uint id;
    uint date;

    string name;
    string symbol;
    string description;

    ///@dev TODO: v2
    ///    uint[3] prices;
    uint mintRate = 0.02 ether;
    uint[3] ticketsSupplies;
    uint[3] ticketsSold;

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

    /// @notice Mapping Compteur Categorie Ticket => Nombre de tickets
    /// @dev Mapping Ticket Category => Ticket counter
    mapping(uint => Counters.Counter) public _tickesCounters;

    /// @notice Mapping Tickets Vendus => address de l'acheteur
    /// @dev Mapping Sold tickets: Id ticket => Address of the buyer
    mapping(uint => address) public _tickesSold;

    /// @dev Event emitted when a ticket is sold
    event TicketSold(uint indexed idEvent, uint indexed id, TicketType category, address buyer, uint quantity);

    constructor(uint _idEvent, uint _date, string memory _name, string memory _symbol, string memory _description, 
        string memory _uri, 
        ///@dev TODO: v2
        //uint[3] memory _prices, 
        uint[3] memory _supplies) ERC1155(_uri) {
        id = _idEvent;
        date = _date;
        name = _name;
        symbol = _symbol;
        description = _description;
        ///@dev TODO: v2
        ///prices = _prices;
        ticketsSupplies = _supplies;
    }

    function buyTickets(TicketType _type, uint _quantity) public payable {
        require(_type >= TicketType.DOE && _type <= TicketType.VIP, "Ticket category unkown");
        uint _category = uint(_type);
        require(ticketsSupplies[_category] > 0 && (_quantity <= (ticketsSupplies[_category] - ticketsSold[_category] )), "Supply for this ticket is not enough");
        require(msg.value == mintRate * _quantity, "Transaction value not equal to price required");

        ///@dev TODO: v2
        ///require(msg.value == prices[_category] * 1, "Transaction value not equal to price required");

        ///@dev Tickets Minting

        ///@dev Ticket by Category
        for(uint i = 0; i < _quantity; i++){
            uint idTicket = _tickesCounters[_category].current();
            _tickesCounters[_category].increment();

            _mint(address(this), idTicket, 1, "");
            _tickesList[idTicket] = TicketInfo({id: idTicket, place: idTicket + 1, isSold: true, isUsed: false, category: TicketType(_category)});
            _tickesSold[idTicket] = msg.sender;

            emit TicketSold(id, idTicket, TicketType(_category), msg.sender, 1);
        }
    }

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

    ///@dev used to change the owner of this contract
    function transferOwnership (address newOwner) override public onlyOwner {
        require(owner() != newOwner, "Owner is the same !");
        _transferOwnership(newOwner);
    }
}
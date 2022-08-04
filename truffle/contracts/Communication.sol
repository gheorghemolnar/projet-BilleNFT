// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Communication is Ownable {

    struct Organizer {
        uint idEvent;
        string nameSociety;
        string numIdSociety;//code siret
        string nameRepresentative;//nom du representant
        string phone;
        string email;
        bool isRegistered;
    }

    mapping (address => Organizer) organizers;
    
    event OrganizerRegistered(address _organizerAddress);

    modifier onlyOrganizers() {
        require(organizers[msg.sender].isRegistered, "You're not an organizer");
        _;
    }

    function getOrganizer(address _addr) external onlyOrganizers view returns (Organizer memory) {
        return organizers[_addr];
    }

    function addOrganizer(address _addr, string memory _nameSociety, string memory _numIdSociety, string memory _nameRepresentative, string memory _phone, string memory _email) public onlyOwner {
        require(organizers[_addr].isRegistered != true, 'Already registered');
        organizers[_addr].isRegistered = true;
        organizers[_addr].nameSociety = _nameSociety;
        organizers[_addr].numIdSociety = _numIdSociety;
        organizers[_addr].nameRepresentative = _nameRepresentative;
        organizers[_addr].phone = _phone;
        organizers[_addr].email = _email;
        emit OrganizerRegistered(_addr);
    }
}
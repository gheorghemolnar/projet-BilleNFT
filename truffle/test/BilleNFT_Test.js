const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Web3 = require('web3');

const BilleStore = artifacts.require("./BilleStore.sol");
const BilleEvent = artifacts.require("./BilleEvent.sol");

const TICKET_UNIT_PRICE = 0.02;

const TicketCategory = {
    CODE_DOE: 0,
    CODE_STD: 1,
    CODE_VIP: 2,
    UNKNOWN:  100,
};

contract("BilleStore", async (accounts) => {
    const owner = accounts[0];
    const customer01 = accounts[1];
    const customer02 = accounts[2];
    const customer03 = accounts[3];
    const customer04 = accounts[4];


    context("Initialising Store / Event", () => {
        let billeStoreInstance;
        let billeEventInstanceEmpty;
        
        describe("When creating Store Event", async () => {
            beforeEach(async () => {
                billeStoreInstance = await BilleStore.new({ from: owner });
            });

            it("should not be able to create an event with invalid Date", async () => {
                await expectRevert(billeStoreInstance.createEvent(0, "Concert Olympia Paris", "BNF", "Description", "URI", [50, 30, 10]), "Date is required");
            });

            it("should not be able to create an event with empty Name", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "", "BNF", "Description", "URI", [50, 30, 10]), "Name is required");
            });

            it("should not be able to create an event with empty Symbol", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "", "Description", "URI", [50, 30, 10]), "Symbol is required");
            });

            it("should not be able to create an event with empty Description", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "SYM", "", "URI", [50, 30, 10]), "Description is required");
            });

            it("should not be able to create an event with empty Uri", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "SYM", "Description", "", [50, 30, 10]), "Uri is required");
            });

            it("should not be able to create an event with 0 Supplies for 'Fosse'", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "SYM", "Description", "URI", [0, 30, 10]), "Supply is required for 'Fosse' Tickets");
            });

            it("should not be able to create an event with 0 Supplies for 'Gradin'", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "SYM", "Description", "URI", [10, 0, 10]), "Supply is required for 'Gradin' Tickets");
            });

            it("should not be able to create an event with 0 Supplies for 'VIP'", async () => {
                await expectRevert(billeStoreInstance.createEvent(432420, "Concert Olympia Paris", "SYM", "Description", "URI", [10, 30, 0]), "Supply is required for 'VIP' Tickets");
            });

            it("should increment the counter  upon a creation of an event", async () => {
                const nbEventBefore = await billeStoreInstance.getEventCount();
                await billeStoreInstance.createEvent(12547332, "Pink Floyd - Greatest tour", "BNF", "Concert Olympia Paris", "URI", [50, 30, 10]);
                const nbEventAfter = await billeStoreInstance.getEventCount();

                expect(nbEventBefore).to.be.bignumber.equal(new BN(0));
                expect(nbEventAfter).to.be.bignumber.equal(new BN(1));

            });

            it("should emit EventCreated containing the address, upon a creation of an event", async () => {
                const storeCreateEvent = await billeStoreInstance.createEvent(12547332, "Concert hiphop", "BNF", "Bercy", "URI", [50, 30, 10]);
                const newEventAddress = await billeStoreInstance.getEventAddress(0);

                expect(newEventAddress).to.not.equal(constants.ZERO_ADDRESS);
                expectEvent(storeCreateEvent, "EventCreated", { id: new BN(0), date: new BN(12547332), name: "Concert hip-hop", description: "Bercy", uri: "URI", eventAddress: newEventAddress });

            });
        });

        describe("When buying tickets", async () => {
            beforeEach(async () => {
                billeStoreInstance = await BilleStore.new({ from: owner });
            });

            it(`should revert when buying a ticket with unknown category`, async () => {
                await billeStoreInstance.createEvent(12547332, "Concert classique", "BNF", "Theatre Antoine", "URI", [50, 30, 10]);

                const newEventAddress = await billeStoreInstance.getEventAddress(0);
                billeEventInstanceEmpty = await BilleEvent.new(0, 0, "", "", "", "", [0, 0, 0]);

                billeEventInstanceEmpty.address = newEventAddress;
                
                await expectRevert(billeEventInstanceEmpty.buyTickets(TicketCategory.UNKNOWN, 1, { value: 20000000000000000 }), "Ticket category unkown");
            });

            it("create an event and supply for this ticket is not enough", async () => {
                await billeStoreInstance.createEvent(12547332, "Concert classique", "BNF", "Theatre Antoine", "URI", [50, 30, 10]);
                const newEventAddress = await billeStoreInstance.getEventAddress(0);
                billeEventInstanceEmpty = await BilleEvent.new(0, 0, "", "", "", "", [0, 0, 0], { from: owner });

                billeEventInstanceEmpty.address = newEventAddress;
                await expectRevert(billeEventInstanceEmpty.buyTickets(TicketCategory.CODE_DOE, 1, { value: 20000000000000000, from: customer01 }), "Supply for this ticket is not enough");
            });
        });
    });

    context.only("With a valid Store / Event", () => {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

        let billeStoreInstance;
        let billeEventInstance;

        
        describe("Customer should", async () => {
            before(async() => {              
                billeStoreInstance = await BilleStore.new({ from: owner });

                await billeStoreInstance.createEvent(12547332, "Pink Floyd - Greatest tour", "BNF", "Concert Olympia Paris", "URI", [50, 30, 10], { from: owner });
                await billeStoreInstance.createEvent(12547332, "Pink Martini - Greatest tour", "BNF", "Concert Olympia Paris", "URI", [50, 30, 10], { from: owner });
                const newEventAddress = await billeStoreInstance.getEventAddress(1);

                billeEventInstance = new web3.eth.Contract(BilleEvent.abi, newEventAddress);

            });

            it("should create an Ticket and emit TicketSold", async() => {
                const quantity = 1;
                const ticketsBought = await billeEventInstance.methods.buyTickets(TicketCategory.CODE_STD, quantity).send({ 
                    value: web3.utils.toWei(`${TICKET_UNIT_PRICE}`, 'ether') * quantity, 
                    from: owner,
                    gas: 1000000
                });

                expectEvent(ticketsBought, "TicketSold", {idEvent,idTicket,category,owner,quantity});
            });
        });
    });
});

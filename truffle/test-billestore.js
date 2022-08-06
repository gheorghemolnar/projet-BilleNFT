const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
  } = require('@openzeppelin/test-helpers');
  const { expect } = require('chai');
  
  const BilleStore = artifacts.require("./BilleStore.sol");
  const BilleEvent = artifacts.require("./BilleEvent.sol");

  contract("BilleStore", async(accounts) => {
    context.only("Newly deployed Contract", () => {
        let billeStoreInstance;

        const owner = accounts[0];
        const customer01 = accounts[1];
        const customer02 = accounts[2];
        const customer03 = accounts[3];
        const customer04 = accounts[4];
       
        const CODE_DOE = 0;
        const CODE_STD = 1;
        const CODE_VIP = 2;

        describe("Administrator should", async() => {
            beforeEach(async()=> {
                billeStoreInstance = await BilleStore.new({from: owner});
            });

            it("have a good count for creation of an event", async() => {
                await billeStoreInstance.createEvent(12547332,"Toto","BNF","Titi", "Tata", [50, 30, 10]);
                const nbEvent = await billeStoreInstance.getEventCount();
                expect(nbEvent).to.be.bignumber.equal(new BN(1));
            });
            it("be allowed to register a new event / concert", async() => {
                const retCreateEvent = await billeStoreInstance.createEvent(12547332,"Toto","BNF","Titi", "Tata", [50, 30, 10]);
                const addEvent = await billeStoreInstance.getEventAddress(0);
                expectEvent(retCreateEvent, "EventCreated", {id:new BN(0),date:new BN(12547332),name:"Toto",description:"Titi",uri:"Tata",eventAddress: addEvent});
            });
            it("create an event and Ticket category unkown", async() => {
                const retCreateEvent = await billeStoreInstance.createEvent(12547332,"Toto","BNF","Titi", "Tata", [50, 30, 10]);
                const addEvent = await billeStoreInstance.getEventAddress(0);
                const billeEventInstanceEmpty = await BilleEvent.new(0, 0, "", "", "", "", [0,0,0], {from: owner});
                billeEventInstanceEmpty.options.address = addEvent;
                await expectRevert(billeEventInstanceEmpty.buyTickets(5, 1, {from: customer01}, "Ticket category unkown"));
            });
            it("create an event and supply for this ticket is not enough", async() => {
                const retCreateEvent = await billeStoreInstance.createEvent(12547332,"Toto","BNF","Titi", "Tata", [50, 30, 10]);
                const addEvent = await billeStoreInstance.getEventAddress(0);
                const billeEventInstanceEmpty = await BilleEvent.new(0, 0, "", "", "", "", [0,0,0], {from: owner});
                billeEventInstanceEmpty.options.address = addEvent;
                await expectRevert(billeEventInstanceEmpty.buyTickets(CODE_DOE, 1, {from: customer01}, "Supply for this ticket is not enough"));
            });

        });

        

        

    });
});

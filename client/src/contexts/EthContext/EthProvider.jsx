import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import { getContractStoreByAddress, getContractEventByAddress, getContractCommByAddress } from '../../utils';

function EthProvider({ children }) {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contractBilleStore, contractBilleEvent, contractCommunication;
        let initEvents = [];
        let initTicketsSold = [];

        let initOwner = false;
        try {
          address = artifact.networks[networkID].address;
          contractBilleStore = getContractStoreByAddress(web3, abi, address);
          contractBilleEvent = getContractEventByAddress(web3, address);
          contractCommunication = getContractCommByAddress(web3, address);
          
          // On recup tous les events passés du contrat
          if(contractBilleStore && contractBilleEvent) {
            const options = { fromBlock: 0, toBlock: 'latest' };

            [initOwner, initEvents ] = await Promise.all([
              contractBilleStore.methods.owner().call(),
              contractBilleStore.getPastEvents('EventCreated', options)
            ]);


          }
        } catch (err) {
          console.error(err);
        }
        
        dispatch({
          type: actions.INIT,
          data: { artifact, web3, accounts, networkID, 
            owner: initOwner, contractBilleStore, 
            contractBilleEvent, contractCommunication, 
            eventsCreated: [...initEvents], ticketsSold: [...initTicketsSold],
            handleDispatch: dispatch
          }
        });
      }
    }, []);
    

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/BilleStore.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    const eventsSubscriptions = {};
    const options1 = {fromBlock: 'latest'};

    if(state.contractBilleStore) {
      const subEvCreate = state.contractBilleStore.events.EventCreated(options1)
      .on('connected', event => {
        console.log("Les détails de l'évènement sont connu", event);
      })
      .on('data', event => {
        dispatch({
          type: actions.EVENT_CREATED,
          data: {
            evCreate: event
          }
        })
      });
      // add subscription for Events
      eventsSubscriptions['eventCreated'] = subEvCreate;
    }

    if(state.contractBilleEvent) {
      const subTicketSold = state.contractBilleEvent.events.TicketSold(options1)
      .on('connected', event => {
        console.log("Les détails de l'évènement sont connu", event);
      })
      .on('data', event => {
        dispatch({
          type: actions.TICKET_SOLD,
          data: {
            evTicketSold: event
          }
        })
      });
      // add subscription for Tickets
      eventsSubscriptions['ticketSold'] = subTicketSold;
    }

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
      Object.entries(eventsSubscriptions).forEach(([key, subsription]) => {
        console.log("Unsubscribe for ", key);
        subsription.unsubscribe();
      })
    };
  }, [init, state.artifact, state.contractBilleStore, state.contractBilleEvent]);

  

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;

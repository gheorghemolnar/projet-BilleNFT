import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import CommunicationABI from "../../contracts/Communication.json";
import BilleEventABI from "../../contracts/BilleEvent.json";

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
        let initEvents = [], ticketSolds = [];
        try {
          address = artifact.networks[networkID].address;
          contractBilleStore = new web3.eth.Contract(abi, address);
 
          // On recup tous les events passés du contrat
          if(contractBilleStore) {
            const options = { fromBlock: 0, toBlock: 'latest' };

            [initEvents] = await Promise.all([
              contractBilleStore.getPastEvents('EventCreated', options)
            ]);

            contractBilleEvent = new web3.eth.Contract(BilleEventABI.abi, address);
            [ticketSolds] = await Promise.all([
              contractBilleEvent.getPastEvents('TicketSold', options)
            ]);

            contractCommunication = new web3.eth.Contract(CommunicationABI.abi, address);
            
          }
        } catch (err) {
          console.error(err);
        }
        
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contractBilleStore, contractBilleEvent, contractCommunication, eventsCreated: [...initEvents], ticketsSold: [...ticketSolds] }
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
          type: actions.eventAdded,
          data: {
            evCreate: event
          }
        })
      });
      // add subscription for Voters
      eventsSubscriptions['eventsCreate'] = subEvCreate;

      const subTicketSold = state.contractBilleEvent.events.TicketSold(options1)
      .on('connected', event => {
        console.log("Les détails de l'évènement sont connu", event);
      })
      .on('data', event => {
        dispatch({
          type: actions.eventAdded,
          data: {
            evTicketSold: event
          }
        })
      });
      // add subscription for Voters
      eventsSubscriptions['TicketSold'] = subTicketSold;

    }

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
      Object.entries(eventsSubscriptions).forEach(([key, subsription]) => {
        console.log("Unsubscribe for ", key);
        subsription.unsubscribe();
      })
    };
  }, [init, state.artifact, state.contractBilleStore, state.contractBilleEvent], state.contractCommunication);

  

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

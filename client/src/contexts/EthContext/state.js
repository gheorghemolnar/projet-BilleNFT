const actions = {
  init: "INIT",  
  eventAdded: "EVENTCREATED_ADDED",
  ticketSoldAdded: "TICKETSOLD_ADDED"
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  billeEvent: null,
  eventsCreated: [],
  ticketsSold: []
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.eventAdded:
        return {
           ...state, 
           eventsCreated: [...state.eventsCreated, data.evCreate]
          };
    case actions.ticketSoldAdded:
        return {
            ...state,
            ticketsSold: [...state.ticketsSold, data.evTicketSold]
          };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};

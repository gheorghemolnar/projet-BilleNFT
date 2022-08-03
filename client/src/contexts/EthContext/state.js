const actions = {
  init: "INIT",  
  eventAdded: "EVENTDETAILS_ADDED",
  // ticketSoldAdded: "TICKETSOLD_ADDED"
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  billeEvent: null,
  eventsCreate: [],
  ticketSold: []
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.eventAdded:
        return {
           ...state, 
           eventsCreate: [...state.eventsCreate, data.evCreate]
          };
    case actions.ticketSoldAdded:
        return {
            ...state,
            ticketSold: [...state.ticketSold, data.evTicketSold]
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

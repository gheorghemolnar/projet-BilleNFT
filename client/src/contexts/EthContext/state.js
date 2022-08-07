const actions = {
  INIT: "INIT",  
  EVENT_CREATED: "EVENT_CREATED",
  TICKET_SOLD: "TICKET_SOLD"
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: [],
  networkID: '',
  contract: null,
  contractBilleEvent: null,
  eventsCreated: [],
  ticketsSold: [],
  owner: false,
  handleDispatch: () => {}
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.INIT:
      return { ...state, ...data };
    case actions.EVENT_CREATED:
        return {
           ...state, 
           eventsCreated: [...state.eventsCreated, data.evCreate]
          };
    case actions.TICKET_SOLD:
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

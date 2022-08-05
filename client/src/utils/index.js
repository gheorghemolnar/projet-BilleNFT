import BilleEventABI from "../contracts/BilleEvent.json";
import CommunicationABI from "../contracts/Communication.json";

export const getContractStoreByAddress = (web3, abi, address) => {
    const contract = new web3.eth.Contract(abi, address, {gasPrice: '20000000000'});
    return contract;
}

export const getContractEventByAddress = (web3, address) => {
    const contract = new web3.eth.Contract(BilleEventABI.abi, address, {gasPrice: '20000000000'});
    return contract;
}

export const getContractCommByAddress = (web3, address) => {
    const contract = new web3.eth.Contract(CommunicationABI.abi, address);
    return contract;
}

export const getDateFromTimestamp = (date) => {
    const dateEvent = Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    return dateEvent;
}

// Is App Owner
export const isOwner = (currentUser, owner) => currentUser && currentUser.length > 0 ? currentUser[0] === owner : false;

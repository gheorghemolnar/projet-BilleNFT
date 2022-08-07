import BilleEventABI from "../contracts/BilleEvent.json";
import CommunicationABI from "../contracts/Communication.json";


export const TICKET_PRICE = 0.02;

export const TICKET_CATEGORIES = [0, 1, 2];
export const TICKET_CATEGORIES_LABELS = ['Fosse', 'Gradins', 'VIP'];

export const getStatsAsObject = (arrValues) => {
    const result = {sales: [], supplies: []};

    for (let i = 0; i<TICKET_CATEGORIES.length; i++) {
        result['sales'].push(arrValues[i]);
        result['supplies'].push(arrValues[i+3]);
    }

    return result;
}

export const getContractStoreByAddress = (web3, abi, address) => {
    const contract = new web3.eth.Contract(abi, address, {gas: '21000'});
    return contract;
}

export const getContractEventByAddress = (web3, address) => {
    const contract = new web3.eth.Contract(BilleEventABI.abi, address, {gas: '21000'});
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

// Conversions
export const formatAmount = (amount, web3, unit = 'ether') => web3 ? `${web3.utils.fromWei(amount, unit)} Eth`: '0 Eth';

// Is App Owner
export const isOwner = (currentUser, owner) => currentUser && currentUser.length > 0 ? currentUser[0] === owner : false;

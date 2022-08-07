import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import {
  getContractEventByAddress, 
  getDateFromTimestamp,
  isOwner,
  formatAmount,
  TICKET_CATEGORIES,
  TICKET_CATEGORIES_LABELS,
  TICKET_PRICE } from "../../utils";
import useEth from "../../contexts/EthContext/useEth";

export default function ViewEvent() {
  const { state: { web3, accounts, owner, eventsCreated = [] } } = useEth();
  const [contractBilleEvent, setContractBilleEvent] = useState(null);
  const [stats, setStats] = useState( { balance: formatAmount('0', web3), ticketsStats: ['0', '0', '0', '0', '0', '0', '0'] });

  const { id } = useParams();
  const isAdmin = isOwner(accounts, owner);
  const showEventStats = contractBilleEvent && isAdmin;

  useEffect(() => {
    if (web3 && (!contractBilleEvent)) {
      const contractEvent = getContractEventByAddress(web3, id);
      setContractBilleEvent(contractEvent);
    }
  }, [web3, contractBilleEvent, id]);

  useEffect(() => {
    const fetchData = async () => {
      const ticketsStatsObject = await contractBilleEvent.methods.getEventStats().call({ from: accounts[0] });
      const ticketsStats = Object.values(ticketsStatsObject);
      const balance = `${ticketsStats.slice(-1)[0]}`;

      setStats(stats => ({ ...stats, balance: formatAmount(balance, web3), ticketsStats }));
    }

    if (isAdmin && contractBilleEvent) {
      fetchData();
    }
  }, [web3, accounts, contractBilleEvent, isAdmin]);

  let eventInfos = { date: '', description: '', eventAddress: '', name: '', uri: '' }, eventStats, eventStatsTickets;
  const [currentEvent] = eventsCreated.filter(({ returnValues: { eventAddress } }) => eventAddress === id);

  if (currentEvent) {
    const { returnValues: { date, description, eventAddress, name, uri } } = currentEvent;
    eventInfos = { date: getDateFromTimestamp(date), description, eventAddress, name, uri };
    
    // Stats sales / supply by Ticket category
    eventStatsTickets = TICKET_CATEGORIES.map(i => {
        return (<div key={i} className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-3 col-form-label">Tickets {`${TICKET_CATEGORIES_LABELS[i]}`}</label>
          <div className="col-sm-9">
            <input type="text" className="form-control w-50 text-end" id="colFormLabel" placeholder="col-form-label" value={`${stats.ticketsStats[i]} / ${stats.ticketsStats[i+3]}`} disabled />
          </div>
        </div>
      );
    })

    // Stats balance
    eventStats = <section className="event-view container py-5 bg-light">
      <h4 className="fw-light">Admin - Event stats</h4>
      <div className="row mb-3">
          <label htmlFor="colFormLabelSm" className="col-sm-3 col-form-label col-form-label">Balance</label>
          <div className="col-sm-9">
            <input type="text" className="form-control w-50  text-end" id="colFormLabelSm" placeholder="col-form-label" value={stats.balance} disabled />
          </div>
      </div>
      {eventStatsTickets}
    </section>;
  }

  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Détails événement</h1>
            <p className="lead text-muted">
              <Link type="button" className="btn btn-primary" to={`/events/${id}/buyticket`}>J'y vais</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="event-view container p-3 bg-light">
        <div className="row mb-3">
          <label htmlFor="ticketPrice" className="col-sm-3 col-form-label col-form-label">Current price</label>
          <div className="col-sm-9">
            <input type="text" className="form-control w-25" id="ticketPrice" placeholder="col-form-label" value={`${TICKET_PRICE} Eth`} disabled />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="colFormLabelSm" className="col-sm-3 col-form-label col-form-label">Date</label>
          <div className="col-sm-9">
            <input type="text" className="form-control w-25" id="colFormLabelSm" placeholder="col-form-label" value={eventInfos.date} disabled />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-3 col-form-label">Name</label>
          <div className="col-sm-9">
            <input type="text" className="form-control event-large-field" id="colFormLabel" placeholder="col-form-label" value={eventInfos.name} disabled />
          </div>
        </div>
        <div className="row">
          <label htmlFor="colFormLabelLg" className="col-sm-3 col-form-label col-form-label">Description</label>
          <div className="col-sm-9">
            <input type="text" className="form-control event-large-field" id="colFormLabelLg" placeholder="col-form-label" value={eventInfos.description} disabled />
          </div>
        </div>
      </div>
      <br/>
      {
        showEventStats && eventStats
      }
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <Link to="/" className="btn btn-sm btn-outline-secondary">Tous les événements</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
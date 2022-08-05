import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";

import { getContractEventByAddress, isOwner } from "../../utils";
import useEth from "../../contexts/EthContext/useEth";
import { getDateFromTimestamp, TICKET_CATEGORIES, TICKET_CATEGORIES_LABELS } from "../../utils";

export default function ViewEvent() {
  const { state: { web3, accounts, owner, ticketsSold = [], eventsCreated = [] } } = useEth();
  const [contractBilleEvent, setContractBilleEvent] = useState(null);
  const [stats, setStats] = useState( { balance: '', ticketsStats: [] });

  const { id } = useParams();
  const showEventStats = contractBilleEvent && isOwner(accounts, owner);

  useEffect(() => {
    if (web3 && (!contractBilleEvent)) {
      const contractEvent = getContractEventByAddress(web3, id);
      setContractBilleEvent(contractEvent);
    }
  }, [web3]);

  useEffect(() => {
    const fetchData = async () => {
      const [ balance, ticketsStats ] = await Promise.all([
        contractBilleEvent.methods.getBalance().call({ from: accounts[0]}),
        contractBilleEvent.methods.getEventStats().call({ from: accounts[0] })
      ]);
     
      setStats ({ ...stats, balance: `${web3.utils.fromWei(balance, 'ether')} Eth`, ticketsStats });
    }

    if (contractBilleEvent) {
      fetchData();
    }
  }, [contractBilleEvent]);

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
            <input type="email" className="form-control  text-end" id="colFormLabel" placeholder="col-form-label" value={`${stats.ticketsStats[i]} / ${stats.ticketsStats[i+3]}`} disabled />
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
            <input type="email" className="form-control  text-end" id="colFormLabelSm" placeholder="col-form-label" value={stats.balance} disabled />
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
              <Link type="button" className="btn btn-primary" to={`/buyticket/${id}`}>J'y vais</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="event-view container p-3 bg-light">
        <div className="row mb-3">
          <label htmlFor="colFormLabelSm" className="col-sm-3 col-form-label col-form-label">Date</label>
          <div className="col-sm-9">
            <input type="email" className="form-control" id="colFormLabelSm" placeholder="col-form-label" value={eventInfos.date} disabled />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-3 col-form-label">Name</label>
          <div className="col-sm-9">
            <input type="email" className="form-control" id="colFormLabel" placeholder="col-form-label" value={eventInfos.name} disabled />
          </div>
        </div>
        <div className="row">
          <label htmlFor="colFormLabelLg" className="col-sm-3 col-form-label col-form-label">Description</label>
          <div className="col-sm-9">
            <input type="email" className="form-control" id="colFormLabelLg" placeholder="col-form-label" value={eventInfos.description} disabled />
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
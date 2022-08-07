import React from 'react';
import { Link } from "react-router-dom";

import NoticeNoArtifact from "../NoticeNoArtifact";
import NoticeWrongNetwork from "../NoticeWrongNetwork";
import useEth from "../../contexts/EthContext/useEth";
import { getDateFromTimestamp, TICKET_CATEGORIES_LABELS } from "../../utils";

export default function ListingTickets() {
  const { state: { artifact, contractBilleEvent, owner, eventsCreated, ticketsSold  } } = useEth();
  const myTickets = ticketsSold.filter (({returnValues} ) => returnValues.owner === owner);
  const myEventIds = myTickets.map(({returnValues}) => returnValues.idEvent);
  const myEventsInfos = eventsCreated.reduce((acc, {returnValues}) => {
    if(myEventIds.includes(returnValues.id)) {
      acc[returnValues.id] = {
        ...returnValues
      }
    }
    return acc;
  }, {});

  const myTicketsHeader = <section key="header" className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Mes tickets</h1>
        </div>
      </div>
    </section>;
  
  const myTicketsList =
    myTickets.map(({ returnValues: { category, idEvent,idTicket,quantity } }) => {
      const { eventAddress, name, description, date, uri } = myEventsInfos[idEvent];
      const dateEve = getDateFromTimestamp(date);
      const imageSrc = uri !== '' ? `${uri.split('//')[1]}` : '';

      console.log(`🚀  imageSrc`, imageSrc);

      return <div className="col-lg-6 p-3" key={idTicket}>
        <div className="card shadow-sm w-50">
          {
            imageSrc ? <img src={`https://gateway.pinata.cloud/ipfs/${uri.split('//')[1]}`} alt="eventImage"/> : <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
          }

          <div className="card-body">

            <Link to={`/events/${eventAddress}`} >
              <p className="card-text"> <strong>{name}</strong></p>
              <p className="card-text"> {description}</p>
              <p className="card-text"> <strong>Date:</strong> {dateEve}</p>
              <p className="card-text"> <strong>Nombre de tickets:</strong> {quantity}</p>
              <p className="card-text"> <strong>Catégorie</strong>: {TICKET_CATEGORIES_LABELS[category]}</p>
            </Link>
          </div>
        </div>
      </div>
    });
  const eventContent = [myTicketsHeader, myTicketsList ];

  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row">
          {
            !artifact ? <NoticeNoArtifact /> :
              !contractBilleEvent ? <NoticeWrongNetwork /> :
                eventContent
          }
        </div>
      </section>




    </main>
  );
}
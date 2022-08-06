import React from 'react';
import { Link } from "react-router-dom";

import NoticeNoArtifact from "../NoticeNoArtifact";
import NoticeWrongNetwork from "../NoticeWrongNetwork";
import useEth from "../../contexts/EthContext/useEth";
import { getDateFromTimestamp, isOwner } from "../../utils";

export default function Listing() {
  const { state: { artifact, contractBilleStore, eventsCreated, accounts, owner } } = useEth();

  const isAdmin = isOwner(accounts, owner);
  const eventHeader = <section key="header" className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Liste des événements à venir</h1>
          <p className="lead text-muted">Vous souhaitez assister au concert de votre artiste préféré avec vos amis, offrir un billet de concert à l’un de vos proches, ou trouver la sortie idéale en amoureux.Avec BilleNFT vous n’aurez aucun mal à trouver en quelques clics un billet pour le concert de votre choix.</p>
          <p>
            {isAdmin && (<Link to="/addevent" className="btn btn-primary">Ajouter un événement</Link>)}
          </p>
        </div>
      </div>
    </section>;
  
  const eventList =
    eventsCreated.map(({ returnValues }) => {
      const { eventAddress, name, description, date } = returnValues;
      const dateEve = getDateFromTimestamp(date);

      return <div className="col-lg-6 p-3" key={returnValues.id}>
        <div className="card shadow-sm">
          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

          <div className="card-body">

            <Link to={`/events/${eventAddress}`} >

              <p className="card-text">  {name} </p>
              <p className="card-text"> {description}</p>
              <div className="d-flex justify-content-between align-items-center">

                <small className="text-muted">{dateEve}</small>
              </div>
            </Link>
          </div>
        </div>
      </div>
    });
  const eventContent = [eventHeader, eventList ];

  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row">
          {
            !artifact ? <NoticeNoArtifact /> :
              !contractBilleStore ? <NoticeWrongNetwork /> :
                eventContent
          }
        </div>
      </section>




    </main>
  );
}
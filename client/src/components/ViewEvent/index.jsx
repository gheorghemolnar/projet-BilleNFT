import React from 'react';
import { Link, useParams } from "react-router-dom";

// import useEth from "../../contexts/EthContext/useEth";

export default function ViewEvent() {
  /* const { state: { artifact, contract } } = useEth(); */
  let { id } = useParams();

  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Détails événement</h1>
            <p className="lead text-muted">
              <Link type="button" className="btn btn-primary" to={`/buyticket/${id}`}>Achetez vos tickets</Link>
            </p>
          </div>
        </div>
      </section>

      <div className="event-view p-3 bg-light">
        <div className="row mb-3">
          <label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label">Date</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="colFormLabelSm" placeholder="col-form-label"  disabled />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="colFormLabel" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="colFormLabel" placeholder="col-form-label" disabled />
          </div>
        </div>
        <div className="row">
          <label htmlFor="colFormLabelLg" className="col-sm-2 col-form-label col-form-label">Description</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" id="colFormLabelLg" placeholder="col-form-label" disabled />
          </div>
        </div>
      </div>

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
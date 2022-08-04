import React from 'react';
import { Link } from "react-router-dom";

// import useEth from "../../contexts/EthContext/useEth";

export default function ViewEvent() {
  /* const { state: { artifact, contract } } = useEth(); */
  return (
    <main>
      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <h1 class="fw-light">Détails événement</h1>
            {/* <p class="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p> */}
          </div>
        </div>
      </section>

      <div class="event-view p-3 bg-light">
        <div class="row mb-3">
          <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label">Date</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" id="colFormLabelSm" placeholder="col-form-label"  disabled />
          </div>
        </div>
        <div class="row mb-3">
          <label for="colFormLabel" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" id="colFormLabel" placeholder="col-form-label" disabled />
          </div>
        </div>
        <div class="row">
          <label for="colFormLabelLg" class="col-sm-2 col-form-label col-form-label">Description</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" id="colFormLabelLg" placeholder="col-form-label" disabled />
          </div>
        </div>
      </div>

      <section class="py-5 text-center container">
        <div class="row py-lg-5">
          <div class="col-lg-6 col-md-8 mx-auto">
            <Link to="/" class="btn btn-sm btn-outline-secondary">Tous les événements</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export function NavToHome() {
  return <section className="py-5 text-center container">
    <div className="row py-lg-5">
      <div className="col-lg-6 col-md-8 mx-auto">
        <Link to="/events" className="btn btn-sm btn-outline-secondary">Tous les événements</Link>
      </div>
    </div>
  </section>;
}
  
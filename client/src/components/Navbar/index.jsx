import React from 'react';

import useEth from "../../contexts/EthContext/useEth";

export default function Navbar() {
  const { state: { accounts } } = useEth();

  return (
    <header>
      <div className="collapse bg-dark" id="navbarHeader">
        <div className="container">
          <div className="row">
            <div className="col-sm-8 col-md-7 py-4">          
            </div>
            <div className="col-sm-4 offset-md-1 py-4">
              <h4 className="text-white">Contact</h4>
              <ul className="list-unstyled">
                <li><a href="https://web3.corsica" className="text-white">Suivez nous sur Twitter</a></li>
                <li><a href="https://web3.corsica" className="text-white">Mais aussi sur Facebook</a></li>
                <li><a href="https://web3.corsica" className="text-white">Contactez nous</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <a href="/" className="navbar-brand d-flex align-items-center">
            <img src="https://web3.corsica/wp-content/uploads/2022/07/logo.png" alt="logo" width="211" height="57" fill="none"></img>
          </a>
          <div className="center text-white">Compte : { accounts[0] }</div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
  
import React from 'react';

function NoticeWrongNetwork() {
  return (
    <div className="container text-center">
      <div className="row  justify-content-center">
        <div className="col-5  align-self-center">
        <button type="button" className="btn btn-warning">Veuillez vérifier le réseau sur lequel MetaMask est connecté</button>
        </div>
      </div>
    </div>
  );
}

export default NoticeWrongNetwork;

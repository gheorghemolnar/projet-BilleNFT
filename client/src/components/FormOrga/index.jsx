import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link  } from "react-router-dom";
import { useForm } from "react-hook-form";

import useEth from "../../contexts/EthContext/useEth";
import { getContractCommByAddress, isOwner } from "../../utils";

export default function FormOrga() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { state: { web3, accounts, owner } } = useEth();
  const [contractCommunication, setContractCommunication] = useState(null);
  
  const price = web3.utils.toWei('0.02', 'ether');
  const { id } = useParams();

  const isAdmin = isOwner(accounts, owner);

  useEffect(() => {
    if (web3 && (!contractCommunication)) {
      const contractEvent = getContractCommByAddress(web3, id);
      setContractCommunication(contractCommunication);
    }
  }, [web3, contractCommunication, id]);

  const onSubmit = async data => {
    console.log(data);
    await handleCreateEvent(data);
  }

  const handleCreateEvent = async (params) => {
    const { dateEvent, nameEvent, contractOrga, nameSociety, numIdSociety, nameRepresentative, phone, email } = params;
    try {
      await contractCommunication.methods.addOrganizer(contractOrga, nameSociety, numIdSociety, nameRepresentative, phone, email).send({ from: accounts[0], gas: 3000000, value: price });
      navigate('/');
    } catch (err) {
      console.log("Erreur", err);
    }
  }


  return ( {isAdmin} ? (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Ajout un organisateur</h1>
          </div>
        </div>
      </section>

      <form className="p-3 bg-light" onSubmit={handleSubmit(onSubmit)} >

        <div className="mb-3 row">
          <label htmlFor="eventNameDate" className="col-sm-4 col-form-label">Nom de l'événement et Date</label>
          <div className="col-sm-8">
            <input {...register("nameEvent")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="date" className="col-sm-4 col-form-label">Compte Ethereum de la société :</label>
          <div className="col-sm-8">
            <input defaultValue="0xE22fE60a0780ed591b20EaD458f42Cdf9351F30e" {...register("contractOrga")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="symbol" className="col-sm-4 col-form-label">Nom de la société :</label>
          <div className="col-sm-8">
            <input defaultValue="Stade du Perou" {...register("nameSociety")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="description" className="col-sm-4 col-form-label">Numéro d'identification de la société :</label>
          <div className="col-sm-8">
            <input defaultValue="531045225593" {...register("numIdSociety")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="uri" className="col-sm-4 col-form-label">Nom du représentant :</label>
          <div className="col-sm-8">
            <input defaultValue="Jean Claude D" {...register("nameRepresentative")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies1" className="col-sm-4 col-form-label">Numéro de téléphone :</label>
          <div className="col-sm-8">
            <input defaultValue="0606540606" {...register("phone")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies2" className="col-sm-4 col-form-label">Email : </label>
          <div className="col-sm-8">
            <input defaultValue="google@gmail.com" {...register("email")} />
          </div>
        </div>

        <div className="mb-3 row container text-center">
          <div className="col">
            <button className="btn btn-primary" type="submit" >Envoyer</button>
          </div>
        </div>

      </form>

      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <Link to="/" className="btn btn-sm btn-outline-secondary">Tous les événements</Link>
          </div>
        </div>
      </section>

    </main>
  ) : ( <div>Vous n'avez pas les droits pour accéder à cette page</div> ) 
  );
  

}
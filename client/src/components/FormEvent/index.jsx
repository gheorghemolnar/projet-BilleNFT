import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";

export default function FormEvent() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { state: { accounts, contractBilleStore, contractBilleEvent, contractCommunication, eventsCreated, ticketsSold } } = useEth();
  const onSubmit = async data => {
    console.log(data);
    await handleCreateEvent(data);
  }


  const handleCreateEvent = async (params) => {
    const { dateEvent, nameEvent, symbol, description, uri, ticketSupply1, ticketSupply2, ticketSupply3 } = params;
    try {
      const dateTimestamp = Number(new Date(dateEvent));
      await contractBilleStore.methods.createEvent(dateTimestamp, nameEvent, symbol, description, uri, [ticketSupply1, ticketSupply2, ticketSupply3]).send({ from: accounts[0] });
      navigate('/');
    } catch (err) {
      console.log("Erreur", err);
    }
  }


  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Ajout nouvel événement</h1>
            {/* <p className="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p> */}
          </div>
        </div>
      </section>

      <form className="p-3 bg-light" onSubmit={handleSubmit(onSubmit)} >

        <div className="mb-3 row">
          <label htmlFor="name" className="col-sm-4 col-form-label">Nom de l'événement</label>
          <div className="col-sm-8">
            <input defaultValue="Toto" {...register("nameEvent")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="date" className="col-sm-4 col-form-label">Date de l'évènement</label>
          <div className="col-sm-8">
            <input defaultValue="2022-10-20" type="date" {...register("dateEvent")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="symbol" className="col-sm-4 col-form-label">Monnaie</label>
          <div className="col-sm-8">
            <input defaultValue="BNF" {...register("symbol")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="description" className="col-sm-4 col-form-label">Description</label>
          <div className="col-sm-8">
            <input defaultValue="La legende" {...register("description")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="uri" className="col-sm-4 col-form-label">Uri</label>
          <div className="col-sm-8">
            <input defaultValue="181818222" {...register("uri")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies1" className="col-sm-4 col-form-label">Nombre de tickets Pelouse</label>
          <div className="col-sm-8">
            <input type="number" defaultValue={50} {...register("ticketSupply1")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies2" className="col-sm-4 col-form-label">Nombre de tickets Gradin</label>
          <div className="col-sm-8">
            <input type="number" defaultValue={30} {...register("ticketSupply2")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies2" className="col-sm-4 col-form-label">Nombre de tickets VIP</label>
          <div className="col-sm-8">
            <input type="number" defaultValue={10} {...register("ticketSupply3")} />
          </div>
        </div>

        <div className="mb-3 row container text-center">
          <div className="col">
            <button className="btn btn-primary" type="submit" >Envoyer</button>
          </div>
        </div>

      </form>
    </main>
  );

}
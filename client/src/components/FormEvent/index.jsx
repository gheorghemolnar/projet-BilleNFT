import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";

export default function FormEvent() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { state: {accounts, contractBilleStore, contractBilleEvent, contractCommunication, eventsCreated, ticketsSold}} = useEth();
  const onSubmit = async data => {
    console.log(data);
    await handleCreateEvent(data);
  }


  const handleCreateEvent = async(params) => {
    const {dateEvent, nameEvent, symbol, description, uri, ticketSupply1, ticketSupply2, ticketSupply3} =params;
       try{
      const dateTimestamp = Number (new Date(dateEvent));
      await contractBilleStore.methods.createEvent(dateTimestamp, nameEvent, symbol, description, uri, [ticketSupply1, ticketSupply2, ticketSupply3]).send({from: accounts[0]});
      navigate('/');
    }catch(err){
        console.log("Erreur", err);
    }    
  }

  
  /* const { state: { artifact, contract } } = useEth(); */
  return(
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

        <table>          
          <tbody>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="name">Nom de l'événement</label>
              </td>
              <td>
              <input defaultValue="Toto" {...register("nameEvent")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="date">Date de l'évènement</label>
              </td>
              <td>
                <input defaultValue="2022-05-20" type="date" {...register("dateEvent")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="monnaie">Monnaie</label>
              </td>
              <td>
                <input defaultValue="BNF" {...register("symbol")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="description">Description</label>
              </td>
              <td>
                <input defaultValue="La legende" {...register("description")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="Uri :">Uri</label>
              </td>
              <td>
                <input defaultValue="181818222" {...register("uri")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="ticketSupplies">Nombre de tickets Pelouse</label>
              </td>
              <td>
                <input type="number" defaultValue={50} {...register("ticketSupply1")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="ticketSupplies">Nombre de tickets Gradin</label>
              </td>
              <td>
                <input type="number" defaultValue={30} {...register("ticketSupply2")}      />
              </td>
            </tr>
            <tr>
              <td>
                <label className="p-3 bg-light" htmlFor="ticketSupplies">Nombre de tickets VIP</label>
              </td>
              <td>
                <input type="number" defaultValue={10} {...register("ticketSupply3")}      />
              </td>
            </tr>
            </tbody>
        </table>

        <button  className="btn btn-primary" type="submit" >Envoyer</button>
      </form>
    </main>
  );
  
}
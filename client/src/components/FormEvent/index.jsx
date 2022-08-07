import React, {useState} from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import useEth from "../../contexts/EthContext/useEth";
import { NavToHome } from "../common";

dotenv.config();

export default function FormEvent() {
  const { state: { accounts, contractBilleStore } } = useEth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ fileImg, setFileImg ] = useState(null);

  const onSubmit = async data => {
    const { nameEvent } = data;
    
    try {
      setIsLoading(true);
      
      let uri = "default";
      if(fileImg && nameEvent){
        const cidImage = await sendFileToIPFS(nameEvent);
        uri = cidImage;
      }

      const newData = {...data, uri};

      await handleCreateEvent(newData);

    } catch (err) {
      console.log("Error occured", err);
    }finally{
      setIsLoading(false);
    }
  }

  const handleCreateEvent = async (params) => {
    const { dateEvent, nameEvent, symbol, description, uri = "default", ticketSupply1, ticketSupply2, ticketSupply3 } = params;

    try {
      const dateTimestamp = Number(new Date(dateEvent));

      await contractBilleStore.methods.createEvent(dateTimestamp, nameEvent, symbol, description, uri, [ticketSupply1, ticketSupply2, ticketSupply3]).send({ from: accounts[0] });
      navigate('/events');

    } catch (err) {
      console.log("Erreur", err);
    }
  }

  const sendFileToIPFS = async (eventName) => {
    const timestamp = Number(Date.now());
    const fileName = `${fileImg.name}`;
    const filePath = `/${timestamp}-${eventName}/${fileName}`;

    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg, filePath);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            'pinata_api_key': `${process.env.REACT_APP_PINATA_API_KEY}`,
            'pinata_secret_api_key': `${process.env.REACT_APP_PINATA_API_SECRET}`,
            "Content-Type": "multipart/form-data"
          },
        });

        const cidImage = `ipfs://${resFile.data.IpfsHash}/${fileName}`;
        console.log("Image uploaded to Pinata", cidImage);

        return cidImage;

      } catch (err) {
        console.log("Error sending File to IPFS: ");
        console.log(err);
      }
    }
  }

  return (
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Ajout nouvel événement</h1>
          </div>
        </div>
      </section>

      <form className="p-3 bg-light" onSubmit={handleSubmit(onSubmit)} >

        <div className="mb-3 row">
          <label htmlFor="imageEvent" className="col-sm-4 col-form-label">Image événement</label>
          <div className="col-sm-8">
            <input type="file" {...register("imageEvent")} onChange={(e) =>setFileImg(e.target.files[0])} />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="nameEvent" className="col-sm-4 col-form-label">Nom de l'événement</label>
          <div className="col-sm-8">
            <input className="event-large-field" defaultValue="Group's Greatest tour in Paris" {...register("nameEvent")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="dateEvent" className="col-sm-4 col-form-label">Date de l'évènement</label>
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
            <input className="event-large-field" defaultValue="La legende - once in your lifetime !" {...register("description")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies1" className="col-sm-4 col-form-label">Nombre de tickets Pelouse</label>
          <div className="col-sm-8">
            <input type="number" className="text-end" defaultValue={50} {...register("ticketSupply1")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies2" className="col-sm-4 col-form-label">Nombre de tickets Gradin</label>
          <div className="col-sm-8">
            <input type="number" className="text-end" defaultValue={30} {...register("ticketSupply2")} />
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketSupplies2" className="col-sm-4 col-form-label">Nombre de tickets VIP</label>
          <div className="col-sm-8">
            <input type="number" className="text-end" defaultValue={10} {...register("ticketSupply3")} />
          </div>
        </div>

        <div className="mb-3 row container text-center">
          <div className="col">
            <button className="btn btn-primary" type="submit" >{
              isLoading ? <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> : "Envoyer"
            }</button>
          </div>
        </div>

      </form>

      {<NavToHome />}

    </main>
  );

}
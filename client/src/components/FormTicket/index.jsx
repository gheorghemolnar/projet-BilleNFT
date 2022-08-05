import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Joi from 'joi';

import { getContractEventByAddress } from "../../utils";
import useEth from "../../contexts/EthContext/useEth";

export default function FormEvent() {
  const { state: { web3, accounts } } = useEth();
  
  const navigate = useNavigate();
  let {id} = useParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [contractBilleEvent, setContractBilleEvent] = useState(null);

  //error list from joi validation
  const [errlist, setErrlist] = useState([]);
  // error message from Api request
  const [errMessage, setErrMessage] = useState('');

  const [ticketOrder , setTicketOrder] = useState({
    category: 0,
    quantity: 1
  });

  useEffect(() => {
    const fetchData = async(tmp) => {
      // const address = contractBilleEvent.address();
      if(tmp){
        console.log(`🚀 balance Contrat ${id}`, await tmp.methods.getBalance().call({from: accounts[0]}));
      }

        setContractBilleEvent(tmp);
      // return address;
    }

    if (web3) {
      const tmp = getContractEventByAddress(web3, id);
      fetchData(tmp);

    }
  }, [web3]);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    let addedTicketOrder = { ...ticketOrder };

    if(e.target.name)
      addedTicketOrder[e.target.name] = parseInt(inputValue, 10);
    else
      addedTicketOrder[e.target.id] = inputValue;

    setTicketOrder(addedTicketOrder);
  }

  const handleTicketBuy = async () => {
    const {category, quantity}= ticketOrder;

    if (contractBilleEvent) {
      const price = web3.utils.toWei('0.02', 'ether') * quantity;

      try {
        setIsLoading(true);
        await contractBilleEvent.methods.buyTickets(category, quantity).send({ from: accounts[0], gas: 3000000, value: price });

        navigate(`/events/${id}`);

      }catch(err) {
        console.log(`handleTicketBuy: Error `, err);
        setErrMessage("Une erreur est survenue. Essayez ultérieurement.");
      }finally {
        setIsLoading(false);
      }
    }else {
      setErrMessage("Une erreur est survenue. Essayez ultérieurement");
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    const schema = Joi.object({
      category: Joi.number().min(0).max(2).required(),
      quantity: Joi.number().min(1).max(4).required()
    });

    const joiResponse = schema.validate( ticketOrder  , { abortEarly: false});
    
    if(joiResponse.error){
      setErrlist(joiResponse.error.details);
    }else{
      setErrlist([]);

      //call Api
      await handleTicketBuy();
    }
    
  };
  
  return(
    <main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Achetez vos tickets</h1>
            {/* <p className="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p> */}
          </div>
        </div>
      </section>

      <form className="p-3 bg-light" onSubmit={handleSubmit}>
        {
          errMessage.length ? <div className='alert alert-danger py-1'> {errMessage} </div> : ""
        }
        {
          errlist.length ? errlist.map((err,i) => <div key={i} className='alert alert-danger py-1' role="alert"> {err.message}</div>): ""
        }
        <div className="mb-3 row">
          <label forhtml="category" className="col-sm-4 col-form-label">Catégorie</label>
          <div className="col-sm-8">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="category" id="category1" value="0" onChange={handleChange} checked={ticketOrder.category === 0} disabled={isLoading} />
              <label className="form-check-label" forhtml="inlineRadio1">Fosse</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="category" id="category2" value="1" onChange={handleChange}  checked={ticketOrder.category === 1} disabled={isLoading} />
              <label className="form-check-label" forhtml="inlineRadio2">Gradins</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" name="category" id="category3" value="2" onChange={handleChange}  checked={ticketOrder.category === 2} disabled={isLoading} />
              <label className="form-check-label" forhtml="inlineRadio3">VIP</label>
            </div>
          </div>
        </div>
        <div className="mb-3 row">
          <label htmlFor="ticketNumber" className="col-sm-4 form-label">Nombre de tickets:</label>
          <div className="col-sm-8">
            <input type="number" className="form-control" id="quantity" min={1} max={4} onChange={handleChange} defaultValue={1} disabled={isLoading} />
          </div>
        </div>
        <div className="mb-3 row container text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>{
              isLoading ? <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div> : "J'achète"
            }</button>
          </div>
        </div>
      </form>
    </main>
  );
}

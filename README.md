# dApp BilleNFT
## Création d'évènement avec vente de ticket

L'utilisation de React avec Node et truffle nous permet de construire une dApp qui interagit avec Metamask, que ce soit sur le réseau de test Rinkeby ou en localhost avec Ganache.

Lien de la vidéo de démonstration

Le projet est scindé en deux dossiers principaux

- client
- truffle

# Le dossier truffle

Il contient trois contrats: 
- *BilleStore.sol*
- *BilleEvent.sol* 
- *Communication.sol*


# Le dossier client 

Dans le dossier **src** nous avons App.jsx qui contient les routes grace au composant react-router-dom.

Le fichier package.json a demandé des modifications pour déployer sur Github Pages. Voici le lien pour voir l'application ainsi déployé :


Le code est situé dans le fichier App.js

```js
import { Outlet, useRoutes } from "react-router-dom";

import { EthProvider } from "./contexts/EthContext";
import Navbar from "./components/Navbar";
import Listing from "./components/Listing";
import FormEvent from "./components/FormEvent";
import ViewEvent from "./components/ViewEvent";
import FormTicket from "./components/FormTicket";
import NoMatch from "./components/NoMatch";
import "./App.css";
```
Les imports permettent d'utiliser les différentes propriétés de React, ainsi que les composants utilisés pour segmenter l'affichage.

```js
let routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { 
            index: true, element: <Listing />,
        },
```

Regardons un composant plus en détail
```js
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, Link } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";

export default function FormEvent() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { state: { accounts, contractBilleStore } } = useEth();
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
    ... suite du formulaire
    </main>
  );
  ```
  Nous avons ici le react-hook-form qui permet d'utiliser des propriétés de formulaire plus intérressant comme 
  ```js
 <input defaultValue="Toto" {...register("nameEvent")} />
```
 pour récupérer les informations de cet input.
 [Capture écran interface formulaire](https://drive.google.com/file/d/12SpfPR5BrlLsMS0p3IuUXTBLY5WMiIj3/view?usp=sharing)

 
 Nous voyons aussi la connexion avec la blockchain via la fonction createEvent dans ce code 
  ```js
await contractBilleStore.methods.createEvent(dateTimestamp, nameEvent, symbol, description, uri, [ticketSupply1, ticketSupply2, ticketSupply3]).send({ from: accounts[0] });
```
C'est cette fonction qui ajoute un évènement dans le contrat BilleStore, cet évènement est de type BilleEvent et il contient à ce titre la date sous forme de Timestamp, le nom de l'évènement, le symbol du NFT, la description de l'évènement, l'uri pour avoir un lien avec les metadata en json, et les trois catégories de billets (Pelouse, Gradin, Loge) avec le chiffre correspondant au nombre rentré dans le formulaire.

# Gestion des droits Admin

Seul l'administrateur de BilleNFT (du contrat deployé Billestore) a le droit d'ajouter un évènement.
[Interface de l'admin avec un évènement créé](https://drive.google.com/file/d/1i9iyOq3AmPJPuU18KRQXaLBtvC1cPTDR/view?usp=sharing)

Le client n'a pas le bouton permettant de créer un évènement, ceci grâce au code :
  ```js
const isAdmin = isOwner(accounts, owner);
```
Cette fonction étant importé depuis /client/src/utils/index.js ici écrite en écriture ternaire
```js
export const isOwner = (currentUser, owner) => currentUser && currentUser.length > 0 ? currentUser[0] === owner : false;
```
Dans le formulaire (components/Listing/index.jsx) ce bouton est masqué via cette fonction :
```js
<p>
    {isAdmin && (<Link to="/addevent" className="btn btn-primary">Ajouter un événement</Link>)}
</p>
```
[Vu de l'évènement par l'administrateur](https://drive.google.com/file/d/1tC9wS82awir9ue0lNzH1pANAnXIY16Q8/view?usp=sharing)
La création d'évènement fonctionne, ainsi que la vente de ticket pour le client. Il a accès aux informations de l'évènement choisi dans le listing avec cette interface.
[Vu de l'évènement par le client](https://drive.google.com/file/d/1QeebOOqQQFiPUFKG8rfC3qVRaZV2dLO5/view?usp=sharing)
Puis en cliquant sur le bouton **J'y vais** il arrive sur cette interface

[Achat de ticket par le client](https://drive.google.com/file/d/1fO6LsTtq_-l6qvGuAMICYmvkUHV0bLvf/view?usp=sharing)


# Gestion d'events avec getPastEvents

Dans ce test au sein d'une fonction nous voyons une utilisation de la gestion d'évènement.
```js
if(contractBilleStore && contractBilleEvent) {
    const options = { fromBlock: 0, toBlock: 'latest' };
    
    [initOwner, initEvents, ticketSolds] = await Promise.all([
      contractBilleStore.methods.owner().call(),
      contractBilleStore.getPastEvents('EventCreated', options),
      contractBilleEvent.getPastEvents('TicketSold', options)
    ]);
}
  ```
  Dans un useCallback (composant de React) nous avons une gestion dynamique des évènements passés.

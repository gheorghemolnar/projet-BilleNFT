# dApp BilleNFT

## Création d'évènement avec vente de ticket

L'utilisation de React avec Node et truffle nous permet de construire une dApp qui interagit avec Metamask, que ce soit sur le réseau de test Rinkeby ou en localhost avec Ganache.

Lien de la vidéo de démonstration
https://www.loom.com/share/135cd7c19ef04da29573b99d023efbe9

Un site web a été créé pour la dApp avec lequel on peut créer un évènement avec la vente de ticket.
https://web3.corsica/ 
La connexion à la DApp sera faite ultérieurement à cause du routage de react qui entre en conflit avec l'architecture du site.

Le projet est scindé en deux dossiers principaux

- client
- truffle

# Le dossier truffle

Il contient trois contrats : 

- *BilleStore.sol*
- *BilleEvent.sol* 
- *Communication.sol*

# Le dossier client 

Dans le dossier **src** nous avons App.jsx qui contient les routes grâce au composant react-router-dom.

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

  Nous avons ici le react-hook-form qui permet d'utiliser des propriétés de formulaire plus intéressant comme 

```js
 <input defaultValue="Toto" {...register("nameEvent")} />
```

 pour récupérer les informations de cet input.

 ![L'administrateur ajoute un évènement via le formulaire](https://web3.corsica/wp-content/billenft/static/img/adminAjoutEvenementMM.png)
*L'administrateur ajoute un évènement via le formulaire*
 
 Nous voyons aussi la connexion avec la blockchain via la fonction createEvent dans ce code 

```js
await contractBilleStore.methods.createEvent(dateTimestamp, nameEvent, symbol, description, uri, [ticketSupply1, ticketSupply2, ticketSupply3]).send({ from: accounts[0] });
```

C'est cette fonction qui ajoute un évènement dans le contrat BilleStore, cet évènement est de type BilleEvent et il contient à ce titre la date sous forme de Timestamp, le nom de l'évènement, le symbol du NFT, la description de l'évènement, l'uri pour avoir un lien avec les metadata en json, et les trois catégories de billets (Pelouse, Gradin, Loge) avec le chiffre correspondant au nombre rentré dans le formulaire.

# Gestion des droits administrateur

![L'interface lorsque l'administrateur se connecte au contrat tout juste deployé](https://web3.corsica/wp-content/billenft/static/img/interfaceArriveVideAdmin.png)
*L'interface lorsque l'administrateur se connecte au contrat tout juste deployé*

Seul l'administrateur de BilleNFT (du contrat deployé Billestore) a le droit d'ajouter un évènement.

![L'interface lorsque le client se connecte au contrat tout juste deployé](https://web3.corsica/wp-content/billenft/static/img/interfaceArriveVideClient.png)
*L'interface lorsque le client se connecte au contrat tout juste deployé*

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
    {isAdmin && (<Link to="/add" className="btn btn-primary">Ajouter un événement</Link>)}
</p>
```

![Vu de l'évènement par l'administrateur](https://web3.corsica/wp-content/billenft/static/img/adminVoitInfoContract.png)
*Vu de l'évènement par l'administrateur*

La création d'évènement fonctionne, ainsi que la vente de ticket pour le client. Il a accès aux informations de l'évènement choisi dans le listing avec cette interface.

![Vu des évènements par le client](https://web3.corsica/wp-content/billenft/static/img/clientDetailEve.png)
*Vu des évènements par le client*

![Vu des détails de l'évènement par le client](https://web3.corsica/wp-content/billenft/static/img/clientVoitEve.png)
*Vu des détails de l'évènement par le client*

Puis en cliquant sur le bouton **J'y vais** il arrive sur cette interface

![Achat de ticket par le client](https://web3.corsica/wp-content/billenft/static/img/ClientAcheteTicket.png)
*Achat de ticket par le client*

Du côté de l'administrateur il voit avant l'achat du client
![Vue administrateur](https://web3.corsica/wp-content/billenft/static/img/adminVoitInfoContract.png)
*Lorsque l'administrateur consulte les détails d'un évènement, il a plus d'information qu'un client*

![Interface administrateur après un achat permet de consulter la balance du contrat ainsi que le nombre de ticket vendu par catégorie](https://web3.corsica/wp-content/billenft/static/img/adminSeeInfoContractApresUnAchat.png)
*Interface administrateur après un achat permet de consulter la balance du contrat ainsi que le nombre de ticket vendu par catégorie*

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

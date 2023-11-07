import React, { useState, useEffect } from 'react';
import Web3 from 'web3'; // Assurez-vous que Web3 est correctement installé

const LivretFamille = require("../contracts/LivretFamille.json");
const abi = LivretFamille.abi;
const contractAddress = '0x11a39D4697561B9330C081EecfF03F908DD7Ddc0';
const ListeLivretsComponent = () => {
  const [livrets, setLivrets] = useState([]);
  const [livretIndexToDelete, setLivretIndexToDelete] = useState(null);

  useEffect(() => {
    // Récupérer la liste des livrets de famille depuis le contrat Solidity
    const fetchLivrets = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(
          abi,
          contractAddress
        );

        const livrets = await contract.methods.listerLivrets().call();
        setLivrets(livrets);
      } catch (error) {
        console.error('Erreur lors de la récupération de la liste des livrets :', error);
      }
    };

    fetchLivrets();
  }, []);

  const handleDeleteLivret = (livretIndex) => {
    setLivretIndexToDelete(livretIndex);
  };

  const confirmDeleteLivret = async () => {
    if (livretIndexToDelete !== null) {
      try {
        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(
          abi,
          contractAddress
        );

        await contract.methods.supprimerLivret(livretIndexToDelete).send({ from: web3.eth.defaultAccount });

        // Actualiser la liste des livrets après suppression
        const updatedLivrets = [...livrets];
        updatedLivrets.splice(livretIndexToDelete, 1);
        setLivrets(updatedLivrets);

        setLivretIndexToDelete(null); // Réinitialiser l'indice à supprimer
      } catch (error) {
        console.error('Erreur lors de la suppression du livret :', error);
      }
    }
  };

  return (
    <div>
      <h2>Liste des livrets de famille</h2>
      <ul>
        {livrets.map((livret, index) => (
          <li key={index}>
             Livret {index + 1}: {livret.epoux1.prenom} {livret.epoux1.nom} et {livret.epoux2.prenom} {livret.epoux2.nom}
            <button onClick={() => handleDeleteLivret(index)}>Supprimer</button>
          </li>
        ))}
      </ul>
      {livretIndexToDelete !== null && (
        <div>
          <p>Confirmez la suppression du livret {livretIndexToDelete + 1} :</p>
          <button onClick={confirmDeleteLivret}>Confirmer</button>
        </div>
      )}
    </div>
  );
};

export default ListeLivretsComponent;
import React, { useState, useEffect } from 'react';
import Web3 from 'web3'; // Assurez-vous que Web3 est correctement installé

const abi = [{"inputs":[{"internalType":"uint256","name":"livretIndex","type":"uint256"},{"internalType":"string","name":"nomEnfant","type":"string"},{"internalType":"string","name":"prenomEnfant","type":"string"},{"internalType":"uint256","name":"dateDeNaissanceEnfant","type":"uint256"}],"name":"ajouterEnfant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"nomEpoux1","type":"string"},{"internalType":"string","name":"prenomEpoux1","type":"string"},{"internalType":"uint256","name":"dateDeNaissanceEpoux1","type":"uint256"},{"internalType":"string","name":"nomEpoux2","type":"string"},{"internalType":"string","name":"prenomEpoux2","type":"string"},{"internalType":"uint256","name":"dateDeNaissanceEpoux2","type":"uint256"}],"name":"creerLivret","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"enfantsParLivret","outputs":[{"internalType":"string","name":"nom","type":"string"},{"internalType":"string","name":"prenom","type":"string"},{"internalType":"uint256","name":"dateDeNaissance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"listerLivrets","outputs":[{"components":[{"components":[{"internalType":"string","name":"nom","type":"string"},{"internalType":"string","name":"prenom","type":"string"},{"internalType":"uint256","name":"dateDeNaissance","type":"uint256"}],"internalType":"struct LivretFamille.Epoux","name":"epoux1","type":"tuple"},{"components":[{"internalType":"string","name":"nom","type":"string"},{"internalType":"string","name":"prenom","type":"string"},{"internalType":"uint256","name":"dateDeNaissance","type":"uint256"}],"internalType":"struct LivretFamille.Epoux","name":"epoux2","type":"tuple"},{"internalType":"uint256[]","name":"enfants","type":"uint256[]"}],"internalType":"struct LivretFamille.Livret[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"livrets","outputs":[{"components":[{"internalType":"string","name":"nom","type":"string"},{"internalType":"string","name":"prenom","type":"string"},{"internalType":"uint256","name":"dateDeNaissance","type":"uint256"}],"internalType":"struct LivretFamille.Epoux","name":"epoux1","type":"tuple"},{"components":[{"internalType":"string","name":"nom","type":"string"},{"internalType":"string","name":"prenom","type":"string"},{"internalType":"uint256","name":"dateDeNaissance","type":"uint256"}],"internalType":"struct LivretFamille.Epoux","name":"epoux2","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"livretIndex","type":"uint256"}],"name":"obtenirNombreEnfants","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"obtenirNombreLivrets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"livretIndex","type":"uint256"}],"name":"supprimerLivret","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const contractAddress = '0xEF1711414092630f63A8F58382e155E1BC40Af62';
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
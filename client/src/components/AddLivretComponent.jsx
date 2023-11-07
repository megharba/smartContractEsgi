import React, { useState } from 'react';
import Web3 from 'web3';
import './LivretStyle.css';

const abi = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "enfantsParLivret",
    "outputs": [
      {
        "internalType": "string",
        "name": "nom",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "prenom",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dateDeNaissance",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "livrets",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "nom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "prenom",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "dateDeNaissance",
            "type": "uint256"
          }
        ],
        "internalType": "struct LivretFamille.Epoux",
        "name": "epoux1",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "nom",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "prenom",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "dateDeNaissance",
            "type": "uint256"
          }
        ],
        "internalType": "struct LivretFamille.Epoux",
        "name": "epoux2",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "nomEpoux1",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "prenomEpoux1",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dateDeNaissanceEpoux1",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "nomEpoux2",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "prenomEpoux2",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dateDeNaissanceEpoux2",
        "type": "uint256"
      }
    ],
    "name": "creerLivret",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "livretIndex",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "nomEnfant",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "prenomEnfant",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "dateDeNaissanceEnfant",
        "type": "uint256"
      }
    ],
    "name": "ajouterEnfant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "livretIndex",
        "type": "uint256"
      }
    ],
    "name": "supprimerLivret",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "obtenirNombreLivrets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "nombreLivrets",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "livretIndex",
        "type": "uint256"
      }
    ],
    "name": "obtenirNombreEnfants",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "nombreEnfants",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
]

const contractAddress = '0xEF1711414092630f63A8F58382e155E1BC40Af62';
//hook & Use State & Use Effect /Use Effect Cleanup /Props stock

const AddLivretComponent = () => {
  const [state, setState] = useState({
    nomEpoux1: '',
    prenomEpoux1: '',
    dateDeNaissanceEpoux1: '',
    nomEpoux2: '',
    prenomEpoux2: '',
    dateDeNaissanceEpoux2: '',
    children: [],
    childName: '',
    childBirthDate: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleAddChild = () => {
    const { childName, childBirthDate } = state;
    const newChild = { name: childName, birthDate: childBirthDate };
    setState({
      ...state,
      children: [...state.children, newChild],
      childName: '',
      childBirthDate: '',
    });
  };

  const createLivret = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, contractAddress);
  
    const accounts = await web3.eth.getAccounts();
    const {
      nomEpoux1,
      prenomEpoux1,
      dateDeNaissanceEpoux1,
      nomEpoux2,
      prenomEpoux2,
      dateDeNaissanceEpoux2,
      children,
    } = state;
  
    // Convertissez la date de naissance en nombre entier
    const dateDeNaissance1 = Date.parse(dateDeNaissanceEpoux1) / 1000; // Supposons que la date soit au format "YYYY-MM-DD"
    const dateDeNaissance2 = Date.parse(dateDeNaissanceEpoux2) / 1000;
  
    const childrenData = children.map(
      (child) => `${child.nom},${child.prenom},${Date.parse(child.dateDeNaissance) / 1000}`
    );
  
    await contract.methods
      .creerLivret(
        nomEpoux1,
        prenomEpoux1,
        dateDeNaissance1,
        nomEpoux2,
        prenomEpoux2,
        dateDeNaissance2
      )
      .send({ from: accounts[0] });
  
    // Ajouter les enfants au livret créé
    const livretIndex = await contract.methods.obtenirNombreLivrets().call();
    for (const child of childrenData) {
      const [nom, prenom, dateDeNaissance] = child.split(',');
      await contract.methods
        .ajouterEnfant(livretIndex, nom, prenom, dateDeNaissance)
        .send({ from: accounts[0] });
    }
  };

  return (
    <div>
      <h2>Créer un nouveau livret de famille</h2>
      <form>
        <div>
          <label>Nom de l'époux 1:</label>
          <input
            type="text"
            name="nomEpoux1"
            value={state.nomEpoux1}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Prénom de l'époux 1:</label>
          <input
            type="text"
            name="prenomEpoux1"
            value={state.prenomEpoux1}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date de naissance de l'époux 1:</label>
          <input
            type="date"
            name="dateDeNaissanceEpoux1"
            value={state.dateDeNaissanceEpoux1}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Nom de l'époux 2:</label>
          <input
            type="text"
            name="nomEpoux2"
            value={state.nomEpoux2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Prénom de l'époux 2:</label>
          <input
            type="text"
            name="prenomEpoux2"
            value={state.prenomEpoux2}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date de naissance de l'époux 2:</label>
          <input
            type="date"
            name="dateDeNaissanceEpoux2"
            value={state.dateDeNaissanceEpoux2}
            onChange={handleInputChange}
          />
        </div>
        {/* Ajoutez des champs pour les paramètres supplémentaires */}
        <div>
          <label>Nom de l'enfant:</label>
          <input
            type="text"
            name="childName"
            value={state.childName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Date de naissance de l'enfant:</label>
          <input
            type="date"
            name="childBirthDate"
            value={state.childBirthDate}
            onChange={handleInputChange}
          />
        </div>
        {/* Fin des champs supplémentaires */}
        {/* ... Autres champs de formulaire existants ... */}
        <button type="button" onClick={handleAddChild}>
          Ajouter un enfant
        </button>
        <button type="button" onClick={createLivret}>
          Créer Livret de Famille
        </button>
      </form>
    </div>
  );
};

export default AddLivretComponent;

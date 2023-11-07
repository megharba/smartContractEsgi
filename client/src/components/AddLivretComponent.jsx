import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './LivretStyle.css';
const LivretFamille = require("../contracts/LivretFamille.json");
const abi = LivretFamille.abi;
const contractAddress = '0x11a39D4697561B9330C081EecfF03F908DD7Ddc0';

const AddLivretComponent = () => {
  const [state, setState] = useState({
    nomEpoux1: '',
    prenomEpoux1: '',
    dateDeNaissanceEpoux1: '',
    nomEpoux2: '',
    prenomEpoux2: '',
    dateDeNaissanceEpoux2: '',
    children: [],
    numberOfChildren: 0,
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = state.nomEpoux1 && state.prenomEpoux1 && state.dateDeNaissanceEpoux1 &&
                    state.nomEpoux2 && state.prenomEpoux2 && state.dateDeNaissanceEpoux2 &&
                    state.children.length === parseInt(state.numberOfChildren, 10) &&
                    state.children.every(child => child.nom && child.dateDeNaissance);
    setIsFormValid(isValid);
  }, [state]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => {
      if (name === 'numberOfChildren') {
        const numberOfChildren = parseInt(value, 10) || 0;
        const children = numberOfChildren < prevState.children.length
          ? prevState.children.slice(0, numberOfChildren)
          : [
              ...prevState.children,
              ...Array(numberOfChildren - prevState.children.length).fill({ nom: '', dateDeNaissance: '' })
            ];
        return { ...prevState, numberOfChildren, children };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleChildInputChange = (field, value, index) => {
    setState(prevState => {
      const updatedChildren = [...prevState.children];
      updatedChildren[index] = { ...updatedChildren[index], [field]: value };
      return { ...prevState, children: updatedChildren };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      console.error('The form is invalid.');
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);
      const accounts = await web3.eth.getAccounts();
      
      const {
        nomEpoux1, prenomEpoux1, dateDeNaissanceEpoux1,
        nomEpoux2, prenomEpoux2, dateDeNaissanceEpoux2,
        children,
      } = state;

      const dateDeNaissance1 = new Date(dateDeNaissanceEpoux1).getTime() / 1000;
      const dateDeNaissance2 = new Date(dateDeNaissanceEpoux2).getTime() / 1000;

      await contract.methods
        .creerLivret(nomEpoux1, prenomEpoux1, dateDeNaissance1, nomEpoux2, prenomEpoux2, dateDeNaissance2)
        .send({ from: accounts[0] });

      const livretIndex = await contract.methods.obtenirNombreLivrets().call() - 1;

      for (const child of children) {
        const childDateDeNaissance = new Date(child.dateDeNaissance).getTime() / 1000;
        await contract.methods
          .ajouterEnfant(livretIndex, child.nom, child.prenom, childDateDeNaissance)
          .send({ from: accounts[0] });
      }

      console.log('Livret created successfully');
    } catch (error) {
      console.error('An error occurred during the submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nomEpoux1" placeholder="Nom de l'époux(se) 1" value={state.nomEpoux1} onChange={handleInputChange} />
      <input type="text" name="prenomEpoux1" placeholder="Prénom de l'époux(se) 1" value={state.prenomEpoux1} onChange={handleInputChange} />
      <input type="date" name="dateDeNaissanceEpoux1" placeholder="Date de naissance de l'époux(se) 1" value={state.dateDeNaissanceEpoux1} onChange={handleInputChange} />
  
      <input type="text" name="nomEpoux2" placeholder="Nom de l'époux(se) 2" value={state.nomEpoux2} onChange={handleInputChange} />
      <input type="text" name="prenomEpoux2" placeholder="Prénom de l'époux(se) 2" value={state.prenomEpoux2} onChange={handleInputChange} />
      <input type="date" name="dateDeNaissanceEpoux2" placeholder="Date de naissance de l'époux(se) 2" value={state.dateDeNaissanceEpoux2} onChange={handleInputChange} />
  
      <input type="number" name="numberOfChildren" placeholder="Number of Children" value={state.numberOfChildren} onChange={handleInputChange} />
  
      {state.children.map((child, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Nom de l'enfant ${index + 1}`}
            value={child.nom}
            onChange={event => handleChildInputChange('nom', event.target.value, index)}
          />
          <input
            type="date"
            placeholder={`Date de naissance de l'enfant ${index + 1}`}
            value={child.dateDeNaissance}
            onChange={event => handleChildInputChange('dateDeNaissance', event.target.value, index)}
          />
        </div>
      ))}

      <button type="submit" disabled={!isFormValid}>Ajouter Livret</button>
    </form>
  );
};

export default AddLivretComponent;

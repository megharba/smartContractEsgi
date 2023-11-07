// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LivretFamille {
    // Structure de données pour représenter un époux
    struct Epoux {
        string nom;
        string prenom;
        uint256 dateDeNaissance;
    }

    // Structure de données pour représenter un enfant
    struct Enfant {
        string nom;
        string prenom;
        uint256 dateDeNaissance;
    }

    // Structure de données pour représenter un livret de famille
    struct Livret {
        Epoux epoux1;
        Epoux epoux2;
    }

    // Tableau pour stocker tous les livrets de famille
    Livret[] public livrets;

    // Mapping pour stocker les enfants par livret de famille
    mapping(uint256 => Enfant[]) public enfantsParLivret;

    // Fonction pour créer un nouveau livret de famille
    function creerLivret(
        string memory nomEpoux1,
        string memory prenomEpoux1,
        uint256 dateDeNaissanceEpoux1,
        string memory nomEpoux2,
        string memory prenomEpoux2,
        uint256 dateDeNaissanceEpoux2
    ) public {
        // Créer une instance de Livret
        Livret memory nouveauLivret = Livret({
            epoux1: Epoux({
                nom: nomEpoux1,
                prenom: prenomEpoux1,
                dateDeNaissance: dateDeNaissanceEpoux1
            }),
            epoux2: Epoux({
                nom: nomEpoux2,
                prenom: prenomEpoux2,
                dateDeNaissance: dateDeNaissanceEpoux2
            })
        });

        // Ajouter le nouveau livret au tableau des livrets
        livrets.push(nouveauLivret);
    }

    // Fonction pour ajouter un enfant à un livret de famille existant
    function ajouterEnfant(
        uint256 livretIndex,
        string memory nomEnfant,
        string memory prenomEnfant,
        uint256 dateDeNaissanceEnfant
    ) public {
        require(livretIndex < livrets.length, "Livret introuvable");

        // Créer une instance d'enfant
        Enfant memory nouvelEnfant = Enfant({
            nom: nomEnfant,
            prenom: prenomEnfant,
            dateDeNaissance: dateDeNaissanceEnfant
        });

        // Ajouter l'enfant au mapping avec l'indice du livret
        enfantsParLivret[livretIndex].push(nouvelEnfant);
    }

    // Fonction pour supprimer un livret de famille
    function supprimerLivret(uint256 livretIndex) public {
        require(livretIndex < livrets.length, "Livret introuvable");

        // Supprimer les enfants associés au livret individuellement
        delete enfantsParLivret[livretIndex];

        // Supprimer le livret en déplaçant le dernier élément à sa place et en réduisant la taille du tableau
        if (livretIndex < livrets.length - 1) {
            livrets[livretIndex] = livrets[livrets.length - 1];
        }
        livrets.pop();
    }

    // Fonction pour obtenir le nombre total de livrets de famille
    function obtenirNombreLivrets() public view returns (uint256) {
        return livrets.length;
    }

    // Fonction pour obtenir le nombre d'enfants dans un livret donné
    function obtenirNombreEnfants(uint256 livretIndex) public view returns (uint256) {
        require(livretIndex < livrets.length, "Livret introuvable");
        return enfantsParLivret[livretIndex].length;
    }

    // Fonction pour lister les livrets
    function listerLivrets() public view returns (Livret[] memory) {
        return livrets;
    }
}

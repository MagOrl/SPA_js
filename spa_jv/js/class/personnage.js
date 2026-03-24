import { ENDPOINT } from '../config.js';

class Personnage {
    constructor(nom, img, description){
        this.nom = nom;
        this.img = img;
        this.favori = false;
        this.description = description;
        this.equipement = [];
    }

    static fromJSON(data) {
        const personnage = new Personnage(data.nom, data.img, data.description);
        personnage.id = data.id;
        personnage.favori = Boolean(data.favori);
        personnage.equipement = Array.isArray(data.equipement) ? data.equipement : [];
        return personnage;
    }
}

export default class PersonnageProvider {
    static fetchPersonnage = async (limit = 10) => {
        const options = {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json'
           }
       };
       try {
           const response = await fetch(ENDPOINT, options);
           if (!response.ok) {
               throw new Error(`HTTP ${response.status}`);
           }
           const json = await response.json();
           const items = Array.isArray(json)
               ? json
               : (Array.isArray(json.data) ? json.data : []);
           return items.slice(0, limit).map((item) => Personnage.fromJSON(item));
       } catch (err) {
           console.log('Error getting documents', err);
           return [];
       }
    }

}
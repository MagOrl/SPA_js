import PersonnageProvider from "../../class/personnage.js";

export default class DetailPersonnage {
  constructor(id) {
    this.personnage = PersonnageProvider.getPersonnage(id);
  }
  

}

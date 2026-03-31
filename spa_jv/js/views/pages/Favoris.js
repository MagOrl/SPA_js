import PersonnageProvider from '../../class/personnage.js';
import { getFavoriteIds, removeFavorite } from '../../storage/favoritesStorage.js';

export default class Favoris {
  constructor() {
    this.personnages = [];
  }

  async render() {
    return `
      <section class="tf2-page">
        <header class="tf2-header">
          <h1 class="tf2-title">Mes favoris</h1>
          <nav class="tf2-nav">
            <a class="tf2-link" href="#/personnages">Liste</a>
          </nav>
        </header>

        <div id="tf2-fav-grid" class="tf2-grid"></div>
      </section>
      <style>
        .tf2-page { max-width: 1000px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif; }
        .tf2-header { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
        .tf2-title { margin: 0 0 20px; color: #d85c2a; }
        .tf2-nav { display:flex; gap: 10px; }
        .tf2-link { color:#d85c2a; text-decoration:none; border:1px solid #d85c2a; padding:6px 10px; border-radius:6px; }
        .tf2-link:hover { background:#fff2ec; }
        .tf2-grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
        .tf2-empty { color: #555; }
        .tf2-card { border: 1px solid #ddd; border-radius: 10px; padding: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
        .tf2-card__img { width:100%; height: 220px; object-fit: cover; border-radius:8px; background:#f4f4f4; }
        .tf2-card__title { margin: 10px 0 8px; }
        .tf2-card__actions { display:flex; gap: 8px; flex-wrap: wrap; }
        .tf2-btn { border:1px solid #d85c2a; background:#fff; color:#d85c2a; border-radius:6px; padding:6px 10px; cursor:pointer; }
        .tf2-btn:hover { background:#fff2ec; }
        .tf2-btn--danger { border-color:#b73d15; color:#b73d15; }
      </style>
    `;
  }

  async afterRender() {
    const favIds = getFavoriteIds();
    const grid = document.querySelector('#tf2-fav-grid');
    if (!grid) return;

    if (favIds.length === 0) {
      grid.innerHTML = `<p class="tf2-empty">Aucun favori. Retournez sur la liste et ajoutez-en.</p>`;
      return;
    }

    const all = await PersonnageProvider.fetchPersonnage(500);
    this.personnages = all.filter((p) => favIds.includes(Number(p.id)));

    if (this.personnages.length === 0) {
      grid.innerHTML = `<p class="tf2-empty">Vos favoris ne sont plus disponibles dans l'API.</p>`;
      return;
    }

    grid.innerHTML = this.personnages.map((p) => this.cardTemplate(p)).join('');

    grid.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('button[data-remove-id]');
      if (!removeBtn) return;

      const id = Number(removeBtn.dataset.removeId);
      removeFavorite(id);
      this.personnages = this.personnages.filter((x) => Number(x.id) !== id);

      if (this.personnages.length === 0) {
        grid.innerHTML = `<p class="tf2-empty">Aucun favori. Retournez sur la liste et ajoutez-en.</p>`;
        return;
      }

      grid.innerHTML = this.personnages.map((p) => this.cardTemplate(p)).join('');
    });
  }

  cardTemplate(personnage) {
    const image = personnage.img;

    return `
      <article class="tf2-card">
        <img src="${image}" alt="${personnage.nom}" class="tf2-card__img">
        <h3 class="tf2-card__title">${personnage.nom}</h3>
        <div class="tf2-card__actions">
          <a class="tf2-btn" href="#/personnages/${personnage.id}">Voir détail</a>
          <button class="tf2-btn tf2-btn--danger" data-remove-id="${personnage.id}">Retirer</button>
        </div>
      </article>
    `;
  }
}

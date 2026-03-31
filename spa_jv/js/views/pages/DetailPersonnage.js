import PersonnageProvider from "../../class/personnage.js";
import Utils from "../../Utils.js";
import { isFavorite, toggleFavorite } from "../../storage/favoritesStorage.js";
import { initLazyImages } from "../../utils/lazyLoad.js";
import { ENDPOINT } from "../../config.js";

export default class DetailPersonnage {
  constructor() {
    this.personnage = null;
    this.id = null;
  }

  async render() {
    const request = Utils.parseRequestURL();
    this.id = request.id;

    if (!this.id) {
      return `<p>Identifiant manquant.</p>`;
    }

    this.personnage = await PersonnageProvider.getPersonnage(this.id);
    if (!this.personnage || !this.personnage.id) {
      return `<p>Personnage introuvable.</p>`;
    }

    const image = this.personnage.img;

    const equipements = this.personnage.equipement;

    const rating = typeof this.personnage.note === 'number' ? this.personnage.note : 0;
    const fav = isFavorite(this.personnage.id);

    return `
      <section class="tf2-page">
        <header class="tf2-header">
          <h1 class="tf2-title">${this.escapeHtml(this.personnage.nom)}</h1>
          <nav class="tf2-nav">
            <a class="tf2-link" href="#/personnages">Liste</a>
            <a class="tf2-link" href="#/favoris">Favoris</a>
          </nav>
        </header>

        <div class="tf2-detail">
          <img data-src="${image}" alt="${this.escapeHtml(this.personnage.nom)}" class="tf2-img">

          <div class="tf2-info">
            <p class="tf2-desc">${this.escapeHtml(this.personnage.description || '')}</p>
            <p class="tf2-items"><strong>Equipement:</strong> ${this.escapeHtml(equipements)}</p>

            <div class="tf2-actions">
              <button id="tf2-fav" class="tf2-btn ${fav ? 'is-active' : ''}">
                ${fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
            </div>

            <div class="tf2-rating">
              <label for="tf2-note"><strong>Note (0-5):</strong></label>
              <select id="tf2-note" class="tf2-select">
                ${this.renderNoteOptions(rating)}
              </select>
              <button id="tf2-save" class="tf2-btn">Enregistrer</button>
              <span id="tf2-status" class="tf2-status" aria-live="polite"></span>
            </div>
          </div>
        </div>
      </section>

      <style>
        .tf2-page { max-width: 1000px; margin: 0 auto; padding: 24px; font-family: Arial, sans-serif; }
        .tf2-header { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
        .tf2-title { margin: 0 0 20px; color: #d85c2a; }
        .tf2-nav { display:flex; gap: 10px; }
        .tf2-link { color:#d85c2a; text-decoration:none; border:1px solid #d85c2a; padding:6px 10px; border-radius:6px; }
        .tf2-link:hover { background:#fff2ec; }
        .tf2-detail { display:grid; grid-template-columns: 340px 1fr; gap: 18px; align-items:start; }
        .tf2-img { width:100%; height: 340px; object-fit: cover; border-radius:10px; background:#f4f4f4; border:1px solid #eee; }
        .tf2-desc { margin: 0 0 12px; line-height: 1.5; }
        .tf2-items { margin: 0 0 12px; }
        .tf2-actions { margin: 0 0 16px; }
        .tf2-btn { border: 1px solid #d85c2a; background: #fff; color: #d85c2a; border-radius: 6px; padding: 6px 10px; cursor: pointer; }
        .tf2-btn:hover { background: #fff2ec; }
        .tf2-btn.is-active { background:#d85c2a; color:#fff; }
        .tf2-rating { display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }
        .tf2-select { padding: 6px 10px; border-radius: 6px; border:1px solid #ddd; }
        .tf2-status { color:#555; min-height: 18px; }
        @media (max-width: 800px) { .tf2-detail { grid-template-columns: 1fr; } .tf2-img { height: 260px; } }
      </style>
    `;
  }

  async afterRender() {
    initLazyImages(document);

    const favBtn = document.querySelector('#tf2-fav');
    if (favBtn && this.personnage) {
      favBtn.addEventListener('click', () => {
        const nowFav = toggleFavorite(this.personnage.id);
        favBtn.textContent = nowFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
        favBtn.classList.toggle('is-active', nowFav);
      });
    }

    const saveBtn = document.querySelector('#tf2-save');
    const noteSelect = document.querySelector('#tf2-note');
    const status = document.querySelector('#tf2-status');
    if (!saveBtn || !noteSelect || !this.personnage) return;

    saveBtn.addEventListener('click', async () => {
      const note = Number(noteSelect.value);
      if (Number.isNaN(note) || note < 0 || note > 5) {
        if (status) status.textContent = 'Note invalide.';
        return;
      }

      if (status) status.textContent = 'Enregistrement...';
      const ok = await this.saveNote(note);
      if (status) status.textContent = ok ? 'Note enregistree.' : 'Erreur lors de l\'enregistrement.';
    });
  }

  async saveNote(note) {
    try {
      const response = await fetch(`${ENDPOINT}/${this.personnage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note })
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  renderNoteOptions(current) {
    const options = [0, 1, 2, 3, 4, 5];
    return options
      .map((value) => `<option value="${value}" ${value === current ? 'selected' : ''}>${value}</option>`)
      .join('');
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}

import PersonnageProvider from '../../class/personnage.js';
import { isFavorite, toggleFavorite } from '../../storage/favoritesStorage.js';
import { initLazyImages } from '../../utils/lazyLoad.js';

export default class Home {
    constructor() {
        this.personnages = [];
        this.filtered = [];
        this.currentPage = 1;
        this.perPage = 3;
        this.search = '';
    }

    async render() {
        this.personnages = await PersonnageProvider.fetchPersonnage(100);
        this.filtered = this.personnages;

        return `
            <section class="tf2-page">
                <header class="tf2-header">
                    <h1 class="tf2-title">Personnages de Team Fortress 2</h1>
                    <nav class="tf2-nav">
                        <a class="tf2-link" href="#/favoris">Favoris</a>
                    </nav>
                </header>

                <div class="tf2-toolbar">
                    <input id="tf2-search" class="tf2-search" type="search" placeholder="Rechercher un personnage..." value="${this.escapeHtml(this.search)}">
                    <small class="tf2-hint">Recherche sur le nom + description</small>
                </div>
                <div id="tf2-grid" class="tf2-grid"></div>
                <nav id="tf2-pagination" class="tf2-pagination" aria-label="Pagination personnages"></nav>
            </section>
            <style>
                .tf2-page {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 24px;
                    font-family: Arial, sans-serif;
                }

                .tf2-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .tf2-nav { display:flex; gap: 10px; }
                .tf2-link { color:#d85c2a; text-decoration:none; border:1px solid #d85c2a; padding:6px 10px; border-radius:6px; }
                .tf2-link:hover { background:#fff2ec; }

                .tf2-title {
                    margin: 0 0 20px;
                    color: #d85c2a;
                }

                .tf2-toolbar { display:flex; flex-direction:column; gap: 6px; margin: 0 0 16px; }
                .tf2-search { padding: 10px 12px; border-radius: 8px; border:1px solid #ddd; }
                .tf2-hint { color:#666; }

                .tf2-grid {
                    display: grid;
                    gap: 16px;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                }

                .tf2-empty {
                    color: #555;
                    font-size: 1rem;
                }

                .tf2-card {
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    padding: 12px;
                    background: #fff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }

                .tf2-card__img {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 8px;
                    background: #f4f4f4;
                }

                .tf2-card__title {
                    margin: 10px 0 8px;
                }

                .tf2-card__desc,
                .tf2-card__items {
                    margin: 0 0 8px;
                    line-height: 1.4;
                }

                .tf2-card__actions { display:flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
                .tf2-btn { border: 1px solid #d85c2a; background: #fff; color: #d85c2a; border-radius: 6px; padding: 6px 10px; cursor: pointer; text-decoration:none; display:inline-block; }
                .tf2-btn:hover { background: #fff2ec; }
                .tf2-btn.is-active { background:#d85c2a; color:#fff; }

                .tf2-pagination {
                    margin-top: 20px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .tf2-page-btn {
                    border: 1px solid #d85c2a;
                    background: #fff;
                    color: #d85c2a;
                    border-radius: 6px;
                    padding: 6px 10px;
                    cursor: pointer;
                }

                .tf2-page-btn:hover {
                    background: #fff2ec;
                }

                .tf2-page-btn.is-active {
                    background: #d85c2a;
                    color: #fff;
                }

                .tf2-page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            </style>
        `;
    }

    afterRender() {
        this.renderPage();

        const searchInput = document.querySelector('#tf2-search');
        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                this.search = event.target.value || '';
                this.applySearch();
                this.currentPage = 1;
                this.renderPage();
            });
        }

        const grid = document.querySelector('#tf2-grid');
        if (grid) {
            grid.addEventListener('click', (event) => {
                const favBtn = event.target.closest('button[data-fav-id]');
                if (!favBtn) return;

                const id = Number(favBtn.dataset.favId);
                const nowFav = toggleFavorite(id);
                favBtn.textContent = nowFav ? 'Retirer des favoris' : 'Ajouter aux favoris';
                favBtn.classList.toggle('is-active', nowFav);
            });
        }

        const pagination = document.querySelector('#tf2-pagination');
        if (!pagination) {
            return;
        }

        pagination.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-page]');
            if (!button) {
                return;
            }

            const nextPage = Number(button.dataset.page);
            if (Number.isNaN(nextPage)) {
                return;
            }

            this.currentPage = nextPage;
            this.renderPage();
        });
    }

    renderPage() {
        const grid = document.querySelector('#tf2-grid');
        const pagination = document.querySelector('#tf2-pagination');
        if (!grid || !pagination) {
            return;
        }

        if (this.filtered.length === 0) {
            grid.innerHTML = '<p class="tf2-empty">Aucun personnage n\'a pu etre recupere.</p>';
            pagination.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(this.filtered.length / this.perPage);
        this.currentPage = Math.min(Math.max(this.currentPage, 1), totalPages);

        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        const currentItems = this.filtered.slice(start, end);

        grid.innerHTML = currentItems.map((personnage) => this.cardTemplate(personnage)).join('');
        initLazyImages(document);

        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';

        const numberedButtons = Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const activeClass = page === this.currentPage ? 'is-active' : '';
            return `<button class="tf2-page-btn ${activeClass}" data-page="${page}">${page}</button>`;
        }).join('');

        pagination.innerHTML = `
            <button class="tf2-page-btn" data-page="${this.currentPage - 1}" ${prevDisabled}>Precedent</button>
            ${numberedButtons}
            <button class="tf2-page-btn" data-page="${this.currentPage + 1}" ${nextDisabled}>Suivant</button>
        `;
    }

    cardTemplate(personnage) {
        const image = personnage.img;

        const equipements = personnage.equipement.length;

        return `
            <article class="tf2-card">
                <img data-src="${image}" alt="${personnage.nom}" class="tf2-card__img">
                <h3 class="tf2-card__title">${personnage.nom}</h3>
                <p class="tf2-card__desc">${personnage.description}</p>
                <p class="tf2-card__items"><strong>Equipement:</strong> ${equipements}</p>
                <div class="tf2-card__actions">
                    <a class="tf2-btn" href="#/personnages/${personnage.id}">Voir detail</a>
                    <button class="tf2-btn ${isFavorite(personnage.id) ? 'is-active' : ''}" data-fav-id="${personnage.id}">
                        ${isFavorite(personnage.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </button>
                </div>
            </article>
        `;
    }

    applySearch() {
        const q = (this.search || '').trim().toLowerCase();
        if (q.length === 0) {
            this.filtered = this.personnages;
            return;
        }
        this.filtered = this.personnages.filter((p) => {
            const name = (p.nom || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return name.includes(q) || desc.includes(q);
        });
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
import PersonnageProvider from '../../class/personnage.js';

export default class Home {
    constructor() {
        this.personnages = [];
        this.currentPage = 1;
        this.perPage = 3;
    }

    async render() {
        this.personnages = await PersonnageProvider.fetchPersonnage(100);

        return `
            <section class="tf2-page">
                <h1 class="tf2-title">Personnages de Team Fortress 2</h1>
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

                .tf2-title {
                    margin: 0 0 20px;
                    color: #d85c2a;
                }

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
                    height: 50%;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .tf2-card__title {
                    margin: 10px 0 8px;
                }

                .tf2-card__desc,
                .tf2-card__items {
                    margin: 0 0 8px;
                    line-height: 1.4;
                }

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

        if (this.personnages.length === 0) {
            grid.innerHTML = '<p class="tf2-empty">Aucun personnage n\'a pu etre recupere.</p>';
            pagination.innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(this.personnages.length / this.perPage);
        this.currentPage = Math.min(Math.max(this.currentPage, 1), totalPages);

        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        const currentItems = this.personnages.slice(start, end);

        grid.innerHTML = currentItems.map((personnage) => this.cardTemplate(personnage)).join('');

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
        const image = personnage.img && personnage.img.trim().length > 0
            ? personnage.img
            : `https://placehold.co/600x360/2f3745/ffffff?text=${encodeURIComponent(personnage.nom)}`;

        const equipements = personnage.equipement.length > 0
            ? personnage.equipement.join(', ')
            : 'Aucun equipement';

        return `
            <article class="tf2-card">
                <img src="${image}" alt="${personnage.nom}" class="tf2-card__img">
                <h3 class="tf2-card__title">${personnage.nom}</h3>
                <p class="tf2-card__desc">${personnage.description}</p>
                <p class="tf2-card__items"><strong>Equipement:</strong> ${equipements}</p>
            </article>
        `;
    }
}
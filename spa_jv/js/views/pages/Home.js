import PersonnageProvider from '../../class/personnage.js';

export default class Home {
    async render() {
        const personnages = await PersonnageProvider.fetchPersonnage();

        const cards = personnages.map((personnage) => {
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
        }).join('');

        return `
            <section class="tf2-page">
                <h1 class="tf2-title">Personnages de Team Fortress 2</h1>
                <div class="tf2-grid">
                    ${cards || '<p>Aucun personnage trouve.</p>'}
                </div>
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
            </style>
        `;
    }
}
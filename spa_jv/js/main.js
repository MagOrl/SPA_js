import Home from './views/pages/Home.js';

const mountHome = async () => {
    const app = document.querySelector('#app');
    const page = new Home();
    app.innerHTML = await page.render();
};

window.addEventListener('load', mountHome);
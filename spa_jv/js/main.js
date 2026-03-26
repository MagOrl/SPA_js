import Home from "./views/pages/Home.js";
import DetailPersonnage from "./views/pages/DetailPersonnage.js";
import Error404 from "./views/pages/Error404.js";
import Favoris from "./views/pages/Favoris.js";

import Utils from "./Utils.js";

const routes = {
  "/": Home,
  "/personnages": Home,
  "/personnages/:id": DetailPersonnage,
  "/favoris": Favoris,
};

const router = async () => {
  const content = document.querySelector("#app") || document.querySelector("#content");
  if (!content) {
    return;
  }

  let request = Utils.parseRequestURL();

  let parsedURL =
    (request.resource ? "/" + request.resource : "/") +
    (request.id ? "/:id" : "") +
    (request.verb ? "/" + request.verb : "");
  let page = routes[parsedURL] ? new routes[parsedURL]() : new Error404();

  content.innerHTML = await page.render();

  if (typeof page.afterRender === "function") {
    await page.afterRender();
  }
};

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

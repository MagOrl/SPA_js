var p=Object.defineProperty;var f=(o,e,s)=>e in o?p(o,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[e]=s;var a=(o,e,s)=>f(o,typeof e!="symbol"?e+"":e,s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const l="http://localhost:3001/personnages";class c{constructor(e,s,r){this.nom=e,this.img=s,this.favori=!1,this.description=r,this.equipement=[]}static fromJSON(e){const s=new c(e.nom,e.img,e.description);return s.id=e.id,s.favori=!!e.favori,s.equipement=Array.isArray(e.equipement)?e.equipement:[],s}}class d{}a(d,"fetchPersonnage",async(e=10)=>{const s={method:"GET",headers:{"Content-Type":"application/json"}};try{const r=await fetch(l,s);if(!r.ok)throw new Error(`HTTP ${r.status}`);const t=await r.json();return(Array.isArray(t)?t:Array.isArray(t.data)?t.data:[]).slice(0,e).map(n=>c.fromJSON(n))}catch(r){return console.log("Error getting documents",r),[]}});class m{async render(){return`
            <section class="tf2-page">
                <h1 class="tf2-title">Personnages de Team Fortress 2</h1>
                <div class="tf2-grid">
                    ${(await d.fetchPersonnage()).map(r=>{const t=r.img&&r.img.trim().length>0?r.img:`https://placehold.co/600x360/2f3745/ffffff?text=${encodeURIComponent(r.nom)}`,i=r.equipement.length>0?r.equipement.join(", "):"Aucun equipement";return`
                <article class="tf2-card">
                    <img src="${t}" alt="${r.nom}" class="tf2-card__img">
                    <h3 class="tf2-card__title">${r.nom}</h3>
                    <p class="tf2-card__desc">${r.description}</p>
                    <p class="tf2-card__items"><strong>Equipement:</strong> ${i}</p>
                </article>
            `}).join("")||"<p>Aucun personnage trouve.</p>"}
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
                    height: 180px;
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
        `}}const u=async()=>{const o=document.querySelector("#app"),e=new m;o.innerHTML=await e.render()};window.addEventListener("load",u);

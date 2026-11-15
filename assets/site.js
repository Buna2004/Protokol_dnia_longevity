/* Shared navigation, no external dependencies */
(()=>{
const links=[["index.html","Start"],["kalkulator.html","Kalkulator"],["protokol.html","Protokół dnia"],["bloodwork.html","Badania"],["trening.html","Trening"],["mito.html","MITO MORNING"]];
const current=decodeURIComponent(location.pathname.split("/").pop()||"index.html");
const header=document.querySelector("[data-site-header]");
if(header){
 header.className="topbar";
 const nav=links.map(([url,label])=>'<a href="'+url+'" '+(current===url?'class="active" aria-current="page"':'')+'>'+label+'</a>').join("");
 header.innerHTML='<div class="container inner"><a href="index.html" class="brand" aria-label="Polish Biohacker, strona główna"><span class="brand-mark" aria-hidden="true">✺</span><span>Polish <strong>Biohacker</strong></span></a><button class="menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Otwórz menu">☰ Menu</button><nav id="site-nav" class="nav" aria-label="Główna nawigacja">'+nav+'</nav></div>';
 const toggle=header.querySelector(".menu-toggle"),menu=header.querySelector(".nav");
 toggle.addEventListener("click",()=>{const opened=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",String(opened));toggle.textContent=opened?"✕ Zamknij":"☰ Menu"});
 menu.addEventListener("click",e=>{if(e.target.closest("a")){menu.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰ Menu"}});
}
const footer=document.querySelector("[data-site-footer]");
if(footer){
 footer.className="footer";
 footer.innerHTML='<div class="container footer-inner"><div><div class="brand"><span class="brand-mark" aria-hidden="true">✺</span>Polish <strong>Biohacker</strong></div><small>Siła · wydolność · rozsądnie rozumiana długowieczność</small></div><nav aria-label="Linki w stopce"><a href="index.html">Start</a><a href="kalkulator.html">Kalkulator</a><a href="bloodwork.html">Badania</a><a href="trening.html">Trening</a><a href="mito.html">MITO MORNING</a><a href="https://www.tiktok.com/@polish.biohacker" rel="noopener noreferrer" target="_blank">TikTok ↗</a></nav><small>© '+new Date().getFullYear()+' Polish Biohacker · Dokumentacja osobistych doświadczeń, nie porada medyczna.</small></div>';
}
})();
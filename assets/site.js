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
 footer.innerHTML='<div class="container footer-inner"><div class="footer-brand"><div class="brand"><span class="brand-mark" aria-hidden="true">✺</span>Polish <strong>Biohacker</strong></div><small>Siła · wydolność · rozsądnie rozumiana długowieczność</small></div><nav class="footer-nav" aria-label="Linki w stopce"><a href="index.html">Start</a><a href="kalkulator.html">Kalkulator</a><a href="bloodwork.html">Badania</a><a href="trening.html">Trening</a><a href="mito.html">MITO MORNING</a></nav><div class="footer-social" aria-label="Obserwuj Polish Biohacker w mediach społecznościowych"><a class="social-btn" href="https://www.tiktok.com/@polish.biohacker" rel="noopener noreferrer" target="_blank" aria-label="Polish Biohacker na TikTok — otwórz w nowej karcie"><span class="social-symbol" aria-hidden="true">♪</span> TikTok ↗</a><a class="social-btn" href="https://youtube.com/@polishbiohacker?si=2X02I8zV_Ec69krV" rel="noopener noreferrer" target="_blank" aria-label="Polish Biohacker na YouTube — otwórz w nowej karcie"><span class="social-symbol" aria-hidden="true">▶</span> YouTube ↗</a><a class="social-btn" href="https://www.instagram.com/polish.biohacker?exln=MTFicWU2cDJnY3l4NA==" rel="noopener noreferrer" target="_blank" aria-label="Polish Biohacker na Instagramie — otwórz w nowej karcie"><span class="social-symbol" aria-hidden="true">◎</span> Instagram ↗</a><a class="social-btn" href="https://www.facebook.com/share/1CM55Tcjbv/" rel="noopener noreferrer" target="_blank" aria-label="Polish Biohacker na Facebooku — otwórz w nowej karcie"><span class="social-symbol" aria-hidden="true">f</span> Facebook ↗</a></div><small class="footer-disclaimer">© '+new Date().getFullYear()+' Polish Biohacker · Dokumentacja osobistych doświadczeń, nie porada medyczna.</small></div>';
}
})();
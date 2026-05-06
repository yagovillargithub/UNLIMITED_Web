// UNLIMITED — shared interactions

// ─── Scroll reveals ──────────────────────────────────────────────
function initReveals(){
  document.documentElement.classList.add("reveal-ready");
  const els = document.querySelectorAll("[data-reveal]");
  // Split text into chars for char-reveal
  els.forEach(el => {
    if (el.dataset.reveal === "char" && !el.dataset.split){
      const txt = el.textContent;
      el.textContent = "";
      [...txt].forEach((c,i)=>{
        const sp = document.createElement("span");
        sp.className = "ch";
        sp.style.transitionDelay = (i*0.018)+"s";
        sp.textContent = c === " " ? "\u00A0" : c;
        el.appendChild(sp);
      });
      el.dataset.split = "1";
    }
  });
  const io = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add("is-in");
        // do not unobserve — replays if scrolled back is too jumpy; keep observed but only add class
        io.unobserve(e.target);
      }
    });
  }, {threshold: .12, rootMargin: "0px 0px -8% 0px"});
  els.forEach(el=>io.observe(el));
}

// ─── Cursor blob ────────────────────────────────────────────────
function initCursor(){
  if (matchMedia("(pointer:coarse)").matches) return;
  const blob = document.createElement("div");
  blob.className = "cursor-blob";
  document.body.appendChild(blob);
  let tx=0,ty=0,cx=0,cy=0,visible=false;
  window.addEventListener("mousemove",(e)=>{
    tx=e.clientX; ty=e.clientY;
    if(!visible){blob.style.opacity=1; visible=true}
  });
  window.addEventListener("mouseleave",()=>{blob.style.opacity=0; visible=false});
  function loop(){
    cx += (tx-cx)*.08; cy += (ty-cy)*.08;
    blob.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}

// ─── Active nav link ───────────────────────────────────────────
function initNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a[data-page]").forEach(a=>{
    if (a.dataset.page === path.replace(".html","")) a.classList.add("active");
  });
}

// ─── Tweaks listener — applies tweak state to <html> attrs ─────
// Reads localStorage so settings persist across pages.
function applyTweakState(state){
  const html = document.documentElement;
  if (state.palette) html.setAttribute("data-palette", state.palette);
  if (state.font)    html.setAttribute("data-font", state.font);
  if (typeof state.dark === "boolean") html.setAttribute("data-theme", state.dark ? "dark" : "light");
  if (state.heroVariant) html.setAttribute("data-hero", state.heroVariant);
}
function loadTweaks(){
  try{
    const s = JSON.parse(localStorage.getItem("unlimited.tweaks") || "{}");
    applyTweakState(s);
  }catch(e){}
}
function saveTweaks(state){
  try{ localStorage.setItem("unlimited.tweaks", JSON.stringify(state)); }catch(e){}
}
window.UNL = { applyTweakState, loadTweaks, saveTweaks };

// ─── Marquee duplicator ────────────────────────────────────────
function initMarquee(){
  document.querySelectorAll(".marquee__track").forEach(t=>{
    if (t.dataset.dup) return;
    t.dataset.dup = "1";
    t.appendChild(t.cloneNode(true).firstElementChild ? t.cloneNode(true) : t);
    // simpler: append clones of children
    const inner = t.innerHTML;
    t.innerHTML = inner + inner;
  });
}

// ─── Init ──────────────────────────────────────────────────────
loadTweaks();
document.addEventListener("DOMContentLoaded", ()=>{
  initNav();
  initReveals();
  initCursor();
  initMarquee();
});

// Landing-specific interactions

// ─── Services: card swap by which service is in viewport ───
function initServicesSticky(){
  const items = document.querySelectorAll(".srv");
  const cards = document.querySelectorAll(".srv-card");
  if (!items.length || !cards.length) return;
  const setActive = (i)=>{
    cards.forEach(c=>c.classList.toggle("active", +c.dataset.card === i));
  };
  const io = new IntersectionObserver((ents)=>{
    // pick the entry closest to the upper-mid of viewport
    let best = null, bestDist = Infinity;
    ents.forEach(e=>{
      if (!e.isIntersecting) return;
      const r = e.target.getBoundingClientRect();
      const mid = window.innerHeight * .4;
      const d = Math.abs(r.top + r.height/2 - mid);
      if (d < bestDist){ bestDist = d; best = e.target; }
    });
    if (best) setActive(+best.dataset.srv);
  }, { threshold:[.3,.6], rootMargin:"-20% 0px -30% 0px" });
  items.forEach(i=>io.observe(i));

  // also handle scroll directly to keep card snapped
  const onScroll = ()=>{
    const mid = window.innerHeight * .42;
    let best = null, bestDist = Infinity;
    items.forEach(it=>{
      const r = it.getBoundingClientRect();
      const d = Math.abs(r.top + r.height/2 - mid);
      if (d < bestDist){ bestDist = d; best = it; }
    });
    if (best) setActive(+best.dataset.srv);
  };
  window.addEventListener("scroll", onScroll, { passive:true });
}

// ─── Process tabs ───
function initProcessTabs(){
  const tabs = document.querySelectorAll(".process-tab");
  const panels = document.querySelectorAll(".process-panel");
  let auto = setInterval(()=>{
    const cur = +document.querySelector(".process-tab.active").dataset.tab;
    activate((cur+1) % tabs.length);
  }, 5000);
  function activate(i){
    tabs.forEach(t=>t.classList.toggle("active", +t.dataset.tab === i));
    panels.forEach(p=>p.classList.toggle("active", +p.dataset.panel === i));
  }
  tabs.forEach(t=>{
    t.addEventListener("click", ()=>{
      clearInterval(auto);
      activate(+t.dataset.tab);
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initServicesSticky();
  initProcessTabs();
});

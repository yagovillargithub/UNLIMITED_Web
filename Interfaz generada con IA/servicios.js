// Servicios page — hover/click swaps detail card

document.addEventListener("DOMContentLoaded", ()=>{
  const rows = document.querySelectorAll(".srv-row");
  const cards = document.querySelectorAll(".srv-detail-card");
  if (!rows.length) return;

  function activate(i){
    rows.forEach(r=>r.classList.toggle("active", +r.dataset.srv === i));
    cards.forEach(c=>c.classList.toggle("active", +c.dataset.detail === i));
  }
  // start with first
  activate(0);

  rows.forEach(r=>{
    r.addEventListener("mouseenter", ()=>activate(+r.dataset.srv));
    r.addEventListener("click", ()=>activate(+r.dataset.srv));
  });
});

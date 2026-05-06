// Contacto page — form validation + chip selection + progress

document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("ctForm");
  if (!form) return;

  // Chip groups
  document.querySelectorAll(".ct-chips").forEach(group=>{
    const multi = group.dataset.multi !== undefined;
    const radio = group.dataset.radio !== undefined;
    const hidden = group.parentElement.querySelector("input[type=hidden]");
    group.querySelectorAll(".ct-chip").forEach(chip=>{
      chip.addEventListener("click", ()=>{
        if (multi){
          chip.classList.toggle("active");
        } else if (radio){
          group.querySelectorAll(".ct-chip").forEach(c=>c.classList.toggle("active", c===chip));
        }
        if (hidden){
          const vals = [...group.querySelectorAll(".ct-chip.active")].map(c=>c.dataset.val);
          hidden.value = vals.join(", ");
          updateProgress();
        }
      });
    });
  });

  // Char count
  const msg = document.getElementById("ctMessage");
  const cnt = document.getElementById("ctCount");
  msg.addEventListener("input", ()=>{
    cnt.textContent = msg.value.length;
    if (msg.value.length > 1000){
      msg.value = msg.value.slice(0,1000);
      cnt.textContent = 1000;
    }
    updateProgress();
  });

  // Live validation + progress
  const required = ["ctName","ctEmail","ctCompany","ctMessage","ctInterest"];
  function isFilled(id){
    const el = document.getElementById(id);
    if (id === "ctEmail") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    return (el.value || "").trim().length > 0;
  }
  function updateProgress(){
    const n = required.filter(isFilled).length;
    document.getElementById("ctProgressN").textContent = n;
    document.querySelector(".ct-progress-bar").style.setProperty("--p", (n/5*100)+"%");
  }
  ["ctName","ctEmail","ctCompany","ctMessage"].forEach(id=>{
    document.getElementById(id).addEventListener("input", ()=>{
      // clear error on edit
      document.getElementById(id).closest(".ct-field").classList.remove("has-error");
      updateProgress();
    });
    document.getElementById(id).addEventListener("blur", ()=>validate(id));
  });

  function validate(id){
    const el = document.getElementById(id);
    const field = el.closest(".ct-field");
    const errEl = field.querySelector(".ct-err");
    let err = "";
    const v = (el.value||"").trim();
    if (!v){ err = "Este campo es necesario."; }
    else if (id === "ctEmail" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ err = "Email no válido."; }
    else if (id === "ctMessage" && v.length < 20){ err = "Cuéntenos un poco más (mín. 20 caracteres)."; }
    if (err){
      field.classList.add("has-error");
      errEl.textContent = err;
      return false;
    } else {
      field.classList.remove("has-error");
      errEl.textContent = "";
      return true;
    }
  }

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const ok = ["ctName","ctEmail","ctCompany","ctMessage"].map(validate).every(Boolean);
    const interest = document.getElementById("ctInterest").value;
    if (!interest){
      const f = document.getElementById("ctInterest").closest(".ct-field");
      f.classList.add("has-error");
      f.querySelector(".ct-err").textContent = "Seleccione al menos una opción.";
      return;
    }
    if (!ok) return;

    // submit animation
    const btn = document.getElementById("ctSubmit");
    btn.disabled = true;
    btn.innerHTML = "Enviando…";
    setTimeout(()=>{
      form.style.transition = "opacity .4s, transform .4s";
      form.style.opacity = 0;
      form.style.transform = "translateY(-12px)";
      setTimeout(()=>{
        form.hidden = true;
        const success = document.getElementById("ctSuccess");
        success.hidden = false;
        document.getElementById("ctRef").textContent = "UNL-" + Math.floor(Math.random()*9000+1000);
      }, 400);
    }, 700);
  });

  updateProgress();
});

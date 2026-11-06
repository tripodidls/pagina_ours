/* =========================================================
   CONFIGURACIÓN — cambiá estos datos por los tuyos
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp con código de país, sin "+", espacios ni guiones.
  // Ejemplo Argentina: 54 9 11 1234 5678  ->  "5491112345678"
  whatsapp: "5491100000000",
  // Mensaje que aparece al tocar el botón flotante de WhatsApp
  mensajeInicial: "¡Hola! Vi su página web y quiero consultar por sus servicios.",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Enlaces de WhatsApp ---------- */
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = waLink(CONFIG.mensajeInicial);
});

/* ---------- Año del pie de página ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const header = document.querySelector(".header");
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");

const setMenu = (open) => {
  menu.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

/* ---------- Botones de servicios: marcan esa opción en el formulario ---------- */
const form = document.getElementById("contact-form");
const error = document.getElementById("form-error");

document.querySelectorAll("[data-service]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const box = form.querySelector(`input[name="servicios"][value="${btn.dataset.service}"]`);
    if (box) box.checked = true;
  })
);

/* ---------- Formulario -> mensaje de WhatsApp ---------- */
const checked = (name) =>
  [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = form.nombre.value.trim();
  const negocio = form.negocio.value.trim();
  const servicios = checked("servicios");
  const actual = checked("actual");
  const plazo = form.plazo.value;
  const mensaje = form.mensaje.value.trim();

  form.nombre.classList.toggle("invalid", !nombre);
  form.querySelector(".chips-field").classList.toggle("invalid", !servicios.length);

  if (!nombre || !servicios.length) {
    error.hidden = false;
    return;
  }
  error.hidden = true;

  const lineas = [
    `¡Hola! Soy ${nombre} y quiero pedir un presupuesto personalizado.`,
    negocio && `• Mi emprendimiento: ${negocio}`,
    `• Estoy buscando: ${servicios.join(", ")}`,
    actual.length && `• Hoy tengo: ${actual.join(", ")}`,
    plazo && `• Lo necesito: ${plazo}`,
    mensaje && `\n${mensaje}`,
  ].filter(Boolean);

  window.open(waLink(lineas.join("\n")), "_blank", "noopener");
});

/* =========================================================
   EFECTOS AL DESLIZAR
   ========================================================= */
const hero = document.querySelector(".hero");
const progress = document.querySelector(".progress");
const parallaxEls = [...document.querySelectorAll("[data-parallax]")];

// Guarda la posición original de cada elemento con parallax
const measureParallax = () => {
  parallaxEls.forEach((el) => {
    el.style.translate = "";
    const r = el.getBoundingClientRect();
    el._top = r.top + window.scrollY;
    el._h = r.height;
  });
};

let ticking = false;
const onScroll = () => {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;

  header.classList.toggle("scrolled", y > 40);

  const max = document.documentElement.scrollHeight - vh;
  progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);

  if (reduceMotion) return;

  // Portada: --p va de 0 (arriba) a 1 (cuando la portada salió de la pantalla)
  const p = Math.min(Math.max(y / hero.offsetHeight, 0), 1);
  hero.style.setProperty("--p", p.toFixed(4));

  // Imágenes de los servicios: se desplazan suavemente a otra velocidad
  parallaxEls.forEach((el) => {
    const offset = el._top + el._h / 2 - (y + vh / 2);
    if (Math.abs(offset) > vh * 1.5) return;
    el.style.translate = `0 ${(-offset * parseFloat(el.dataset.parallax)).toFixed(1)}px`;
  });
};
const requestScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
};
window.addEventListener("scroll", requestScroll, { passive: true });

/* ---------- Cinta en movimiento (se acelera al deslizar) ---------- */
const track = document.querySelector(".marquee-track");
const group = track.querySelector(".marquee-group");
track.append(group.cloneNode(true), group.cloneNode(true));
let groupWidth = 0;
const measureMarquee = () => { groupWidth = group.offsetWidth; };

if (!reduceMotion) {
  const loop = (t) => {
    if (groupWidth) {
      const offset = (t * 0.04 + window.scrollY * 0.35) % groupWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* =========================================================
   LLUVIA DE IDEAS — líneas que conectan cada idea con el centro
   ========================================================= */
const mindmap = document.querySelector(".mindmap");
const linesSvg = mindmap.querySelector(".mindmap-lines");
const centerNode = mindmap.querySelector(".node-center");
const ideaNodes = [...mindmap.querySelectorAll("a.node")];
const SVG_NS = "http://www.w3.org/2000/svg";

const drawLines = () => {
  const w = mindmap.clientWidth;
  const h = mindmap.clientHeight;
  linesSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  linesSvg.replaceChildren();

  const cx = centerNode.offsetLeft;
  const cy = centerNode.offsetTop;

  ideaNodes.forEach((node, i) => {
    const x = node.offsetLeft;
    const y = node.offsetTop;
    // Curva suave entre el centro y la idea
    const bend = (i % 2 ? 1 : -1) * 0.18;
    const qx = (cx + x) / 2 - (y - cy) * bend;
    const qy = (cy + y) / 2 + (x - cx) * bend;

    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", `M${cx},${cy} Q${qx.toFixed(1)},${qy.toFixed(1)} ${x},${y}`);
    linesSvg.appendChild(path);
    path.style.setProperty("--len", path.getTotalLength().toFixed(1));
    node._line = path;
  });
};

ideaNodes.forEach((node) => {
  const on = () => node._line?.classList.add("active");
  const off = () => node._line?.classList.remove("active");
  node.addEventListener("mouseenter", on);
  node.addEventListener("mouseleave", off);
  node.addEventListener("focus", on);
  node.addEventListener("blur", off);
});

/* ---------- Animaciones de aparición ---------- */
const revealTargets = document.querySelectorAll(
  ".section-label, .section-head, .service-text, .custom-intro, .custom-card, .steps li, .faq details, .contact-info, .contact-form, .cta-inner"
);

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(entry.target === mindmap ? "in-view" : "visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
  io.observe(mindmap);
} else {
  mindmap.classList.add("in-view");
}

/* ---------- Medidas iniciales y al cambiar el tamaño de pantalla ---------- */
const measureAll = () => {
  measureParallax();
  measureMarquee();
  drawLines();
  onScroll();
};
window.addEventListener("resize", measureAll);
window.addEventListener("load", measureAll);
document.fonts?.ready.then(measureAll);
measureAll();

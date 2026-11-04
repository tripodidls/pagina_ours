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

/* ---------- Enlaces de WhatsApp ---------- */
const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

document.querySelectorAll(".js-whatsapp").forEach((a) => {
  a.href = waLink(CONFIG.mensajeInicial);
});

/* ---------- Año del pie de página ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  })
);

/* ---------- Sombra del encabezado al hacer scroll ---------- */
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Botones de paquetes: preseleccionan el servicio ---------- */
const select = document.getElementById("servicio");
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    select.value = `Paquete ${btn.dataset.plan}`;
  })
);

/* ---------- Formulario -> mensaje de WhatsApp ---------- */
const form = document.getElementById("contact-form");
const error = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const nombre = (data.nombre || "").trim();
  const servicio = data.servicio || "";

  form.nombre.classList.toggle("invalid", !nombre);
  form.servicio.classList.toggle("invalid", !servicio);

  if (!nombre || !servicio) {
    error.hidden = false;
    return;
  }
  error.hidden = true;

  const lineas = [
    `¡Hola! Soy ${nombre}.`,
    data.negocio?.trim() && `Mi emprendimiento/empresa: ${data.negocio.trim()}.`,
    `Me interesa: ${servicio}.`,
    data.mensaje?.trim() && `\n${data.mensaje.trim()}`,
  ].filter(Boolean);

  window.open(waLink(lineas.join("\n")), "_blank", "noopener");
});

/* ---------- Animación de aparición al hacer scroll ---------- */
const revealTargets = document.querySelectorAll(
  ".section-head, .card, .plan, .steps li, .faq details, .contact-info, .contact-form"
);

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
}

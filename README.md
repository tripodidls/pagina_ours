# Estudio Nova — Sitio web

Página web de servicios: creación de páginas web, contenido para redes (imágenes y reels para Instagram) e identidad de marca.

Sitio estático (HTML + CSS + JavaScript), sin dependencias: se publica gratis con **GitHub Pages**.

## Estructura

```
index.html        → contenido de la página (textos, secciones)
css/styles.css    → diseño y colores
js/main.js        → número de WhatsApp, menú móvil y formulario
assets/favicon.svg→ ícono de la pestaña del navegador
assets/img/       → ilustraciones de cada servicio
```

## Qué personalizar

| Qué | Dónde |
|---|---|
| Nombre de la marca ("Estudio Nova") | `index.html` (buscar y reemplazar) |
| Número de WhatsApp | `js/main.js` → `CONFIG.whatsapp` |
| Email e Instagram | `index.html`, sección `#contacto` |
| Colores | `css/styles.css` → variables en `:root` |
| Precios de los paquetes | `index.html`, sección `#paquetes` (`plan-price`) |
| Imágenes de cada servicio | Reemplazá `assets/img/web.svg`, `redes.svg` y `marca.svg` por tus fotos (por ejemplo `web.jpg`) y cambiá el nombre en `index.html` |

## Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub (por ejemplo `mi-sitio`).
2. Subí estos archivos a la rama `main`.
3. En el repositorio: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / carpeta **/(root)** → **Save**
4. En 1–2 minutos el sitio queda online en `https://TU-USUARIO.github.io/mi-sitio/`.

> Si el repositorio se llama `TU-USUARIO.github.io`, el sitio queda en `https://TU-USUARIO.github.io/`.

### Dominio propio (opcional)

En **Settings → Pages → Custom domain** escribí tu dominio (ej. `www.tumarca.com`) y configurá en tu proveedor de dominio un registro **CNAME** apuntando a `TU-USUARIO.github.io`.

## Ver el sitio en tu computadora

Abrí `index.html` con doble clic, o desde la carpeta del proyecto:

```bash
python3 -m http.server 8000
```

y entrá a http://localhost:8000

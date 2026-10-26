# DDR-KF-019 · Sitio de documentación con Vite, React y GitHub Pages

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (hito H7).

## Contexto

H7 pide un sitio de documentación publicado. La documentación ya existe como Markdown generado desde el código (`docs/components/*.md`), las decisiones (`docs/decisions/*.md`) y los ejemplos que corren en el playground. Faltaba mostrarlos juntos, con los ejemplos funcionando.

## Decisión

- **Una sola cadena de herramientas.** El sitio es una aplicación de Vite y React dentro del repositorio (`site/`, configuración en `vite.site.config.ts`). Usa los propios componentes de Kafka: `NavMenu`, `ThemeToggle`, `Prose` y los ejemplos reales. El sitio es la primera demostración del sistema.
- **El Markdown sigue siendo la fuente.** `scripts/site/data.mjs` lo convierte a HTML al compilar; no se escribe ningún archivo generado. Los enlaces relativos entre páginas pasan a rutas del sitio y los que apuntan al repositorio van a GitHub. Una prueba (`tests/site-data.mjs`) comprueba que ningún enlace queda roto.
- **Ejemplos vivos.** Cada ejemplo de una página de componente corre encima del código que lo imprime.
- **Rutas con `#`** (`#/components/chip`): GitHub Pages no necesita reglas de servidor y los enlaces profundos funcionan.
- **GitHub Pages**, con la acción `pages.yml`, que publica cuando `main` cambia o a mano. Hasta fusionar la rama de trabajo, el sitio solo se compila y se prueba en CI.
- **Calidad medida.** `pnpm run test:site` recorre las 70 páginas de componentes en un navegador real, comprueba foco, tema y teclado, pasa axe-core en dos tamaños y dos temas, y falla si la página se desborda en 390 px o pide algo fuera de su origen.
- **Idioma.** La interfaz del sitio va en español; la documentación de cada componente sigue en inglés (generada desde el código).

## Alternativas descartadas

- **Astro o Docusaurus:** más cómodos para texto, pero añaden otra cadena de herramientas y los ejemplos tendrían que montarse dos veces.
- **Vercel o Netlify:** vistas previas por rama, a cambio de una cuenta más y de depender de otro servicio. Se puede revisar si el sitio crece.

## Consecuencias

- Cualquier cambio en un componente, un ejemplo o una decisión llega al sitio sin tocar nada más.
- **Literata autoalojada** en el sitio (variable, con tamaño óptico, subconjuntos latino y latino extendido; licencia OFL en `site/fonts/`). El sitio no pide nada a terceros. En H8 falta llevarla a la librería y a la impresión.
- **Carga por página.** La primera carga trae solo el esqueleto (≈120 kB comprimidos); el contenido y los ejemplos de cada página llegan cuando se abre. `tests/site-size.mjs` fija el presupuesto.
- **Buscador** en la cabecera, hecho con el `Combobox` de Kafka: busca componentes (con su familia), decisiones y páginas, ignora tildes y se enfoca con `/`.
- Los ejemplos usan rutas como `/portada.svg`; bajo `/kafka-ds/` el sitio las prefija al crear cada elemento (`site/jsx-runtime.ts`, solo para el sitio).

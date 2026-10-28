# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Los paquetes `@kafka-ds/*` comparten versión y siguen [versionado semántico](https://semver.org/lang/es/).

## [Sin publicar]

## [1.0.0] · 27 oct 2026

Primera versión publicada en npm.

### Paquetes

- `@kafka-ds/tokens`: 1129 tokens en tres capas (primitivos, semánticos y de componente) en CSS, JSON y TypeScript, con Literata autoalojada y el módulo de impresión.
- `@kafka-ds/react`: 70 componentes de React 19 y Tailwind v4, accesibles (WCAG 2.2 AA) y construidos solo con tokens.
- `@kafka-ds/theme-altazor`: tema Altazor, solo CSS, construido sobre Kafka.

### Qué incluye

- **Componentes** de lectura, interfaz esencial, navegación y capas, y retroalimentación y superficies, con textos en español e inglés.
- **Tipografía de lectura:** Literata variable (OFL) incluida en los paquetes; ninguna página la pide a un tercero.
- **Impresión:** plantillas de libro, revista y ficha, con páginas A5, A4 y Carta sobre una rejilla de 3,5 pt.
- **Temas:** claro, oscuro y sistema; un tema se aplica con `data-kafka-theme`.
- **Accesibilidad verificada:** contraste de lectura 7:1, teclado y ARIA en navegador real, axe-core sin violaciones y lectura del árbol de accesibilidad (la que consumen NVDA, JAWS y VoiceOver) en los 70 componentes.
- **Documentación:** sitio con ejemplos en vivo y una página por componente, y la guía de [primeros pasos](docs/getting-started.md).
- **Publicación:** con trusted publishing (OIDC) y procedencia, desde `.github/workflows/release.yml`.

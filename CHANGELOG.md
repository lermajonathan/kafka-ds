# Registro de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Kafka no se publica en npm hasta la 1.0.0.

## [Sin publicar]

### H0 · Cimientos (21 oct 2026)
- **Tokens**: de 184 a 313. Nuevos: estados (`bg.hover`, `bg.active`, `bg.sunken-hover/active`, `bg.brand-hover/active`), enlaces (`fg.link-hover`, `fg.link-visited`), `selection` y `highlight`, capas (`layer.*`), movimiento (`motion.*`), `opacity.disabled`, breakpoints, `layout.*`, pesos y espaciado de letra como primitivos, y los roles de lectura `quote`, `footnote` y `dropcap`.
- **Módulo de impresión**: primitivos `physical.*` (páginas A5, A4 y Carta, sangrado, márgenes, tipografía en puntos, rejilla de 3,5 pt) y semánticos `print.*` para libro, revista y ficha.
- **Componentes de tokens**: estados hover, activo y deshabilitado en botón y chip. Ya no leen colores, sombras ni movimiento primitivos.
- **Cambio**: el degradado `gradient.vip` pasó de primitivos a semánticos; los colores de la tarjeta VIP son ahora `color.vip.*`.
- **Compilador**: soporta `fontStyle` en tipografía y alias entre tokens de tipografía.
- **Pruebas**: contraste de 87 a 129 pares; nueva `test:structure` (reglas de capas, escalas, rejilla de impresión y modos); `test:lint` comprueba que el lint detecta hex, `rgb()` y dimensiones mágicas.
- **Gobierno**: README, CONTRIBUTING, GOVERNANCE, SECURITY, CODE_OF_CONDUCT y política de deprecación.
- **Decisiones**: DDR-KF-004 (alcance), 005 (impresión) y 006 (cimientos de tokens).

### Antes de H0
- Tokens v0.1 (184), compilador, pruebas de contraste, CI y DDR-KF-001 a 003.

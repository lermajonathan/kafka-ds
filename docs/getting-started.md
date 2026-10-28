# Primeros pasos

Kafka es un sistema de diseño para la literatura en pantalla: tipografía de lectura primero, interfaz accesible después. Tiene tres piezas que se pueden usar por separado: los **tokens** (variables CSS), los **componentes** de React y el **módulo de impresión**.

> **Estado: 1.0.0.** Los paquetes `@kafka-ds/tokens`, `@kafka-ds/react` y `@kafka-ds/theme-altazor` están en npm. También puedes usar Kafka desde el repositorio, como se explica abajo.

## 1. Pruébalo

Necesitas Node 22 o superior y pnpm 10.

```bash
git clone https://github.com/lermajonathan/kafka-ds.git
cd kafka-ds
pnpm install
pnpm dev
```

`pnpm dev` abre un playground con todos los ejemplos. Añade `?theme=dark` para ver el modo oscuro y `?only=chip` para ver un solo componente.

## 2. Usa los tokens

Los tokens salen como variables CSS con el prefijo `--kafka-`. Usa siempre los semánticos (`bg`, `fg`, `border`…): se adaptan solos al modo claro y al oscuro.

```css
.mi-tarjeta {
  background: var(--kafka-color-bg-surface);
  color: var(--kafka-color-fg-default);
  border-radius: var(--kafka-radius-card);
  box-shadow: var(--kafka-elevation-card);
}
```

El modo oscuro sigue al sistema. Para forzarlo, `<html data-theme="dark">`; para forzar el claro, `data-theme="light"`.

## 3. Usa los componentes

Envuelve la aplicación en `KafkaProvider` (textos de la interfaz) y en `ThemeProvider` (modo claro, oscuro o sistema). Pon `themeInitScript()` en el `<head>` para que la primera pintura ya tenga el tema correcto.

```tsx
import { KafkaProvider, ThemeProvider, ThemeToggle, Button, labelsEs } from '@kafka-ds/react'

export function App() {
  return (
    <KafkaProvider labels={labelsEs}>
      <ThemeProvider>
        <ThemeToggle />
        <Button>Inscribirme</Button>
      </ThemeProvider>
    </KafkaProvider>
  )
}
```

Cada componente tiene su página con cuándo usarlo, ejemplos que funcionan, propiedades, accesibilidad, contenido y tokens.

## 4. Reglas que conviene conocer

- **Tres niveles de tokens.** Los componentes solo leen tokens semánticos, nunca primitivos.
- **Contraste.** Texto de lectura a 7:1, interfaz a 4,5:1 y elementos no textuales a 3:1, en claro y en oscuro.
- **El oro no es texto.** Sobre papel mide 1,98:1: va como superficie con texto de tinta, o como texto sobre tinta.
- **Enlaces subrayados.** El color solo nunca distingue un enlace.
- **Objetivo táctil de 44 px** en los controles principales.

## Siguientes pasos

- Explora los [componentes](components/README.md), agrupados por familia.
- Consulta la [referencia de tokens](tokens.md).
- Lee las [decisiones de diseño](decisions/DDR-KF-004-alcance-v1.md), empezando por el alcance de la 1.0.
- Mira el [roadmap](roadmap.md) para saber qué falta.

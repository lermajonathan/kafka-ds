# @kafka-ds/react

Componentes React de [Kafka](https://github.com/lermajonathan/kafka-ds), el sistema de diseño para la literatura en pantalla. Accesibles (WCAG 2.2 AA), manejados por tokens y con modo oscuro.

```bash
npm install @kafka-ds/react react react-dom
```

```tsx
import '@kafka-ds/react/styles.css'            // sin Tailwind
import { Button, KafkaProvider, labelsEs } from '@kafka-ds/react'

<KafkaProvider labels={labelsEs}>
  <Button>Inscribirme</Button>
</KafkaProvider>
```

¿Ya usas Tailwind v4? En tu hoja de estilos, después de `@import "tailwindcss";`:

```css
@import '@kafka-ds/react/tailwind.css';
```

Los íconos son una selección de [Phosphor](https://phosphoricons.com) (1.000+ íconos); cualquier ícono de Phosphor funciona donde un componente recibe `Icon`.

MIT © Jonathan Lerma.

# DDR-KF-016 · Tooltip con flecha, cuatro lados y valores truncados con tooltip

- **Estado:** aceptada · 2026-10-26
- **Decide:** Jonathan Lerma (revisión visual de Figma, corte C4).

## Contexto

El Tooltip no mostraba de dónde viene la información y solo se podía poner arriba o abajo. El DateRangePicker, con un rango largo en un campo estrecho, partía el texto en dos líneas y hacía crecer el campo. En Figma el Calendar y el RangeCalendar tenían el título del mes pegado a las letras de los días porque faltaba la fila de cabecera real (anterior / mes / siguiente, de 44 px).

## Decisión

- **Tooltip:** lleva una flecha (cuadrado girado 45° del color del tooltip, token `tooltip.arrow-size`) que apunta al centro del control en `top`, `bottom`, `left` y `right`. Si no hay espacio, se voltea al lado opuesto y la flecha lo sigue (`data-side` en el panel). La separación sube a 12 px (`tooltip.offset`) para que la flecha no toque el control.
- **Tooltip sin texto:** un `content` vacío apaga el tooltip sin cambiar el marcado (así se puede activar solo cuando hace falta).
- **DateRangePicker:** el valor ocupa siempre una línea y se corta con puntos suspensivos; solo cuando se corta, un tooltip muestra el texto completo al pasar el puntero y al enfocar con teclado. El nombre accesible siempre lleva el valor completo.
- **Calendar y RangeCalendar (Figma):** la cabecera es la del componente: botón anterior, mes, botón siguiente (44 px).

## Alternativas descartadas

- **Atributo `title`:** no aparece al enfocar con teclado y no se puede estilizar.
- **Reducir la fuente del valor:** el texto seguiría desbordándose en campos más estrechos.

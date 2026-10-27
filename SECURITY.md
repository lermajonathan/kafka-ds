# Seguridad

Kafka son tokens, hojas de estilo y componentes de interfaz; no procesa datos de usuarios ni tiene servidor. Aun así, un componente puede introducir un problema (por ejemplo, XSS en un componente que renderiza HTML) o una dependencia puede tener una vulnerabilidad.

## Cómo reportar

No abras una *issue* pública. Usa **Security → Report a vulnerability** en [github.com/lermajonathan/kafka-ds](https://github.com/lermajonathan/kafka-ds/security/advisories/new). Incluye qué componente o archivo afecta, los pasos para reproducirlo y el impacto que ves.

## Qué esperar

- Acuse de recibo en 5 días hábiles.
- Una evaluación y un plan en 15 días hábiles.
- Crédito en el CHANGELOG si lo deseas.

Solo se corrige la versión más reciente mientras Kafka esté en 1.x.

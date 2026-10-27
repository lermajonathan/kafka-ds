# Gobernanza

Kafka es **código abierto con un mantenedor**. Cualquiera puede usarlo, copiarlo y proponer cambios; las decisiones las toma su autor, Jonathan Lerma ([@lermajonathan](https://github.com/lermajonathan)).

## Quién decide

- **Todo lo que se implementa o se rechaza lo aprueba el mantenedor.** Una propuesta sin respuesta no equivale a un sí.
- Las decisiones de diseño relevantes quedan escritas como DDR en [`docs/decisions/`](docs/decisions), con su motivo y sus consecuencias.
- Las decisiones se pueden revisar con una nueva DDR que reemplaza a la anterior; no se borran.

## Qué se acepta

Un cambio entra si resuelve un problema real, cumple los criterios de «completo» de [DDR-KF-004](docs/decisions/DDR-KF-004-alcance-v1.md) y no rompe el uso existente sin pasar por la [política de deprecación](docs/deprecation.md).

Kafka **no incluye** visualización de datos (eso es de [Pance](https://github.com/lermajonathan/pance-ds)) ni componentes específicos de un solo cliente: el tema de Altazor se construye sobre Kafka, no dentro de él: vive en su propio paquete (`@kafka/theme-altazor`), solo con tokens de tema (sobrescrituras semánticas y de componente, nunca primitivos ni tipografía) y sin logotipos, fotografías ni ilustraciones.

## Versiones

[Versionado semántico](https://semver.org/lang/es/). Hasta la 1.0.0 no se publica en npm. Los cambios se registran en [CHANGELOG.md](CHANGELOG.md).

## Conducta

Se aplica el [Código de conducta](CODE_OF_CONDUCT.md). Los problemas de seguridad se reportan según [SECURITY.md](SECURITY.md).

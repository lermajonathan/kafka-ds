/** Family names come from the English documentation index; the site's own navigation speaks Spanish. */
const FAMILY_ES: Record<string, string> = { Actions: 'Acciones', 'Data display': 'Datos', Forms: 'Formularios', Navigation: 'Navegación', Overlays: 'Capas', Reading: 'Lectura', Feedback: 'Retroalimentación', Layout: 'Estructura' }
export const familyName = (name: string) => FAMILY_ES[name] ?? name

// A repeatable, source-only localization pass. It never traverses live user
// content, changes data-* keys, or changes keyboard event names.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const translations = new Map(Object.entries({
  'Settings': 'Ajustes', 'Shapes': 'Figuras', 'Text': 'Texto', 'Styles': 'Estilos',
  'Players': 'Jugadores', 'Arrows': 'Flechas', 'Zones': 'Zonas', 'Equipment': 'Material',
  'Board': 'Pizarra', 'Boards': 'Pizarras', 'Projects': 'Proyectos',
  'Home': 'Local', 'Away': 'Visitante', 'Not set': 'Sin definir', 'Teams': 'Equipos',
  'Pitch': 'Campo', 'Pitch and background': 'Campo y fondo', 'Pitch styles': 'Tipos de campo',
  'My assets': 'Mis recursos', 'Theme': 'Tema', 'System': 'Sistema', 'Light': 'Claro', 'Dark': 'Oscuro',
  'Saved projects': 'Proyectos guardados', 'Move to another device': 'Pasar a otro dispositivo',
  'Agents': 'Herramientas avanzadas', 'Skills and Extensions': 'Instrucciones y extensiones',
  'Skills': 'Instrucciones', 'Skill': 'Instrucción', 'Extension': 'Extensión',
  'Official extension': 'Extensión oficial', 'Hosting': 'Alojamiento',
  'Self-hosted': 'Instalación independiente', 'Local features enabled': 'Funciones locales activas',
  'Help': 'Ayuda', 'How to use': 'Cómo se usa', 'Privacy, data and terms': 'Privacidad, datos y condiciones',
  'Privacy and data': 'Privacidad y datos', 'Self-host': 'Código y alojamiento',
  'Done': 'Listo', 'Close': 'Cerrar', 'Back': 'Volver', 'Cancel': 'Cancelar',
  'Save': 'Guardar', 'Delete': 'Eliminar', 'Remove': 'Quitar', 'Rename': 'Cambiar nombre',
  'Share': 'Compartir', 'Export': 'Exportar', 'Export…': 'Exportar…',
  'Download': 'Descargar', 'Downloaded': 'Descargado', 'Copy': 'Copiar',
  'New project': 'Nuevo proyecto', 'New board': 'Nueva pizarra', 'Board name': 'Nombre de la pizarra',
  'Project name': 'Nombre del proyecto', 'No note': 'Sin nota', 'Note': 'Nota',
  'Blank': 'En blanco', 'Home vs Away': 'Local contra visitante',
  'Save the board on screen': 'Guardar la pizarra actual', 'No saved boards yet. Local saved boards are unlimited.': 'Todavía no hay pizarras guardadas. Puedes guardar todas las que necesites en este navegador.',
  'Export all boards': 'Exportar todas las pizarras', 'Import from a file': 'Importar un archivo',
  'Boards on this device': 'Pizarras de este navegador', 'Your backgrounds': 'Tus fondos',
  'Add a board': 'Añadir pizarra', 'Copy this board': 'Copiar esta pizarra',
  'Same players, same positions.': 'Los mismos jugadores y posiciones.',
  'Empty, the pitch you are drawing on now.': 'El campo actual, sin jugadores ni dibujos.',
  'Start on another pitch': 'Empezar en otro campo', 'Upload image': 'Subir imagen',
  'Photo or screenshot': 'Foto o captura', 'Unavailable': 'No disponible',
  'No notes on this board.': 'Esta pizarra no tiene notas.',
  'Version history': 'Historial de versiones', 'Proposals': 'Propuestas',
  'Match': 'Partido', 'Match settings': 'Ajustes del partido', 'Score': 'Resultado',
  'Clock': 'Tiempo', 'Date': 'Fecha', 'Scoreboard': 'Marcador', 'Team names': 'Nombres de los equipos',
  'Snap to grid': 'Ajustar a la cuadrícula', 'Share and export': 'Compartir y exportar',
  'Fit view': 'Ajustar vista', 'Fit view (F)': 'Ajustar vista (F)',
  'Undo': 'Deshacer', 'Redo': 'Rehacer', 'Boards in this project': 'Pizarras de este proyecto',
  "This board's note": 'Nota de esta pizarra', 'Import live screenshot': 'Importar captura',
  'Change live screenshot': 'Cambiar captura', 'Reset': 'Restablecer', 'Reset 3D camera': 'Restablecer cámara 3D',
  'Move forward': 'Traer delante', 'Move back': 'Enviar detrás', 'Flip': 'Reflejar',
  'Duplicate': 'Duplicar', 'Rotate 45 degrees': 'Girar 45 grados', 'Delete (Backspace)': 'Eliminar (Retroceso)',
  'Group': 'Agrupar', 'Group or save': 'Agrupar o guardar',
  'Color picker': 'Selector de color', 'Pick color from board': 'Tomar color de la pizarra',
  'Color picker views': 'Vistas del selector de color', 'Custom': 'Personalizado', 'Swatches': 'Muestras',
  'Hue ring': 'Círculo de tono', 'Hex color': 'Color hexadecimal', 'Unavailable color': 'Color no disponible',
  'Close color picker': 'Cerrar selector de color', 'Open color picker': 'Abrir selector de color',
  'Hide panel': 'Ocultar panel', 'Show panel': 'Mostrar panel', 'Shape categories': 'Categorías de figuras',
  'Asset name': 'Nombre del recurso', 'Asset category': 'Categoría del recurso',
  'Delete asset': 'Eliminar recurso', 'Save asset': 'Guardar recurso',
  'Live player': 'Jugador sobre captura', 'Switch sides on board': 'Cambiar de campo',
  'Switch home and away': 'Intercambiar local y visitante', 'Swap home and away': 'Intercambiar local y visitante',
  'Flip board': 'Invertir el campo', '+ Player': '+ Jugador', '+ Live player': '+ Jugador sobre captura',
  'Ball': 'Balón', 'Cone': 'Cono', 'Goal': 'Portería', 'Small goal': 'Portería pequeña',
  'Full goal': 'Portería grande', 'Measure': 'Medir', 'Solid arrow': 'Flecha continua',
  'Dashed arrow': 'Flecha discontinua', 'Dotted arrow': 'Flecha de puntos',
  'Line': 'Línea', 'Box': 'Rectángulo', 'Oval': 'Óvalo', 'Triangle': 'Triángulo', 'Outline': 'Contorno',
  'Solid': 'Continua', 'Dashed': 'Discontinua', 'Dotted': 'Puntos', 'Arrow': 'Flecha',
  'First': 'Nombre', 'Last': 'Apellido', 'Full name': 'Nombre completo',
  'Top': 'Arriba', 'Bottom': 'Abajo', 'Right': 'Derecha', 'Left': 'Izquierda',
  'Bold': 'Negrita', 'Small': 'Pequeña', 'Normal': 'Normal', 'Label': 'Etiqueta',
  'Straighten': 'Enderezar', 'Edit text': 'Editar texto', 'Add name from roster': 'Elegir nombre de la plantilla',
  'Clear name': 'Borrar nombre', 'Add node': 'Añadir punto', 'Remove node': 'Quitar punto',
  'Node curve': 'Curva del punto', 'Click': 'Haz clic', 'Tap': 'Toca',
  'Starting XI': 'Once inicial', 'Add starting XI': 'Añadir once inicial', '11 players': '11 jugadores',
  'Added': 'Añadido', 'Dots use': 'Color de las fichas', 'Search a club or national team': 'Buscar club o selección',
  'No clubs or national teams match that search.': 'No hay clubes ni selecciones que coincidan.',
  'Could not search teams. Check your connection and try again.': 'No se han podido buscar equipos. Comprueba la conexión y vuelve a intentarlo.',
  'Could not load that squad. Check your connection and try again.': 'No se ha podido cargar esa plantilla. Comprueba la conexión y vuelve a intentarlo.',
  'Download project images': 'Descargar imágenes del proyecto', 'Export format': 'Formato de exportación',
  'Include the note on each board': 'Incluir la nota de cada pizarra',
  'This project has one board, so there is nothing to animate yet.': 'Añade otra pizarra al proyecto para poder animarlo.',
  'The GIF and the video follow the timing on each link.': 'El GIF y el vídeo respetan los tiempos entre pizarras.',
  'This board': 'Esta pizarra', 'A PNG of the pitch you have open.': 'Una imagen PNG de la pizarra abierta.',
  'All project images': 'Todas las imágenes del proyecto', 'The project as a GIF': 'El proyecto como GIF',
  'Loops the whole move. Drops into a message or a post.': 'La jugada en bucle, lista para compartir.',
  'The project as a video': 'El proyecto como vídeo', 'Full quality, for slides or a longer edit.': 'Para presentaciones o para seguir editando.',
  'That export did not work on this device.': 'No se ha podido exportar en este dispositivo.',
  'Building the project images…': 'Preparando las imágenes…', 'Building the GIF…': 'Preparando el GIF…',
  'Recording the video…': 'Grabando el vídeo…', 'That image could not be read.': 'No se ha podido leer esa imagen.',
  'This canvas has unsaved changes that could not be saved. Discard them and start a new board?': 'Hay cambios que no se han podido guardar. ¿Descartarlos y empezar una nueva pizarra?',
  'Undo the pitch change': 'Deshacer el cambio de campo',
  'Nothing to change on this one.': 'Este elemento no tiene ajustes.',
  'Pick something on the board, or set how the next shape looks.': 'Selecciona un elemento o elige el estilo de la siguiente figura.',
  'Drag anywhere to measure with a straight line.': 'Arrastra para medir con una línea recta.',
  'Drag to orbit · pinch to zoom': 'Arrastra para girar · pellizca para acercar',
  'Drag to orbit · scroll to zoom': 'Arrastra para girar · rueda para acercar',
}));

const files = ['main.ts', 'boards-view.ts', 'saves.ts', 'teams.ts', 'importer.ts'];
for (const name of files) {
  const path = fileURLToPath(new URL(`../vendor/board/src/${name}`, import.meta.url));
  let source = readFileSync(path, 'utf8');
  const parsed = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true);
  const edits = [];
  function visit(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const translated = translations.get(node.text);
      // DOM KeyboardEvent keys are protocols, not user-facing words.
      // Include calls such as e.key.startsWith('Arrow'), not just comparisons.
      const keyboard = /\.(?:key|code)\b/.test(node.parent.getText(parsed));
      if (translated && !keyboard) edits.push([node.getStart(parsed), node.end, JSON.stringify(translated)]);
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) {
    source = source.slice(0, start) + replacement + source.slice(end);
  }
  source = source.replace(/>([^<>\n]*)</g, (whole, content) => {
    const translated = translations.get(content.trim());
    return translated ? `>${content.replace(content.trim(), translated)}<` : whole;
  });
  source = source.replace(/\b(aria-label|title|placeholder)="([^"\n]*)"/g, (whole, attr, value) => {
    const translated = translations.get(value);
    return translated ? `${attr}="${translated}"` : whole;
  });
  writeFileSync(path, source);
  console.log(`${name}: ${edits.length} translated string literals`);
}

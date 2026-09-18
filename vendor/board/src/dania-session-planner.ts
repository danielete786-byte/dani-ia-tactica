import { createDaniaTask, type DaniaTaskKey } from './dania-authored-tasks.ts'

export type DaniaSessionTask = {
  id: string
  title: string
  type: string
  durationMin: number
  players: string
  space: string
  objective: string
  material: string
  organization: string
  development: string
  rules: string
  rotations: string
  coachingPoints: string
  load: string
  notes: string
  diagram?: DaniaTaskKey
}

export type DaniaSession = {
  id: string
  title: string
  team: string
  day: string
  date: string
  arrivalTime: string
  arrivalInstruction: string
  plannedStart: string
  durationMin: number
  venue: string
  field: string
  participants: number
  goalkeepers: number
  availableGoalkeepers: string
  coachCount: number
  absences: string
  level: string
  mainObjective: string
  secondaryObjectives: string
  methodology: string
  material: string
  load: string
  generalNotes: string
  tasks: DaniaSessionTask[]
}

export type DaniaSessionLibrary = {
  version: 5
  activeId: string
  sessions: DaniaSession[]
}

export const DANIA_SESSION_STORAGE_KEY = 'dania-session-planner-v1'
export const DEFAULT_SESSION_ID = 'dania-session-zona2-albolote-20-v1'
export const SALIDA_3421_SESSION_ID = 'dania-session-salida-3421-20-v1'
export const REPLIEGUE_21_SESSION_ID = 'dania-session-repliegue-21-campo-chico-v1'
export const ULTIMO_PASE_22_SESSION_ID = 'dania-session-ultimo-pase-22-campo-grande-v1'
export const ATAQUE_MC_23_SESSION_ID = 'dania-session-ataque-mc-23-campo-chico-v1'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

export function createDefaultDaniaSession(): DaniaSession {
  return {
    id: DEFAULT_SESSION_ID,
    title: 'Sesión · Presión tras pérdida en zona 2',
    team: 'Infantil 4ª Manolo González',
    day: 'Miércoles',
    date: '',
    arrivalTime: '19:45',
    arrivalInstruction: 'Todos los jugadores en el campo y sin las botas puestas.',
    plannedStart: 'Después de ponerse las botas y completar el control de asistencia.',
    durationMin: 70,
    venue: 'Albolote',
    field: 'Campo chico · espacio muy limitado',
    participants: 20,
    goalkeepers: 2,
    availableGoalkeepers: 'Eric Sánchez y Tomás Moreno Baldacci',
    coachCount: 1,
    absences: 'Adam Echanachine Rodríguez, José Luis Sevilla Martín, Jad Mahmouh Bouramtane, Daniel Terrón Alarcos y Víctor Córdoba Paradela.',
    level: 'Infantiles mayoritariamente de primer año y de nivel bajo. Consignas simples, juego libre de toques y correcciones breves.',
    mainObjective: 'Mejorar la organización defensiva inmediatamente después de perder el balón en zona 2.',
    secondaryObjectives: 'Reconocer quién presiona, cerrar el pase interior, dar cobertura y replegar juntos cuando el rival supera la primera presión.',
    methodology: 'Calentamiento breve, dos tareas grupales simultáneas por relevos y una tarea colectiva cercana al partido. El relevo entra únicamente cuando termina la jugada por finalización o disparo fuera; una pérdida o un robo no activan el cambio.',
    material: 'Balones suficientes alrededor de los espacios, petos de tres colores, conos, setas, dos porterías con portero y puertas de conos para las salidas.',
    load: 'Carga media. Cinco minutos totales para agua, cambios de tarea y cierre; reducir la densidad si baja la calidad de las decisiones.',
    generalNotes: 'Montar los dos espacios grupales juntos para poder controlar ambos como único entrenador. Mantener la misma consigna durante toda la sesión: el más cercano presiona, los siguientes cierran dentro y dan cobertura; si superan la presión, todos repliegan y protegen el centro.',
    tasks: [
      {
        id: 'calentamiento',
        title: 'Calentamiento breve · Pase y apoyo',
        type: 'Activación con balón',
        durationMin: 10,
        players: '4 grupos de 5, incluidos los porteros.',
        space: '4 cuadrados próximos de unos 8×8 m, ajustados al rincón disponible.',
        objective: 'Activar, conocer el nivel técnico y preparar el hábito de pasar y ofrecer una nueva línea de pase.',
        material: '4 balones activos, conos y petos por grupos.',
        organization: 'Cada grupo trabaja en su cuadrado. Todos visibles desde una posición central del entrenador.',
        development: 'Conducción corta, pase al compañero y desplazamiento inmediato a un lado libre. Introducir un defensor pasivo solo si el grupo mantiene continuidad.',
        rules: 'Toques libres. Priorizar control orientado, perfil corporal y comunicación. Sin carrera física separada del balón.',
        rotations: 'Rotación continua dentro de cada grupo; los porteros participan con los pies.',
        coachingPoints: 'Levantar la cabeza antes de recibir, orientar el primer control y moverse después de pasar.',
        load: 'Baja y progresiva.',
        notes: 'No necesita pizarra específica. Corregir poco y observar mucho durante el primer bloque.',
      },
      {
        id: 'tarea-parejas',
        title: 'Tarea 1 · 2×2 + 2 comodines',
        type: 'Juego de posición por relevos · dos espacios simultáneos',
        durationMin: 15,
        players: '20: dos grupos de 10. En cada espacio, 2A + 2B + 2 comodines + 1 portero + 3 relevos.',
        space: 'Dos espacios contiguos de referencia 18×14 m; reducir o ampliar según la continuidad real.',
        objective: 'Introducir la reacción conjunta tras pérdida: uno presiona y el compañero protege la salida interior.',
        material: '2 porterías con portero, 4 puertas de conos, balones, conos y petos de tres colores.',
        organization: 'A ataca la portería con portero. B, si recupera, progresa hacia cualquiera de las dos puertas de conos. Los comodines ayudan al poseedor.',
        development: 'La jugada empieza con A en zona 2 y continúa tras cada robo. Si A recupera, vuelve a atacar; si B supera la presión, A repliega y protege el centro.',
        rules: 'Juego libre de toques. No regalar ni anunciar la pérdida. El entrenador no introduce otro balón hasta que termina la transición.',
        rotations: 'Al finalizar entran un relevo de A, uno de B y uno de comodín. Quienes salen esperan. Cada espacio rota por separado.',
        coachingPoints: 'El más cercano frena y orienta hacia fuera; el compañero cierra dentro y ayuda sin ir los dos al balón.',
        load: 'Media, con pausas muy cortas entre jugadas.',
        notes: 'El relevo solo entra tras finalización o disparo fuera. Un robo o una pérdida no paran la jugada.',
        diagram: 'parejas',
      },
      {
        id: 'tarea-trios',
        title: 'Tarea 2 · 3×3 + 2 comodines',
        type: 'Juego de posición por relevos · dos espacios simultáneos',
        durationMin: 18,
        players: '20: dos grupos de 10. En cada espacio, 3A + 3B + 2 comodines + 1 portero + 1 relevo rotatorio.',
        space: 'Dos espacios contiguos de referencia 20×16 m; usar el máximo ancho que permita controlar ambos.',
        objective: 'Coordinar presión, cierre del pase interior y cobertura de un tercer compañero.',
        material: '2 porterías con portero, 4 puertas de conos, balones, conos y petos de tres colores.',
        organization: 'Misma orientación que en la tarea anterior para no perder tiempo en el montaje. Añadir un jugador activo por equipo y dejar una cola de un relevo.',
        development: 'Tras pérdida, el más cercano presiona, el segundo cierra dentro y el tercero equilibra. Si el rival progresa, los tres abandonan la persecución y repliegan juntos.',
        rules: 'Toques libres y salida real del rival. Valorar también un repliegue correcto; no exigir recuperar en un número fijo de segundos.',
        rotations: 'Al terminar entra el relevo en el siguiente rol del orden A → B → comodín. Quien sale pasa a la espera; el portero permanece.',
        coachingPoints: 'Distancias cortas, comunicación clara y protección del centro antes de saltar todos al balón.',
        load: 'Media-alta por la continuidad cognitiva; dar agua antes de la colectiva.',
        notes: 'Cada espacio finaliza su jugada de forma independiente y el entrenador confirma el cambio.',
        diagram: 'trios',
      },
      {
        id: 'tarea-colectiva',
        title: 'Tarea colectiva · 7×7 + 2 porteros',
        type: 'Juego condicionado cercano al partido',
        durationMin: 22,
        players: '20: 7A contra 7B + Eric y Tomás en portería + 4 relevos, dos por equipo.',
        space: 'Todo el campo chico disponible, dividido visualmente en tres zonas longitudinales.',
        objective: 'Transferir la presión tras pérdida en zona 2 al juego colectivo y decidir cuándo presionar o replegar.',
        material: '2 porterías, balones en ambos fondos, conos para marcar las tres zonas y dos colores de petos.',
        organization: 'Estructura orientativa 3–2–2 por equipo. Dos relevos de cada equipo esperan fuera en posiciones acordadas.',
        development: 'Juego normal. Cuando la pérdida se produce en zona 2, el equipo reacciona según cercanía y ayudas. Si recupera, vuelve a atacar; si el rival sale, repliega por dentro hasta finalizar.',
        rules: 'Sin límite de toques ni recuperación obligatoria en pocos segundos. Reiniciar desde zona 2 tras cada finalización para repetir el momento trabajado.',
        rotations: 'Al terminar la jugada entran los dos relevos de cada equipo en las posiciones fijadas. Alternar las posiciones sustituidas; los porteros permanecen.',
        coachingPoints: 'Presión del cercano, cierre de líneas interiores, cobertura, avance de la última línea y repliegue compacto si el rival supera la presión.',
        load: 'Media-alta, con intervenciones breves del entrenador entre jugadas.',
        notes: 'Cerrar con una pregunta: ¿qué hacemos los demás cuando el compañero más cercano va a presionar?',
        diagram: 'colectiva',
      },
    ],
  }
}

export function createSalida3421Session(): DaniaSession {
  return {
    id: SALIDA_3421_SESSION_ID,
    title: 'Sesión · Salida de balón en 3-4-2-1',
    team: 'Infantil 4ª Manolo González',
    day: 'Lunes',
    date: '07/09/2026',
    arrivalTime: '19:45',
    arrivalInstruction: 'Todos los jugadores en el campo y sin las botas puestas.',
    plannedStart: 'Después de ponerse las botas y completar el control de asistencia.',
    durationMin: 90,
    venue: 'Albolote',
    field: 'Campo habitual · dos espacios contiguos y 55×45 m de referencia para la colectiva',
    participants: 20,
    goalkeepers: 3,
    availableGoalkeepers: 'Eric Sánchez, Daniel Terrón Alarcos y Tomás Moreno Baldacci',
    coachCount: 1,
    absences: 'No indicadas para esta sesión.',
    level: 'Infantiles mayoritariamente de primer año y de nivel bajo. Consignas simples, juego libre de toques, muchas repeticiones y correcciones breves.',
    mainObjective: 'Iniciar el ataque organizado desde el portero dentro del sistema 3-4-2-1 y superar la primera presión rival.',
    secondaryObjectives: 'Abrir a los tres centrales, lateralizar y escalonar el doble pivote, hacer bajar a los dos mediapuntas por dentro sin colocarlos en la misma línea de los pivotes, mantener a los carrileros altos y abiertos y al delantero fijando.',
    methodology: 'Calentamiento breve únicamente con pases por parejas y tríos a velocidad progresiva; dos tareas grupales simultáneas por relevos y una tarea colectiva cercana al partido. El relevo entra únicamente cuando termina la jugada; una pérdida o un robo no activan el cambio.',
    material: 'Balones suficientes, petos de dos colores, conos, setas, dos porterías y cuatro puertas de conos para las salidas.',
    load: 'Carga media-alta. Ochenta y dos minutos de tareas y ocho minutos para agua, cambios y cierre, hasta completar 90 minutos.',
    generalNotes: 'Montar los dos espacios grupales juntos para controlar ambos como único entrenador. Consigna común: pivotes hacia los lados y escalonados; mediapuntas por dentro y un escalón por delante. Si reciben de espaldas, juegan de cara; si pueden girarse, progresan.',
    tasks: [
      {
        id: 'calentamiento-pases',
        title: 'Calentamiento breve · Pases en parejas y tríos',
        type: 'Activación técnica con balón',
        durationMin: 8,
        players: '20 jugadores: primero 10 parejas y después grupos de 3, integrando a los tres porteros con los pies.',
        space: 'Zona próxima al montaje principal. Parejas separadas 5-6 m y tríos en triángulos de 8-10 m.',
        objective: 'Elevar progresivamente la velocidad del balón y preparar control orientado, perfil y movilidad después del pase.',
        material: 'Un balón por pareja y un balón por trío en la parte final.',
        organization: 'Dos minutos de pase suave por parejas, tres minutos aumentando distancia y tensión, y tres minutos en tríos con pase y cambio de posición.',
        development: 'Comenzar a ritmo suave. Aumentar progresivamente la velocidad del pase y terminar circulando rápido en triángulo, sin realizar carreras máximas ni añadir ejercicios físicos separados.',
        rules: 'Toques libres. El pase debe llegar al pie alejado y el receptor orienta el primer control. Moverse inmediatamente después de pasar.',
        rotations: 'Cambiar pareja o posición al pasar al trabajo en tríos. Los porteros participan como jugadores de campo.',
        coachingPoints: 'Mirar antes de recibir, perfilar el cuerpo, dar tensión al pase y no quedarse quieto después de jugar.',
        load: 'Baja y progresiva.',
        notes: 'Calentamiento deliberadamente breve: solo pases por parejas y tríos a varias velocidades.',
      },
      {
        id: 'salida-base-3421',
        title: 'Tarea 1 · Salida con tres centrales y doble pivote',
        type: 'Juego de posición por relevos · dos espacios simultáneos',
        durationMin: 22,
        players: '20: dos grupos de 10. En cada espacio, portero + 3 centrales + 2 pivotes contra 3 defensores + 1 relevo. El tercer portero empieza como relevo con los pies y rota.',
        space: 'Dos campos contiguos de referencia 24×20 m, visibles desde una posición central del entrenador.',
        objective: 'Reconocer la estructura inicial y superar la primera línea mediante los centrales abiertos y los dos pivotes lateralizados.',
        material: '2 porterías, 4 puertas de conos, balones, conos y petos de dos colores.',
        organization: 'Cada acción comienza desde el portero. Los tres centrales ocupan la base; cuando el portero o el central controlan, cada pivote se desplaza hacia un costado y ambos quedan a distinta altura.',
        development: 'Seis minutos permitiendo la presión después del primer pase, un minuto de corrección, siete minutos de presión libre, un minuto de corrección y siete minutos de competición entre campos. La salida puntúa al controlar tras cualquiera de las dos puertas. Si el rival roba, ataca la portería.',
        rules: 'Juego libre de toques. No obligar el pase al pivote si está marcado: su movimiento también puede liberar una conducción del central o un cambio de lado.',
        rotations: 'Relevo → equipo de salida → equipo defensor → relevo. Cambiar únicamente al terminar la acción. Los porteros rotan cada cinco minutos: portería A → portería B → apoyo/relevo con los pies.',
        coachingPoints: 'Tres centrales abiertos; pivotes hacia lados diferentes y escalonados; central conduce si nadie salta; recibir perfilado para jugar hacia delante.',
        load: 'Media, con pausas cortas para corregir.',
        notes: 'El relevo solo entra tras salida completada, gol, disparo fuera o balón fuera. Un robo o una pérdida no paran la jugada.',
        diagram: 'salida-base',
      },
      {
        id: 'salida-lado-3421',
        title: 'Tarea 2 · Pivote lateralizado y mediapunta que baja',
        type: 'Juego de posición por relevos · lados derecho e izquierdo simultáneos',
        durationMin: 24,
        players: '20: dos grupos de 10. En cada espacio, portero + central del medio + central exterior + pivote + carrilero + mediapunta contra 3 defensores + 1 relevo.',
        space: 'Dos campos contiguos de referencia 24×20 m. Uno representa el lado izquierdo y otro el derecho.',
        objective: 'Coordinar el movimiento del pivote hacia fuera con la bajada interior del mediapunta y progresar usando apoyo, giro o tercer jugador.',
        material: '2 porterías, 2 puertas de salida, balones, conos, setas y petos.',
        organization: 'El pivote parte por dentro y se lateraliza al primer control del portero o central. El mediapunta parte más alto y baja por dentro, pero nunca hasta colocarse en la misma línea del pivote. El carrilero conserva amplitud y altura.',
        development: 'Siete minutos con oposición moderada, un minuto de corrección, siete minutos con oposición libre, un minuto de corrección y ocho minutos de competición. Buscar portero/central → pivote → mediapunta → carrilero o salida.',
        rules: 'Un punto por superar la presión, dos si recibe el mediapunta y tres si el mediapunta juega de cara y progresa un tercer jugador. Si el mediapunta puede girarse, no se le obliga a descargar.',
        rotations: 'Misma rueda que en la tarea anterior y siempre al finalizar la acción. Los tres porteros rotan por portería, portería contraria y apoyo/relevo.',
        coachingPoints: 'Pivote fuera, mediapunta por dentro; no ocupar la misma altura; carrilero alto y abierto; jugar de cara si recibe de espaldas y girar si tiene espacio.',
        load: 'Media-alta por la velocidad de decisión.',
        notes: 'No forzar una secuencia cerrada: si aparece un pase vertical claro, aprovecharlo. Mantener ambos espacios próximos para controlar los dos.',
        diagram: 'salida-lado',
      },
      {
        id: 'salida-colectiva-3421',
        title: 'Tarea colectiva · Salida completa en 3-4-2-1',
        type: 'Juego condicionado cercano al partido',
        durationMin: 28,
        players: '20: 10 jugadores de campo en 3-4-2-1 + portero contra 7 jugadores de campo + portero. El tercer portero queda como relevo y rota.',
        space: '55×45 m de referencia, con dos porterías y anchura suficiente para mantener abiertos a los carrileros.',
        objective: 'Transferir la salida completa al juego colectivo y encontrar al pivote lateralizado o al mediapunta que baja antes de progresar.',
        material: '2 porterías, balones en ambos fondos, conos para delimitar y petos de dos colores.',
        organization: 'Equipo de salida: portero, 3 centrales, 2 carrileros, 2 pivotes, 2 mediapuntas y 1 delantero. Rival orientativo en 2-3-2. Todas las acciones comienzan desde el portero del 3-4-2-1.',
        development: 'Ocho minutos con rival en bloque medio y permitiendo el primer pase, un minuto de corrección, ocho minutos con presión libre, un minuto de corrección y diez minutos de partido condicionado.',
        rules: 'Juego libre de toques. El gol vale doble cuando durante la salida se conecta con un pivote lateralizado y después con uno de los mediapuntas. Tras robo, el rival ataca inmediatamente la portería de salida.',
        rotations: 'Los tres porteros rotan después de cada serie: portero de salida → portería rival → relevo. A mitad del bloque, intercambiar jugadores de ambos equipos para repartir los roles de salida.',
        coachingPoints: 'Tres centrales abiertos; pivotes lateralizados y escalonados; mediapuntas por dentro y por delante; carrileros altos y abiertos; delantero fijando y dando profundidad.',
        load: 'Media-alta, con correcciones de un minuto entre series.',
        notes: 'Pregunta final: ¿dónde debe recibir el mediapunta para poder girarse: al lado del pivote o un escalón por delante?',
        diagram: 'salida-colectiva',
      },
    ],
  }
}

export function createRepliegue21Session(): DaniaSession {
  return {
    id: REPLIEGUE_21_SESSION_ID,
    title: 'Sesión · Defensa organizada y repliegue colectivo',
    team: 'Infantil 4ª Manolo González',
    day: 'Miércoles',
    date: '09/09/2026',
    arrivalTime: '19:45',
    arrivalInstruction: 'Todos los jugadores en el campo y sin las botas puestas.',
    plannedStart: 'Después de ponerse las botas y completar el control de asistencia.',
    durationMin: 90,
    venue: 'Albolote',
    field: 'Campo chico · espacio muy reducido. Aprovechar la profundidad disponible y reducir la anchura.',
    participants: 21,
    goalkeepers: 2,
    availableGoalkeepers: 'Eric Sánchez y Tomás Moreno Baldacci',
    coachCount: 1,
    absences: 'Adam Echanachine Rodríguez, José Luis Sevilla Martín, Jad Mahmouh Bouramtane, Daniel Terrón Alarcos y Víctor Córdoba Paradela.',
    level: 'Infantiles mayoritariamente de primer año y de nivel bajo. Una sola consigna común, tareas visibles desde el centro y correcciones muy breves.',
    mainObjective: 'Aprender a replegar todos cuando la presión en campo rival queda superada y el rival puede atacar hacia delante.',
    secondaryObjectives: 'Reconocer el momento de abandonar la presión; temporizar con el jugador más cercano; correr hacia portería y hacia dentro; recuperar distancias cortas y evitar que cualquier jugador quede parado por delante del balón.',
    methodology: 'Calentamiento breve en siete tríos, una primera tarea en tres pasillos, una segunda por oleadas de tres equipos y un partido reducido condicionado. Los relevos entran únicamente al finalizar la acción; una pérdida, un robo o un pase que supera la presión no activan el cambio.',
    material: 'Balones suficientes, petos de tres colores, conos y setas, dos porterías y seis puertas de conos para los pasillos.',
    load: 'Carga media-alta. Ochenta y un minutos de trabajo y nueve minutos para agua, cambios de tarea y cierre, hasta completar 90 minutos.',
    generalNotes: 'No realizar un juego colectivo grande: el espacio no permite que el repliegue se vea con claridad. Mantener todos los montajes orientados en la longitud del campo. Repetir únicamente tres palabras: VUELTA, DENTRO Y JUNTOS.',
    tasks: [
      {
        id: 'calentamiento-trios-21',
        title: 'Calentamiento breve · Siete tríos de pases',
        type: 'Activación técnica con balón',
        durationMin: 8,
        players: '21 jugadores en 7 tríos, incluidos Eric y Tomás trabajando con los pies.',
        space: 'Siete triángulos pequeños próximos al montaje principal, de 6-8 m por lado.',
        objective: 'Activar con balón y elevar progresivamente la velocidad del pase, el control orientado y el movimiento posterior.',
        material: '7 balones y conos o setas para marcar los triángulos.',
        organization: 'Tres minutos de pase suave, tres minutos con mayor tensión y control orientado, y dos minutos a uno o dos contactos según el nivel.',
        development: 'El jugador pasa y cambia inmediatamente de cono. Mantener ritmo continuo sin añadir carrera física ni contenido táctico complejo.',
        rules: 'Toques libres al inicio. En el último bloque, jugar a dos contactos si el grupo conserva precisión.',
        rotations: 'Rotación continua dentro de cada trío. Los porteros participan como jugadores de campo.',
        coachingPoints: 'Mirar antes de recibir, orientar el control, pasar con tensión y no quedarse quieto después de jugar.',
        load: 'Baja y progresiva.',
        notes: 'Calentamiento deliberadamente breve para dedicar la mayor parte de la sesión al repliegue.',
      },
      {
        id: 'repliegue-pasillos-21',
        title: 'Tarea 1 · Repliegue en tres pasillos',
        type: 'Juego de progresión por relevos · tres espacios simultáneos',
        durationMin: 22,
        players: '21: tres grupos de 7. En cada pasillo, 3 atacantes contra 3 defensores + 1 relevo. Eric y Tomás participan con los pies en dos de los tríos atacantes.',
        space: 'Tres pasillos contiguos y alargados de referencia 9×20 m. Reducir anchura antes que longitud.',
        objective: 'Reconocer que la primera presión ha sido superada y coordinar temporización, carrera hacia portería y cierre interior.',
        material: '6 puertas de conos, balones, conos y petos de tres colores.',
        organization: 'Los atacantes comienzan en un extremo e intentan progresar con control por una de las dos puertas. Los tres defensores empiezan presionando arriba. El relevo espera fuera.',
        development: 'Seis minutos guiados, un minuto de corrección, siete minutos libres, un minuto de corrección y siete minutos de competición. Si un rival recibe orientado hacia delante, el más cercano frena el ataque y los otros dos repliegan por dentro.',
        rules: 'Un punto atacante por cruzar una puerta controlando. Un punto defensor si, después de ser superada la presión, recupera o fuerza un pase atrás protegiendo el centro. La jugada continúa hasta terminar.',
        rotations: 'El relevo entra solo al finalizar la acción y sustituye al rol acordado. Rotar ataque, defensa y los porteros con los pies entre bloques.',
        coachingPoints: 'Primera carrera hacia portería y hacia dentro. El más cercano temporiza; los demás se colocan entre balón y puertas. Consigna: VUELTA, DENTRO Y JUNTOS.',
        load: 'Media, con acciones cortas y pausas mínimas.',
        notes: 'Los tres pasillos ejecutan la misma tarea y quedan juntos para poder controlarlos desde una posición central.',
        diagram: 'repliegue-pasillos',
      },
      {
        id: 'repliegue-oleadas-21',
        title: 'Tarea 2 · Oleadas 6+1 contra 6',
        type: 'Oleadas de ataque, presión y repliegue · tres equipos',
        durationMin: 24,
        players: '21: Eric y Tomás fijos en portería, tres equipos de 6 jugadores de campo y 1 comodín ofensivo.',
        space: 'Todo el largo útil del campo chico y aproximadamente 24-28 m de anchura.',
        objective: 'Pasar de una presión alta fallida a un bloque compacto sin dejar jugadores caminando por delante del balón.',
        material: '2 porterías, balones en ambos fondos, petos de tres colores y conos para delimitar.',
        organization: 'Juegan 6 + comodín contra 6 mientras el tercer equipo espera. Rotación por oleadas: A ataca a B, B ataca a C y C ataca a A.',
        development: 'Siete minutos guiados, un minuto de corrección, siete minutos libres, un minuto de corrección y ocho minutos de competición. Cada ataque empieza desde un portero. Si la presión queda superada, el cercano temporiza y los otros cinco corren hacia dentro y hacia su portería.',
        rules: 'Juego libre de toques. Premiar también al defensor que, tras ser superado, obliga a jugar atrás o recupera ya organizado. El comodín juega siempre con el atacante.',
        rotations: 'El equipo que defendía pasa a atacar al equipo que esperaba únicamente cuando termina la oleada. Cambiar el comodín cada cuatro acciones. Los porteros permanecen.',
        coachingPoints: 'Rival orientado hacia delante significa abandonar la persecución. Proteger el carril central, comunicarse y llegar juntos antes de volver a saltar.',
        load: 'Media-alta por las carreras de repliegue; mantener las oleadas breves.',
        notes: 'El tercer equipo espera preparado detrás del fondo. No introducir otro balón mientras continúa una transición.',
        diagram: 'repliegue-oleadas',
      },
      {
        id: 'repliegue-partido-21',
        title: 'Partido condicionado · 8 contra 8 + 2 porteros',
        type: 'Juego reducido condicionado · transferencia final',
        durationMin: 27,
        players: '21: 8 contra 8 + Eric y Tomás en portería + 3 relevos.',
        space: 'Todo el campo chico disponible. Campo alargado y con anchura reducida para que exista recorrido de repliegue.',
        objective: 'Aplicar el repliegue colectivo en juego real y recuperar una estructura 4-3-1 cuando la presión alta no funciona.',
        material: '2 porterías, balones en ambos fondos, conos y dos colores de petos.',
        organization: 'Estructura inicial orientativa 3-3-1-1. Al ser superada la presión, los ocho jugadores recuperan un 4-3-1 compacto. Los tres relevos esperan fuera.',
        development: 'Ocho minutos guiados, un minuto de corrección, ocho minutos libres, un minuto de corrección y nueve minutos de partido. Reiniciar desde portero para repetir la decisión entre seguir presionando o replegar.',
        rules: 'Gol normal: un punto. El gol vale doble si algún rival queda parado por delante del balón sin ayudar a defender. No detener el juego al superar la presión.',
        rotations: 'Los tres relevos entran únicamente en los parones siguiendo una cola fija y alternando equipos para mantener el 8 contra 8.',
        coachingPoints: 'El más cercano frena; los demás corren hacia su portería, cierran dentro y acortan distancias. Nadie camina. Consigna: VUELTA, DENTRO Y JUNTOS.',
        load: 'Media-alta, con intervenciones de un minuto entre bloques.',
        notes: 'Cerrar preguntando: ¿cuándo dejamos de presionar y cuál es nuestra primera carrera?',
        diagram: 'repliegue-partido',
      },
    ],
  }
}

export function createUltimoPase22Session(): DaniaSession {
  return {
    id: ULTIMO_PASE_22_SESSION_ID,
    title: 'Sesión · Último pase y finalización en 3-4-2-1',
    team: 'Infantil 4ª Manolo González',
    day: 'Lunes',
    date: '14/09/2026',
    arrivalTime: '19:45',
    arrivalInstruction: 'Todos los jugadores en el campo y sin las botas puestas.',
    plannedStart: 'Después de ponerse las botas y completar el control de asistencia.',
    durationMin: 90,
    venue: 'Albolote',
    field: 'Campo grande · 70×55 m de referencia para la colectiva y dos espacios de finalización.',
    participants: 22,
    goalkeepers: 3,
    availableGoalkeepers: 'Eric Sánchez, Daniel Terrón Alarcos y Tomás Moreno Baldacci',
    coachCount: 1,
    absences: 'No indicadas. Sesión diseñada para los 22 jugadores disponibles.',
    level: 'Infantiles mayoritariamente de primer año y de nivel bajo. Consignas simples, juego libre de toques, muchas repeticiones y correcciones breves.',
    mainObjective: 'Transformar el ataque organizado en ocasión clara mediante un último pase con ventaja y una correcta ocupación de las zonas de finalización.',
    secondaryObjectives: 'Encontrar a los dos mediapuntas entre líneas, fijar defensores antes de soltar, coordinar la ruptura del delantero con el momento del pase y ocupar primer palo, segundo palo y zona de pase atrás.',
    methodology: 'Calentamiento breve de pases por parejas, una tarea de superioridad cerca del área, una tarea por oleadas y un partido condicionado. Los relevos entran únicamente cuando termina la jugada; una pérdida o un robo no activan el cambio.',
    material: 'Balones suficientes en ambos fondos, petos de cuatro colores, conos, setas, dos porterías y marcadores para delimitar las zonas de mediapuntas y finalización.',
    load: 'Carga media-alta. Ochenta y un minutos de trabajo y nueve minutos para agua, cambios de tarea y cierre, hasta completar 90 minutos.',
    generalNotes: 'Aprovechar el campo grande sin aumentar demasiado las distancias para este nivel. Corregir una sola idea cada vez. Consigna común: MIRA, FIJA Y FILTRA. El pase debe salir cuando empieza el desmarque, no cuando la carrera ya ha terminado.',
    tasks: [
      {
        id: 'calentamiento-parejas-22',
        title: 'Calentamiento breve · Once parejas de pases',
        type: 'Activación técnica con balón',
        durationMin: 8,
        players: '22 jugadores en 11 parejas, incluidos Eric, Daniel y Tomás trabajando con los pies.',
        space: 'Zona próxima al primer montaje. Parejas separadas inicialmente 5-6 m y después 8-10 m.',
        objective: 'Activar y aumentar progresivamente la velocidad del balón, el perfil corporal y la precisión del pase.',
        material: '11 balones y conos o setas para ordenar las distancias.',
        organization: 'Dos minutos de pase suave, tres minutos aumentando distancia y tensión, y tres minutos de pase fuerte con control orientado y movimiento corto después de jugar.',
        development: 'El receptor mira antes, controla con el pie alejado y devuelve el pase. En el último bloque, cambiar el ángulo de apoyo después de cada envío.',
        rules: 'Toques libres. Si baja la precisión, reducir distancia antes de reducir la velocidad. No añadir carrera física separada del balón.',
        rotations: 'Cambiar de compañero al minuto 4. Los tres porteros realizan todo el calentamiento con los pies.',
        coachingPoints: 'Mirar antes de recibir, perfilar el cuerpo, dar tensión al pase y moverse después de jugar.',
        load: 'Baja y progresiva.',
        notes: 'Calentamiento deliberadamente breve para dedicar la sesión al último pase y la finalización.',
      },
      {
        id: 'ultimo-pase-superioridad-22',
        title: 'Tarea 1 · Último pase en 4 contra 2 + portero',
        type: 'Ataque en superioridad por relevos · dos espacios simultáneos',
        durationMin: 22,
        players: '22 en dos grupos de 11. Grupo A: 10 jugadores de campo + 1 portero. Grupo B: 9 jugadores de campo + 2 porteros; uno en meta y otro como pivote iniciador con los pies.',
        space: 'Dos espacios de referencia 32×28 m orientados a portería, montados de forma que el entrenador pueda ver ambos desde la zona central.',
        objective: 'Reconocer el momento de atraer y filtrar el último pase hacia el delantero o el mediapunta que rompe.',
        material: '2 porterías, balones en los inicios, conos para marcar la zona entre líneas y petos de dos colores.',
        organization: 'En cada espacio atacan pivote, dos mediapuntas y delantero contra dos defensores y portero. La acción comienza en el pivote; los mediapuntas reciben por dentro y el delantero fija antes de romper.',
        development: 'Seis minutos con defensores moderados, un minuto de corrección, siete minutos con oposición libre, un minuto de corrección y siete minutos de competición. Permitir pase filtrado, pared, tercer hombre o pase atrás; no imponer una secuencia cerrada.',
        rules: 'Un punto por remate claro y dos por gol tras pase al espacio o pase atrás. Juego libre de toques. La acción continúa después de una pérdida hasta que termina.',
        rotations: 'Tras cada acción salen los atacantes de campo y entran los siguientes de la cola; los dos defensores cambian cada dos acciones. Porteros: 0-7 Eric/Tomás en meta y Daniel de apoyo; 7-14 Daniel/Eric en meta y Tomás de apoyo; 14-22 Tomás/Daniel en meta y Eric de apoyo.',
        coachingPoints: 'Mediapuntas entre líneas y a distinta altura; delantero fija antes de romper; cabeza levantada; pase al inicio de la carrera. Tras pase lateral: 9 al primer palo, mediapunta alejado al segundo y cercano a pase atrás.',
        load: 'Media, con acciones breves y repetidas.',
        notes: 'Los relevos solo entran tras gol, remate fuera, balón fuera o señal. El portero de apoyo no finaliza: inicia y ofrece pase de seguridad.',
        diagram: 'ultimo-pase-superioridad',
      },
      {
        id: 'ultimo-pase-oleadas-22',
        title: 'Tarea 2 · Oleadas 6 + mediapunta contra 6',
        type: 'Ataque organizado por oleadas · tres equipos',
        durationMin: 24,
        players: '22: tres equipos de 6 jugadores de campo, 1 mediapunta comodín, 2 porteros en meta y el tercer portero como relevo activo con los balones.',
        space: '60×48 m de referencia, con dos porterías y una zona de finalización señalada en cada extremo.',
        objective: 'Pasar de la progresión al último pase contra una defensa organizada y finalizar con al menos dos jugadores llegando al área.',
        material: '2 porterías, balones en ambos fondos, petos de cuatro colores, conos y setas.',
        organization: 'Juegan 6 + mediapunta comodín contra 6. El tercer equipo espera preparado. Estructura atacante orientativa 2-2-1-1 más el comodín como segundo mediapunta.',
        development: 'Siete minutos guiados, un minuto de corrección, siete minutos libres, un minuto de corrección y ocho minutos de competición. A ataca a B; al terminar, B ataca a C; después C ataca a A.',
        rules: 'Gol normal: un punto. Gol tras pase filtrado, pared o pase atrás: dos puntos. Si el defensor roba, puede contraatacar y la acción no termina hasta gol, remate fuera o balón fuera.',
        rotations: 'Los equipos cambian únicamente al finalizar la oleada. El comodín cambia cada cuatro minutos con un jugador del equipo que espera. Porteros: 0-8 Eric/Tomás y Daniel relevo; 8-16 Daniel/Eric y Tomás relevo; 16-24 Tomás/Daniel y Eric relevo.',
        coachingPoints: 'No correr todos hacia el balón. Abrir para separar defensores, encontrar al mediapunta de cara y atacar profundidad en cuanto levanta la cabeza. Acompañar el remate al primer y segundo palo.',
        load: 'Media-alta por las acciones de ida y vuelta; mantener cada oleada breve.',
        notes: 'El equipo de espera recoge balones y se prepara. No introducir otro balón mientras una transición sigue viva.',
        diagram: 'ultimo-pase-oleadas',
      },
      {
        id: 'ultimo-pase-partido-22',
        title: 'Partido condicionado · 3-4-2-1 con delantero comodín',
        type: 'Juego colectivo condicionado · transferencia al partido',
        durationMin: 27,
        players: '22: 9 contra 9, dos porteros, un delantero comodín que juega con el poseedor y el tercer portero como relevo. En posesión se completa el 3-4-2-1.',
        space: '70×55 m de referencia. Anchura suficiente para los carrileros y profundidad real para los desmarques.',
        objective: 'Transferir el último pase al 3-4-2-1 completo y coordinar mediapuntas, delantero y carrileros en el último tercio.',
        material: '2 porterías, balones en ambos fondos, petos de tres colores y conos para señalar el último tercio.',
        organization: 'Cada equipo de 9 se organiza en 3-4-2. El delantero comodín juega siempre con el equipo que tiene el balón, que forma un 3-4-2-1 completo. Reinicios desde portero.',
        development: 'Ocho minutos guiados, un minuto de corrección, ocho minutos libres, un minuto de corrección y nueve minutos de partido. Cuando un mediapunta recibe de cara, el delantero rompe y el otro mediapunta acompaña la jugada.',
        rules: 'Gol normal: un punto. Gol doble si el último pase es filtrado, una pared o un pase atrás y el área está ocupada por al menos dos atacantes. Tras pérdida, se puede presionar; si no se recupera, replegar como se trabajó la semana anterior.',
        rotations: 'El delantero comodín cambia cada tres minutos, siempre al terminar una acción, con un mediapunta o delantero de uno de los equipos. Porteros: 0-9 Eric/Tomás y Daniel relevo; 9-18 Daniel/Eric y Tomás relevo; 18-27 Tomás/Daniel y Eric relevo. Cada portero juega 18 minutos y descansa 9.',
        coachingPoints: 'Carrileros dan amplitud; mediapuntas reciben en intervalos; 9 fija y rompe; pase antes de que termine la carrera. En acción lateral: 9 primer palo, mediapunta alejado segundo palo y mediapunta cercano a pase atrás.',
        load: 'Media-alta, con correcciones de un minuto y continuidad de partido.',
        notes: 'Cerrar preguntando: ¿cuándo debe salir el pase, cuando empieza el desmarque o cuando el compañero ya está marcado?',
        diagram: 'ultimo-pase-partido',
      },
    ],
  }
}

export function createAtaqueMc23Session(): DaniaSession {
  return {
    id: ATAQUE_MC_23_SESSION_ID,
    title: 'Sesión · Ataque organizado y distribución de los MC',
    team: 'Infantil 4ª Manolo González',
    day: 'Miércoles',
    date: '16/09/2026',
    arrivalTime: '19:45',
    arrivalInstruction: 'Todos los jugadores en el campo y sin las botas puestas.',
    plannedStart: 'Después de ponerse las botas y completar el control de asistencia.',
    durationMin: 90,
    venue: 'Albolote',
    field: 'Campo chico · espacio muy reducido. Mantener los dos montajes grupales contiguos y utilizar todo el largo en el partido.',
    participants: 23,
    goalkeepers: 3,
    availableGoalkeepers: 'Eric Sánchez, Daniel Terrón Alarcos y Tomás Moreno Baldacci',
    coachCount: 1,
    absences: 'No indicadas. Sesión diseñada para los 23 jugadores disponibles.',
    level: 'Infantiles mayoritariamente de primer año y de nivel bajo. Consignas simples, muchas repeticiones y correcciones breves.',
    mainObjective: 'Dar continuidad y orientación al ataque organizado mediante una correcta distribución del juego de los dos mediocentros.',
    secondaryObjectives: 'Mirar antes de recibir, perfilarse para jugar hacia delante, escalonar el doble pivote, utilizar al tercer jugador, volver al portero si no se puede progresar y cambiar el balón hacia el lado libre.',
    methodology: 'Calentamiento breve con pases, dos tareas grupales simultáneas y un partido condicionado con dos MC comodines. Cada acción termina en salida completada, gol, disparo fuera o balón fuera; los relevos entran únicamente al terminar.',
    material: 'Balones suficientes junto a los dos espacios, petos de tres colores, conos y setas, dos porterías y cuatro puertas de conos para las salidas.',
    load: 'Carga media-alta. Ochenta minutos de tareas y diez minutos para agua, cambios y cierre, hasta completar 90 minutos.',
    generalNotes: 'El campo pequeño obliga a pensar y jugar rápido. No confundir posesión con pases sin intención: conservar para atraer y cambiar. Repetir únicamente tres palabras: MIRA, PERFÍLATE Y CAMBIA. Un MC viene a ayudar y el otro se coloca en diagonal.',
    tasks: [
      {
        id: 'calentamiento-pases-23',
        title: 'Calentamiento breve · Triángulos y rombos de pase',
        type: 'Activación técnica con balón',
        durationMin: 8,
        players: '23 jugadores: cinco tríos y dos grupos de cuatro. Eric, Daniel y Tomás trabajan integrados con los pies.',
        space: 'Grupos próximos al montaje principal. Triángulos y rombos de 6-8 m, adaptados al espacio disponible.',
        objective: 'Activar y preparar el perfil corporal, el control orientado, el tercer jugador y el movimiento después del pase.',
        material: '7 balones y conos o setas para marcar triángulos y rombos.',
        organization: 'Dos minutos de pase suave, tres minutos de control orientado y pase al tercer jugador, y tres minutos aumentando la velocidad con cambio de posición.',
        development: 'El jugador mira antes, recibe con el pie alejado y se desplaza después del pase. En los grupos de cuatro, el jugador sin balón ajusta continuamente el ángulo de apoyo.',
        rules: 'Toques libres al inicio. En el bloque final, jugar a dos contactos únicamente cuando se conserve la precisión.',
        rotations: 'Rotación continua dentro de cada grupo. Los tres porteros completan todo el bloque como jugadores de campo.',
        coachingPoints: 'Mirar antes de recibir, cuerpo abierto, pase con tensión y movimiento inmediato para volver a ofrecer apoyo.',
        load: 'Baja y progresiva.',
        notes: 'Calentamiento deliberadamente breve. No añadir carrera física separada del balón.',
      },
      {
        id: 'ataque-mc-posesion-23',
        title: 'Tarea 1 · 4 contra 4 + 2 MC + portero de apoyo',
        type: 'Juego de posición · dos espacios simultáneos',
        durationMin: 20,
        players: '23: dos grupos de 10 jugadores de campo. En cada espacio, 4 contra 4 + 2 MC comodines + 1 portero exterior. El tercer portero introduce balones y rota.',
        space: 'Dos campos contiguos de 24×18 m divididos visualmente en tres carriles verticales.',
        objective: 'Conservar para atraer y cambiar la orientación mediante dos MC escalonados y colocados en diagonal.',
        material: 'Balones, petos de tres colores y conos para delimitar los dos espacios y sus carriles.',
        organization: 'Los MC juegan siempre con el poseedor. Un MC ofrece apoyo cercano y el otro se aleja en diagonal. El portero exterior funciona como pase de seguridad y reinicio.',
        development: 'Cinco bloques de cuatro minutos. El poseedor intenta llevar el balón de un carril lateral al contrario pasando por uno o por los dos MC. Si el rival cierra dentro, se utiliza al portero y se inicia por el otro lado.',
        rules: 'Un punto por cambiar de carril utilizando a un MC y dos puntos si intervienen ambos MC. Los MC juegan a dos toques; el resto tiene libertad para decidir.',
        rotations: 'Cada cuatro minutos, al terminar la acción, cambia la pareja de MC para que los diez jugadores de cada grupo pasen por el rol. Porteros: 0-7 Eric/Tomás y Daniel introduce; 7-14 Daniel/Eric y Tomás introduce; 14-20 Tomás/Daniel y Eric introduce.',
        coachingPoints: 'No colocar los dos MC a la misma altura. Mirar antes, recibir de lado, orientar el primer control y jugar lejos de la presión.',
        load: 'Media, con alta exigencia de atención y pausas breves entre bloques.',
        notes: 'No premiar una posesión larga sin intención. El objetivo es atraer en un lado y encontrar el carril libre.',
        diagram: 'ataque-mc-posesion',
      },
      {
        id: 'ataque-mc-progresion-23',
        title: 'Tarea 2 · Ataque organizado 5 contra 5 + portero',
        type: 'Progresión y finalización · dos espacios simultáneos',
        durationMin: 24,
        players: '23: dos grupos de 10 jugadores de campo. En cada espacio, 5 atacantes contra 5 defensores + 1 portero. El tercer portero queda como relevo activo.',
        space: 'Dos campos contiguos de 28×22 m. Una portería en el inicio y dos puertas de salida en el fondo contrario.',
        objective: 'Progresar desde el portero con tres jugadores de primera línea y dos MC, moviendo al rival antes de atacar el lado libre.',
        material: '2 porterías, 4 puertas de conos, balones, petos de dos colores y setas.',
        organization: 'Cada ataque comienza desde el portero. El equipo poseedor se organiza en 3+2. Los cinco defensores presionan; si recuperan, disponen de cinco segundos para finalizar sobre la portería grande.',
        development: 'Siete minutos guiados, un minuto de corrección, siete minutos libres, un minuto de corrección y ocho minutos de competición. Después de cada acción se intercambian ataque y defensa.',
        rules: 'La salida vale un punto si participa un MC y dos puntos si intervienen los dos MC y se cambia de lado. La acción continúa tras robo hasta salida, gol, disparo fuera o balón fuera.',
        rotations: 'Los jugadores intercambian roles al finalizar cada acción. Porteros: 0-8 Eric/Tomás y Daniel relevo; 8-16 Daniel/Eric y Tomás relevo; 16-24 Tomás/Daniel y Eric relevo.',
        coachingPoints: 'Central atrae antes de pasar; MC cercano ayuda por detrás de la presión; MC alejado se coloca en diagonal; si no se puede avanzar, volver al portero.',
        load: 'Media-alta por la continuidad y las transiciones breves.',
        notes: 'Evitar convertir la tarea en un ataque directo permanente. Primero ordenar, atraer y encontrar al MC libre.',
        diagram: 'ataque-mc-progresion',
      },
      {
        id: 'ataque-mc-partido-23',
        title: 'Partido condicionado · 8 contra 8 + 2 MC comodines',
        type: 'Juego colectivo condicionado · transferencia al 3-4-2-1',
        durationMin: 28,
        players: '23: 8 contra 8, dos MC comodines, Eric y Tomás inicialmente en portería, dos relevos de campo y Daniel como primer portero de relevo.',
        space: 'Todo el campo chico disponible, aproximadamente 45×32 m, dividido visualmente en tres carriles verticales.',
        objective: 'Transferir la distribución del doble pivote al ataque organizado y encontrar al equipo alejado cuando el rival cierra el lado del balón.',
        material: '2 porterías, balones en ambos fondos, petos de tres colores y conos para señalar los carriles.',
        organization: 'Cada equipo de ocho se organiza con 3 centrales, 2 carrileros, 2 mediapuntas y 1 delantero. Los dos MC comodines juegan con el poseedor y completan el 3-4-2-1.',
        development: 'Ocho minutos guiados, un minuto de corrección, ocho minutos libres, un minuto de corrección, nueve minutos de partido y un minuto de pregunta final. Todos los reinicios comienzan desde un portero.',
        rules: 'Gol válido si participa al menos un MC. Gol doble si intervienen los dos MC, el balón cambia de carril y aparece un último pase. Tras pérdida, cinco segundos para recuperar; si no, reorganizarse.',
        rotations: 'Los dos relevos sustituyen cada cuatro minutos a un carrilero y un mediapunta; nadie permanece fuera más de cuatro minutos. Porteros: 0-9 Eric/Tomás y Daniel relevo; 9-18 Daniel/Eric y Tomás relevo; 18-27 Tomás/Daniel y Eric relevo.',
        coachingPoints: 'MC cercano apoya; MC alejado da salida diagonal. Recibir perfilado, jugar al tercer hombre y cambiar antes de que el rival llegue a cerrar.',
        load: 'Media-alta, con correcciones breves y continuidad de partido.',
        notes: 'Pregunta final: cuando el rival cierra el lado del balón, ¿dónde debe colocarse el segundo MC?',
        diagram: 'ataque-mc-partido',
      },
    ],
  }
}

export function createDefaultSessionLibrary(): DaniaSessionLibrary {
  const previous = createDefaultDaniaSession()
  const salida = createSalida3421Session()
  const repliegue = createRepliegue21Session()
  const current = createUltimoPase22Session()
  const ataqueMc = createAtaqueMc23Session()
  return { version: 5, activeId: ataqueMc.id, sessions: [previous, salida, repliegue, current, ataqueMc] }
}

export function normalizeSessionLibrary(value: unknown): DaniaSessionLibrary {
  if (!value || typeof value !== 'object') return createDefaultSessionLibrary()
  const candidate = value as Partial<DaniaSessionLibrary> & { version?: number }
  if (![1, 2, 3, 4, 5].includes(Number(candidate.version)) || !Array.isArray(candidate.sessions) || !candidate.sessions.length) return createDefaultSessionLibrary()
  const sessions = clone(candidate.sessions.filter(session => session && typeof session.id === 'string' && Array.isArray(session.tasks)))
  if (!sessions.length) return createDefaultSessionLibrary()
  const hasSalidaSession = sessions.some(session => session.id === SALIDA_3421_SESSION_ID)
  if (candidate.version === 1 && !hasSalidaSession) sessions.push(createSalida3421Session())
  const hasRepliegueSession = sessions.some(session => session.id === REPLIEGUE_21_SESSION_ID)
  if (Number(candidate.version) < 3 && !hasRepliegueSession) sessions.push(createRepliegue21Session())
  const hasUltimoPaseSession = sessions.some(session => session.id === ULTIMO_PASE_22_SESSION_ID)
  if (Number(candidate.version) < 4 && !hasUltimoPaseSession) sessions.push(createUltimoPase22Session())
  const hasAtaqueMcSession = sessions.some(session => session.id === ATAQUE_MC_23_SESSION_ID)
  if (Number(candidate.version) < 5 && !hasAtaqueMcSession) sessions.push(createAtaqueMc23Session())
  const migratedToAtaqueMc = Number(candidate.version) < 5 && !hasAtaqueMcSession
  const activeId = migratedToAtaqueMc
    ? ATAQUE_MC_23_SESSION_ID
    : sessions.some(session => session.id === candidate.activeId) ? String(candidate.activeId) : sessions[0].id
  return { version: 5, activeId, sessions }
}

export function sessionTaskMinutes(session: DaniaSession): number {
  return session.tasks.reduce((total, task) => total + Math.max(0, Number(task.durationMin) || 0), 0)
}

const escapeHtml = (value: unknown): string => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;')

const withBreaks = (value: unknown): string => escapeHtml(value).replaceAll('\n', '<br>')

const fileStem = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'sesion-dania'

export function sessionDownloadName(session: DaniaSession, extension: 'html' | 'json'): string {
  return `${fileStem(session.title)}.${extension}`
}

type SessionScene = ReturnType<typeof createDaniaTask>['boards'][number]['scene']
export type SessionSceneRenderer = (scene: SessionScene) => string

const exportDiagram = (key: DaniaTaskKey, renderScene: SessionSceneRenderer): string => {
  const project = createDaniaTask(key, 0)
  return `<div class="diagram-grid">${project.boards.map(board => `
    <figure><div class="diagram">${renderScene(board.scene)}</div><figcaption>${escapeHtml(board.title)}</figcaption></figure>`).join('')}</div>`
}

export function buildSessionExportHtml(session: DaniaSession, renderScene: SessionSceneRenderer): string {
  const general: readonly [string, unknown][] = [
    ['Equipo', session.team], ['Día / fecha', `${session.day}${session.date ? ` · ${session.date}` : ''}`],
    ['Convocatoria', `${session.arrivalTime} · ${session.arrivalInstruction}`], ['Inicio previsto', session.plannedStart],
    ['Lugar', `${session.venue} · ${session.field}`], ['Duración', `${session.durationMin} min`],
    ['Disponibles', `${session.participants} (${session.goalkeepers} porteros: ${session.availableGoalkeepers})`], ['Entrenadores', session.coachCount],
    ['Bajas', session.absences], ['Nivel', session.level], ['Objetivo principal', session.mainObjective],
    ['Objetivos secundarios', session.secondaryObjectives], ['Metodología', session.methodology], ['Material', session.material],
    ['Carga', session.load], ['Notas generales', session.generalNotes],
  ]
  const tasks = session.tasks.map((task, index) => `<section class="task">
    <header><span>Tarea ${index + 1}</span><h2>${escapeHtml(task.title)}</h2><strong>${Number(task.durationMin) || 0} min</strong></header>
    ${task.diagram ? exportDiagram(task.diagram, renderScene) : ''}
    <dl>
      ${([
        ['Tipo', task.type], ['Jugadores', task.players], ['Espacio', task.space], ['Objetivo', task.objective],
        ['Material', task.material], ['Organización', task.organization], ['Desarrollo', task.development],
        ['Reglas', task.rules], ['Relevos', task.rotations], ['Correcciones', task.coachingPoints],
        ['Carga', task.load], ['Notas', task.notes],
      ] as const).map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${withBreaks(value)}</dd></div>`).join('')}
    </dl>
  </section>`).join('')

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(session.title)} · DanIA Táctica</title><style>
  @page{size:A4 landscape;margin:11mm}*{box-sizing:border-box}body{margin:0;color:#203127;background:#fff;font:13px/1.45 Arial,sans-serif}main{max-width:1120px;margin:auto}h1{margin:0 0 6px;font-size:28px}h2{margin:0;font-size:20px}.eyebrow{color:#8c6417;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.summary{margin:20px 0;display:grid;grid-template-columns:repeat(2,1fr);border:1px solid #d8d3c7;border-radius:12px;overflow:hidden}.summary div{padding:9px 12px;border-right:1px solid #e7e2d7;border-bottom:1px solid #e7e2d7}.summary dt,.task dt{color:#6b756d;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.summary dd,.task dd{margin:3px 0 0}.task{break-before:page;padding-top:2mm}.task header{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding-bottom:10px;border-bottom:2px solid #8c6417}.task header span,.task header strong{color:#8c6417;font-weight:800}.diagram-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.diagram{aspect-ratio:5/4;border:1px solid #d8d3c7;border-radius:8px;overflow:hidden;background:#faf9f5}.diagram svg{display:block;width:100%;height:100%}figure{margin:0}figcaption{text-align:center;color:#6b756d;font-size:10px;margin-top:3px}.task dl{display:grid;grid-template-columns:repeat(2,1fr);gap:0 18px}.task dl div{padding:7px 0;border-bottom:1px solid #e7e2d7}.task dd{margin:2px 0 0}.footer{margin-top:16px;color:#6b756d;font-size:10px}@media print{.task{break-before:page}}
  </style></head><body><main><p class="eyebrow">DanIA Táctica · Plan de sesión</p><h1>${escapeHtml(session.title)}</h1>
  <p>${escapeHtml(session.team)} · ${escapeHtml(session.venue)} · ${Number(session.durationMin) || 0} minutos planificados (${sessionTaskMinutes(session)} minutos de tareas).</p>
  <dl class="summary">${general.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${withBreaks(value)}</dd></div>`).join('')}</dl>
  ${tasks}<p class="footer">Documento creado en DanIA Táctica. Los esquemas son orientativos y editables en la pizarra.</p></main></body></html>`
}

type SessionField = keyof Omit<DaniaSession, 'id' | 'tasks'>
type TaskField = keyof Omit<DaniaSessionTask, 'id' | 'diagram'>
type FieldSpec<T extends string> = { key: T; label: string; rows?: number; number?: boolean; wide?: boolean }

const SESSION_FIELDS: readonly FieldSpec<SessionField>[] = [
  { key: 'title', label: 'Nombre de la sesión', wide: true },
  { key: 'team', label: 'Equipo' }, { key: 'day', label: 'Día' }, { key: 'date', label: 'Fecha' },
  { key: 'arrivalTime', label: 'Hora de convocatoria' }, { key: 'arrivalInstruction', label: 'Indicaciones de llegada', rows: 2, wide: true },
  { key: 'plannedStart', label: 'Inicio previsto', rows: 2 }, { key: 'durationMin', label: 'Duración total (min)', number: true },
  { key: 'venue', label: 'Lugar' }, { key: 'field', label: 'Campo / espacio' },
  { key: 'participants', label: 'Jugadores disponibles', number: true }, { key: 'goalkeepers', label: 'Porteros', number: true },
  { key: 'availableGoalkeepers', label: 'Porteros disponibles' }, { key: 'coachCount', label: 'Entrenadores', number: true },
  { key: 'absences', label: 'Bajas', rows: 2, wide: true }, { key: 'level', label: 'Nivel y características', rows: 3, wide: true },
  { key: 'mainObjective', label: 'Objetivo principal', rows: 3, wide: true },
  { key: 'secondaryObjectives', label: 'Objetivos secundarios', rows: 3, wide: true },
  { key: 'methodology', label: 'Estructura y metodología', rows: 4, wide: true },
  { key: 'material', label: 'Material general', rows: 3 }, { key: 'load', label: 'Carga general', rows: 3 },
  { key: 'generalNotes', label: 'Notas generales', rows: 4, wide: true },
]

const TASK_FIELDS: readonly FieldSpec<TaskField>[] = [
  { key: 'title', label: 'Nombre de la tarea', wide: true }, { key: 'type', label: 'Tipo' },
  { key: 'durationMin', label: 'Duración (min)', number: true }, { key: 'players', label: 'Jugadores', rows: 2 },
  { key: 'space', label: 'Espacio', rows: 2 }, { key: 'objective', label: 'Objetivo', rows: 3, wide: true },
  { key: 'material', label: 'Material', rows: 2 }, { key: 'organization', label: 'Organización', rows: 3 },
  { key: 'development', label: 'Desarrollo', rows: 4, wide: true }, { key: 'rules', label: 'Reglas / condicionantes', rows: 3 },
  { key: 'rotations', label: 'Relevos y rotaciones', rows: 3 }, { key: 'coachingPoints', label: 'Correcciones del entrenador', rows: 3, wide: true },
  { key: 'load', label: 'Carga', rows: 2 }, { key: 'notes', label: 'Notas', rows: 3 },
]

const fieldMarkup = <T extends string>(field: FieldSpec<T>, value: unknown, attrs: string): string => {
  const classes = `dania-session-field${field.wide ? ' wide' : ''}`
  const input = field.rows
    ? `<textarea rows="${field.rows}" ${attrs}>${escapeHtml(value)}</textarea>`
    : `<input type="${field.number ? 'number' : 'text'}"${field.number ? ' min="0" step="1"' : ''} value="${escapeHtml(value)}" ${attrs}>`
  return `<label class="${classes}"><span>${escapeHtml(field.label)}</span>${input}</label>`
}

const freshId = (): string => `dania-session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const emptyTask = (): DaniaSessionTask => ({
  id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: 'Nueva tarea', type: '', durationMin: 10, players: '', space: '', objective: '', material: '',
  organization: '', development: '', rules: '', rotations: '', coachingPoints: '', load: '', notes: '',
})

type PlannerOptions = {
  trigger: HTMLButtonElement
  openTask: (key: DaniaTaskKey) => boolean
  notify: (message: string) => void
  renderScene: SessionSceneRenderer
}

export function mountDaniaSessionPlanner({ trigger, openTask, notify, renderScene }: PlannerOptions): { open: () => void; close: () => void } {
  const raw = (() => { try { return localStorage.getItem(DANIA_SESSION_STORAGE_KEY) } catch { return null } })()
  const library = normalizeSessionLibrary(raw ? (() => { try { return JSON.parse(raw) } catch { return null } })() : null)
  let lastFocus: HTMLElement | null = null

  document.body.insertAdjacentHTML('beforeend', `<div class="dania-session-modal" id="dania-session-modal" role="dialog" aria-modal="true" aria-labelledby="dania-session-title" hidden>
    <div class="dania-session-shell">
      <header class="dania-session-header">
        <div><p>Planificador</p><h2 id="dania-session-title">Sesiones de entrenamiento</h2></div>
        <button type="button" class="dania-session-close" data-session-action="close" aria-label="Cerrar planificador">×</button>
      </header>
      <div class="dania-session-controls">
        <label><span>Sesión guardada</span><select data-session-picker></select></label>
        <button type="button" data-session-action="new">Nueva</button>
        <button type="button" data-session-action="duplicate">Duplicar</button>
        <button type="button" data-session-action="delete" class="danger">Eliminar</button>
      </div>
      <div class="dania-session-actions">
        <span data-session-status role="status" aria-live="polite">Guardada en este navegador</span>
        <button type="button" data-session-action="save">Guardar</button>
        <button type="button" data-session-action="json">Exportar JSON</button>
        <button type="button" data-session-action="html">Descargar sesión</button>
        <button type="button" data-session-action="print" class="primary">PDF / Imprimir</button>
      </div>
      <main class="dania-session-content" data-session-content></main>
    </div>
  </div>`)

  const modal = document.querySelector<HTMLDivElement>('#dania-session-modal')!
  const content = modal.querySelector<HTMLElement>('[data-session-content]')!
  const picker = modal.querySelector<HTMLSelectElement>('[data-session-picker]')!
  const status = modal.querySelector<HTMLElement>('[data-session-status]')!

  const current = (): DaniaSession => library.sessions.find(session => session.id === library.activeId) || library.sessions[0]
  const persist = (): boolean => {
    try {
      localStorage.setItem(DANIA_SESSION_STORAGE_KEY, JSON.stringify(library))
      status.textContent = `Guardada · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
      return true
    } catch {
      status.textContent = 'No se ha podido guardar en este navegador'
      return false
    }
  }

  const render = () => {
    const session = current()
    picker.innerHTML = library.sessions.map(item => `<option value="${escapeHtml(item.id)}"${item.id === session.id ? ' selected' : ''}>${escapeHtml(item.title)}</option>`).join('')
    const taskMinutes = sessionTaskMinutes(session)
    content.innerHTML = `<section class="dania-session-card">
      <div class="dania-session-card-title"><div><p>Datos generales</p><h3>${escapeHtml(session.title)}</h3></div><span>${taskMinutes}/${session.durationMin} min en tareas</span></div>
      <div class="dania-session-grid">${SESSION_FIELDS.map(field => fieldMarkup(field, session[field.key], `data-session-field="${field.key}"`)).join('')}</div>
    </section>
    <section class="dania-session-task-list">
      <div class="dania-session-list-title"><div><p>Plan de trabajo</p><h3>Tareas de la sesión</h3></div><button type="button" data-session-action="add-task">+ Añadir tarea</button></div>
      ${session.tasks.map((task, index) => `<article class="dania-session-task" data-task-id="${escapeHtml(task.id)}">
        <div class="dania-session-task-head">
          <div><span>${index + 1}</span><div><strong>${escapeHtml(task.title)}</strong><small>${Number(task.durationMin) || 0} min${task.diagram ? ' · 3 pizarras vinculadas' : ''}</small></div></div>
          <div class="dania-session-task-tools">
            <button type="button" data-task-action="up" aria-label="Subir tarea"${index === 0 ? ' disabled' : ''}>↑</button>
            <button type="button" data-task-action="down" aria-label="Bajar tarea"${index === session.tasks.length - 1 ? ' disabled' : ''}>↓</button>
            <button type="button" data-task-action="delete" aria-label="Eliminar tarea">×</button>
          </div>
        </div>
        ${task.diagram ? `<div class="dania-session-diagrams">${createDaniaTask(task.diagram, 0).boards.map(board => `<figure>${renderScene(board.scene)}<figcaption>${escapeHtml(board.title)}</figcaption></figure>`).join('')}</div>
          <button type="button" class="dania-open-diagram" data-task-action="open-diagram">Abrir y editar las 3 pizarras</button>` : '<p class="dania-no-diagram">Esta tarea no tiene una pizarra vinculada.</p>'}
        <div class="dania-session-grid task-fields">${TASK_FIELDS.map(field => fieldMarkup(field, task[field.key], `data-task-field="${field.key}"`)).join('')}</div>
      </article>`).join('')}
    </section>`
  }

  const close = () => {
    if (modal.hidden) return
    modal.hidden = true
    document.body.classList.remove('dania-session-open')
    lastFocus?.focus()
  }
  const open = () => {
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : trigger
    render()
    modal.hidden = false
    document.body.classList.add('dania-session-open')
    modal.querySelector<HTMLButtonElement>('[data-session-action="close"]')?.focus()
  }

  const downloadBlob = (name: string, blob: Blob) => {
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href; anchor.download = name
    document.body.appendChild(anchor); anchor.click(); anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
  }

  trigger.addEventListener('click', open)
  picker.addEventListener('change', () => { library.activeId = picker.value; persist(); render() })
  modal.addEventListener('input', event => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | null
    if (!target) return
    const field = target.dataset.sessionField as SessionField | undefined
    if (field) {
      const numeric = SESSION_FIELDS.find(item => item.key === field)?.number
      ;(current() as unknown as Record<string, unknown>)[field] = numeric ? Math.max(0, Number(target.value) || 0) : target.value
      persist(); return
    }
    const taskField = target.dataset.taskField as TaskField | undefined
    const taskHost = target.closest<HTMLElement>('[data-task-id]')
    if (!taskField || !taskHost) return
    const task = current().tasks.find(item => item.id === taskHost.dataset.taskId)
    if (!task) return
    const numeric = TASK_FIELDS.find(item => item.key === taskField)?.number
    ;(task as unknown as Record<string, unknown>)[taskField] = numeric ? Math.max(0, Number(target.value) || 0) : target.value
    persist()
  })

  modal.addEventListener('click', event => {
    if (event.target === modal) { close(); return }
    const action = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-session-action]')?.dataset.sessionAction
    if (action === 'close') { close(); return }
    if (action === 'save') { persist(); notify('Sesión guardada en este navegador.'); return }
    if (action === 'new') {
      const session = createDefaultDaniaSession()
      session.id = freshId(); session.title = 'Nueva sesión'; session.date = ''; session.tasks = [emptyTask()]
      library.sessions.push(session); library.activeId = session.id; persist(); render(); return
    }
    if (action === 'duplicate') {
      const session = clone(current()); session.id = freshId(); session.title = `${session.title} · copia`
      session.tasks.forEach(task => { task.id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` })
      library.sessions.push(session); library.activeId = session.id; persist(); render(); return
    }
    if (action === 'delete') {
      if (library.sessions.length === 1) { notify('Debe quedar al menos una sesión guardada.'); return }
      if (!confirm(`¿Eliminar “${current().title}”? Esta acción solo afecta a este navegador.`)) return
      library.sessions = library.sessions.filter(session => session.id !== library.activeId)
      library.activeId = library.sessions[0].id; persist(); render(); return
    }
    if (action === 'add-task') { current().tasks.push(emptyTask()); persist(); render(); return }
    if (action === 'json') {
      const session = current()
      downloadBlob(sessionDownloadName(session, 'json'), new Blob([JSON.stringify(session, null, 2)], { type: 'application/json;charset=utf-8' }))
      notify('Datos de la sesión exportados.'); return
    }
    if (action === 'html') {
      const session = current()
      downloadBlob(sessionDownloadName(session, 'html'), new Blob([buildSessionExportHtml(session, renderScene)], { type: 'text/html;charset=utf-8' }))
      notify('Sesión descargada con todos sus datos y diagramas.'); return
    }
    if (action === 'print') {
      const printWindow = window.open('', '_blank', 'popup,width=1200,height=900')
      if (!printWindow) { notify('El navegador ha bloqueado la ventana de impresión. Permite ventanas emergentes y vuelve a intentarlo.'); return }
      printWindow.opener = null
      let printed = false
      const print = () => {
        if (printed || printWindow.closed) return
        printed = true; printWindow.focus(); printWindow.print()
      }
      printWindow.addEventListener('load', print, { once: true })
      printWindow.document.open(); printWindow.document.write(buildSessionExportHtml(current(), renderScene)); printWindow.document.close()
      window.setTimeout(print, 500)
      return
    }

    const taskButton = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-task-action]')
    const taskHost = taskButton?.closest<HTMLElement>('[data-task-id]')
    const task = current().tasks.find(item => item.id === taskHost?.dataset.taskId)
    if (!taskButton || !task) return
    const index = current().tasks.indexOf(task)
    if (taskButton.dataset.taskAction === 'open-diagram' && task.diagram) {
      if (openTask(task.diagram)) close()
    } else if (taskButton.dataset.taskAction === 'delete') {
      if (!confirm(`¿Eliminar la tarea “${task.title}” de esta sesión?`)) return
      current().tasks.splice(index, 1); persist(); render()
    } else if (taskButton.dataset.taskAction === 'up' && index > 0) {
      ;[current().tasks[index - 1], current().tasks[index]] = [current().tasks[index], current().tasks[index - 1]]
      persist(); render()
    } else if (taskButton.dataset.taskAction === 'down' && index < current().tasks.length - 1) {
      ;[current().tasks[index + 1], current().tasks[index]] = [current().tasks[index], current().tasks[index + 1]]
      persist(); render()
    }
  })
  modal.addEventListener('keydown', event => {
    event.stopPropagation()
    if (event.key === 'Escape') { event.preventDefault(); close() }
  })

  return { open, close }
}

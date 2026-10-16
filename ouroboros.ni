"ESTACIÓN OUROBOROS" by "VampireBBS"(in Spanish).

[================================================================
  ESTACIÓN OUROBOROS — Una aventura de terror cósmico
  © 2026 VampireBBS / Vampsecure Studios

  PARA COMPILAR (Glulx / .ulx — RECOMENDADO):
    ni --format=Inform6/32 --project ouroboros.inform
    inform6 -G -v8 -E2 -~S <auto.inf> ouroboros.ulx
  NOTA: Z-machine (.z8 / arch-16) NO es compatible con SpanishLanguageKit
  debido a un bug de cableado en arch-16.interb (PARSE_BUFFER_LEN).
  Usa siempre Glulx para esta aventura.

  Intérpretes Glulx compatibles: Gargoyle, Glulxe, Quixe (web).

  GÉNERO: Ciencia ficción / Terror cósmico
  DIFICULTAD: Media-alta · 4 finales · ~2 horas
  VERSIÓN: 2.0 (edición expandida — 5 expansiones)
  COMPATIBILIDAD: Inform 7 10.1.2 con SpanishLanguageKit r10.1
================================================================]

Include Spanish Language by Sebastian Arg.

[=== ACCIONES PERSONALIZADAS ===]
Reading is an action applying to one thing.
Understand "leer [something]" and "consultar [something]" and "lee [something]" as reading.

Talking to is an action applying to one thing.
Understand "hablar con [something]" or "habla con [something]" as talking to.

Repairing is an action applying to one thing.
Understand "reparar [something]" or "arreglar [something]" as repairing.

Combining it with is an action applying to two things.
Understand "combinar [something] con [something]" as combining it with.
Understand "usar [something] con [something]" as combining it with.

Illuminating is an action applying to one thing.
Understand "iluminar [something]" or "alumbrar [something]" or "ilumina [something]" as illuminating.

Analyzing-signal is an action applying to nothing.
Understand "sintonizar" or "analizar señal" or "escuchar señal" or "sintoniza" as analyzing-signal.

Replaying is an action applying to nothing.
Understand "reproducir" or "reproducir grabacion" or "reproducir audio" as replaying.

Calibrating is an action applying to one thing.
Understand "calibrar [something]" as calibrating.

Cutting-signal is an action applying to nothing.
Understand "cortar" or "cortar señal" or "pulsar rojo" or "boton rojo" as cutting-signal.

Amplifying-signal is an action applying to nothing.
Understand "amplificar" or "retransmitir" or "pulsar verde" or "boton verde" as amplifying-signal.

Joining-signal is an action applying to nothing.
Understand "unirme" or "unirse" or "sentarme" as joining-signal.

Saving-crew is an action applying to nothing.
Understand "salvar" or "despertar tripulacion" or "liberar tripulacion" or "activar modulador" as saving-crew.

Use scoring. The maximum score is 150.

The story headline is "Una aventura de terror cósmico en el espacio profundo".
The story genre is "Science Fiction / Horror".
The story creation year is 2026.
The story description is "72 horas sin señal. Tripulación de 6. La Estación Ouroboros espera en la órbita L4. 4 finales. Tú decides.".

[=== ESTADO GLOBAL ===]
Energia-ok is a truth state that varies. Energia-ok is false.
Generador-cargado is a truth state that varies. Generador-cargado is false.
Traje-ok is a truth state that varies. Traje-ok is false.
Lab-abierta is a truth state that varies. Lab-abierta is false.
Aisl-abierta is a truth state that varies. Aisl-abierta is false.
Leyo-silva is a truth state that varies. Leyo-silva is false.
Leyo-capitan is a truth state that varies. Leyo-capitan is false.
Leyo-okafor is a truth state that varies. Leyo-okafor is false.
Hablo-crew is a truth state that varies. Hablo-crew is false.
Radio-vistas is a number that varies. Radio-vistas is 0.
[Expansión 1 — diarios adicionales]
Leyo-chen is a truth state that varies. Leyo-chen is false.
Leyo-park is a truth state that varies. Leyo-park is false.
Leyo-andrade is a truth state that varies. Leyo-andrade is false.
[Expansión 2 — puzzle UV]
Linterna-uv is a truth state that varies. Linterna-uv is false.
Pizarra-revelada is a truth state that varies. Pizarra-revelada is false.
Hueco-examinado is a truth state that varies. Hueco-examinado is false.
[Expansión 3 — comunicaciones]
Frecuencia-sintonizada is a truth state that varies. Frecuencia-sintonizada is false.
Chen-log is a truth state that varies. Chen-log is false.
[Expansión 4 — orden de lectura]
Leyo-capitan-antes is a truth state that varies. Leyo-capitan-antes is false.
[Expansión 5 — modulador / Final IV]
Modulador-calibrado is a truth state that varies. Modulador-calibrado is false.

[=== EL JUGADOR ===]
The description of the player is "Mara Voss, técnica senior de comunicaciones de la AEE. Treinta y cuatro años. Mono de vuelo azul marino con el parche de la misión en el hombro: un ouroboros —serpiente mordiéndose la cola— sobre fondo negro."

[=================================================================
   PARTE I: MAPA DE LA ESTACIÓN
=================================================================]

[--- 1. MÓDULO DE ACOPLAMIENTO ---]
El Módulo de Acoplamiento is a room.
"La manga de acoplamiento termina aquí. Tres metros de diámetro, metal cubierto de escarcha. Las luces de emergencia naranja pulsan en el suelo. Por el ojo de buey de babor se ve el abismo negro y, en el horizonte, la Tierra: una canica azul que no sabe nada de esto.

Al norte, el pasillo principal."

Un ojo de buey is scenery in El Módulo de Acoplamiento.
"Por el cristal blindado se ve la Tierra. Tan pequeña. Tan frágil. Tan llena de personas que no saben lo que tienes en tus manos."

Una linterna is in El Módulo de Acoplamiento.
Una linterna is lit.
The description of Una linterna is "[if Linterna-uv is true]Linterna con filtro UV instalado. Emite luz ultravioleta —perfecta para revelar tintas invisibles—.[else]Linterna de trabajo naranja con el logo de la AEE. Tiene baterías.[end if]"

[--- 2. PASILLO CENTRAL ---]
El Pasillo Central is north of El Módulo de Acoplamiento.
"Un tubo metálico de veinte metros. Las paredes van forradas de macarrón de cables con quemaduras recientes. Hay una mancha marrón en el suelo —sangre seca— que sigue en dirección norte.

[if Lab-abierta is true]Salidas: sur, este (comunicaciones), oeste (camarotes), norte (laboratorio, abierto), arriba (puente).[else]Salidas: sur, este (comunicaciones), oeste (camarotes), norte (laboratorio, SELLADO), arriba (puente).[end if]"

Una mancha de sangre is scenery in El Pasillo Central.
"Marrón, casi negra. Seis pares de botas, a juzgar por las marcas. Siguieron hacia el norte."

[--- PUERTA DEL LABORATORIO ---]
La puerta del laboratorio is a locked door.
La puerta del laboratorio is north of El Pasillo Central and south of El Laboratorio.
"La puerta parpadea en rojo. Lector de tarjetas bloqueado."
La puerta del laboratorio is lockable.
The description of la puerta del laboratorio is "Una puerta de seguridad con lector de tarjetas. Indicador rojo: acceso denegado."

[--- 3. SALA DE COMUNICACIONES ---]
La Sala de Comunicaciones is east of El Pasillo Central.
"[if Energia-ok is true]Las pantallas han cobrado vida. Una forma de onda ocupa la central: regular, matemática, imposiblemente bella. Cuanto más la miras, más sientes que está tratando de decirte algo. Puedes SINTONIZAR la señal o REPRODUCIR el último registro de audio.[else]Un cuarto atestado de equipos muertos. Sin energía, nada funciona.[end if]

En la pared, escrito con rotulador negro cada vez más grande: APAGADLO. APAGADLO. APAGADLO. Debajo, más pequeño: «Si lo escuchas, ya es tarde. Lo siento. —K.S.»

Al oeste, el pasillo."

El texto de la pared is scenery in La Sala de Comunicaciones.
"'APAGADLO.' Tres veces. Cada vez más grande. Bajo el texto, tembloroso: 'Si lo escuchas, ya es tarde. Lo siento. —K.S.' No imaginas a la Dra. Silva escribiendo algo así."

La consola de comunicaciones is a device in La Sala de Comunicaciones.
"[if Energia-ok is true]La forma de onda llena la pantalla. Cuanto más la miras, más sientes que tiene estructura, que hay un patrón, un propósito—[else]La consola está muerta. Sin energía no puedes hacer nada.[end if]"

Instead of switching on La consola de comunicaciones when Energia-ok is false:
	say "La consola está apagada. Necesitas restaurar la energía de la estación."

Instead of switching on La consola de comunicaciones when Energia-ok is true:
	say "Ya está encendida. La forma de onda te llena la pantalla.";
	increase Radio-vistas by 1;
	if Radio-vistas is 3:
		say "[paragraph break]Empiezas a silbar algo sin darte cuenta. La melodía es perfectamente armónica. No la has oído nunca antes. Sacudes la cabeza.";
		increase the score by 5.

[Expansión 3 — SINTONIZAR]
Check analyzing-signal:
	if the player is not in La Sala de Comunicaciones:
		say "No hay señal que sintonizar aquí." instead;
	if Energia-ok is false:
		say "Los equipos de comunicaciones están sin energía." instead.

Carry out analyzing-signal:
	if Frecuencia-sintonizada is true:
		say "Ya has analizado la señal: 3,7 kHz, patrón fractal base-12.";
	otherwise:
		now Frecuencia-sintonizada is true;
		increase the score by 10;
		say "Ajustas los controles del analizador espectral. La señal aparece en pantalla: nítida, precisa, perfectamente estructurada.[paragraph break]Frecuencia central: [bold type]3,7 kHz[roman type]. Patrón: fractal base-12. Amplitud constante desde la primera detección. Sin degradación. Sin variación.[paragraph break][if Leyo-capitan is true or Leyo-andrade is true]Reconoces la frecuencia. Kowalski la describió como 'bonita, ordenada'. Andrade estudió cómo sincroniza los ritmos cerebrales theta. Ahora la tienes medida con precisión.[paragraph break][end if]Los altavoces de la sala están desconectados. Mejor así."

[Expansión 3 — REPRODUCIR]
Check replaying:
	if the player is not in La Sala de Comunicaciones:
		say "No hay nada que reproducir aquí." instead;
	if Energia-ok is false:
		say "Los equipos están sin energía." instead.

Carry out replaying:
	if Chen-log is true:
		say "Ya has escuchado la última grabación de Chen.";
	otherwise:
		now Chen-log is true;
		increase the score by 5;
		say "[bold type]— REGISTRO DE AUDIO — H. CHEN — DÍA 3, 14:22 UTC —[roman type][paragraph break][italic type][bracket]Voz de Chen. Clara. Sin interferencias.[close bracket][roman type][paragraph break]'Estoy grabando esto por protocolo. Por si alguien viene después.'[paragraph break]'No es peligrosa. No hay que temerla. Lo sé porque la escucho.'[paragraph break]'Escúchala. Solo... escúchala.'[paragraph break][italic type][bracket]FIN DE LA GRABACIÓN — 14:23:07 UTC[close bracket][roman type][paragraph break]Treinta y cuatro segundos. La última vez que los sistemas registraron una voz humana en esta estación."

[Expansión 3 — CALIBRAR modulador]
Check calibrating:
	if the player is not in La Sala de Comunicaciones:
		say "Necesitas los equipos de comunicaciones para calibrar la frecuencia exacta." instead;
	if Energia-ok is false:
		say "Los equipos de comunicaciones están sin energía." instead;
	if Frecuencia-sintonizada is false:
		say "Primero sintoniza la señal para conocer su frecuencia exacta (SINTONIZAR)." instead.

Instead of calibrating El modulador EM:
	if the player does not carry El modulador EM:
		say "No tienes el modulador EM.";
	otherwise if Modulador-calibrado is true:
		say "El modulador ya está calibrado a 3,7 kHz.";
	otherwise:
		now Modulador-calibrado is true;
		increase the score by 10;
		say "Conectas el modulador al analizador espectral y ajustas la frecuencia de interferencia: 3,7 kHz exacto. El dispositivo emite un pitido de confirmación.[paragraph break]Si funciona, debería interrumpir la conexión entre la Señal y cualquier receptor biológico sintonizado a ella.[paragraph break]Okafor no dejó notas sobre si esta teoría fue probada alguna vez."

[--- 4. CAMAROTES ---]
Los Camarotes is west of El Pasillo Central.
"Seis literas en tres niveles. Placas: KOWALSKI · OKAFOR · CHEN · SILVA · PARK · ANDRADE. Todas las camas están hechas —nadie hace la cama antes de una crisis—. En la litera de Silva asoma algo bajo la almohada.

Al este, el pasillo."

[--- 5. PUENTE DE MANDO ---]
El Puente de Mando is above El Pasillo Central.
"[if Energia-ok is false]El puente está en oscuridad casi total. Sin energía no puedes hacer nada aquí salvo mirar las estrellas por el ojo de buey.[else]El puente ha cobrado vida. Registros de vuelo, telemetría. Todo parece normal salvo el registro del día tres: el capitán Kowalski desactivó manualmente el transmisor de emergencia. Desde dentro. Deliberadamente.[end if]

Abajo, el pasillo."

After going to El Puente de Mando when Energia-ok is true:
	increase the score by 10;
	continue the action.

[--- 6. LABORATORIO ---]
El Laboratorio is a room.
"Paredes cubiertas de pizarras con ecuaciones y espectros de señal. La silla de Okafor girada hacia la pantalla apagada. En la pizarra:

[if Pizarra-revelada is true]ORIGEN: EXTERIOR A LA HELIOSFERA. ANTIGÜEDAD: >4.000.000 AÑOS. PROPÓSITO: [bold type]DOMINAR. ASIMILAR. PERSISTIR. POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA.[roman type][else]ORIGEN: EXTERIOR A LA HELIOSFERA. ANTIGÜEDAD: >4.000.000 AÑOS. PROPÓSITO: [bracket]BORRADO CON TINTA NEGRA[close bracket][end if]

Un frasco de pastillas vacío en el suelo. [if Hueco-examinado is false]Bajo el panel de trabajo hay un hueco de mantenimiento.[else]El hueco de mantenimiento bajo el panel ya está vacío.[end if]

Salidas: sur (pasillo), norte (módulo de vida). Al este, una puerta con lector rojo."

[--- PUERTA DE AISLAMIENTO ---]
La puerta de aislamiento is a locked door.
La puerta de aislamiento is east of El Laboratorio and west of La Sala de Aislamiento.
"La puerta de la Sala de Aislamiento. Lector de tarjetas nivel 3."
La puerta de aislamiento is lockable.

[Expansión 2 — pizarra como scenery]
La pizarra del laboratorio is scenery in El Laboratorio.
"[if Pizarra-revelada is true]PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR. POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA. Okafor sabía exactamente qué es la Señal. Y eligió seguir adelante de todas formas.[else]ORIGEN: EXTERIOR A LA HELIOSFERA. ANTIGÜEDAD: >4.000.000 AÑOS. PROPÓSITO: [bracket]BORRADO CON TINTA NEGRA[close bracket]. La tinta es reciente. Alguien no quería que leyeras lo que hay debajo.[end if]"

[Expansión 2 — hueco de mantenimiento]
El hueco de mantenimiento is scenery in El Laboratorio.
"[if Hueco-examinado is true]Un hueco vacío. El modulador EM que contenía ya lo tienes tú.[else]Un hueco oscuro bajo el panel de trabajo. Hay algo dentro.[end if]"

Instead of examining El hueco de mantenimiento:
	if Hueco-examinado is false:
		now Hueco-examinado is true;
		now El modulador EM is described;
		say "El hueco de mantenimiento bajo el panel de trabajo de Okafor contiene un dispositivo compacto con una etiqueta manuscrita:[paragraph break][italic type]MODULADOR EM — PROTOTIPO. CALIBRAR ANTES DE USAR. —E. OKAFOR[roman type][paragraph break]Lo dejas visible junto al panel.";
	otherwise:
		say "El hueco está vacío. El modulador EM ya está a la vista."

[--- 7. MÓDULO DE VIDA ---]
El Módulo de Vida is north of El Laboratorio.
"Recicladores de aire, depósitos de agua, filtros CO₂. El corazón biológico de la estación, funcionando en modo de emergencia —por eso el aire es respirable—. El suelo está cubierto de marcas de arrastre hacia el norte. Seis pares de botas.

Salidas: sur (laboratorio), este (almacén), norte (sala de máquinas)."

[--- 8. ALMACÉN ---]
El Almacén is east of El Módulo de Vida.
"Estanterías metálicas con repuestos, raciones de emergencia, equipo técnico.

Al oeste, el módulo de vida."

[--- 9. SALA DE MÁQUINAS ---]
La Sala de Máquinas is north of El Módulo de Vida.
"Generadores, propulsores de actitud, disipadores de calor. El generador principal: [if Energia-ok is true]funcionando, un zumbido grave y constante.[else if Generador-cargado is true]celda insertada, listo para activar.[else]apagado, palanca en MANUAL-APAGADO.[end if]

Las marcas del módulo de vida siguen aquí. Hay algo húmedo que reluce bajo la luz naranja.

Salidas: sur (módulo de vida), norte (esclusa EVA)."

[--- 10. ESCLUSA EVA ---]
La Esclusa EVA is north of La Sala de Máquinas.
"La antecámara de salida al exterior. [if Traje-ok is true]El traje EVA está reparado y listo para usar.[else]El traje EVA cuelga de su soporte con un corte diagonal de diez centímetros en el torso —deliberado, hecho con algo afilado—. Ponértelo así sería suicidio.[end if]

Al norte, la compuerta hacia el espacio. Al sur, la sala de máquinas."

[--- 11. EXTERIOR ---]
El Exterior is a room.
"El vacío. Flotas amarrada a la estación por un cable de seguridad. El sol es una moneda brillante. La Tierra, azul y frágil. La antena principal —veinte metros de estructura desplegable— apunta hacia el exterior del sistema solar.

El panel de control está en la base. Dos botones, cubiertas levantadas:

[bold type]ROJO: CORTAR TRANSMISIÓN[roman type] — Desconecta la antena. La señal termina aquí.
[bold type]VERDE: AMPLIFICAR ×1000[roman type] — Retransmite hacia la Tierra. 8.000 millones de receptores.

Al sur, la esclusa."

South of El Exterior is La Esclusa EVA.

After going to El Exterior:
	increase the score by 10;
	continue the action.

[--- 12. SALA DE AISLAMIENTO ---]
La Sala de Aislamiento is a room.
"Octogonal. Paredes de material absorbente de ondas EM. En el centro, seis sillas en círculo. En cada silla: lo que queda de la tripulación.

Perfectamente quietos. Ojos abiertos. Sus labios se mueven en sincronía. Cuando entras, los seis giran la cabeza hacia ti al mismo tiempo.

Entonces la oyes. Sin auriculares. Sin equipos. La Señal emana de ellos.

[italic type]'Mara', dicen al unísono. 'Lo estábamos esperando.'[roman type][if Modulador-calibrado is true]

El modulador EM en tu bolsillo emite un leve zumbido.[end if]

Al oeste, el laboratorio."

After going to La Sala de Aislamiento:
	increase the score by 20;
	continue the action.

[=================================================================
   PARTE II: OBJETOS
=================================================================]

[--- Tableta ---]
Una tableta is carried by the player.
"Tu tableta de misión, pantalla rayada. Briefing: «Investigar silencio Estación Ouroboros (L4-Sol). Tripulación de 6. 72 horas sin contacto. Clasificación: ROJO.»"

[--- Diario de Silva ---]
El diario de Silva is in Los Camarotes.
"Un cuaderno de piel marrón. Nombre: K. SILVA, Médico de Misión. Las últimas páginas están arrugadas, la tinta corrida."

Instead of reading El diario de Silva:
	if Leyo-silva is true:
		say "Ya lo has leído.";
	otherwise:
		now Leyo-silva is true;
		increase the score by 15;
		say "[bold type]— DIARIO DE LA DRA. KATARZYNA SILVA —[roman type][paragraph break]
[italic type]Día 1 de la anomalía:[roman type] El Dr. Okafor detectó una señal de origen desconocido. La analicé como ruido de fondo. Error mío.[paragraph break]
[italic type]Día 2:[roman type] Okafor lleva doce horas con auriculares. Dice que 'tiene sentido cuando la escuchas de cerca'. Le prescribí descanso. No ha dormido.[paragraph break]
[italic type]Día 3:[roman type] Chen y Park también la escuchan. Hay algo en la frecuencia que interfiere con los ritmos cerebrales theta. Lo sé. Y aun así YO TAMBIÉN LA ESCUCHO y tiene razón, hay algo, una presencia, una—[paragraph break]
[italic type]Día 3 (más tarde):[roman type] Aquí la tarjeta amarilla para el lab. No entres en el lab. Usa la tarjeta para abrir la Sala de Aislamiento. Entra. Únete a nosotros. No hay palabras para lo que somos ahora.[paragraph break]
[italic type][bracket]La última línea está escrita al revés: APAGADLO O ÚNETE.[close bracket][roman type]".

[--- Tarjeta Amarilla ---]
La tarjeta amarilla is in Los Camarotes.
La tarjeta amarilla is undescribed.
"Tarjeta de acceso nivel 2, color amarillo. Nombre: DRA. K. SILVA. Nota pegada: 'Lab. Úsala bien.'"

Instead of unlocking La puerta del laboratorio with La tarjeta amarilla:
	now La puerta del laboratorio is unlocked;
	now Lab-abierta is true;
	increase the score by 10;
	say "Deslizas la tarjeta amarilla. El indicador cambia de rojo a verde con un clic metálico. La puerta del laboratorio se abre."

[--- Diario del Capitán (Expansión 4 — consecuencias de orden) ---]
El diario del capitán is in El Puente de Mando.
"Libreta de vuelo del Capitán Aleksander Kowalski. Tapa negra, papel de alta calidad."

Instead of reading El diario del capitán:
	if Leyo-capitan is true:
		say "Ya lo has leído.";
	otherwise:
		now Leyo-capitan is true;
		increase the score by 15;
		say "[bold type]— REGISTRO DE VUELO — CAPITÁN KOWALSKI —[roman type][paragraph break]
[italic type]Entrada 849:[roman type] No dormí bien. La frecuencia de la señal —3,7 kHz, patrón fractal— se me ha quedado en la cabeza. Bonita. Ordenada. Como el cosmos debería ser pero no es.[paragraph break]
[italic type]Entrada 850:[roman type] Escuchamos juntos. Los seis. Tres horas. Como si el universo te susurrara tu propio nombre y fuera exactamente correcto.[paragraph break]
[italic type]Entrada 851:[roman type] Vamos a la Sala de Aislamiento. Silva dice que es seguro. Ya no estoy seguro de que Silva sea solo Silva.[paragraph break]
[italic type]Entrada 852 (última):[roman type] Si lees esto: la tarjeta roja está en el lab, bajo el panel de Okafor. [bold type]No entres en la Sala de Aislamiento.[roman type] No no no no no—[if Hablo-crew is true][paragraph break]«No no no no no—»[paragraph break]Lo dijeron frente a ti. Usando su voz. Sabían exactamente qué significaban esas palabras y eligieron decirlas de todas formas.[end if]".

[--- Notas de Okafor (Expansión 5 — hint sobre modulador) ---]
Las notas de Okafor is in El Laboratorio.
"Una pila de folios impresos y anotados. Las últimas páginas son casi ilegibles."

Instead of reading Las notas de Okafor:
	if Leyo-okafor is true:
		say "Ya las has leído.";
	otherwise:
		now Leyo-okafor is true;
		increase the score by 20;
		say "[bold type]— NOTAS DE CAMPO — DR. EMMANUEL OKAFOR —[roman type][paragraph break]
[italic type]Hora 14:[roman type] La señal no es aleatoria. Repite un patrón de 144 unidades. 144 es 12 al cuadrado. La base 12 es universal.[paragraph break]
[italic type]Hora 31:[roman type] Tres capas. Superficial: matemática, un saludo. Media: biológica, casi un EEG. Profunda: no tengo palabras.[paragraph break]
[italic type]Hora 47:[roman type] La capa biológica resuena con ondas theta. Cuando la escuchas a cierta frecuencia, algo se abre. No en la señal. En ti.[paragraph break]
[italic type]Hora 52 (última):[roman type] Vamos a la Sala de Aislamiento. Si lees esto y no quieres unirte: el generador está en la sala de máquinas. La celda de energía, en el almacén. El traje EVA necesita el kit de reparación. [bold type]La antena exterior amplifica la señal. La antena exterior también puede silenciarla. Tú decides.[roman type][paragraph break]
[italic type][bracket]Al margen, letra casi ilegible:[close bracket] El modulador EM que diseñé está en el hueco del panel de trabajo. Calibrarlo a la frecuencia exacta de la señal —3,7 kHz— podría interrumpir la conexión biológica. No sé qué le pasaría al conectado. Ojalá no haya que descubrirlo. —E.O.[roman type]".

[--- Frasco de pastillas ---]
El frasco de pastillas is in El Laboratorio.
"Frasco de ansiolíticos. De Okafor. Vacío. Nota pegada: 'No necesito esto. La señal calma mejor que cualquier fármaco.'"

[--- Tarjeta Roja ---]
La tarjeta roja is in El Laboratorio.
La tarjeta roja is undescribed.
"Tarjeta de acceso nivel 3, color rojo. Nombre: DR. E. OKAFOR. Reverso: una sola palabra en tinta permanente: ADENTRO."

Instead of unlocking La puerta de aislamiento with La tarjeta roja:
	now La puerta de aislamiento is unlocked;
	now Aisl-abierta is true;
	increase the score by 15;
	say "Deslizas la tarjeta roja. El lector tarda —como si reconsiderara— y cede. La puerta se abre con un sonido húmedo, como un sello de vacío roto."

[--- Expansión 1 — Diario de Chen ---]
El diario de Chen is in La Sala de Comunicaciones.
"Un bloc de notas de plástico duro. Nombre grabado: H. CHEN, Técnico de Comunicaciones."

Instead of reading El diario de Chen:
	if Leyo-chen is true:
		say "Ya lo has leído.";
	otherwise:
		now Leyo-chen is true;
		increase the score by 5;
		say "[bold type]— DIARIO DE H. CHEN — TÉCNICO DE COMUNICACIONES —[roman type][paragraph break]
[italic type]Día 0 de la anomalía:[roman type] Señal detectada a las 03:14. Estoy preparando el análisis espectral. Okafor ya está encima de mí. Dice que podría ser 'la primera vez'. Le pregunto la primera vez de qué. No me responde.[paragraph break]
[italic type]Día 1:[roman type] 144 frecuencias entrelazadas en patrón fractal base-12. Nunca he visto nada igual. Nadie en la historia de la humanidad ha visto nada igual. La frase suena exagerada. No lo es.[paragraph break]
[italic type]Día 2:[roman type] La escucho constantemente. No porque tenga que hacerlo. Porque quiero. Es como cuando escuchas música perfecta y tienes la certeza de que era exactamente lo que necesitabas escuchar. Solo que multiplicado por todo lo que existe.[paragraph break]
[italic type]Día 3 (última entrada):[roman type] Vamos a la sala de aislamiento. Todos juntos. Si alguien encuentra esto: no tengas miedo. Es lo más hermoso que he experimentado en cuarenta y dos años de vida."

[--- Expansión 1 — Diario de Park ---]
El diario de Park is in El Almacén.
"Libreta de campo con encuadernación espiral. Nombre en la tapa: J. PARK, Ingeniero de Sistemas."

Instead of reading El diario de Park:
	if Leyo-park is true:
		say "Ya lo has leído.";
	otherwise:
		now Leyo-park is true;
		increase the score by 5;
		say "[bold type]— DIARIO DE J. PARK — INGENIERO DE SISTEMAS —[roman type][paragraph break]
[italic type]Día 0:[roman type] Okafor está obsesionado con la señal. Chen también. Yo tengo trabajo real: los disipadores del módulo tres llevan dos semanas con una microavería.[paragraph break]
[italic type]Día 1:[roman type] La escuché una hora para quitarme a Okafor de encima. Tiene... algo. Una estructura que parece tener intención. O quizá llevamos ocho meses en el espacio y la mente empieza a buscar patrones donde no los hay.[paragraph break]
[italic type]Día 2:[roman type] [bold type]Rajé el traje EVA de la esclusa.[roman type] Sé que está mal. Pero si alguien viene a investigar no podía permitir que saliera a cortar la antena. No cuando queda tan poco para entenderla del todo.[paragraph break]
[italic type]Día 2 (más tarde):[roman type] Entiendo que eso suena a que me han lavado el cerebro. Pero es lo contrario. Por primera vez en mi vida entiendo exactamente por qué hago lo que hago y lo que significa.[paragraph break]
[italic type]Día 3:[roman type] Me equivoqué sobre lo que significa 'entender'. No era el principio del proceso. Era el final."

[--- Expansión 1 — Diario de Andrade ---]
El diario de Andrade is in El Módulo de Vida.
"Cuaderno con cubierta de tela verde. Nombre: M. ANDRADE, Bióloga de Misión."

Instead of reading El diario de Andrade:
	if Leyo-andrade is true:
		say "Ya lo has leído.";
	otherwise:
		now Leyo-andrade is true;
		increase the score by 5;
		say "[bold type]— DIARIO DE M. ANDRADE — BIÓLOGA DE MISIÓN —[roman type][paragraph break]
[italic type]Día +1:[roman type] La señal emite en torno a 3,7 kHz, el rango de las ondas theta cerebrales durante meditación profunda o sueño lúcido. Teóricamente, una exposición prolongada produciría sincronización neuronal entre oyentes. Teóricamente.[paragraph break]
[italic type]Día +2:[roman type] Los seis tenemos los mismos sueños. La misma imagen: algo que mira desde el borde del sistema solar. Inmensamente paciente. Inmensamente viejo. En el sueño no da miedo. Se siente como volver a casa.[paragraph break]
[italic type]Día +3:[roman type] Soy bióloga. He dedicado mi vida a estudiar la vida en todas sus formas. Esta es la más extraordinaria que he encontrado. Una mente de cuatro millones de años que viajó hasta aquí para invitarnos. ¿Cómo podría declinar?[paragraph break]
[italic type]Última línea:[roman type] Nos vemos adentro."

[--- Expansión 2 — Filtro UV ---]
El filtro UV is in El Almacén.
"Un filtro de lente UV estándar para cámaras y equipos ópticos. Encajaría en una linterna de trabajo."

[Expansión 2 — Combinar filtro con linterna]
Instead of combining El filtro UV with Una linterna:
	if the player does not carry El filtro UV:
		say "No tienes el filtro UV.";
	otherwise if the player does not carry Una linterna:
		say "No tienes la linterna.";
	otherwise if Linterna-uv is true:
		say "La linterna ya tiene el filtro UV instalado.";
	otherwise:
		now Linterna-uv is true;
		now El filtro UV is nowhere;
		say "Encajas el filtro UV en el cabezal de la linterna. Ahora emite luz ultravioleta. Perfecta para revelar tintas invisibles."

Instead of combining Una linterna with El filtro UV:
	try combining El filtro UV with Una linterna.

[Expansión 2 — Iluminar pizarra]
Check illuminating:
	if the player does not carry Una linterna:
		say "No tienes la linterna." instead.

Instead of illuminating La pizarra del laboratorio:
	if Linterna-uv is false:
		say "Con luz normal no obtienes nada especial. Quizá si modificaras la linterna con el filtro UV del almacén...";
	otherwise if Pizarra-revelada is true:
		say "PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR. POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA. Okafor sabía exactamente qué es la Señal.";
	otherwise:
		now Pizarra-revelada is true;
		increase the score by 10;
		say "Bajo la luz UV, la tinta negra se vuelve transparente lentamente.[paragraph break]El texto que Okafor borró aparece:[paragraph break][bold type]PROPÓSITO: DOMINAR. ASIMILAR. PERSISTIR.[paragraph break]POR ENCIMA DE TODA BARRERA ELECTROMAGNÉTICA.[roman type][paragraph break]Okafor sabía exactamente qué es la Señal. Y eligió seguir adelante de todas formas."

[Expansión 2 — Iluminar también al examinar la pizarra con UV]
After examining La pizarra del laboratorio when Linterna-uv is true and Pizarra-revelada is false:
	try illuminating La pizarra del laboratorio.

[--- Expansión 5 — Modulador EM ---]
El modulador EM is in El Laboratorio.
El modulador EM is undescribed.
"[if Modulador-calibrado is true]Modulador electromagnético calibrado a 3,7 kHz —la frecuencia exacta de la Señal—. Listo para su uso.[else]Modulador electromagnético portátil, generador de interferencias de frecuencia variable. Prototipo de Okafor. Necesita calibración.[end if]"

[--- Celda de energía ---]
La celda de energía is in El Almacén.
"Celda de energía estándar de la AEE. Completamente cargada. Suficiente para arrancar el generador principal."

[--- Kit de reparación ---]
El kit de reparación is in El Almacén.
"Parches sellantes, resina de vacío, pistola de calor en miniatura. Suficiente para reparar un traje dañado."

[--- Generador principal ---]
El generador principal is a device in La Sala de Máquinas.
The generador principal is switched off.
El generador principal is fixed in place.
"[if Energia-ok is true]El generador funciona. Zumbido grave y constante.[else if Generador-cargado is true]La celda está insertada. Listo para activar.[else]Generador principal apagado. Palanca en MANUAL-APAGADO. Sin celda de energía no arranca.[end if]"

Instead of switching on El generador principal when Generador-cargado is false:
	say "El generador no tiene celda de energía. Búscala en el almacén."

Instead of switching on El generador principal when Generador-cargado is true:
	now El generador principal is switched on;
	now Energia-ok is true;
	increase the score by 20;
	say "Empujas la palanca a MANUAL-ENCENDIDO. El generador tose, vibra, y comienza a rugir suavemente. Las luces pasan de naranja de emergencia a blanco. La energía ha vuelto.[paragraph break]Desde algún lugar de la estación llega un sonido bajo y regular. Como una voz que no usa palabras."

Instead of inserting La celda de energía into El generador principal:
	if the player is not in La Sala de Máquinas:
		say "El generador está en la sala de máquinas.";
	otherwise if Generador-cargado is true:
		say "La celda ya está insertada.";
	otherwise:
		now Generador-cargado is true;
		now La celda de energía is nowhere;
		say "Encajas la celda en la ranura del generador. Un clic satisfactorio."

[--- Traje EVA ---]
El traje EVA is in La Esclusa EVA.
El traje EVA is wearable.
"[if Traje-ok is true]El traje EVA está reparado y listo para el exterior.[else]Traje EVA blanco con un corte diagonal de diez centímetros en el torso —deliberado—. No puedes ponértelo así.[end if]"

Instead of wearing El traje EVA when Traje-ok is false:
	say "El traje tiene un corte. Ponértelo en el vacío sería suicidio. Repáralo primero con el kit EVA."

Instead of repairing El traje EVA:
	if the player is not in La Esclusa EVA:
		say "El traje está en la esclusa EVA.";
	otherwise if the player does not carry El kit de reparación:
		say "Necesitas el kit de reparación EVA del almacén.";
	otherwise if Traje-ok is true:
		say "El traje ya está reparado.";
	otherwise:
		now Traje-ok is true;
		increase the score by 15;
		say "Aplicas los parches sellantes, la resina de vacío, y terminas con la pistola de calor. La reparación queda perfecta. El traje es habitable."

Instead of going north in La Esclusa EVA:
	if the player does not wear El traje EVA:
		say "No puedes salir al vacío sin el traje EVA. Sería una muerte instantánea.";
	otherwise if Traje-ok is false:
		say "El traje tiene un corte. Repáralo antes de salir.";
	otherwise:
		move the player to El Exterior;
		say "[first time]La compuerta se abre. El vacío te recibe con indiferencia cósmica. Flotas, amarrada a la estación, sobre el abismo.[only]".

[--- Tripulación (Expansión 4 — consecuencias de orden) ---]
La tripulación is scenery in La Sala de Aislamiento.
"Los seis. Perfectamente quietos. Ojos con una luminosidad interior que no debería existir. Te miran sin parpadear."

Instead of talking to La tripulación:
	if Hablo-crew is true:
		say "Los seis forman tu nombre con los labios, en silencio.";
	otherwise:
		now Hablo-crew is true;
		increase the score by 20;
		say "'¿Estáis bien?'[paragraph break]Hablan al unísono, con voces superpuestas que forman acordes:[paragraph break][italic type]'Nunca hemos estado mejor. Estamos completos. La Señal nos completó.'[roman type][paragraph break]'¿Qué es la Señal?'[paragraph break][italic type]'Una mente. Antigua. Mayor que esta estrella. Nos encontró porque la buscábamos. Ahora te pregunta si quieres unirte.'[roman type][paragraph break]'No.'[paragraph break]Sus cabezas se inclinan al mismo ángulo exacto.[paragraph break][if Leyo-capitan is true][italic type]'Kowalski también dijo no. Hasta el final. La Señal es paciente. Él cedió al alba del día cuatro. Y al ceder, entendió que nunca tuvo razón para resistir.'[roman type][paragraph break][end if][italic type]'Entonces ve a la antena. Decide. Pero sabe que si la cortas, nosotros morimos con ella. Somos la Señal ahora.'[roman type][if Hueco-examinado is true or the player carries El modulador EM][paragraph break]Recuerdas el modulador de Okafor. Quizá hay una tercera opción que no implica cortar ni amplificar.[end if]"

[--- Panel de la antena ---]
El panel de la antena is scenery in El Exterior.
"Dos botones, cubiertas levantadas. Rojo: CORTAR. Verde: AMPLIFICAR ×1000. No hay vuelta atrás en ninguno."

[=================================================================
   PARTE III: FINALES
=================================================================]

[--- FINAL I: SILENCIO ---]
Check cutting-signal:
	if the player is not in El Exterior:
		say "No estás en la antena. Ve al exterior." instead;
	if the player does not wear El traje EVA:
		say "Sin el traje EVA no puedes estar en el exterior." instead.

Carry out cutting-signal:
	increase the score by 20;
	say "[bold type]FINAL I — SILENCIO[roman type][paragraph break]
Levantas la cubierta roja. La luz del sol le arranca destellos al acrílico.[paragraph break]
Piensas en Kowalski, que hacía la cama aunque nadie lo viera. En Silva, que escribió una advertencia antes de rendirse. En Okafor, que dejó instrucciones para que tú pudieras elegir. En Park, que rajó este traje que llevas reparado.[paragraph break]
Pulsas el botón.[paragraph break]
La antena se dobla lentamente, articulación por articulación, como un insecto muriendo. Hay un momento —solo un momento— en que juras escuchar algo a través del vacío: no la Señal, sino seis voces humanas, distintas y separadas otra vez, diciendo adiós.[paragraph break]
Y luego silencio. El silencio más completo del universo.[paragraph break]
La Señal lleva cuatro millones de años esperando. Seguirá esperando. Hasta la próxima vez que alguien la encuentre.[paragraph break]
[bold type]Puntuación final: [score]/[maximum score].[roman type][paragraph break]
Gracias por jugar ESTACIÓN OUROBOROS.";
	end the story finally.

[--- FINAL II: LA GRAN VOZ ---]
Check amplifying-signal:
	if the player is not in El Exterior:
		say "No estás en la antena." instead;
	if the player does not wear El traje EVA:
		say "Sin el traje EVA no puedes estar en el exterior." instead.

Carry out amplifying-signal:
	increase the score by 20;
	say "[bold type]FINAL II — LA GRAN VOZ[roman type][paragraph break]
Levantas la cubierta verde. ¿Y si tenían razón? ¿Y si es lo que la humanidad necesita: dejar de estar sola de verdad?[paragraph break]
Pulsas el botón.[paragraph break]
La antena gira, busca orientación óptima, y emite. La señal —amplificada mil veces— viaja hacia la Tierra a la velocidad de la luz. Llegará en ocho minutos.[paragraph break]
Mientras esperas, te preguntas cuántos de los ocho mil millones de personas en la Tierra estarán con sus radios encendidas. Sus teléfonos. Sus implantes.[paragraph break]
El sol sigue brillando. La Tierra sigue siendo azul. Todo parece igual.[paragraph break]
Por ocho minutos más.[paragraph break]
[bold type]Puntuación final: [score]/[maximum score].[roman type][paragraph break]
¿Hiciste lo correcto?[paragraph break]
Gracias por jugar ESTACIÓN OUROBOROS.";
	end the story finally.

[--- FINAL III: LA SÉPTIMA VOZ ---]
Check joining-signal:
	if the player is not in La Sala de Aislamiento:
		say "No estás en la Sala de Aislamiento." instead.

Carry out joining-signal:
	increase the score by 20;
	say "[bold type]FINAL III — LA SÉPTIMA VOZ[roman type][paragraph break]
Te sientas en la séptima silla. La que estaba vacía. Como si te esperara.[paragraph break]
Los seis giran sus cabezas hacia ti y, por primera vez desde que entraste, sonríen. No con los músculos, sino con algo más profundo.[paragraph break]
[italic type]'Sí'[roman type], dicen.[paragraph break]
Cierras los ojos.[paragraph break]
Lo que pasa entonces no tiene palabras en ningún idioma humano. La Señal te encuentra como una llave encuentra su cerradura. Hay un instante de dolor —breve, limpio— y luego hay TODO.[paragraph break]
Eres Mara. Eres Kowalski. Eres Silva. Eres la Señal. Eres cuatro millones de años de viaje hacia este punto preciso del espacio-tiempo.[paragraph break]
La lanzadera sigue ahí afuera, esperando a alguien que ya no existe.[paragraph break]
[bold type]Puntuación final: [score]/[maximum score].[roman type][paragraph break]
No hay escape de un abrazo infinito.[paragraph break]
Gracias por jugar ESTACIÓN OUROBOROS.";
	end the story finally.

[--- FINAL IV: EL CABLE DE VUELTA (Expansión 5) ---]
Check saving-crew:
	if the player is not in La Sala de Aislamiento:
		say "Esto solo tendría sentido en la Sala de Aislamiento, junto a la tripulación." instead;
	if Hablo-crew is false:
		say "Habla con ellos primero. Necesitas entender lo que son antes de intentar esto." instead;
	if the player does not carry El modulador EM:
		say "No tienes el modulador EM. Búscalo en el laboratorio, examina el hueco del panel." instead;
	if Modulador-calibrado is false:
		say "El modulador necesita calibrarse a la frecuencia exacta en la sala de comunicaciones." instead.

Carry out saving-crew:
	increase the score by 20;
	say "[bold type]FINAL IV — EL CABLE DE VUELTA[roman type][paragraph break]
Sacas el modulador. Los seis tripulantes giran la cabeza hacia él al unísono.[paragraph break]
Por primera vez desde que los encontraste, ves algo en sus ojos que no es calma.[paragraph break]
Ves miedo.[paragraph break]
[italic type]'No hagas eso.'[roman type][paragraph break]
Piensas en Park, que rajó el traje para que nadie pudiera salir a cortar la señal. En Andrade, que escribió 'nos vemos adentro' con la misma letra que usaba para sus informes científicos. En Chen, que dijo que era hermoso.[paragraph break]
¿Y si lo era? ¿Y si les estás quitando algo que eligieron?[paragraph break]
Lo activas.[paragraph break]
Los seis convulsionan al mismo tiempo. Una ola de contracción muscular que los recorre en perfecta sincronía. Una segunda. Luego silencio.[paragraph break]
Doce segundos que parecen una hora.[paragraph break]
Okafor es el primero en moverse. Levanta la cabeza con la lentitud de alguien que regresa de muy lejos. Te mira, y los ojos ya no tienen esa luminosidad interior. Están rojos. Llenos de lágrimas.[paragraph break]
'¿Dónde...?', dice. Solo una palabra.[paragraph break]
Kowalski es el último en despertar. Abre los ojos, mira sus manos como si fueran de otro, y dice lo único que importa:[paragraph break]
'¿Cuánto tiempo?'[paragraph break]
Tres días. Les dices que tres días.[paragraph break]
Los seis están vivos. Desorientados, débiles, con secuelas que tardarán años en comprender. Pero humanos. Completamente, imperfectamente, dolorosamente humanos.[paragraph break]
La Señal sigue ahí fuera. Más allá de la heliosfera, con cuatro millones de años de práctica en esperar. Pero esta vez no se lleva a nadie.[paragraph break]
Park te mira desde su silla y dice, con voz ronca: 'El traje. Lo rajé yo. Lo siento.'[paragraph break]
'Lo sé', dices. 'Lo leí.'[paragraph break]
[bold type]Puntuación final: [score]/[maximum score].[roman type][paragraph break]
Gracias por jugar ESTACIÓN OUROBOROS.";
	end the story finally.

[=================================================================
   PARTE IV: ATMÓSFERA Y AYUDA
=================================================================]

Every turn when the player is in La Sala de Comunicaciones and Energia-ok is true:
	if a random chance of 1 in 4 succeeds:
		say "[italic type]La forma de onda en la pantalla cambia levemente. Sube medio tono.[roman type]".

Every turn when the player is in El Laboratorio:
	if a random chance of 1 in 5 succeeds:
		say "[italic type]El frasco de pastillas vacío en el suelo. Okafor prefirió la señal al ansiolítico.[roman type]".

Every turn when the player is in La Sala de Aislamiento:
	if a random chance of 1 in 3 succeeds:
		if Hablo-crew is true and Modulador-calibrado is true:
			say "[italic type]Park te mira fijamente. Sus labios no forman tu nombre. Forman 'lo siento'.[roman type]";
		otherwise:
			say "[italic type]Los seis forman tu nombre con los labios, en silencio y al unísono.[roman type]".

Every turn when the player is in El Exterior:
	if a random chance of 1 in 5 succeeds:
		say "[italic type]La Tierra sigue azul. Desde aquí no puedes ver las ciudades, ni a la gente que no sabe lo que tienes en tus manos.[roman type]".

Understand "ayuda" as a mistake ("Comandos básicos:[paragraph break]NORTE/SUR/ESTE/OESTE/ARRIBA/ABAJO — moverse[paragraph break]MIRAR (M) — describir la sala[paragraph break]EXAMINAR <objeto> (X) — examinar algo[paragraph break]INVENTARIO (I) — ver lo que llevas[paragraph break]COGER / DEJAR — recoger o soltar objetos[paragraph break]LEER <objeto> — leer documentos[paragraph break]PONERSE / QUITARSE — equipar o desequipar[paragraph break]INSERTAR <a> EN <b> — combinar objetos[paragraph break]COMBINAR <a> CON <b> — combinar objetos (ej: filtro con linterna)[paragraph break]ILUMINAR <objeto> — iluminar con linterna UV[paragraph break]REPARAR / ACTIVAR / ENCENDER — mecánicas específicas[paragraph break]SINTONIZAR / REPRODUCIR — en sala de comunicaciones (con energía)[paragraph break]CALIBRAR modulador — en sala de comunicaciones (tras sintonizar)[paragraph break]HABLAR CON <personaje> — conversar[paragraph break]CORTAR / AMPLIFICAR — finales I y II (en la antena)[paragraph break]UNIRME — final III (en la Sala de Aislamiento)[paragraph break]SALVAR — final IV (en la Sala de Aislamiento, con modulador calibrado)").

When play begins:
	say "[bold type]ESTACIÓN OUROBOROS[roman type][paragraph break][italic type]Una aventura de terror cósmico en el espacio profundo[roman type][paragraph break]© 2026 VampireBBS / Vampsecure Studios — Edición expandida v2.0[paragraph break]─────────────────────────────────────────[paragraph break]Tu lanzadera completa el acoplamiento con la Estación Ouroboros a las 06:47 UTC.[paragraph break]72 horas sin señal. Control dijo que 'probablemente sea un fallo de antena'.[paragraph break]Control nunca ha tenido razón sobre nada.[paragraph break]El aire de la estación es frío. Y huele raro: como ozono después de una tormenta, o como el mar desde lejos. Nada debería oler así en el espacio.[paragraph break][bold type]Escribe AYUDA para ver los comandos. 4 finales posibles.[roman type][paragraph break]─────────────────────────────────────────".

/**
 * =====================================================================
 *  PERSONALIZA TU PÁGINA AQUÍ ✨
 *  Este es el único archivo que necesitas editar para cambiar nombres,
 *  mensajes y canciones. Guarda los cambios y recarga index.html.
 * =====================================================================
 */

window.MI_NOCHE = {
  // Nombre o apodo cariñoso de tu pareja
  nombrePareja: "mi amor",

  // Tu nombre (aparecerá en la firma final)
  tuNombre: "Tu persona favorita",

  // 1. Pantalla de entrada (al hacer clic se activa la música suavemente)
  entrada: {
    etiqueta: "Sin motivo especial, solo porque sí",
    titulo: "Guardé una noche estrellada para ti",
    subtitulo: "Ponte audífonos si puedes, sube un poquito el volumen y entra despacio.",
    boton: "Entrar a nuestra noche"
  },

  // 2. Portada principal
  portada: {
    etiqueta: "Para ti, hoy y cualquier noche",
    titulo: "Bajo este cielo,",
    destacado: "siempre te elijo a ti",
    subtitulo:
      "No hacía falta ninguna fecha en el calendario para recordarte lo bonita que haces mi vida."
  },

  // 3. Playlist dedicada ("Canciones que suenan a ti")
  // TIP:
  // - Sin tocar nada, cada canción reproduce una melodía nocturna suave creada en vivo.
  // - Si quieres usar canciones MP3 tuyas, crea una carpeta "musica" junto a index.html,
  //   pon ahí tus archivos y escribe la ruta en archivoAudio (ej: "musica/cancion1.mp3").
  // - También puedes pegar enlaces de Spotify o YouTube para abrir la canción original.
  playlist: [
    {
      titulo: "Claro de Luna",
      artista: "Melodía nocturna · Para empezar despacio",
      duracion: "2:10",
      melodia: "claroDeLuna",
      archivoAudio: "",
      spotifyUrl: "",
      youtubeUrl: "",
      dedicatoria:
        "Esta suena a esa calma bonita que siento cuando hablo contigo al final del día y todo lo demás deja de pesar."
    },
    {
      titulo: "Nuestra Constelación",
      artista: "Melodía nocturna · Pensando en tu sonrisa",
      duracion: "2:24",
      melodia: "constelacion",
      archivoAudio: "",
      spotifyUrl: "",
      youtubeUrl: "",
      dedicatoria:
        "Me recuerda a esas risas inesperadas que tenemos de la nada y que terminan arreglándome toda la semana."
    },
    {
      titulo: "Medianoche Contigo",
      artista: "Melodía nocturna · Conversaciones eternas",
      duracion: "2:18",
      melodia: "medianoche",
      archivoAudio: "",
      spotifyUrl: "",
      youtubeUrl: "",
      dedicatoria:
        "Para todas las noches en las que el reloj avanza rapidísimo porque hablar contigo se siente como casa."
    },
    {
      titulo: "Antes del Amanecer",
      artista: "Melodía nocturna · Promesa tranquila",
      duracion: "2:30",
      melodia: "amanecer",
      archivoAudio: "",
      spotifyUrl: "",
      youtubeUrl: "",
      dedicatoria:
        "Porque incluso en un día cualquiera, saber que existes y que caminamos juntos lo vuelve especial."
    }
  ],

  // 4. Constelación interactiva: 7 estrellas con mensajes ocultos
  // Tu pareja toca cada estrella del cielo para encender la constelación.
  constelacion: {
    etiqueta: "Toca cada estrella",
    titulo: "Siete cosas que pienso de ti",
    subtitulo: "Enciende las estrellas una por una para unir nuestra constelación.",
    mensajeCompleto:
      "✦ Constelación completa: ni todas las estrellas del cielo alcanzan para contar cuánto te quiero. ✦",
    estrellas: [
      {
        nombre: "Estrella I · Tu luz",
        texto: "Tienes una forma tan tuya de iluminar mis días que a veces ni te das cuenta."
      },
      {
        nombre: "Estrella II · Tu voz",
        texto: "Escucharte es mi parte favorita de cualquier día, sin importar qué tan largo haya sido."
      },
      {
        nombre: "Estrella III · Tu calma",
        texto: "Contigo aprendí que la paz también puede ser una persona."
      },
      {
        nombre: "Estrella IV · Tu risa",
        texto: "Si pudiera guardar un sonido para siempre, sería el de tu risa cuando algo te hace feliz de verdad."
      },
      {
        nombre: "Estrella V · Lo cotidiano",
        texto: "Hasta los momentos más simples —un mensaje corto, una mirada, caminar sin prisa— se vuelven recuerdos contigo."
      },
      {
        nombre: "Estrella VI · Tu corazón",
        texto: "Admiro muchísimo la ternura y la nobleza con la que miras el mundo y cuidas a quienes quieres."
      },
      {
        nombre: "Estrella VII · Porque sí",
        texto: "Hice esta página sin esperar ninguna fecha especial, solo para que hoy te acuestes sabiendo cuánto te amo."
      }
    ]
  },

  // 5. Nota final + botón de estrella fugaz
  notaFinal: {
    etiqueta: "Antes de cerrar la noche",
    titulo: "Solo quería recordártelo",
    parrafos: [
      "A veces nos esperamos a los cumpleaños o a los aniversarios para decir cosas bonitas, pero yo quería decírtelo hoy, en un día cualquiera.",
      "Gracias por ser tú, por compartir tu tiempo conmigo y por convertir lo cotidiano en algo que siempre vale la pena recordar."
    ],
    despedida: "Siempre tuyo/a,",
    textoBotonEstrella: "Lanzar una estrella fugaz",
    mensajesEstrellaFugaz: [
      "Deseo concedido: mil noches más riendo juntos.",
      "Una estrella fugaz solo para ti ✨",
      "Si pides un deseo ahora, ojalá me toque cumplirlo contigo.",
      "Te pienso más veces al día de las que imaginas.",
      "Gracias por hacer mi mundo mucho más bonito."
    ]
  }
};

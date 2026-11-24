/**
 * =====================================================================
 *  LÓGICA PRINCIPAL · NOCHE ESTRELLADA
 *  Controla el cielo interactivo, el reproductor de playlist,
 *  la constelación de mensajes y las estrellas fugaces.
 * =====================================================================
 */

(function () {
  const DATOS = window.MI_NOCHE;
  if (!DATOS) return;

  const motorAudio = new window.MotorAudioNocturno();

  // Utilidades
  const $ = (id) => document.getElementById(id);
  const formatearTiempo = (seg) => {
    const limpio = Math.max(0, Math.floor(seg || 0));
    const min = Math.floor(limpio / 60);
    const resto = limpio % 60;
    return `${min}:${String(resto).padStart(2, "0")}`;
  };

  /* ===================================================================
     1. CARGAR TEXTOS DESDE personalizar.js
     =================================================================== */
  function aplicarTextos() {
    $("entrada-etiqueta").textContent = DATOS.entrada.etiqueta;
    $("entrada-titulo").textContent = DATOS.entrada.titulo;
    $("entrada-subtitulo").textContent = DATOS.entrada.subtitulo;
    $("entrada-boton-texto").textContent = DATOS.entrada.boton;

    $("portada-etiqueta").textContent = DATOS.portada.etiqueta;
    $("portada-titulo").textContent = DATOS.portada.titulo;
    $("portada-destacado").textContent = DATOS.portada.destacado;
    $("hero-nombre-pareja").textContent = DATOS.nombrePareja;
    $("portada-subtitulo").textContent = DATOS.portada.subtitulo;

    $("constelacion-etiqueta").textContent = DATOS.constelacion.etiqueta;
    $("constelacion-titulo").textContent = DATOS.constelacion.titulo;
    $("constelacion-subtitulo").textContent = DATOS.constelacion.subtitulo;
    $("constelacion-completa").textContent = DATOS.constelacion.mensajeCompleto;

    $("nota-etiqueta").textContent = DATOS.notaFinal.etiqueta;
    $("nota-titulo").textContent = DATOS.notaFinal.titulo;
    $("nota-despedida").textContent = DATOS.notaFinal.despedida;
    $("nota-autor").textContent = DATOS.tuNombre;
    $("footer-autor").textContent = DATOS.tuNombre;
    $("btn-fugaz-texto").textContent = DATOS.notaFinal.textoBotonEstrella;

    const contenedorParrafos = $("nota-parrafos");
    contenedorParrafos.innerHTML = "";
    DATOS.notaFinal.parrafos.forEach((texto) => {
      const p = document.createElement("p");
      p.textContent = texto;
      contenedorParrafos.appendChild(p);
    });
  }

  /* ===================================================================
     2. CIELO ESTRELLADO INTERACTIVO (CANVAS)
     =================================================================== */
  const canvas = $("cielo-canvas");
  const ctx = canvas.getContext("2d");
  let ancho = window.innerWidth;
  let alto = window.innerHeight;
  const estrellasFondo = [];
  const estrellasFugaces = [];
  const destellosClick = [];

  function redimensionarCielo() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (estrellasFondo.length === 0) {
      const cantidad = Math.min(180, Math.floor((ancho * alto) / 7500));
      for (let i = 0; i < cantidad; i += 1) {
        estrellasFondo.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          radio: Math.random() * 1.65 + 0.35,
          fase: Math.random() * Math.PI * 2,
          velocidad: 0.008 + Math.random() * 0.022,
          calida: Math.random() < 0.28
        });
      }
    }
  }

  function lanzarEstrellaFugaz(grande = false) {
    const desdeIzquierda = Math.random() < 0.7;
    estrellasFugaces.push({
      x: desdeIzquierda ? Math.random() * ancho * 0.55 : ancho * (0.45 + Math.random() * 0.5),
      y: Math.random() * alto * 0.38,
      vx: (desdeIzquierda ? 1 : -1) * (grande ? 13 : 9 + Math.random() * 4),
      vy: grande ? 5.2 : 3.4 + Math.random() * 2.2,
      largo: grande ? 170 : 105,
      vida: 1,
      grosor: grande ? 2.6 : 1.6
    });
  }

  function crearDestello(x, y) {
    for (let i = 0; i < 8; i += 1) {
      const angulo = (Math.PI * 2 * i) / 8 + Math.random() * 0.4;
      const velocidad = 0.6 + Math.random() * 1.4;
      destellosClick.push({
        x,
        y,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad,
        radio: 1 + Math.random() * 1.5,
        vida: 1
      });
    }
  }

  function animarCielo() {
    ctx.clearRect(0, 0, ancho, alto);

    // Estrellas titilantes
    for (const est of estrellasFondo) {
      est.fase += est.velocidad;
      const alpha = 0.25 + ((Math.sin(est.fase) + 1) / 2) * 0.72;
      ctx.beginPath();
      ctx.arc(est.x, est.y, est.radio, 0, Math.PI * 2);
      ctx.fillStyle = est.calida
        ? `rgba(243, 213, 155, ${alpha})`
        : `rgba(226, 234, 255, ${alpha})`;
      ctx.fill();
    }

    // Estrellas fugaces ocasionales
    if (Math.random() < 0.004 && estrellasFugaces.length < 2) {
      lanzarEstrellaFugaz(false);
    }

    for (let i = estrellasFugaces.length - 1; i >= 0; i -= 1) {
      const f = estrellasFugaces[i];
      f.x += f.vx;
      f.y += f.vy;
      f.vida -= 0.017;

      const colaX = f.x - (f.vx / 12) * f.largo;
      const colaY = f.y - (f.vy / 12) * f.largo;
      const grad = ctx.createLinearGradient(f.x, f.y, colaX, colaY);
      grad.addColorStop(0, `rgba(255, 246, 224, ${Math.max(0, f.vida)})`);
      grad.addColorStop(0.4, `rgba(243, 213, 155, ${Math.max(0, f.vida * 0.55)})`);
      grad.addColorStop(1, "rgba(243, 213, 155, 0)");

      ctx.strokeStyle = grad;
      ctx.lineWidth = f.grosor;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(colaX, colaY);
      ctx.stroke();

      if (f.vida <= 0) {
        estrellasFugaces.splice(i, 1);
      }
    }

    // Polvo de estrellas al tocar la pantalla
    for (let i = destellosClick.length - 1; i >= 0; i -= 1) {
      const p = destellosClick[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vida -= 0.025;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243, 213, 155, ${Math.max(0, p.vida)})`;
      ctx.fill();
      if (p.vida <= 0) {
        destellosClick.splice(i, 1);
      }
    }

    window.requestAnimationFrame(animarCielo);
  }

  /* ===================================================================
     3. REPRODUCTOR Y PLAYLIST DEDICADA
     =================================================================== */
  let indicePista = 0;
  const playlist = DATOS.playlist || [];
  const barrasEcualizador = Array.from($("ecualizador").querySelectorAll("span"));

  function renderizarListaPlaylist() {
    const lista = $("playlist-items");
    lista.innerHTML = "";
    $("playlist-conteo").textContent = `${playlist.length} canciones`;

    playlist.forEach((track, idx) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "playlist-item-btn" + (idx === indicePista ? " activa" : "");
      btn.innerHTML = `
        <span class="playlist-item-num">${String(idx + 1).padStart(2, "0")}</span>
        <span>
          <span class="playlist-item-titulo"></span>
          <span class="playlist-item-artista"></span>
        </span>
        <span class="playlist-item-duracion"></span>
      `;
      btn.querySelector(".playlist-item-titulo").textContent = track.titulo;
      btn.querySelector(".playlist-item-artista").textContent = track.artista;
      btn.querySelector(".playlist-item-duracion").textContent = track.duracion || "2:15";

      btn.addEventListener("click", () => {
        seleccionarPista(idx, true);
      });

      li.appendChild(btn);
      lista.appendChild(li);
    });
  }

  function actualizarEstadoReproduccionUI() {
    const sonando = motorAudio.reproduciendo;
    $("icono-play").textContent = sonando ? "❚❚" : "▶";
    $("mini-play-icon").textContent = sonando ? "❚❚" : "▶";
    $("vinilo-disco").classList.toggle("girando", sonando);
    $("mini-player").classList.toggle("reproduciendo", sonando);
  }

  function seleccionarPista(nuevoIndice, autoReproducir = false) {
    if (!playlist.length) return;
    indicePista = (nuevoIndice + playlist.length) % playlist.length;
    const track = playlist[indicePista];

    motorAudio.cargarTrack(track, autoReproducir);

    const numTexto = String(indicePista + 1).padStart(2, "0");
    const totalTexto = String(playlist.length).padStart(2, "0");
    $("track-numero").textContent = `Pista ${numTexto} de ${totalTexto}`;
    $("track-titulo").textContent = track.titulo;
    $("track-artista").textContent = track.artista;
    $("track-dedicatoria").textContent = track.dedicatoria;
    $("mini-titulo").textContent = track.titulo;
    $("tiempo-actual").textContent = "0:00";
    $("tiempo-total").textContent = track.duracion || formatearTiempo(motorAudio.obtenerDuracion());
    $("barra-progreso").value = "0";

    // Enlaces opcionales a Spotify o YouTube si la persona los agregó
    const enlacesBox = $("track-enlaces");
    enlacesBox.innerHTML = "";
    if (track.spotifyUrl) {
      const a = document.createElement("a");
      a.className = "btn-plataforma";
      a.href = track.spotifyUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Abrir en Spotify ↗";
      enlacesBox.appendChild(a);
    }
    if (track.youtubeUrl) {
      const a = document.createElement("a");
      a.className = "btn-plataforma";
      a.href = track.youtubeUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Ver en YouTube ↗";
      enlacesBox.appendChild(a);
    }
    enlacesBox.hidden = enlacesBox.children.length === 0;

    // Resaltar pista activa en la lista
    const botones = $("playlist-items").querySelectorAll(".playlist-item-btn");
    botones.forEach((btn, idx) => {
      btn.classList.toggle("activa", idx === indicePista);
    });

    actualizarEstadoReproduccionUI();
  }

  function actualizarVisualizadorYProgreso() {
    const duracion = motorAudio.obtenerDuracion();
    const actual = motorAudio.obtenerTiempoActual();

    if (duracion > 0) {
      $("tiempo-actual").textContent = formatearTiempo(actual);
      $("tiempo-total").textContent = formatearTiempo(duracion);
      const pct = Math.min(100, (actual / duracion) * 100);
      $("barra-progreso").value = String(pct);
    }

    const nivel = motorAudio.obtenerNivelVisual();
    const t = performance.now() * 0.006;
    barrasEcualizador.forEach((barra, i) => {
      if (!motorAudio.reproduciendo) {
        barra.style.height = "6px";
      } else {
        const onda = (Math.sin(t + i * 0.7) + 1) * 0.5;
        const altura = 6 + (onda * 16 + nivel * 10);
        barra.style.height = `${Math.round(altura)}px`;
      }
    });

    window.requestAnimationFrame(actualizarVisualizadorYProgreso);
  }

  motorAudio.onEnded = () => {
    seleccionarPista(indicePista + 1, true);
  };

  /* ===================================================================
     4. CONSTELACIÓN INTERACTIVA (SVG)
     =================================================================== */
  const COORDENADAS_CONSTELACION = [
    { x: 95, y: 240 },
    { x: 195, y: 145 },
    { x: 315, y: 205 },
    { x: 405, y: 95 },
    { x: 515, y: 175 },
    { x: 625, y: 120 },
    { x: 710, y: 235 }
  ];

  const estrellasEncendidas = new Set();
  let estrellaSeleccionada = -1;

  function construirConstelacion() {
    const estrellas = DATOS.constelacion.estrellas || [];
    const grupoLineas = $("constelacion-lineas");
    const grupoNodos = $("constelacion-nodos");
    const svgNS = "http://www.w3.org/2000/svg";

    grupoLineas.innerHTML = "";
    grupoNodos.innerHTML = "";

    // Líneas entre estrellas consecutivas
    for (let i = 0; i < estrellas.length - 1; i += 1) {
      const p1 = COORDENADAS_CONSTELACION[i % COORDENADAS_CONSTELACION.length];
      const p2 = COORDENADAS_CONSTELACION[(i + 1) % COORDENADAS_CONSTELACION.length];
      const linea = document.createElementNS(svgNS, "line");
      linea.setAttribute("x1", p1.x);
      linea.setAttribute("y1", p1.y);
      linea.setAttribute("x2", p2.x);
      linea.setAttribute("y2", p2.y);
      linea.setAttribute("class", "constelacion-linea");
      linea.dataset.desde = String(i);
      linea.dataset.hasta = String(i + 1);
      grupoLineas.appendChild(linea);
    }

    // Nodos de estrellas
    estrellas.forEach((estrella, idx) => {
      const pos = COORDENADAS_CONSTELACION[idx % COORDENADAS_CONSTELACION.length];
      const g = document.createElementNS(svgNS, "g");
      g.setAttribute("class", "estrella-nodo");
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", `Encender ${estrella.nombre}`);
      g.dataset.indice = String(idx);

      const halo = document.createElementNS(svgNS, "circle");
      halo.setAttribute("cx", pos.x);
      halo.setAttribute("cy", pos.y);
      halo.setAttribute("r", "22");
      halo.setAttribute("class", "estrella-halo");

      const nucleo = document.createElementNS(svgNS, "circle");
      nucleo.setAttribute("cx", pos.x);
      nucleo.setAttribute("cy", pos.y);
      nucleo.setAttribute("r", "7");
      nucleo.setAttribute("class", "estrella-nucleo");

      const etiqueta = document.createElementNS(svgNS, "text");
      etiqueta.setAttribute("x", pos.x);
      etiqueta.setAttribute("y", pos.y + 38);
      etiqueta.setAttribute("class", "estrella-etiqueta-svg");
      etiqueta.textContent = `✦ ${idx + 1}`;

      g.appendChild(halo);
      g.appendChild(nucleo);
      g.appendChild(etiqueta);

      const activar = () => encenderEstrella(idx);
      g.addEventListener("click", activar);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activar();
        }
      });

      grupoNodos.appendChild(g);
    });

    actualizarProgresoConstelacion();
  }

  function encenderEstrella(indice) {
    const estrellas = DATOS.constelacion.estrellas || [];
    const data = estrellas[indice];
    if (!data) return;

    estrellasEncendidas.add(indice);
    estrellaSeleccionada = indice;
    motorAudio.tocarDestelloEstrella(indice);

    const card = $("estrella-mensaje-card");
    card.style.opacity = "0.25";
    window.setTimeout(() => {
      $("estrella-nombre").textContent = data.nombre;
      $("estrella-texto").textContent = data.texto;
      card.style.opacity = "1";
    }, 140);

    actualizarEstadoConstelacionSVG();
    actualizarProgresoConstelacion();
  }

  function actualizarEstadoConstelacionSVG() {
    const nodos = $("constelacion-nodos").querySelectorAll(".estrella-nodo");
    nodos.forEach((nodo) => {
      const idx = Number(nodo.dataset.indice);
      nodo.classList.toggle("encendida", estrellasEncendidas.has(idx));
      nodo.classList.toggle("seleccionada", idx === estrellaSeleccionada);
    });

    const lineas = $("constelacion-lineas").querySelectorAll(".constelacion-linea");
    lineas.forEach((linea) => {
      const a = Number(linea.dataset.desde);
      const b = Number(linea.dataset.hasta);
      linea.classList.toggle("encendida", estrellasEncendidas.has(a) && estrellasEncendidas.has(b));
    });
  }

  function actualizarProgresoConstelacion() {
    const total = (DATOS.constelacion.estrellas || []).length;
    const encendidas = estrellasEncendidas.size;
    $("constelacion-progreso").textContent = `${encendidas} de ${total} estrellas encendidas`;

    if (encendidas >= total && total > 0) {
      $("constelacion-completa").hidden = false;
      lanzarEstrellaFugaz(true);
    }
  }

  /* ===================================================================
     5. EVENTOS E INICIALIZACIÓN
     =================================================================== */
  function configurarEventos() {
    // Pantalla de entrada -> abre la noche y comienza la música suave
    document.body.classList.add("entrada-activa");
    $("btn-entrar").addEventListener("click", () => {
      $("pantalla-entrada").classList.add("oculta");
      document.body.classList.remove("entrada-activa");

      const principal = $("contenido-principal");
      principal.classList.add("visible");
      principal.setAttribute("aria-hidden", "false");
      $("mini-player").hidden = false;

      motorAudio.reproducir();
      actualizarEstadoReproduccionUI();
      lanzarEstrellaFugaz(true);
    });

    // Controles del reproductor
    const toggleMusica = () => {
      motorAudio.alternar();
      actualizarEstadoReproduccionUI();
    };
    $("btn-play-pausa").addEventListener("click", toggleMusica);
    $("mini-btn-play").addEventListener("click", toggleMusica);

    $("btn-anterior").addEventListener("click", () => {
      seleccionarPista(indicePista - 1, true);
    });
    $("btn-siguiente").addEventListener("click", () => {
      seleccionarPista(indicePista + 1, true);
    });

    $("barra-progreso").addEventListener("input", (e) => {
      const valor = Number(e.target.value) / 100;
      motorAudio.buscarProgreso(valor);
    });

    $("control-volumen").addEventListener("input", (e) => {
      const val = Number(e.target.value);
      $("volumen-valor").textContent = `${val}%`;
      motorAudio.establecerVolumen(val / 100);
    });

    // Botón para encender todas las estrellas de la constelación
    $("btn-encender-todas").addEventListener("click", () => {
      const estrellas = DATOS.constelacion.estrellas || [];
      estrellas.forEach((_, idx) => estrellasEncendidas.add(idx));
      if (estrellas.length) {
        encenderEstrella(estrellas.length - 1);
      }
    });

    // Botón de estrella fugaz final
    let indiceDeseo = 0;
    $("btn-estrella-fugaz").addEventListener("click", () => {
      lanzarEstrellaFugaz(true);
      motorAudio.tocarDestelloEstrella(indiceDeseo + 2);
      const frases = DATOS.notaFinal.mensajesEstrellaFugaz || [];
      if (frases.length) {
        $("fugaz-mensaje").textContent = frases[indiceDeseo % frases.length];
        indiceDeseo += 1;
      }
    });

    // Polvo de estrellas al hacer clic en cualquier punto de la pantalla
    document.addEventListener("pointerdown", (e) => {
      crearDestello(e.clientX, e.clientY);
    });

    // Aparición suave de secciones al hacer scroll
    const secciones = document.querySelectorAll(".seccion-revelar");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("en-vista");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      secciones.forEach((sec) => observer.observe(sec));
    } else {
      secciones.forEach((sec) => sec.classList.add("en-vista"));
    }

    window.addEventListener("resize", redimensionarCielo);
  }

  // Arrancar todo
  aplicarTextos();
  redimensionarCielo();
  animarCielo();
  renderizarListaPlaylist();
  seleccionarPista(0, false);
  construirConstelacion();
  configurarEventos();
  actualizarVisualizadorYProgreso();
})();

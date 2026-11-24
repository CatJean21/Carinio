(() => {
  const datos = window.DATOS_SORPRESA;
  if (!datos) return;

  // Referencias del DOM
  const body = document.body;
  const overlay = document.getElementById("pantalla-inicio");
  const main = document.getElementById("contenido-principal");
  const btnAbrir = document.getElementById("btn-abrir-sorpresa");

  const razonTextoEl = document.getElementById("razon-texto");
  const razonContadorEl = document.getElementById("razon-contador");
  const razonDescubiertasEl = document.getElementById("razon-descubiertas");
  const barraProgresoEl = document.getElementById("barra-progreso-fill");
  const mensajeCompletoEl = document.getElementById("razon-mensaje-completo");
  const btnNuevaRazon = document.getElementById("btn-nueva-razon");
  const btnAnterior = document.getElementById("btn-razon-anterior");
  const btnVerTodas = document.getElementById("btn-ver-todas");
  const listaTodasEl = document.getElementById("lista-todas-razones");

  const btnVela = document.getElementById("btn-soplar-vela");
  const velaHint = document.getElementById("vela-hint");
  const deseoTituloEl = document.getElementById("deseo-titulo");
  const deseoInstruccionEl = document.getElementById("deseo-instruccion");
  const valeRegaloEl = document.getElementById("vale-regalo");

  // 1. Cargar textos personalizados desde datos.js
  function cargarContenido() {
    document.title = `Para ${datos.nombrePareja} ♥`;

    document.getElementById("intro-sobretitulo").textContent = datos.pantallaInicio.sobretitulo;
    document.getElementById("intro-titulo").textContent = datos.pantallaInicio.titulo;
    document.getElementById("intro-subtitulo").textContent = datos.pantallaInicio.subtitulo;
    document.getElementById("intro-btn-texto").textContent = datos.pantallaInicio.textoBoton;

    document.getElementById("etiqueta-fecha").textContent = datos.etiquetaFecha;
    document.getElementById("portada-titulo").textContent = datos.portada.titulo;
    document.getElementById("portada-nombre").textContent = datos.nombrePareja;
    document.getElementById("portada-subtitulo").textContent = datos.portada.subtitulo;

    document.getElementById("carta-titulo").textContent = datos.carta.titulo;
    const cartaCuerpo = document.getElementById("carta-cuerpo");
    cartaCuerpo.innerHTML = "";
    datos.carta.parrafos.forEach((texto) => {
      const p = document.createElement("p");
      p.textContent = texto;
      cartaCuerpo.appendChild(p);
    });
    document.getElementById("carta-despedida").textContent = datos.carta.despedida;
    document.getElementById("carta-autor").textContent = datos.tuNombre;
    document.getElementById("footer-autor").textContent = datos.tuNombre;

    deseoTituloEl.textContent = datos.deseoFinal.titulo;
    deseoInstruccionEl.textContent = datos.deseoFinal.instruccion;
    document.getElementById("vale-subtitulo").textContent = datos.deseoFinal.mensajeSorpresa;
    document.getElementById("vale-titulo").textContent = datos.deseoFinal.tituloVale;
    document.getElementById("vale-detalle").textContent = datos.deseoFinal.detalleVale;

    // Construir vista de todas las razones
    listaTodasEl.innerHTML = "";
    datos.razones.forEach((razon, index) => {
      const card = document.createElement("article");
      card.className = "nota-razon";

      const num = document.createElement("span");
      num.className = "nota-razon-num";
      num.textContent = `RAZÓN ${String(index + 1).padStart(2, "0")}`;

      const p = document.createElement("p");
      p.textContent = razon;

      card.append(num, p);
      listaTodasEl.appendChild(card);
    });
  }

  // 2. Partículas suaves + estallidos cálidos en Canvas
  const canvas = document.getElementById("ambiente-canvas");
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colores = ["#c49a5c", "#d98b88", "#8f3d4c", "#e8c391", "#f0b8ae"];
  let particulas = [];
  let animacionActiva = false;

  function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function lanzarDestello(x, y, cantidad = 28) {
    if (reduceMotion) return;

    for (let i = 0; i < cantidad; i++) {
      const angulo = (Math.PI * 2 * i) / cantidad + (Math.random() - 0.5) * 0.4;
      const velocidad = 1.6 + Math.random() * 4.2;
      particulas.push({
        x,
        y,
        vx: Math.cos(angulo) * velocidad,
        vy: Math.sin(angulo) * velocidad - 1.5,
        size: 3 + Math.random() * 4.5,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.012,
        color: colores[Math.floor(Math.random() * colores.length)],
        esCorazon: Math.random() < 0.35
      });
    }

    if (!animacionActiva) {
      animacionActiva = true;
      requestAnimationFrame(dibujarParticulas);
    }
  }

  function dibujarCorazon(x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.35;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(
      x - size / 2,
      y + (size + topCurveHeight) / 2,
      x,
      y + (size + topCurveHeight) / 1.4,
      x,
      y + size
    );
    ctx.bezierCurveTo(
      x,
      y + (size + topCurveHeight) / 1.4,
      x + size / 2,
      y + (size + topCurveHeight) / 2,
      x + size / 2,
      y + topCurveHeight
    );
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function dibujarParticulas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas = particulas.filter((p) => p.alpha > 0.02);

    particulas.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.07; // gravedad suave
      p.vx *= 0.985;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.esCorazon) {
        dibujarCorazon(p.x, p.y, p.size * 2.1);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (particulas.length > 0) {
      requestAnimationFrame(dibujarParticulas);
    } else {
      animacionActiva = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // 3. Abrir sorpresa inicial
  body.classList.add("bloqueado");

  btnAbrir.addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lanzarDestello(rect.left + rect.width / 2, rect.top + rect.height / 2, 42);

    overlay.classList.add("oculta");
    body.classList.remove("bloqueado");
    main.classList.add("visible");
    main.setAttribute("aria-hidden", "false");

    activarObservadorSecciones();
  });

  // 4. Interacción: "Razones por las que te amo"
  const razones = datos.razones;
  let indiceActual = 0;
  const vistas = new Set([0]);

  function actualizarRazon(nuevoIndice, conAnimacion = true) {
    const total = razones.length;
    indiceActual = ((nuevoIndice % total) + total) % total;
    vistas.add(indiceActual);

    const aplicarTexto = () => {
      razonTextoEl.textContent = razones[indiceActual];
      razonContadorEl.textContent = `Razón ${String(indiceActual + 1).padStart(2, "0")} de ${String(total).padStart(2, "0")}`;

      const cantidad = vistas.size;
      razonDescubiertasEl.textContent =
        cantidad === 1 ? "1 descubierta" : `${cantidad} de ${total} descubiertas`;

      const porcentaje = Math.round((cantidad / total) * 100);
      barraProgresoEl.style.width = `${porcentaje}%`;

      if (cantidad === total) {
        mensajeCompletoEl.hidden = false;
      }
    };

    if (!conAnimacion || reduceMotion) {
      aplicarTexto();
      return;
    }

    razonTextoEl.classList.add("cambiando");
    window.setTimeout(() => {
      aplicarTexto();
      razonTextoEl.classList.remove("cambiando");
    }, 220);
  }

  btnNuevaRazon.addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    lanzarDestello(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    actualizarRazon(indiceActual + 1, true);
  });

  btnAnterior.addEventListener("click", () => {
    actualizarRazon(indiceActual - 1, true);
  });

  btnVerTodas.addEventListener("click", () => {
    const abierto = !listaTodasEl.hidden;
    listaTodasEl.hidden = abierto;
    btnVerTodas.setAttribute("aria-expanded", String(!abierto));
    btnVerTodas.textContent = abierto ? "Ver todas" : "Ocultar lista";
  });

  // 5. Interacción: Soplar la vela de cumpleaños
  let velaApagada = false;

  btnVela.addEventListener("click", (e) => {
    if (velaApagada) return;
    velaApagada = true;

    btnVela.classList.add("apagada");
    btnVela.setAttribute("aria-disabled", "true");
    velaHint.textContent = "Deseo pedido ✦";

    deseoTituloEl.textContent = datos.deseoFinal.tituloDesbloqueado;
    deseoInstruccionEl.textContent = "Aquí tienes tu pequeño regalo:";
    valeRegaloEl.hidden = false;

    const rect = e.currentTarget.getBoundingClientRect();
    lanzarDestello(rect.left + rect.width / 2, rect.top + 45, 48);
  });

  // 6. Revelar secciones suavemente al hacer scroll
  function activarObservadorSecciones() {
    const secciones = document.querySelectorAll(".seccion-revelar");

    if (!("IntersectionObserver" in window) || reduceMotion) {
      secciones.forEach((s) => s.classList.add("en-vista"));
      return;
    }

    const observador = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("en-vista");
            observador.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    secciones.forEach((s) => observador.observe(s));
  }

  // Inicializar
  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas);
  cargarContenido();
  actualizarRazon(0, false);
})();

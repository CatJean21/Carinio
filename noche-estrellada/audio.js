/**
 * =====================================================================
 *  MOTOR DE AUDIO NOCTURNO
 *  - Si una canción tiene archivoAudio ("musica/mi-cancion.mp3"),
 *    reproduce ese archivo real.
 *  - Si archivoAudio está vacío, genera en vivo una melodía suave de
 *    piano celestial / caja de música con Web Audio API para que la
 *    página suene bonita desde el primer segundo.
 * =====================================================================
 */

(function () {
  // Progresiones suaves (frecuencias en Hz) para cada tema nocturno
  const MELODIAS = {
    claroDeLuna: {
      duracionSeg: 130,
      tempoMs: 560,
      acordes: [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0],  // Am7
        [174.61, 220.0, 261.63, 329.63], // Fmaj7
        [196.0, 246.94, 293.66, 392.0]   // G6
      ],
      arpegio: [0, 1, 2, 3, 2, 1, 3, 2]
    },
    constelacion: {
      duracionSeg: 144,
      tempoMs: 520,
      acordes: [
        [293.66, 369.99, 440.0, 554.37], // Dmaj7
        [246.94, 293.66, 369.99, 440.0], // Bm7
        [196.0, 246.94, 293.66, 369.99], // Gmaj7
        [220.0, 277.18, 329.63, 440.0]   // A
      ],
      arpegio: [0, 2, 1, 3, 2, 3, 1, 2]
    },
    medianoche: {
      duracionSeg: 138,
      tempoMs: 600,
      acordes: [
        [246.94, 293.66, 369.99, 440.0], // Bm7
        [196.0, 246.94, 293.66, 369.99], // Gmaj7
        [293.66, 369.99, 440.0, 523.25], // Dadd9
        [220.0, 261.63, 329.63, 392.0]   // Am7
      ],
      arpegio: [0, 1, 3, 2, 1, 2, 3, 1]
    },
    amanecer: {
      duracionSeg: 150,
      tempoMs: 540,
      acordes: [
        [261.63, 329.63, 392.0, 523.25], // C
        [196.0, 246.94, 293.66, 440.0],  // G9
        [220.0, 261.63, 329.63, 493.88], // Am9
        [174.61, 220.0, 261.63, 392.0]   // Fadd9
      ],
      arpegio: [0, 1, 2, 3, 1, 2, 3, 2]
    }
  };

  class MotorAudioNocturno {
    constructor() {
      this.ctx = null;
      this.masterGain = null;
      this.audioEl = new Audio();
      this.audioEl.preload = "metadata";

      this.trackActual = null;
      this.modoArchivo = false;
      this.reproduciendo = false;
      this.volumen = 0.65;

      // Estado para el sintetizador nocturno
      this.synthTimer = null;
      this.pasoActual = 0;
      this.tiempoTranscurrido = 0;
      this.ultimoTick = 0;
      this.nivelVisual = 0;
      this.onEnded = null;

      this.audioEl.addEventListener("ended", () => {
        this.reproduciendo = false;
        if (typeof this.onEnded === "function") {
          this.onEnded();
        }
      });
    }

    asegurarContexto() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.volumen * 0.42;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    cargarTrack(track, autoReproducir = false) {
      this.detenerSynth();
      this.audioEl.pause();
      this.trackActual = track;
      this.tiempoTranscurrido = 0;
      this.pasoActual = 0;

      const ruta = (track.archivoAudio || "").trim();
      this.modoArchivo = Boolean(ruta);

      if (this.modoArchivo) {
        this.audioEl.src = ruta;
        this.audioEl.volume = this.volumen;
        this.audioEl.currentTime = 0;
      } else {
        this.audioEl.removeAttribute("src");
      }

      if (autoReproducir) {
        this.reproducir();
      } else {
        this.reproduciendo = false;
      }
    }

    reproducir() {
      if (!this.trackActual) return;
      this.asegurarContexto();
      this.reproduciendo = true;

      if (this.modoArchivo) {
        this.audioEl.volume = this.volumen;
        this.audioEl.play().catch(() => {
          // Si falla la carga del MP3 local, caemos suavemente a la melodía nocturna
          this.modoArchivo = false;
          this.iniciarSynth();
        });
      } else {
        this.iniciarSynth();
      }
    }

    pausar() {
      this.reproduciendo = false;
      if (this.modoArchivo) {
        this.audioEl.pause();
      } else {
        this.detenerSynth();
      }
    }

    alternar() {
      if (this.reproduciendo) {
        this.pausar();
      } else {
        this.reproducir();
      }
      return this.reproduciendo;
    }

    establecerVolumen(valor01) {
      this.volumen = Math.max(0, Math.min(1, valor01));
      this.audioEl.volume = this.volumen;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.volumen * 0.42, this.ctx.currentTime, 0.05);
      }
    }

    buscarProgreso(porcentaje01) {
      const p = Math.max(0, Math.min(1, porcentaje01));
      if (this.modoArchivo && Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
        this.audioEl.currentTime = p * this.audioEl.duration;
      } else {
        const dur = this.obtenerDuracion();
        this.tiempoTranscurrido = p * dur;
      }
    }

    obtenerDuracion() {
      if (this.modoArchivo && Number.isFinite(this.audioEl.duration) && this.audioEl.duration > 0) {
        return this.audioEl.duration;
      }
      const preset = this.obtenerPreset();
      return preset.duracionSeg;
    }

    obtenerTiempoActual() {
      if (this.modoArchivo) {
        return this.audioEl.currentTime || 0;
      }
      if (this.reproduciendo && this.ultimoTick > 0) {
        const ahora = performance.now();
        const delta = (ahora - this.ultimoTick) / 1000;
        this.ultimoTick = ahora;
        this.tiempoTranscurrido += delta;

        const dur = this.obtenerDuracion();
        if (this.tiempoTranscurrido >= dur) {
          this.tiempoTranscurrido = 0;
          if (typeof this.onEnded === "function") {
            this.onEnded();
          }
        }
      }
      return this.tiempoTranscurrido;
    }

    obtenerPreset() {
      const clave = this.trackActual && this.trackActual.melodia;
      return MELODIAS[clave] || MELODIAS.claroDeLuna;
    }

    iniciarSynth() {
      this.detenerSynth();
      const ctx = this.asegurarContexto();
      if (!ctx) return;

      const preset = this.obtenerPreset();
      this.ultimoTick = performance.now();

      const tocarPaso = () => {
        if (!this.reproduciendo) return;
        const indiceAcorde = Math.floor(this.pasoActual / preset.arpegio.length) % preset.acordes.length;
        const acorde = preset.acordes[indiceAcorde];
        const indiceNota = preset.arpegio[this.pasoActual % preset.arpegio.length];
        const freqNota = acorde[indiceNota] * (this.pasoActual % 8 === 7 ? 2 : 1);

        // Al comienzo de cada compás sonamos un pad cálido de fondo
        if (this.pasoActual % preset.arpegio.length === 0) {
          this.tocarPad(acorde[0] / 2, (preset.tempoMs * preset.arpegio.length) / 1000);
          this.tocarPad(acorde[2] / 2, (preset.tempoMs * preset.arpegio.length) / 1000);
        }

        this.tocarNotaCelesta(freqNota, 1.8);
        this.nivelVisual = 1;
        this.pasoActual += 1;
      };

      tocarPaso();
      this.synthTimer = window.setInterval(tocarPaso, preset.tempoMs);
    }

    detenerSynth() {
      if (this.synthTimer !== null) {
        window.clearInterval(this.synthTimer);
        this.synthTimer = null;
      }
      this.ultimoTick = 0;
    }

    tocarNotaCelesta(frecuencia, duracionSeg) {
      if (!this.ctx || !this.masterGain) return;
      const ahora = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filtro = this.ctx.createBiquadFilter();
      const env = this.ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";
      osc1.frequency.setValueAtTime(frecuencia, ahora);
      osc2.frequency.setValueAtTime(frecuencia * 2, ahora);

      filtro.type = "lowpass";
      filtro.frequency.setValueAtTime(1600, ahora);
      filtro.frequency.exponentialRampToValueAtTime(520, ahora + duracionSeg);

      env.gain.setValueAtTime(0.0001, ahora);
      env.gain.linearRampToValueAtTime(0.24, ahora + 0.035);
      env.gain.exponentialRampToValueAtTime(0.0008, ahora + duracionSeg);

      const gainArmonico = this.ctx.createGain();
      gainArmonico.gain.value = 0.08;

      osc1.connect(filtro);
      osc2.connect(gainArmonico);
      gainArmonico.connect(filtro);
      filtro.connect(env);
      env.connect(this.masterGain);

      osc1.start(ahora);
      osc2.start(ahora);
      osc1.stop(ahora + duracionSeg + 0.05);
      osc2.stop(ahora + duracionSeg + 0.05);
    }

    tocarPad(frecuencia, duracionSeg) {
      if (!this.ctx || !this.masterGain) return;
      const ahora = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const filtro = this.ctx.createBiquadFilter();
      const env = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frecuencia, ahora);

      filtro.type = "lowpass";
      filtro.frequency.setValueAtTime(420, ahora);

      env.gain.setValueAtTime(0.0001, ahora);
      env.gain.linearRampToValueAtTime(0.14, ahora + 0.9);
      env.gain.exponentialRampToValueAtTime(0.0008, ahora + duracionSeg);

      osc.connect(filtro);
      filtro.connect(env);
      env.connect(this.masterGain);

      osc.start(ahora);
      osc.stop(ahora + duracionSeg + 0.1);
    }

    // Destello musical suave al tocar una estrella de la constelación o lanzar estrella fugaz
    tocarDestelloEstrella(indice = 0) {
      const ctx = this.asegurarContexto();
      if (!ctx || !this.masterGain) return;
      const escala = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];
      const freq = escala[indice % escala.length];
      this.tocarNotaCelesta(freq, 1.15);
    }

    obtenerNivelVisual() {
      if (!this.reproduciendo) return 0;
      this.nivelVisual *= 0.94;
      return Math.max(0.25, this.nivelVisual);
    }
  }

  window.MotorAudioNocturno = MotorAudioNocturno;
})();

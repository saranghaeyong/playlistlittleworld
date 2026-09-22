/**
 * Web Audio Engine for anime lo-fi music & Japanese summer ambient soundscapes.
 * Supports both local MP3 audio files and seamless procedural sound synthesis fallbacks.
 */

import { PlaylistItem, AmbienceSoundType } from "../types";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmAudioEl: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;
  private isAmbiencePlaying: boolean = false;
  private currentTrack: PlaylistItem | null = null;
  private bgmVolume: number = 0.7;
  private ambienceVolume: number = 0.5;
  private activeAmbience: AmbienceSoundType = "cicadas";
  private isSynthesizingBgm: boolean = false;

  // Synthesis nodes
  private bgmGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private ambienceTimer: number | null = null;
  private windNode: AudioNode | null = null;
  private rainNode: AudioNode | null = null;

  // Callbacks for UI updates
  private onTrackProgressCallbacks: Set<(currentTime: number, duration: number) => void> = new Set();
  private onStateChangeCallbacks: Set<() => void> = new Set();
  private currentTime: number = 0;
  private progressTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
      this.ambienceGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  public onProgress(cb: (currentTime: number, duration: number) => void): () => void {
    this.onTrackProgressCallbacks.add(cb);
    return () => {
      this.onTrackProgressCallbacks.delete(cb);
    };
  }

  private notify() {
    this.onStateChangeCallbacks.forEach((cb) => cb());
  }

  // --- BGM Methods ---
  public async playTrack(track: PlaylistItem) {
    this.initContext();
    this.currentTrack = track;
    this.currentTime = 0;

    // Try HTMLAudioElement first if available
    if (track.audio) {
      try {
        if (this.bgmAudioEl) {
          this.bgmAudioEl.pause();
          this.bgmAudioEl.src = "";
        }
        const audio = new Audio();
        audio.src = track.audio;
        audio.volume = this.bgmVolume;
        audio.loop = true;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.bgmAudioEl = audio;
          this.isBgmPlaying = true;
          this.isSynthesizingBgm = false;
          this.stopSynthBgm();
          this.startProgressTracker();
          this.notify();
          return;
        }
      } catch {
        // Fallback to procedural synthesis seamlessly
      }
    }

    // Fallback: procedural anime lo-fi generator
    this.isBgmPlaying = true;
    this.isSynthesizingBgm = true;
    this.startSynthBgm(track);
    this.startProgressTracker();
    this.notify();
  }

  public pauseBgm() {
    this.isBgmPlaying = false;
    if (this.bgmAudioEl) {
      this.bgmAudioEl.pause();
    }
    this.stopSynthBgm();
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
    this.notify();
  }

  public resumeBgm() {
    if (this.currentTrack) {
      if (this.isSynthesizingBgm) {
        this.initContext();
        this.isBgmPlaying = true;
        this.startSynthBgm(this.currentTrack);
        this.startProgressTracker();
        this.notify();
      } else if (this.bgmAudioEl) {
        this.bgmAudioEl.play().catch(() => {
          this.isSynthesizingBgm = true;
          this.startSynthBgm(this.currentTrack!);
        });
        this.isBgmPlaying = true;
        this.startProgressTracker();
        this.notify();
      }
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.pauseBgm();
    } else {
      if (this.currentTrack) {
        this.resumeBgm();
      }
    }
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudioEl) {
      this.bgmAudioEl.volume = this.bgmVolume;
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  public seek(seconds: number) {
    if (!this.currentTrack) return;
    this.currentTime = Math.max(0, Math.min(this.currentTrack.duration, seconds));
    if (this.bgmAudioEl && !this.isSynthesizingBgm) {
      this.bgmAudioEl.currentTime = this.currentTime;
    }
    this.onTrackProgressCallbacks.forEach((cb) => cb(this.currentTime, this.currentTrack!.duration));
  }

  private startProgressTracker() {
    if (this.progressTimer) clearInterval(this.progressTimer);
    this.progressTimer = window.setInterval(() => {
      if (!this.isBgmPlaying || !this.currentTrack) return;

      if (this.bgmAudioEl && !this.isSynthesizingBgm) {
        this.currentTime = this.bgmAudioEl.currentTime;
      } else {
        this.currentTime += 1;
        if (this.currentTime >= this.currentTrack.duration) {
          this.currentTime = 0;
        }
      }

      this.onTrackProgressCallbacks.forEach((cb) =>
        cb(this.currentTime, this.currentTrack?.duration || 180)
      );
    }, 1000);
  }

  // --- Procedural Lo-Fi Chords Generator ---
  private startSynthBgm(track: PlaylistItem) {
    this.stopSynthBgm();
    if (!this.ctx || !this.bgmGain) return;

    // Frequencies for soothing lo-fi notes
    const noteMap: Record<string, number> = {
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, "F#4": 369.99, G4: 392.00, A4: 440.00, "Bb4": 466.16, B4: 493.88,
      C5: 523.25, "C#5": 554.37, D5: 587.33, E5: 659.25, "F#5": 739.99, G5: 783.99, A5: 880.00
    };

    // Chord progressions for a nostalgic summer feeling
    const chordProgression: number[][] = [
      [noteMap["F4"] || 349, noteMap["A4"] || 440, noteMap["C5"] || 523, noteMap["E5"] || 659], // Fmaj7
      [noteMap["E4"] || 329, noteMap["G4"] || 392, noteMap["B4"] || 493, noteMap["D5"] || 587], // Em7
      [noteMap["D4"] || 293, noteMap["F4"] || 349, noteMap["A4"] || 440, noteMap["C5"] || 523], // Dm7
      [noteMap["C4"] || 261, noteMap["E4"] || 329, noteMap["G4"] || 392, noteMap["B4"] || 493], // Cmaj7
    ];

    let chordStep = 0;
    const playNextChord = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const chord = chordProgression[chordStep % chordProgression.length];
      chordStep++;

      const now = this.ctx.currentTime;
      // Play warm electric piano style chord
      chord.forEach((freq, i) => {
        if (!this.ctx || !this.bgmGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Warm low-pass
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800 + Math.random() * 200, now);
        filter.Q.setValueAtTime(1.5, now);

        // Soft triangle wave with tiny detune for tape-flutter feeling
        osc.type = i % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

        // Gentle envelope: soft attack, warm sustain, long gentle release
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.08 / chord.length, now + 0.15 + i * 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGain);

        osc.start(now + i * 0.04);
        osc.stop(now + 3.0);
      });

      // Occasional gentle bell chime or acoustic arpeggio
      if (Math.random() > 0.3) {
        const chimeFreq = (noteMap["A5"] || 880) * (Math.random() > 0.5 ? 0.75 : 1);
        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = "sine";
        chimeOsc.frequency.setValueAtTime(chimeFreq, now + 0.6);
        chimeGain.gain.setValueAtTime(0.0001, now + 0.6);
        chimeGain.gain.linearRampToValueAtTime(0.018, now + 0.65);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.bgmGain);
        chimeOsc.start(now + 0.6);
        chimeOsc.stop(now + 2.3);
      }
    };

    playNextChord();
    this.synthInterval = window.setInterval(playNextChord, 2600);
  }

  private stopSynthBgm() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // --- Ambience Soundscapes (Japanese Summer) ---
  public toggleAmbience() {
    this.initContext();
    this.isAmbiencePlaying = !this.isAmbiencePlaying;
    if (this.isAmbiencePlaying) {
      this.startAmbience(this.activeAmbience);
    } else {
      this.stopAmbience();
    }
    this.notify();
  }

  public setAmbienceSound(type: AmbienceSoundType) {
    this.activeAmbience = type;
    if (this.isAmbiencePlaying) {
      this.startAmbience(type);
    }
    this.notify();
  }

  public setAmbienceVolume(vol: number) {
    this.ambienceVolume = Math.max(0, Math.min(1, vol));
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setValueAtTime(this.ambienceVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  private startAmbience(type: AmbienceSoundType) {
    this.stopAmbience();
    if (!this.ctx || !this.ambienceGain) return;

    if (type === "cicadas") {
      this.startCicadaAmbience();
    } else if (type === "wind") {
      this.startWindAmbience();
    } else if (type === "birds") {
      this.startBirdsAmbience();
    } else if (type === "rain") {
      this.startRainAmbience();
    }
  }

  private stopAmbience() {
    if (this.ambienceTimer) {
      clearInterval(this.ambienceTimer);
      this.ambienceTimer = null;
    }
    if (this.windNode) {
      try {
        (this.windNode as AudioScheduledSourceNode).stop?.();
      } catch {}
      this.windNode = null;
    }
    if (this.rainNode) {
      try {
        (this.rainNode as AudioScheduledSourceNode).stop?.();
      } catch {}
      this.rainNode = null;
    }
  }

  // Japanese Summer Cicada sound (Higurashi kana-kana & Minminzemi)
  private startCicadaAmbience() {
    const playCicadaChirp = () => {
      if (!this.isAmbiencePlaying || !this.ctx || !this.ambienceGain) return;
      const now = this.ctx.currentTime;

      // Resonant bandpass filtered pulse
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const biquad = this.ctx.createBiquadFilter();

      biquad.type = "bandpass";
      biquad.frequency.setValueAtTime(4600 + Math.random() * 400, now);
      biquad.Q.setValueAtTime(8, now);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);

      // Tremolo/vibrato for that cicada drone
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(14, now);
      lfoGain.gain.setValueAtTime(0.04, now);
      lfo.connect(gain.gain);
      lfo.start(now);
      lfo.stop(now + 3.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start(now);
      osc.stop(now + 3.2);
    };

    playCicadaChirp();
    this.ambienceTimer = window.setInterval(playCicadaChirp, 3600);
  }

  // Gentle summer breeze wind
  private startWindAmbience() {
    if (!this.ctx || !this.ambienceGain) return;

    // Buffer of pink-ish noise
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // Slowly modulate the filter for wind gusts
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceGain);

    noise.start();
    this.windNode = noise;
  }

  // Sparrows & evening garden birds
  private startBirdsAmbience() {
    const playBirdChirp = () => {
      if (!this.isAmbiencePlaying || !this.ctx || !this.ambienceGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const baseFreq = 2400 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.16);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ambienceGain);
      osc.start(now);
      osc.stop(now + 0.25);
    };

    playBirdChirp();
    this.ambienceTimer = window.setInterval(() => {
      playBirdChirp();
      if (Math.random() > 0.4) {
        setTimeout(playBirdChirp, 180);
      }
    }, 2800);
  }

  // Soft summer drizzle
  private startRainAmbience() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambienceGain);

    noise.start();
    this.rainNode = noise;
  }

  // --- Interactive Sound Effects (Easter Eggs) ---
  public playCanClick() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Metal can drop thud + metallic clink
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playCatMeow() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.6);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playWindChime() {
    this.initContext();
    if (!this.ctx) return;
    const notes = [1200, 1500, 1800, 2400];
    notes.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now);
      osc.stop(now + 1.3);
    });
  }

  public playTrainBell() {
    this.initContext();
    if (!this.ctx) return;
    // Classic Japanese railway crossing double bell ding-dong
    const tones = [840, 720];
    for (let i = 0; i < 4; i++) {
      const freq = tones[i % 2];
      const now = this.ctx.currentTime + i * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  }

  // --- Getters ---
  public getState() {
    return {
      isBgmPlaying: this.isBgmPlaying,
      isAmbiencePlaying: this.isAmbiencePlaying,
      currentTrack: this.currentTrack,
      bgmVolume: this.bgmVolume,
      ambienceVolume: this.ambienceVolume,
      activeAmbience: this.activeAmbience,
      currentTime: this.currentTime,
    };
  }
}

export const soundEngine = new SoundEngine();

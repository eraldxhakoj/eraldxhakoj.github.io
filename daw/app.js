const steps = 16;
const pianoNotes = [
  "C5",
  "B4",
  "A#4",
  "A4",
  "G#4",
  "G4",
  "F#4",
  "F4",
  "E4",
  "D#4",
  "D4",
  "C#4",
  "C4"
];

const drumTracks = [
  { id: "kick", label: "Kick" },
  { id: "snare", label: "Snare" },
  { id: "hat", label: "Hi-Hat" }
];

const synthPresets = {
  "aurora-lead": {
    id: "aurora-lead",
    name: "Aurora Lead",
    oscillators: [
      { type: "sawtooth", detune: -8 },
      { type: "sawtooth", detune: 8 }
    ],
    filterCutoff: 3200,
    filterResonance: 11,
    envelope: { attack: 0.02, decay: 0.18, sustain: 0.62, release: 0.45 },
    gain: 0.55
  },
  "midnight-pad": {
    id: "midnight-pad",
    name: "Midnight Pad",
    oscillators: [
      { type: "triangle", detune: -4 },
      { type: "sine", detune: 6 }
    ],
    filterCutoff: 2000,
    filterResonance: 8,
    envelope: { attack: 0.35, decay: 0.7, sustain: 0.8, release: 1.8 },
    gain: 0.5
  },
  "glacier-pluck": {
    id: "glacier-pluck",
    name: "Glacier Pluck",
    oscillators: [
      { type: "square", detune: 0 },
      { type: "triangle", detune: 12 }
    ],
    filterCutoff: 4200,
    filterResonance: 14,
    envelope: { attack: 0.01, decay: 0.18, sustain: 0.35, release: 0.25 },
    gain: 0.5
  },
  "velvet-keys": {
    id: "velvet-keys",
    name: "Velvet Keys",
    oscillators: [
      { type: "sine", detune: -5 },
      { type: "sine", detune: 5 }
    ],
    filterCutoff: 2600,
    filterResonance: 9,
    envelope: { attack: 0.08, decay: 0.32, sustain: 0.7, release: 0.9 },
    gain: 0.58
  }
};

const pianoGrid = document.getElementById("pianoGrid");
const drumGrid = document.getElementById("drumGrid");
const tempoInput = document.getElementById("tempo");
const tempoDisplay = document.getElementById("tempoDisplay");
const swingInput = document.getElementById("swing");
const swingDisplay = document.getElementById("swingDisplay");
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
const clearPatternButton = document.getElementById("clearPattern");
const seedPatternButton = document.getElementById("seedPattern");
const sceneNameInput = document.getElementById("sceneName");
const sceneRepeatsInput = document.getElementById("sceneRepeats");
const addSceneButton = document.getElementById("addScene");
const arrangementList = document.getElementById("arrangementList");
const clearArrangementButton = document.getElementById("clearArrangement");
const sceneDisplay = document.getElementById("sceneDisplay");
const synthPresetSelect = document.getElementById("synthPreset");
const filterCutoffInput = document.getElementById("filterCutoff");
const filterCutoffDisplay = document.getElementById("filterCutoffDisplay");
const filterResonanceInput = document.getElementById("filterResonance");
const filterResonanceDisplay = document.getElementById("filterResonanceDisplay");
const attackInput = document.getElementById("attack");
const attackDisplay = document.getElementById("attackDisplay");
const releaseInput = document.getElementById("release");
const releaseDisplay = document.getElementById("releaseDisplay");

const pianoState = pianoNotes.map(() => Array(steps).fill(false));
const drumState = drumTracks.map(() => Array(steps).fill(false));
const pianoCells = pianoNotes.map(() => Array(steps));
const drumCells = drumTracks.map(() => Array(steps));

const arrangementState = [];
let selectedSceneId = null;
let arrangementMode = false;
let activeSceneIndex = -1;
let activeSceneRepeats = 0;

let audioCtx;
let masterGain;
let noiseBuffer;
let isPlaying = false;
let currentStep = 0;
let timerId;

let synthSettings = clonePreset(synthPresets[synthPresetSelect.value]);

buildPianoGrid();
buildDrumGrid();
updateTempoDisplay();
updateSwingDisplay();
refreshCells();
applySynthControls();
setSceneLabel("Live Pattern");
seedDemoPattern();

stopButton.disabled = true;

playButton.addEventListener("click", startPlayback);
stopButton.addEventListener("click", () => stopPlayback(false));
clearPatternButton.addEventListener("click", () => {
  clearPattern();
  selectedSceneId = null;
  setSceneLabel("Live Pattern");
});
seedPatternButton.addEventListener("click", () => {
  clearPattern();
  seedDemoPattern();
  selectedSceneId = null;
  setSceneLabel("Pattern Demo");
});

tempoInput.addEventListener("input", updateTempoDisplay);
swingInput.addEventListener("input", updateSwingDisplay);

addSceneButton.addEventListener("click", addSceneFromCurrentPattern);
clearArrangementButton.addEventListener("click", () => {
  arrangementState.splice(0, arrangementState.length);
  selectedSceneId = null;
  renderArrangementList();
  setSceneLabel("Live Pattern");
});

arrangementList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const index = arrangementState.findIndex((scene) => scene.id === id);
  if (index === -1) return;

  switch (action) {
    case "load":
      loadSceneForEditing(arrangementState[index]);
      break;
    case "remove":
      arrangementState.splice(index, 1);
      if (selectedSceneId === id) {
        selectedSceneId = null;
        setSceneLabel("Live Pattern");
      }
      renderArrangementList();
      break;
    case "up":
      if (index > 0) {
        moveScene(index, index - 1);
      }
      break;
    case "down":
      if (index < arrangementState.length - 1) {
        moveScene(index, index + 1);
      }
      break;
    default:
      break;
  }
});

synthPresetSelect.addEventListener("change", () => {
  synthSettings = clonePreset(synthPresets[synthPresetSelect.value]);
  applySynthControls();
});

filterCutoffInput.addEventListener("input", () => {
  synthSettings.filterCutoff = Number.parseFloat(filterCutoffInput.value);
  updateSynthDisplays();
});

filterResonanceInput.addEventListener("input", () => {
  synthSettings.filterResonance = Number.parseFloat(filterResonanceInput.value);
  updateSynthDisplays();
});

attackInput.addEventListener("input", () => {
  synthSettings.envelope.attack = Number.parseFloat(attackInput.value);
  updateSynthDisplays();
});

releaseInput.addEventListener("input", () => {
  synthSettings.envelope.release = Number.parseFloat(releaseInput.value);
  updateSynthDisplays();
});

window.addEventListener("keydown", (event) => {
  if (event.code !== "Space" || event.repeat) return;
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
    return;
  if (target && target.isContentEditable) return;
  event.preventDefault();
  if (isPlaying) {
    stopPlayback(false);
  } else {
    startPlayback();
  }
});

function buildPianoGrid() {
  pianoGrid.innerHTML = "";
  pianoNotes.forEach((note, rowIndex) => {
    const row = document.createElement("div");
    row.className = "note-row";

    const label = document.createElement("div");
    label.className = "note-label";
    label.textContent = note;
    row.appendChild(label);

    for (let stepIndex = 0; stepIndex < steps; stepIndex += 1) {
      const cell = createCell("piano", rowIndex, stepIndex);
      row.appendChild(cell);
      pianoCells[rowIndex][stepIndex] = cell;
    }

    pianoGrid.appendChild(row);
  });
}

function buildDrumGrid() {
  drumGrid.innerHTML = "";
  drumTracks.forEach((track, rowIndex) => {
    const row = document.createElement("div");
    row.className = "pattern-row";

    const label = document.createElement("div");
    label.className = "note-label";
    label.textContent = track.label;
    row.appendChild(label);

    for (let stepIndex = 0; stepIndex < steps; stepIndex += 1) {
      const cell = createCell("drum", rowIndex, stepIndex);
      row.appendChild(cell);
      drumCells[rowIndex][stepIndex] = cell;
    }

    drumGrid.appendChild(row);
  });
}

function createCell(type, rowIndex, stepIndex) {
  const cell = document.createElement("div");
  cell.className = "cell";
  const button = document.createElement("button");
  button.type = "button";
  button.addEventListener("click", () => {
    const isActive = toggleCell(type, rowIndex, stepIndex);
    button.classList.toggle("active", isActive);
  });
  cell.appendChild(button);
  return cell;
}

function toggleCell(type, rowIndex, stepIndex) {
  if (type === "piano") {
    pianoState[rowIndex][stepIndex] = !pianoState[rowIndex][stepIndex];
    return pianoState[rowIndex][stepIndex];
  }
  drumState[rowIndex][stepIndex] = !drumState[rowIndex][stepIndex];
  return drumState[rowIndex][stepIndex];
}

function addSceneFromCurrentPattern() {
  const name = sceneNameInput.value.trim() || `Sezione ${arrangementState.length + 1}`;
  const repeats = Math.max(1, Number.parseInt(sceneRepeatsInput.value, 10) || 1);
  const pattern = snapshotPattern();
  const scene = {
    id: `scene-${(Date.now()).toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    repeats,
    piano: pattern.piano,
    drums: pattern.drums
  };
  arrangementState.push(scene);
  sceneNameInput.value = "";
  sceneRepeatsInput.value = repeats.toString();
  renderArrangementList();
  setSceneLabel(`Scene salvata: ${name}`);
}

function moveScene(from, to) {
  const [scene] = arrangementState.splice(from, 1);
  arrangementState.splice(to, 0, scene);
  renderArrangementList();
}

function loadSceneForEditing(scene) {
  injectPattern(scene.piano, scene.drums);
  selectedSceneId = scene.id;
  setSceneLabel(`Scene selezionata: ${scene.name}`);
  renderArrangementList();
}

function snapshotPattern() {
  return {
    piano: pianoState.map((row) => [...row]),
    drums: drumState.map((row) => [...row])
  };
}

function injectPattern(pianoPattern, drumPattern) {
  pianoPattern.forEach((row, rowIndex) => {
    row.forEach((value, stepIndex) => {
      pianoState[rowIndex][stepIndex] = value;
    });
  });
  drumPattern.forEach((row, rowIndex) => {
    row.forEach((value, stepIndex) => {
      drumState[rowIndex][stepIndex] = value;
    });
  });
  refreshCells();
}

function clearPattern() {
  pianoState.forEach((row) => row.fill(false));
  drumState.forEach((row) => row.fill(false));
  refreshCells();
}

function seedDemoPattern() {
  const melody = [
    { note: "C5", steps: [0, 4, 8, 12] },
    { note: "G4", steps: [2, 6, 10, 14] },
    { note: "E4", steps: [4, 12] },
    { note: "D4", steps: [7, 15] }
  ];

  melody.forEach(({ note, steps: activeSteps }) => {
    const rowIndex = pianoNotes.indexOf(note);
    if (rowIndex === -1) return;
    activeSteps.forEach((stepIndex) => {
      pianoState[rowIndex][stepIndex] = true;
    });
  });

  const drumPattern = {
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hat: Array.from({ length: steps }, (_, index) => index).filter((index) => index % 2 === 0)
  };

  drumTracks.forEach(({ id }, rowIndex) => {
    const activeSteps = drumPattern[id] || [];
    activeSteps.forEach((stepIndex) => {
      drumState[rowIndex][stepIndex] = true;
    });
  });

  refreshCells();
}

function refreshCells() {
  pianoCells.forEach((row, rowIndex) => {
    row.forEach((cell, stepIndex) => {
      const button = cell.querySelector("button");
      button.classList.toggle("active", pianoState[rowIndex][stepIndex]);
      cell.classList.remove("playing");
    });
  });
  drumCells.forEach((row, rowIndex) => {
    row.forEach((cell, stepIndex) => {
      const button = cell.querySelector("button");
      button.classList.toggle("active", drumState[rowIndex][stepIndex]);
      cell.classList.remove("playing");
    });
  });
}

function renderArrangementList() {
  arrangementList.innerHTML = "";
  arrangementState.forEach((scene) => {
    const item = document.createElement("li");
    if (scene.id === selectedSceneId) {
      item.classList.add("active");
    }

    const meta = document.createElement("div");
    meta.className = "arrangement-meta";
    const title = document.createElement("strong");
    title.textContent = scene.name;
    const subtitle = document.createElement("span");
    const totalNotes = scene.piano.reduce(
      (sum, row) => sum + row.filter(Boolean).length,
      0
    );
    subtitle.textContent = `${scene.repeats}x • ${totalNotes} eventi`;
    meta.appendChild(title);
    meta.appendChild(subtitle);

    const actions = document.createElement("div");
    actions.className = "scene-actions";
    actions.appendChild(buildSceneActionButton("↑", "up", scene.id, "Sposta su"));
    actions.appendChild(buildSceneActionButton("↓", "down", scene.id, "Sposta giù"));
    actions.appendChild(buildSceneActionButton("⟳", "load", scene.id, "Carica scena"));
    actions.appendChild(buildSceneActionButton("✕", "remove", scene.id, "Elimina"));

    item.appendChild(meta);
    item.appendChild(actions);
    arrangementList.appendChild(item);
  });
}

function buildSceneActionButton(label, action, id, title) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  button.title = title;
  return button;
}

function startPlayback() {
  if (isPlaying) return;
  const context = ensureAudioContext();
  context.resume();

  isPlaying = true;
  arrangementMode = arrangementState.length > 0;
  activeSceneIndex = -1;
  activeSceneRepeats = 0;
  currentStep = 0;
  highlightStep(null);
  playButton.disabled = true;
  stopButton.disabled = false;

  if (arrangementMode) {
    switchToScene(0);
  }

  runStep();
}

function stopPlayback(completed) {
  if (!isPlaying) return;
  isPlaying = false;
  if (timerId) {
    clearTimeout(timerId);
    timerId = undefined;
  }
  highlightStep(null);
  playButton.disabled = false;
  stopButton.disabled = true;
  arrangementMode = false;
  activeSceneIndex = -1;
  activeSceneRepeats = 0;
  if (!completed) {
    setSceneLabel(selectedSceneId ? sceneLabelForSelected() : "Live Pattern");
  } else {
    setSceneLabel("Struttura completata");
  }
}

function runStep() {
  if (!isPlaying) {
    return;
  }

  const context = ensureAudioContext();
  const tempo = Number.parseInt(tempoInput.value, 10);
  const swing = Number.parseFloat(swingInput.value);
  const stepDuration = 60 / tempo / 4;
  const startTime = context.currentTime + 0.02;

  triggerPiano(currentStep, startTime, stepDuration);
  triggerDrums(currentStep, startTime);
  highlightStep(currentStep);

  currentStep = (currentStep + 1) % steps;

  if (currentStep === 0 && arrangementMode) {
    const currentScene = arrangementState[activeSceneIndex];
    activeSceneRepeats += 1;
    if (activeSceneRepeats >= currentScene.repeats) {
      const nextIndex = activeSceneIndex + 1;
      if (nextIndex >= arrangementState.length) {
        stopPlayback(true);
        return;
      }
      switchToScene(nextIndex);
    } else {
      setSceneLabel(buildArrangementLabel(currentScene, activeSceneRepeats + 1));
    }
  }

  let nextInterval = stepDuration;
  if (swing > 0) {
    const swingAmount = stepDuration * swing;
    const isEvenStep = currentStep % 2 === 0;
    nextInterval = isEvenStep ? stepDuration - swingAmount : stepDuration + swingAmount;
  }

  timerId = setTimeout(runStep, Math.max(0.05, nextInterval) * 1000);
}

function switchToScene(index) {
  activeSceneIndex = index;
  activeSceneRepeats = 0;
  const scene = arrangementState[index];
  injectPattern(scene.piano, scene.drums);
  selectedSceneId = scene.id;
  currentStep = 0;
  highlightStep(null);
  setSceneLabel(buildArrangementLabel(scene, 1));
  renderArrangementList();
}

function highlightStep(step) {
  pianoCells.forEach((row) => {
    row.forEach((cell, index) => {
      cell.classList.toggle("playing", step === index);
    });
  });

  drumCells.forEach((row) => {
    row.forEach((cell, index) => {
      cell.classList.toggle("playing", step === index);
    });
  });
}

function triggerPiano(step, startTime, duration) {
  pianoState.forEach((row, rowIndex) => {
    if (!row[step]) return;
    const noteName = pianoNotes[rowIndex];
    const frequency = noteToFrequency(noteName);
    playSynthVoice(frequency, startTime, duration);
  });
}

function triggerDrums(step, startTime) {
  drumState.forEach((row, rowIndex) => {
    if (!row[step]) return;

    const id = drumTracks[rowIndex].id;
    if (id === "kick") {
      playKick(startTime);
    } else if (id === "snare") {
      playSnare(startTime);
    } else {
      playHat(startTime);
    }
  });
}

function ensureAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function ensureNoiseBuffer() {
  if (!noiseBuffer && audioCtx) {
    noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

function playSynthVoice(frequency, startTime, duration) {
  const context = ensureAudioContext();
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(synthSettings.filterCutoff, startTime);
  filter.Q.setValueAtTime(synthSettings.filterResonance, startTime);

  const amp = context.createGain();
  const { attack, decay, sustain, release } = synthSettings.envelope;
  const level = synthSettings.gain;

  amp.gain.cancelScheduledValues(startTime);
  amp.gain.setValueAtTime(0.0001, startTime);
  amp.gain.linearRampToValueAtTime(level, startTime + attack);
  amp.gain.linearRampToValueAtTime(level * sustain, startTime + attack + decay);
  const releaseStart = startTime + duration;
  amp.gain.setValueAtTime(level * sustain, releaseStart);
  amp.gain.linearRampToValueAtTime(0.0001, releaseStart + release);

  const oscillators = synthSettings.oscillators.length
    ? synthSettings.oscillators
    : [{ type: "sawtooth", detune: 0 }];

  const oscNodes = oscillators.map(({ type, detune }) => {
    const osc = context.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);
    osc.detune.setValueAtTime(detune || 0, startTime);
    osc.connect(filter);
    osc.start(startTime);
    osc.stop(releaseStart + release + 0.1);
    return osc;
  });

  filter.connect(amp).connect(masterGain);

  oscNodes.forEach((osc) => {
    osc.onended = () => {
      osc.disconnect();
    };
  });
}

function playKick(startTime) {
  const context = ensureAudioContext();
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(120, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.28);

  gain.gain.setValueAtTime(1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + 0.36);
}

function playSnare(startTime) {
  const context = ensureAudioContext();
  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer();

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(2200, startTime);
  noiseFilter.Q.value = 1.1;

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.75, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);

  const tone = context.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(220, startTime);
  tone.frequency.exponentialRampToValueAtTime(140, startTime + 0.18);

  const toneGain = context.createGain();
  toneGain.gain.setValueAtTime(0.5, startTime);
  toneGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

  noise.connect(noiseFilter).connect(noiseGain).connect(masterGain);
  tone.connect(toneGain).connect(masterGain);

  noise.start(startTime);
  noise.stop(startTime + 0.24);
  tone.start(startTime);
  tone.stop(startTime + 0.2);
}

function playHat(startTime) {
  const context = ensureAudioContext();
  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer();

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(9000, startTime);
  highpass.Q.value = 0.8;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.4, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

  noise.connect(highpass).connect(gain).connect(masterGain);
  noise.start(startTime);
  noise.stop(startTime + 0.14);
}

function noteToFrequency(note) {
  const [, pitch, octave] = note.match(/([A-G]#?)(\d)/);
  const semitoneMap = {
    C: -9,
    "C#": -8,
    D: -7,
    "D#": -6,
    E: -5,
    F: -4,
    "F#": -3,
    G: -2,
    "G#": -1,
    A: 0,
    "A#": 1,
    B: 2
  };
  const semitonesFromA4 = (Number.parseInt(octave, 10) - 4) * 12 + semitoneMap[pitch];
  return 440 * 2 ** (semitonesFromA4 / 12);
}

function updateTempoDisplay() {
  tempoDisplay.textContent = `${tempoInput.value} BPM`;
}

function updateSwingDisplay() {
  const swingPercentage = Math.round(Number.parseFloat(swingInput.value) * 100);
  swingDisplay.textContent = `${swingPercentage}%`;
}

function applySynthControls() {
  filterCutoffInput.value = synthSettings.filterCutoff;
  filterResonanceInput.value = synthSettings.filterResonance;
  attackInput.value = synthSettings.envelope.attack;
  releaseInput.value = synthSettings.envelope.release;
  updateSynthDisplays();
}

function updateSynthDisplays() {
  filterCutoffDisplay.textContent = `${Math.round(synthSettings.filterCutoff)} Hz`;
  filterResonanceDisplay.textContent = `Q ${synthSettings.filterResonance.toFixed(1)}`;
  attackDisplay.textContent = `${synthSettings.envelope.attack.toFixed(2)} s`;
  releaseDisplay.textContent = `${synthSettings.envelope.release.toFixed(2)} s`;
}

function clonePreset(preset) {
  return {
    id: preset.id,
    name: preset.name,
    oscillators: preset.oscillators.map((osc) => ({ ...osc })),
    filterCutoff: preset.filterCutoff,
    filterResonance: preset.filterResonance,
    envelope: { ...preset.envelope },
    gain: preset.gain
  };
}

function setSceneLabel(text) {
  sceneDisplay.textContent = text;
}

function buildArrangementLabel(scene, iteration) {
  return `Struttura: ${scene.name} (${Math.min(iteration, scene.repeats)}/${scene.repeats})`;
}

function sceneLabelForSelected() {
  const scene = arrangementState.find(({ id }) => id === selectedSceneId);
  return scene ? `Scene selezionata: ${scene.name}` : "Live Pattern";
}

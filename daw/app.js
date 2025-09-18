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
  "C4"
];
const drumTracks = [
  { id: "kick", label: "Kick" },
  { id: "snare", label: "Snare" },
  { id: "hat", label: "Hi-Hat" }
];

const pianoGrid = document.getElementById("pianoGrid");
const drumGrid = document.getElementById("drumGrid");
const tempoInput = document.getElementById("tempo");
const tempoDisplay = document.getElementById("tempoDisplay");
const playButton = document.getElementById("playButton");
const stopButton = document.getElementById("stopButton");
const swingInput = document.getElementById("swing");
const swingDisplay = document.getElementById("swingDisplay");

const pianoState = pianoNotes.map(() => Array(steps).fill(false));
const drumState = drumTracks.map(() => Array(steps).fill(false));
const pianoCells = pianoNotes.map(() => Array(steps));
const drumCells = drumTracks.map(() => Array(steps));

let audioCtx;
let masterGain;
let noiseBuffer;
let isPlaying = false;
let currentStep = 0;
let timerId;

buildPianoGrid();
buildDrumGrid();
updateTempoDisplay();
updateSwingDisplay();
seedDemoPattern();
stopButton.disabled = true;

playButton.addEventListener("click", startPlayback);
stopButton.addEventListener("click", stopPlayback);
tempoInput.addEventListener("input", () => {
  updateTempoDisplay();
});
swingInput.addEventListener("input", () => {
  updateSwingDisplay();
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
      const button = pianoCells[rowIndex][stepIndex].querySelector("button");
      button.classList.add("active");
    });
  });

  const drumPattern = {
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hat: Array.from({ length: steps }, (_, index) => index).filter(
      (index) => index % 2 === 0
    )
  };

  drumTracks.forEach(({ id }, rowIndex) => {
    const activeSteps = drumPattern[id] || [];
    activeSteps.forEach((stepIndex) => {
      drumState[rowIndex][stepIndex] = true;
      const button = drumCells[rowIndex][stepIndex].querySelector("button");
      button.classList.add("active");
    });
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

function startPlayback() {
  if (isPlaying) return;

  const context = ensureAudioContext();
  context.resume();
  isPlaying = true;
  currentStep = 0;
  highlightStep(null);
  playButton.disabled = true;
  stopButton.disabled = false;
  runStep();
}

function stopPlayback() {
  if (!isPlaying) return;
  isPlaying = false;
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = undefined;
  highlightStep(null);
  playButton.disabled = false;
  stopButton.disabled = true;
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
  let nextInterval = stepDuration;
  if (swing > 0) {
    const swingAmount = stepDuration * swing;
    const isEvenStep = currentStep % 2 === 0;
    nextInterval = isEvenStep ? stepDuration - swingAmount : stepDuration + swingAmount;
  }

  timerId = setTimeout(runStep, Math.max(0.05, nextInterval) * 1000);
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
  const context = ensureAudioContext();

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
  const osc = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(frequency, startTime);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, startTime);
  filter.Q.value = 8;

  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.6, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 1.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + duration * 1.6);
}

function playKick(startTime) {
  const context = ensureAudioContext();
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(120, startTime);
  osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.32);

  gain.gain.setValueAtTime(1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(startTime);
  osc.stop(startTime + 0.4);
}

function playSnare(startTime) {
  const context = ensureAudioContext();
  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer();

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(1800, startTime);
  noiseFilter.Q.value = 0.8;

  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.7, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

  const tone = context.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(200, startTime);
  tone.frequency.exponentialRampToValueAtTime(120, startTime + 0.18);

  const toneGain = context.createGain();
  toneGain.gain.setValueAtTime(0.4, startTime);
  toneGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);

  noise.connect(noiseFilter).connect(noiseGain).connect(masterGain);
  tone.connect(toneGain).connect(masterGain);

  noise.start(startTime);
  noise.stop(startTime + 0.25);
  tone.start(startTime);
  tone.stop(startTime + 0.2);
}

function playHat(startTime) {
  const context = ensureAudioContext();
  const noise = context.createBufferSource();
  noise.buffer = ensureNoiseBuffer();

  const highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(8000, startTime);
  highpass.Q.value = 0.7;

  const gain = context.createGain();
  gain.gain.setValueAtTime(0.4, startTime);
  gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.12);

  noise.connect(highpass).connect(gain).connect(masterGain);
  noise.start(startTime);
  noise.stop(startTime + 0.15);
}

function noteToFrequency(note) {
  const [pitch, octave] = note.match(/([A-G]#?)(\d)/).slice(1);
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
  swingDisplay.textContent = `${Math.round(Number.parseFloat(swingInput.value) * 100)}%`;
}

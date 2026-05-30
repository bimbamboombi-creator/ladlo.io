
const script = [
  { speaker: 'raja', text: "kaya karogi tum yei mera rajya hai? kon wo tumhara bhai bachayega tumhe " },
  { speaker: 'raja',  text: "ya ashman se koi farista ane bala hai", alexAnim: 'bounce' },
  { speaker: 'kashish',   text: "Let me guess, ashman se ek kutta jarur ane bala hai", samAnim: 'talking' },
  { speaker: 'raja', text: "kutta yei kon hai?" },
  { speaker: 'kashish',  text: "idk meri instincts bolri hai", alexAnim: 'bounce' },
  { speaker: 'raja',   text: "mere rajya mere adesh ke bina panchi bhi ur nahi pata hai", samAnim: 'talking' },
  { speaker: 'kashish',  text: "yei kutta hai." },
  { speaker: null,    text: "suddenly a blue portal opened on gthe top of th eplace and a human like figure appeared. jumped in front of her and protecting her.", mood: 'end' },
  { speaker: 'suvam', text: "Seventeen worlds, actually. ah thak gya hun mei" },
  { speaker: 'kashish',   text: "hei app bhaya yaha. mene to kutta bola tha", samAnim: 'talking' },
  { speaker: 'raja',  text: "yei to insaan hai, kutta kaha per hai?", alexAnim: 'bounce' },
  { speaker: 'kashish', text: "Absolutely not. yeahi kutta hai" },
  { speaker: 'suvam',   text: "wth ye sab kaya bate hori hai? oye raja chup, han tu bol behen", samAnim: 'talking' },
  { speaker: 'kashish', text: "ita der laga di " },
  { speaker: 'suvam',   text: "wo time lgata portal mei travel karne se", samAnim: 'talking' },
  { speaker: 'raja',  text: "yei sab kaya hai" },
    { speaker: null,    text: "with a snap of finger raja got beaten by the human like figure", mood: 'end' },
  { speaker: 'kashish', text: "Yeah, me too. mujhe bhi chutakimarni hai." },
  { speaker: null,    text: "with less time in hand human like figure pushed kashish into the portal", mood: 'end' },
];

// Mood overlays — tinted colours layered over the real background image
const bgMoods = {
  dawn:    'rgba(10, 20, 50, 0.45)',
  morning: 'rgba(20, 50, 80, 0.25)',
  bright:  'rgba(80, 160, 200, 0.10)',
  end:     'rgba(56, 189, 248, 0.08)',
};

const speakerColors = {
  raja: '#38bdf8',
  kashish:  '#f97316',
  suvam:  '#a78bfa',
  sam:   '#34d399',
};

// State
let lineIndex = 0;
let typing = false;
let typeInterval = null;
let fullText = '';

// DOM refs
const bgOverlay   = document.getElementById('bg-overlay');
const overlay     = document.getElementById('overlay');
const startBtn    = document.getElementById('start-btn');
const dialogueBox = document.getElementById('dialogue-box');
const speakerEl   = document.getElementById('speaker-name');
const textContent = document.getElementById('text-content');
const cursor      = document.getElementById('cursor');
const progressBar = document.getElementById('progress-bar');
const skipBtn     = document.getElementById('skip-btn');
const sceneFlash  = document.getElementById('scene-flash');
const charJamie = document.getElementById('char-raja');
const charAlex  = document.getElementById('char-kashish');
const charSam   = document.getElementById('char-suvam');
const nameJamie = document.getElementById('name-raja');
const nameAlex  = document.getElementById('name-kashish');
const nameSam   = document.getElementById('name-suvam');

const allChars = [
  { el: charJamie, name: nameJamie, key: 'raja' },
  { el: charAlex,  name: nameAlex,  key: 'kashish'  },
  { el: charSam,   name: nameSam,   key: 'suvam'   },
];

// ── Generate rain drops ──
(function spawnRain() {
  const layer = document.getElementById('rain-layer');
  for (let i = 0; i < 40; i++) {
    const d = document.createElement('div');
    d.className = 'rain-drop';
    const left = Math.random() * 100;
    const height = 14 + Math.random() * 18;
    const dur = 0.7 + Math.random() * 0.8;
    const delay = Math.random() * 2;
    d.style.cssText = `left:${left}%;height:${height}px;animation-duration:${dur}s;animation-delay:${delay}s;top:0;`;
    layer.appendChild(d);
  }
})();

function flash(cb) {
  sceneFlash.style.opacity = '0.6';
  setTimeout(() => { sceneFlash.style.opacity = '0'; cb && cb(); }, 300);
}

function setMood(mood) {
  bgOverlay.style.background = bgMoods[mood] || bgMoods.dawn;
}

function clearAnims() {
  allChars.forEach(c => c.el.classList.remove('bouncing','talking'));
}

const enteredChars = new Set(['raja','kashish','suvam']);

function setCharState(line) {
  clearAnims();
  allChars.forEach(c => c.name.classList.remove('visible'));
  allChars.forEach(c => c.el.classList.add('dim'));

  if (line.speaker) {
    const sp = allChars.find(c => c.key === line.speaker);
    if (sp) {
      sp.el.classList.remove('dim');
      sp.name.classList.add('visible');
      const anim = line[line.speaker + 'Anim'];
      sp.el.classList.add(anim === 'bounce' ? 'bouncing' : 'talking');
    }
  } else {
    allChars.forEach(c => c.el.classList.remove('dim'));
  }
}

function typeText(text, onDone) {
  typing = true;
  textContent.textContent = '';
  fullText = text;
  let i = 0;
  typeInterval = setInterval(() => {
    textContent.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(typeInterval);
      typing = false;
      cursor.style.display = 'inline-block';
      onDone && onDone();
    }
  }, 26);
}

function showLine(idx) {
  if (idx >= script.length) { showEnd(); return; }
  const line = script[idx];

  progressBar.style.width = ((idx / (script.length - 1)) * 100) + '%';
  setMood(line.mood);
  setCharState(line);

  const isNarr = !line.speaker;
  const speakerNames = { raja: 'Raja', kashish: 'Kashish', suvam: 'Suvam' };
  speakerEl.textContent = isNarr ? '— Narrator —' : (speakerNames[line.speaker] || line.speaker);
  speakerEl.style.color = isNarr ? speakerColors.narr : speakerColors[line.speaker];
  cursor.style.display = 'none';

  if (line.mood === 'end' && idx > 0) flash();

  typeText(line.text);
}

function advance() {
  if (typing) {
    clearInterval(typeInterval);
    textContent.textContent = fullText;
    typing = false;
    cursor.style.display = 'inline-block';
    return;
  }
  lineIndex++;
  showLine(lineIndex);
}

function showEnd() {
  overlay.innerHTML = `
    <div style="font-size:2.5rem">🍂🍂</div>
    <h1>꒰ ✨nest ep mei✨ ꒱ hehe</h1>
    <p style="font-family:'Lora',serif;font-style:italic;color:rgba(255,255,255,0.7);text-align:center;max-width:340px;padding:0 1rem;">
      continue to the next episode to know the next story
    </p>
    <button class="btn" id="replay-btn">Play Again ↺</button>
    <button class="btn" id="next-btn" style="margin-top:0.75rem;">Next Story →</button>
  `;
  overlay.classList.remove('hidden');

  // ── Play Again ──
  document.getElementById('replay-btn').addEventListener('click', () => {
    lineIndex = 0;
    overlay.classList.add('hidden');
    setMood('dawn');
    clearAnims();
    charAuntyji.classList.remove('dim');
    charKashish.classList.remove('dim');
    nameAuntyji.classList.remove('visible');
    nameKashish.classList.remove('visible');
    progressBar.style.width = '0%';
    showLine(0);
  });

  // ── Next Story ──
  document.getElementById('next-btn').addEventListener('click', () => {
    window.location.href = 'act016/h.html';   // 👈 change filename here
  });
}


// Events
startBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  showLine(0);
});

dialogueBox.addEventListener('click', advance);

skipBtn.addEventListener('click', () => {
  if (typing) {
    clearInterval(typeInterval);
    textContent.textContent = fullText;
    typing = false;
    cursor.style.display = 'inline-block';
    return;
  }
  lineIndex++;
  showLine(lineIndex);
});

document.addEventListener('keydown', e => {
  if (['Space','ArrowRight','Enter'].includes(e.code)) { e.preventDefault(); advance(); }
});

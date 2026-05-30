
const script = [
  { speaker: 'zee', text: "app tension na lo kashish ko kuch nahi hoga." },
  { speaker: 'auntyji',  text: "han beta, janam din tha uska gyab hue 2 hr ho chuke hain. pata kaya kar ri hogi wo.", auntyjiAnim: 'bounce' },
  { speaker: 'zee',   text: "aunty dekhte hai, bhaiya to bole the ki kuch karte hai", zeeAnim: 'talking' },
  { speaker: 'auntyji', text: "han, ushe mere hat lagne de paale mei uska research kese karte hai batati mei." },
  { speaker: 'zee',  text: "han pit ke mar dijiyega bhaiya ko.", kashishAnim: 'bounce' },
  { speaker: 'auntyji',   text: "bas dikh jaye wo mujhe.", zeeAnim: 'talking' },
  { speaker: null,    text: "suddenly a flash of light appeared and kashish was came in front of zee", mood: 'end' },
  { speaker: 'kashish',  text: "ahhhhh" },
  { speaker: 'auntyji', text: "hei" },
  { speaker: 'zee',   text: "hei", zeeAnim: 'talking' },
  { speaker: 'auntyji',  text: "chup, har bkt chilati rehti hai tu.", kashishAnim: 'bounce' },
  { speaker: 'kashish', text: "hehe mummy mei a gayi wasap hehe." },
  { speaker: 'zee',   text: "didi app agyi ka ha thi wase", zeeAnim: 'talking' },
  { speaker: 'auntyji', text: "jana jara bartan dhona." },
  { speaker: 'kashish',   text: "kaya yr mummy abhi to travel akrke aya hun mei jara aram karta mei.", zeeAnim: 'talking' },
  { speaker: 'auntyji',  text: "tu gayi kaha thi wase." },
  { speaker: 'zee', text: "aunty chorriye abhi to didi safe hai na wo sahi hai" },
  { speaker: null,    text: "with this we end our story", mood: 'end' },
];

// Mood overlays — tinted colours layered over the real background image
const bgMoods = {
  dawn:    'rgba(10, 20, 50, 0.45)',
  morning: 'rgba(20, 50, 80, 0.25)',
  bright:  'rgba(80, 160, 200, 0.10)',
  end:     'rgba(56, 189, 248, 0.08)',
};

const speakerColors = {
  auntyji: '#38bdf8',
  kashish:  '#f97316',
  narr:  '#a78bfa',
  zee:   '#34d399',
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
const charAuntyji = document.getElementById('char-auntyji');
const charKashish = document.getElementById('char-kashish');
const charZee   = document.getElementById('char-zee');
const nameAuntyji = document.getElementById('name-auntyji');
const nameKashish = document.getElementById('name-kashish');
const nameZee   = document.getElementById('name-zee');

const allChars = [
  { el: charAuntyji, name: nameAuntyji, key: 'auntyji' },
  { el: charKashish,  name: nameKashish,  key: 'kashish' },
  { el: charZee,   name: nameZee,   key: 'zee'   },
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

const enteredChars = new Set(['auntyji','kashish','zee']);

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
  const speakerNames = { auntyji: 'Aunty Ji', kashish: 'Kashish', zee: 'Zee' };
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
    <h1>꒰ ✨ The End ✨ ꒱ hehe</h1>
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
    window.location.href = 'thank u/index.html';   // 👈 change filename here
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

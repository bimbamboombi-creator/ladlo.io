
// ── SCRIPT ──────────────────────────────────────────────────────────────────

const script = [
  { speaker: null,    text: "at the home..", mood: 'dawn' },
  { speaker: 'auntyji',  text: "happy birthday bacha", mood: 'dawn', auntyjiAnim: 'bounce' },
  { speaker: 'auntyji', text: "cake khane ke bad bartan dho lena", mood: 'dawn' },
  { speaker: 'kashish',  text: "gift to kholne do pahale  ...", mood: 'dawn', kashishAnim: 'bounce' },
  { speaker: 'auntyji', text: "are km kar lo phir gift dekh lena", mood: 'dawn' },
  { speaker: 'kashish',  text: "ek gift", mood: 'dawn', kashishAnim: 'bounce' },
  { speaker: 'auntyji', text: "kiska gift dekhni hai", mood: 'dawn' },
  { speaker: 'kashish',  text: "jo pahle hatr mei ayega", mood: 'morning', kashishAnim: 'bounce' },
  { speaker: 'auntyji', text: "acha, dekho", mood: 'morning' },
  { speaker: 'kashish',  text: "hehehehehe", mood: 'morning' },
  { speaker: null,    text: "sat nbar suvam ne call karte hue", mood: 'dawn' },
  { speaker: 'auntyji', text: "jao dekho kon calll kar ra hai?", mood: 'morning' },
  { speaker: 'kashish',  text: "kon hai bar bar kiyu call kar rahe?", mood: 'morning', kashishAnim: 'bounce' },
  { speaker: 'auntyji', text: "tu bhi pagal tere dost bhi pagal", mood: 'morning' },
  { speaker: 'kashish',  text: "yei to suvam bhaiya hai", mood: 'morning' },
  { speaker: 'auntyji', text: "bat kr le kuch kam hoga uska", mood: 'morning' },
  { speaker: 'kashish',  text: "han kya hi kam hoga velle pare rahte hai wo.", mood: 'morning' },
  { speaker: 'auntyji', text: "tu kuch kam nhi karti to sab km chorr ni hote hai", mood: 'morning' },
  { speaker: 'kashish',  text: "mummy yr app meri side lo", mood: 'morning' },
  { speaker: 'auntyji', text: "(laughing) hahaha okay.", mood: 'bright' },

  { speaker: null,    text: "suvam sped up his car towards the house and started calling kashish", mood: 'end' },

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
const charSuvam   = document.getElementById('char-auntyji');
const charDoc = document.getElementById('char-kashish');
const nameSuvam   = document.getElementById('name-auntyji');
const nameDoc = document.getElementById('name-kashish');

// ── Generate rain drops ──
(function spawnRain() {
  const layer = document.getElementById('rain-layer');
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'rain-drop';
    d.textContent = '💢';                          // 🍂 leaf emoji
    const left = Math.random() * 100;
    const size = 12 + Math.random() * 10;          // random size 12–22px
    const dur  = 2 + Math.random() * 6;
    const delay = Math.random() * 2;
    d.style.cssText = `left:${left}%;font-size:${size}px;animation-duration:${dur}s;animation-delay:${delay}s;top:0;`;
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
  charSuvam.classList.remove('bouncing','talking');
  charDoc.classList.remove('bouncing','talking');
}

function setCharState(line) {
  clearAnims();
  charSuvam.classList.remove('dim');
  charDoc.classList.remove('dim');
  nameSuvam.classList.remove('visible');
  nameDoc.classList.remove('visible');

  if (line.speaker === 'auntyji') {
    charDoc.classList.add('dim');
    nameSuvam.classList.add('visible');
    charSuvam.classList.add('talking');
  } else if (line.speaker === 'kashish') {
    charSuvam.classList.add('dim');
    nameDoc.classList.add('visible');
    charDoc.classList.add(line.kashishAnim  === 'bounce' ? 'bouncing' : 'talking');
  }
  // narration — both equal brightness, no bubble
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
  speakerEl.textContent = isNarr ? '— Narrator —' : (line.speaker === 'auntyji' ? 'Aunty Ji' : 'Kashish');
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
    <div style="font-size:2.5rem">🍂🍂🍂</div>
    <h1>The End</h1>
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
    window.location.href = 'act5/act2.html';   // 👈 change filename here
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

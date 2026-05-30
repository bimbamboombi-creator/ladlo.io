
// ── SCRIPT ──────────────────────────────────────────────────────────────────

const script = [
  { speaker: null,    text: "when the world is in danger heros are responsible, ring ring ring ...... suvam picked up the call", mood: 'dawn' },
  { speaker: 'suvam',  text: "heloo", mood: 'dawn', suvamAnim: 'bounce' },
  { speaker: 'suvam', text: "wht happened? wht the emergency?", mood: 'dawn' },
  { speaker: 'doc',  text: "oii oi that gift ...", mood: 'dawn', docAnim: 'bounce' },
  { speaker: 'suvam', text: "that gift wht?", mood: 'dawn' },
  { speaker: 'doc',  text: "wo koi top proffesor ka signed autogrph nahi hai.", mood: 'dawn', docAnim: 'bounce' },
  { speaker: 'suvam', text: "hei?", mood: 'dawn' },
  { speaker: 'doc',  text: "han", mood: 'morning', docAnim: 'bounce' },
  { speaker: 'suvam', text: "ohh, toh gift kya hai?", mood: 'morning' },
  { speaker: 'doc',  text: "that locket jiske uper apan log research kar rahe the?", mood: 'morning' },
  { speaker: 'suvam', text: "kya wo locket cursed thi?", mood: 'morning' },
  { speaker: 'doc',  text: "ig", mood: 'morning', docAnim: 'bounce' },
  { speaker: 'suvam', text: "yei bata locket wha pe gayi kese, mc?", mood: 'morning' },
  { speaker: 'doc',  text: "idk", mood: 'morning' },
  { speaker: 'suvam', text: "wtf", mood: 'morning' },
  { speaker: 'doc',  text: "ab kaya kare?", mood: 'morning' },
  { speaker: 'suvam', text: "tu kuch solution nikal mei kashish ke pass jata hun", mood: 'morning' },
  { speaker: 'doc',  text: "han thik hai", mood: 'morning' },
  { speaker: 'suvam', text: "(tensed) abey yr.", mood: 'bright' },

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
  suvam: '#38bdf8',
  doc:  '#f97316',
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
const charSuvam   = document.getElementById('char-suvam');
const charDoc = document.getElementById('char-doc');
const nameSuvam   = document.getElementById('name-suvam');
const nameDoc = document.getElementById('name-doc');

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

  if (line.speaker === 'suvam') {
    charDoc.classList.add('dim');
    nameSuvam.classList.add('visible');
    charSuvam.classList.add('talking');
  } else if (line.speaker === 'doc') {
    charSuvam.classList.add('dim');
    nameDoc.classList.add('visible');
    charDoc.classList.add(line.docAnim  === 'bounce' ? 'bouncing' : 'talking');
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
  speakerEl.textContent = isNarr ? '— Narrator —' : (line.speaker === 'suvam' ? 'Suvam' : 'Doc');
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
    charJamie.classList.remove('dim');
    charAlex.classList.remove('dim');
    nameJamie.classList.remove('visible');
    nameAlex.classList.remove('visible');
    progressBar.style.width = '0%';
    showLine(0);
  });

  // ── Next Story ──
  document.getElementById('next-btn').addEventListener('click', () => {
    window.location.href = 'act4/act2.html';   // 👈 change filename here
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

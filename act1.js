
// ── SCRIPT ──────────────────────────────────────────────────────────────────

const script = [
  { speaker: null,    text: "thori si dhup aur suvambhai aur bhaiya ka meet up", mood: 'dawn' },
  { speaker: 's',  text: "heloo", mood: 'dawn', alexAnim: 'bounce' },
  { speaker: 's', text: "kesso ho app?", mood: 'dawn' },
  { speaker: 'v',  text: "mei mast, waise hi", mood: 'dawn', alexAnim: 'bounce' },
  { speaker: 's', text: "wase kashish ghr per hai", mood: 'dawn' },
  { speaker: 'v',  text: "hogi syd, mei abhi aya clg se....", mood: 'dawn', alexAnim: 'bounce' },
  { speaker: 's', text: "ohh, uska ajj birthday hai, gift laye ho?", mood: 'dawn' },
  { speaker: 'v',  text: "han", mood: 'morning', alexAnim: 'bounce' },
  { speaker: 's', text: "ohh, toh gift kya laye ho?", mood: 'morning' },
  { speaker: 'v',  text: "ek book", mood: 'morning' },
  { speaker: 's', text: "ohh, does she even read those books?", mood: 'morning' },
  { speaker: 'v',  text: "book ka nam to puch", mood: 'morning', alexAnim: 'bounce' },
  { speaker: 's', text: "kay hai?", mood: 'morning' },
  { speaker: 'v',  text: "how to respect your brothers?", mood: 'morning' },
  { speaker: 's', text: "acha book hai.", mood: 'morning' },
  { speaker: 'v',  text: "tu kaya laya hai?", mood: 'morning' },
  { speaker: 's', text: "mei maggie laya hun.", mood: 'morning' },
  { speaker: 'v',  text: "That's hurtful.", mood: 'morning' },
  { speaker: 's', text: "(sighs) Come on. rat ke bara baje maggie bana ke khati hai....", mood: 'bright' },
  { speaker: 'v',  text: "wo to hai. sabash", mood: 'bright' },
  { speaker: 's', text: "hahaha", mood: 'bright' },
  { speaker: 'v',  text: "tu ghr jake bat kar me ata hun", mood: 'bright', alexAnim: 'bounce' },
  { speaker: 's', text: "han theek hai app aoo....", mood: 'bright' },
  { speaker: null,    text: "suvam arrive at the house and talking to everyone.", mood: 'end' },

];

// Mood overlays — tinted colours layered over the real background image
const bgMoods = {
  dawn:    'rgba(10, 20, 50, 0.45)',
  morning: 'rgba(20, 50, 80, 0.25)',
  bright:  'rgba(80, 160, 200, 0.10)',
  end:     'rgba(56, 189, 248, 0.08)',
};

const speakerColors = {
  s: '#38bdf8',
  v:  '#f97316',
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
const charJamie   = document.getElementById('char-s');
const charAlex    = document.getElementById('char-v');
const nameJamie   = document.getElementById('name-s');
const nameAlex    = document.getElementById('name-v');

// ── Generate rain drops ──
(function spawnRain() {
  const layer = document.getElementById('rain-layer');
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'rain-drop';
    d.textContent = '🍂';                          // 🍂 leaf emoji
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
  charJamie.classList.remove('bouncing','talking');
  charAlex.classList.remove('bouncing','talking');
}

function setCharState(line) {
  clearAnims();
  charJamie.classList.remove('dim');
  charAlex.classList.remove('dim');
  nameJamie.classList.remove('visible');
  nameAlex.classList.remove('visible');

  if (line.speaker === 's') {
    charAlex.classList.add('dim');
    nameJamie.classList.add('visible');
    charJamie.classList.add('talking');
  } else if (line.speaker === 'v') {
    charJamie.classList.add('dim');
    nameAlex.classList.add('visible');
    charAlex.classList.add(line.alexAnim === 'bounce' ? 'bouncing' : 'talking');
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
  speakerEl.textContent = isNarr ? '— Narrator —' : (line.speaker === 's' ? 's' : 'v');
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
    window.location.href = 'act2/act2.html';   // 👈 change filename here
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

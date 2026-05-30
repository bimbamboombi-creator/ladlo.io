

const script = [
  { speaker: null,    text: "at village iwth that lill girl, poor lil village drowned in taxes ", mood: 'dawn' },
  { speaker: 'kashish',  text: "wow, village is beautifull.", mood: 'dawn', kashishAnim: 'bounce' },
  { speaker: 'kashish', text: "kista mast haina, ye tree ka khusbu and yei mitti se bane ghar. bahut acha hai.", mood: 'dawn' },
  { speaker: 'tanvi',  text: "didi app ghr mei aram karein", mood: 'dawn', tanviAnim: 'bounce' },
  { speaker: 'kashish', text: "han wo karti hun mei.", mood: 'dawn' },
  { speaker: 'tanvi',  text: "yei raha chota sa ghr mera.", mood: 'dawn', tanviAnim: 'bounce' },
  { speaker: 'tanvi',  text: "mei kahan a laga ti hun", mood: 'dawn', tanviAnim: 'bounce' },
  { speaker: 'tanvi', text: "han bhaiya bas atei hin honge.", mood: 'dawn' },
  { speaker: 'kashish',  text: "kon tumhare bhaiya?", mood: 'morning'},
  { speaker: 'kashish', text: "acha", mood: 'morning' },
  { speaker: 'tanvi',  text: "han mere bhaiya wo bahut takat bar hai", mood: 'morning' },
  { speaker: 'kashish', text: "esa hai", mood: 'morning' },
  { speaker: 'tanvi',  text: "wo mere liye har batk amm tor ke late hai aur phul bhi", mood: 'morning', tanviAnim: 'bounce' },
  { speaker: 'kashish', text: "how sweet of him", mood: 'morning' },
  { speaker: 'tanvi',  text: "ajj mere liye wo gulab ke full layenge ", mood: 'morning' },
  { speaker: 'kashish', text: "gulab ka phul?", mood: 'morning' },
  { speaker: 'tanvi',  text: "han, wo bas raja ki mahalo mei payi jati hai.", mood: 'morning' },
  { speaker: 'tanvi', text: "uska sunganda acha lgta hai hamee.", mood: 'morning' },
  { speaker: 'kashish',  text: "acha ", mood: 'morning' },
  
  { speaker: null,    text: "suddenly a body throown at the gate of the house it ws her borthers body, he is dead.", mood: 'end' },

];

const bgMoods = {
  dawn:    'rgba(10, 20, 50, 0.45)',
  morning: 'rgba(20, 50, 80, 0.25)',
  bright:  'rgba(80, 160, 200, 0.10)',
  end:     'rgba(56, 189, 248, 0.08)',
};

const speakerColors = {
  suvam: '#38bdf8',
  kashish:  '#f97316',
  tanvi:  '#a78bfa',
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
const charKashish   = document.getElementById('char-kashish');
const charTanvi = document.getElementById('char-tanvi');
const nameKashish   = document.getElementById('name-kashish');
const nameTanvi = document.getElementById('name-tanvi');


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
  charKashish.classList.remove('bouncing','talking');
  charTanvi.classList.remove('bouncing','talking');
}

function setCharState(line) {
  clearAnims();
  charKashish.classList.remove('dim');
  charTanvi.classList.remove('dim');
  nameKashish.classList.remove('visible');
  nameTanvi.classList.remove('visible');

  if (line.speaker === 'kashish') {
    charTanvi.classList.add('dim');
    nameKashish.classList.add('visible');
    charKashish.classList.add('talking');
  } else if (line.speaker === 'tanvi') {
    charKashish.classList.add('dim');
    nameTanvi.classList.add('visible');
    charTanvi.classList.add(line.tanviAnim  === 'bounce' ? 'bouncing' : 'talking');
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
  speakerEl.textContent = isNarr ? '— Narrator —' : (line.speaker === 'kashish' ? 'Kashish' : 'Tanvi');
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

  
  document.getElementById('next-btn').addEventListener('click', () => {
    window.location.href = 'act012/index.html';   // 👈 change filename here
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

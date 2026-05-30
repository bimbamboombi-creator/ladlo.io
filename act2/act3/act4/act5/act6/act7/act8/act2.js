

const script = [
  { speaker: null,    text: "at the hospital, zee saw suvam. she asked him abt wht happened ", mood: 'dawn' },
  { speaker: 'suvam',  text: "hii.", mood: 'dawn', suvamAnim: 'bounce' },
  { speaker: 'suvam', text: "yha per kese", mood: 'dawn' },
  { speaker: 'zee',  text: "bhaiya yei sab kaya hua hai?", mood: 'dawn', zeeAnim: 'bounce' },
  { speaker: 'suvam', text: "kuch ni lil accident", mood: 'dawn' },
  { speaker: 'zee',  text: "a chota accident? kya hora", mood: 'dawn', zeeAnim: 'bounce' },
  { speaker: 'zee',  text: "kashish did ka call nahi lg ra, auntyji bhi ushe hi dund rahe hai", mood: 'dawn', zeeAnim: 'bounce' },
  { speaker: 'zee', text: "birthday ke din yei sab kese ho ra hai.", mood: 'dawn' },
  { speaker: 'suvam',  text: "kya .. kya hua..kashish ko?", mood: 'morning'},
  { speaker: 'suvam', text: "(paniced) is she safe?", mood: 'morning' },
  { speaker: 'zee',  text: "wo gayab ho gayi", mood: 'morning' },
  { speaker: 'suvam', text: "nhnhnh... in ineed to go.", mood: 'morning' },
  { speaker: 'zee',  text: "apane kuch kiya hai?", mood: 'morning', zeeAnim: 'bounce' },
  { speaker: 'suvam', text: "wo gift...", mood: 'morning' },
  { speaker: 'zee',  text: "bhaiya kya kiye ho", mood: 'morning' },
  { speaker: null,    text: "later suvam explains the situation.", mood: 'dawn' },
  { speaker: 'zee', text: "apkko thappad lga denge hm.", mood: 'morning' },
  { speaker: 'zee',  text: "apse hm pahael hi bole ke the ki app apna ye experiment apne pass rakhe, agr kashish ko koi problem aaye to app ktm.", mood: 'morning' },
  { speaker: 'suvam', text: "um hmm i will do something", mood: 'morning' },
  { speaker: 'zee',  text: "karoge nahi karo abhi", mood: 'morning' },
  { speaker: 'suvam', text: "acha thik hai pls go and clam her family down", mood: 'bright' },
  { speaker: 'zee',  text: "app nhi bolne se bhi karenge yei.", mood: 'bright' },
  { speaker: 'suvam', text: "hahaha", mood: 'bright' },
  { speaker: 'zee',  text: "ismei hasne ka kya bat hai.", mood: 'bright', zeeAnim: 'bounce' },
  { speaker: 'suvam', text: "hnn sorry i will go for now.", mood: 'bright' },
  { speaker: null,    text: "suvam called doc amnd moved out in flash .", mood: 'end' },

];

const bgMoods = {
  dawn:    'rgba(10, 20, 50, 0.45)',
  morning: 'rgba(20, 50, 80, 0.25)',
  bright:  'rgba(80, 160, 200, 0.10)',
  end:     'rgba(56, 189, 248, 0.08)',
};

const speakerColors = {
  suvam: '#38bdf8',
  zee:  '#f97316',
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
    charDoc.classList.add(line.zeeAnim  === 'bounce' ? 'bouncing' : 'talking');
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
  speakerEl.textContent = isNarr ? '— Narrator —' : (line.speaker === 'suvam' ? 'Suvam' : 'zee');
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
    window.location.href = 'act9/narr.html';   // 👈 change filename here
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

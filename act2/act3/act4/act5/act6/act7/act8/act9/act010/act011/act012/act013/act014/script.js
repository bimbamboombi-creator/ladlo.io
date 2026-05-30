

const lines = [
  "at the palace a fearce fight was going on between the guards and kashish, she fighting with magician queen and her guards, using her unessecary mana.",
  "soon she blew up the whole palace and all the guards and magician queen were dead.",
  "she has the power, but using it recklessly is not a good idea, she was so tired, becuze of less mana",
  "she fell on the ground, exhausted.",
  "king was angry becuze she killed his beloved magician queen.'",
  "he stood up and said, 'you have gone too far!'",
  "what far , she again stood up and said, ' hahaha, is fighting for insjustice is wrong?'",
  "my kingdom my rules, you have no right to question.",
  "she i exhusted but she is not going to give up, she will fight till the end, she will fight for justice.",
];

const reels = [
  'REEL I','REEL II','REEL III','REEL IV','REEL V',
  'REEL VI','REEL VII','REEL VIII','REEL IX'
];

let cur = 0;

const txt   = document.getElementById('line-text');
const bar   = document.getElementById('bar');
const count = document.getElementById('count');
const nxt   = document.getElementById('next');
const prv   = document.getElementById('prev');
const reel  = document.getElementById('reel');

function show(i) {
  txt.innerHTML = '';
  lines[i].split(' ').forEach((w, j) => {
    const s = document.createElement('span');
    s.className = 'word';
    s.textContent = w;
    txt.appendChild(s);
    setTimeout(() => s.classList.add('show'), 60 + j * 65);
  });
  bar.style.width = ((i + 1) / lines.length * 100) + '%';
  count.textContent = 'Scene ' + (i + 1) + ' / ' + lines.length;
  reel.textContent  = reels[i] || 'REEL I';
  prv.disabled = i === 0;
  nxt.disabled = i === lines.length - 1;
  nxt.textContent = i === lines.length - 1 ? '✦ fin' : 'next ▸';
}

function goNext() { if (cur < lines.length - 1) { cur++; show(cur); } }
function goPrev() { if (cur > 0)                 { cur--; show(cur); } }

nxt.addEventListener('click', goNext);
prv.addEventListener('click', goPrev);

document.getElementById('skip').addEventListener('click', () => {
  window.location.href = 'act015/h.html';
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
  if (e.key === 'ArrowLeft') goPrev();
});

show(0);

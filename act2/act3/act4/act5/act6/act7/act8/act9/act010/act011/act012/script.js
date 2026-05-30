

const lines = [
  "so this happened tanvis brother has been to the kingdom, where he was stealing flowers and got  caught by the king.",
  "the king was very angry how a commoner like him, could  dirty the flower grown in his palace.",
  "now he is dead still clutching that flower in hius hand. he drop dead in front of his sister and his hand holding the flower. touched her heart and she is very sad.",
  "she stated crying.",
  "those guards around heer started laughing and said, 'what are you crying for? your brother is a thief, he deserved to die.'",
  "now, kashish was so angry that she threw the stone from the ground towards the gaurds.",
  "but she shocked herself becuase on blow of the stone, the gaurds started to bleed and fell on the ground.",
  "other gaurds were so scared that they ran away from there. later she wass asked to meet the king of the kingdom.",
  "she rejected but for tanvis justice, she went to meet the king.",
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
  window.location.href = 'act013/act2.html';
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
  if (e.key === 'ArrowLeft') goPrev();
});

show(0);

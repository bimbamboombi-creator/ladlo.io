

const lines = [
  "so , here is the gift that i have for you, hope u enjoyed it. i am sure you will love it.",
  "you have alwaya worked hard but sometimes you need to take a break and enjoy the things around you.",
  "this is a liltle,small,simple story that i have written for you.",
  "i hope you like it.",
  "i hope this story will make you smile and laugh. be hapi and be healthy.",
  "dont cry over such iits or nits, some times u need to take a break. and move on with life.",
  "idk why i am giving you lectures on life, but focus on the ongoing world and enjoy it.",
  "happy birthday kashish, a liltle gift fro ur brother to you.when u feel sad, just remeber that u hvae a brother who loves you and cares for you.",
  "at the end thankyou while making this visual novel, my work got appriciated by many people and also i got client.",
  "he wanted some automated vid editing software to make visual novels, after i complted the project,although it was free,i didnt take money from him.",
  "haha with this hapi birth day to you, i am sure you will have a great life ahead of you. and i hope you will be successful in your life.",
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
  window.location.href = 'act8/act2.html';
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
  if (e.key === 'ArrowLeft') goPrev();
});

show(0);

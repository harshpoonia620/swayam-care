/* ═══════════════════════════════════════════════════════
   SWAYAM CARE — Main JavaScript
   swayamcare.netlify.app
═══════════════════════════════════════════════════════ */


// ── CURSOR ────────────────────────────────────────────────
(function(){
  var hasMouse = window.matchMedia('(pointer:fine)').matches;
  var wrap = document.getElementById('cursorWrap');
  if(!hasMouse || !wrap){ if(wrap) wrap.style.display='none'; return; }

  var ring=document.getElementById('ring');
  var dot =document.getElementById('dot');
  var mx=window.innerWidth/2, my=window.innerHeight/2;
  var rx=mx, ry=my;
  var started=false;

  // Inject cursor:none globally for desktop
  var s=document.createElement('style');
  s.textContent='html,body,a,button,[role="button"]{cursor:none!important}';
  document.head.appendChild(s);

  document.addEventListener('mousemove',function(e){
    mx=e.clientX; my=e.clientY;
    if(!started){ started=true; wrap.style.opacity='1'; }
  });

  // Hover effect on interactive elements
  document.addEventListener('mouseover',function(e){
    if(e.target.closest('a,button,.btn-primary,.btn-ghost,.nav-cta,.sc-option,.prog-card')){
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout',function(e){
    if(e.target.closest('a,button,.btn-primary,.btn-ghost,.nav-cta,.sc-option,.prog-card')){
      document.body.classList.remove('cursor-hover');
    }
  });

  (function tick(){
    rx+=(mx-rx)*0.14; ry+=(my-ry)*0.14;
    dot.style.transform ='translate('+(mx-4)+'px,'+(my-4)+'px)';
    ring.style.transform='translate('+(rx-20)+'px,'+(ry-20)+'px)';
    requestAnimationFrame(tick);
  })();
})();
// ── LOADER ────────────────────────────────────────────────
window.addEventListener('load', ()=>{
  setTimeout(()=>{ document.getElementById('loader').classList.add('hide'); }, 2200);
});

// ── NAV SCROLL ────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── PARTICLES ─────────────────────────────────────────────
const pCont = document.getElementById('particles');
for(let i=0;i<35;i++){
  const p = document.createElement('div');
  p.className = 'particle';
  const sz = Math.random()*3+1;
  p.style.cssText = `
    width:${sz}px; height:${sz}px;
    left:${Math.random()*100}%;
    animation-duration:${8+Math.random()*12}s;
    animation-delay:${Math.random()*10}s;
  `;
  pCont.appendChild(p);
}

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:.12 });
revealEls.forEach(el=>observer.observe(el));

// ── COUNT-UP ANIMATION ────────────────────────────────────
const countEls = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el    = e.target;
    const end   = parseInt(el.dataset.count);
    const dur   = 1800;
    const start = performance.now();
    (function step(now){
      const t = Math.min((now-start)/dur, 1);
      el.textContent = Math.floor(t*end);
      if(t<1) requestAnimationFrame(step);
      else el.textContent = end;
    })(start);
    countObs.unobserve(el);
  });
}, {threshold:.5});
countEls.forEach(el=>countObs.observe(el));

// ── FORM MULTI-STEP ───────────────────────────────────────
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwld4JQOgS0pcEmcNwCO4Vng_6fLO8on60vmKca2S1ADOuWLAHxP_GcP63INyvNkb5p/exec';
let selectedProgram = '';

function scNext() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  if(!name)  { alert('Please enter your full name.'); return; }
  if(!phone) { alert('Please enter your WhatsApp number.'); return; }
  document.getElementById('step1').style.display = 'none';
  document.getElementById('step2').style.display = 'block';
}
function scBack()  { document.getElementById('step2').style.display='none'; document.getElementById('step1').style.display='block'; }
function scBack2() { document.getElementById('step3').style.display='none'; document.getElementById('step2').style.display='block'; }

function scSelect(el, val) {
  document.querySelectorAll('.sc-option').forEach(function(o){ o.classList.remove('selected'); });
  el.classList.add('selected');
  selectedProgram = val;
}
function scNext2() {
  if(!selectedProgram) { alert('Please select a program you are interested in.'); return; }
  document.getElementById('step2').style.display = 'none';
  document.getElementById('step3').style.display = 'block';
}

function scSubmit() {
  var btn = document.getElementById('sc-submit-btn');
  var txt = document.getElementById('sc-btn-text');
  btn.disabled = true;
  txt.textContent = 'Sending...';
  var payload = {
    name:    document.getElementById('f-name').value.trim(),
    phone:   document.getElementById('f-phone').value.trim(),
    prof:    document.getElementById('f-prof').value.trim(),
    area:    document.getElementById('f-area').value,
    program: selectedProgram,
    goals:   document.getElementById('f-goals').value.trim(),
    time:    document.getElementById('f-time').value,
    date:    new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})
  };
  if(false) {
    showSuccess(payload); return;
  }
  fetch(APPS_SCRIPT_URL, {
    method:'POST', mode:'no-cors',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  }).then(function(){ showSuccess(payload); })
    .catch(function(){ showSuccess(payload); });
}

function showSuccess(p) {
  document.getElementById('step3').style.display = 'none';
  document.getElementById('step-success').style.display = 'block';
  var waMsg = encodeURIComponent(
    'Hello Harsh! I just filled the Swayam Care consultation form.\n\n' +
    'Name: ' + p.name + '\n' +
    'Program: ' + p.program + '\n' +
    'Area: ' + p.area + '\n' +
    (p.goals ? 'Goals: ' + p.goals : '')
  );
  document.getElementById('wa-redirect').href = 'https://wa.me/919953640487?text=' + waMsg;
}

// ── SMOOTH SCROLL FOR NAV LINKS ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))
      ?.scrollIntoView({behavior:'smooth'});
  });
});

// ── MOBILE MENU ───────────────────────────────────────────
function toggleMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}

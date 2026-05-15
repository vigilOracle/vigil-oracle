/* ============================================================
   VIGIL ORACLE — landing page script
   Lenis smooth scroll · GSAP ScrollTrigger reveals · counters
   live terminal cycle · FAQ accordion · drawer · clipboard
   live backend integration: stats · terminal · skills grid
   ============================================================ */

const CA = 'TBA';
const API_BASE = 'https://vigil-oracle-api-production.up.railway.app/api';

(function () {
  'use strict';

  /* ----------------------------------------------------------
     [00] HELPERS
     ---------------------------------------------------------- */
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const pad = (n) => String(n).padStart(2, '0');
  const fmtInt = (n) => Math.round(n).toLocaleString('en-US');
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  /* escape user/API text before it touches innerHTML */
  const esc = (s) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  /* GET an API path — native fetch + AbortController, 4s timeout */
  function apiGet(path) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    return fetch(API_BASE + path, {
      signal: ctrl.signal,
      headers: { accept: 'application/json' }
    })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .finally(() => clearTimeout(timer));
  }

  /* ISO timestamp → HH:MM:SS UTC */
  function fmtClock(iso) {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '--:--:--';
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' +
           pad(d.getUTCSeconds());
  }
  function nowClock() {
    const d = new Date();
    return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' +
           pad(d.getUTCSeconds());
  }

  /* compact relative time from an ISO timestamp */
  function relTime(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    if (!isFinite(diff)) return '';
    if (diff < 60000) return 'just now';
    const m = Math.round(diff / 60000);
    if (m < 60) return m + 'm ago';
    const h = Math.round(m / 60);
    if (h < 24) return h + 'h ago';
    return Math.round(h / 24) + 'd ago';
  }

  /* ----------------------------------------------------------
     [01] LENIS — smooth scroll
     ---------------------------------------------------------- */
  let lenis = null;

  function initLenis() {
    if (prefersReduced || typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // keep GSAP ScrollTrigger in sync with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  /* anchor links → smooth scroll via Lenis (or native fallback) */
  function initAnchors() {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        closeDrawer();
        if (lenis) {
          lenis.scrollTo(target, { offset: -70, duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     [02] STATUS BAR — live clock + last beacon
     ---------------------------------------------------------- */
  function initClocks() {
    const lastBeacon = $('#last-beacon');
    const footerClock = $('#footer-clock');
    const agentsLive = $('#agents-live');

    let agents = 1247;

    function tick() {
      const now = new Date();
      const h = pad(now.getUTCHours());
      const m = pad(now.getUTCMinutes());
      const s = pad(now.getUTCSeconds());

      if (lastBeacon) lastBeacon.textContent = `${h}:${m} UTC`;
      if (footerClock) footerClock.textContent = `${h}:${m}:${s} UTC`;
    }

    tick();
    setInterval(tick, 1000);

    /* drift the active-agent count slightly so it feels live */
    if (agentsLive) {
      setInterval(() => {
        agents += Math.floor(Math.random() * 5) - 1;
        if (agents < 1200) agents = 1200;
        agentsLive.textContent = fmtInt(agents);
      }, 4200);
    }
  }

  /* ----------------------------------------------------------
     [03] NAV — blur on scroll
     ---------------------------------------------------------- */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;

    function onScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------
     [04] MOBILE DRAWER
     ---------------------------------------------------------- */
  const drawer = $('#drawer');
  const drawerScrim = $('#drawer-scrim');
  const burger = $('#nav-burger');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawerScrim.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawerScrim.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }

  function initDrawer() {
    if (!drawer) return;
    burger.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });
    $('#drawer-close').addEventListener('click', closeDrawer);
    drawerScrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ----------------------------------------------------------
     [05] HERO PARALLAX
     ---------------------------------------------------------- */
  function initParallax() {
    const heroBg = $('#hero-bg');
    if (!heroBg || prefersReduced) return;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.to(heroBg, {
        yPercent: 16,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    } else {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroBg.style.transform = `translateY(${y * 0.16}px) scale(1.04)`;
        }
      }, { passive: true });
    }
  }

  /* ----------------------------------------------------------
     [06] SCROLL REVEALS — y40 → 0, opacity 0 → 1, stagger
     ---------------------------------------------------------- */
  function initReveals() {
    const items = $$('.reveal');

    if (prefersReduced) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      items.forEach((el) => {
        // group siblings that share a parent for a natural stagger
        ScrollTrigger.create({
          trigger: el,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            const siblings = el.parentElement
              ? $$('.reveal', el.parentElement).filter(
                  (s) => s.parentElement === el.parentElement
                )
              : [el];
            const index = Math.max(0, siblings.indexOf(el));
            gsap.to(el, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              delay: Math.min(index, 6) * 0.08,
              ease: 'power2.out',
              onStart: () => el.classList.add('is-visible')
            });
          }
        });
      });

      // section titles get a small extra lift
      $$('.section__title').forEach((title) => {
        gsap.from(title, {
          scrollTrigger: { trigger: title, start: 'top 88%', once: true },
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'expo.out'
        });
      });
    } else {
      // IntersectionObserver fallback
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      items.forEach((el) => io.observe(el));
    }
  }

  /* ----------------------------------------------------------
     [06b] SECTION DIVIDERS — amber line scans in on view
     ---------------------------------------------------------- */
  function initDividers() {
    const dividers = $$('.divider');
    if (!dividers.length || prefersReduced) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-scanned');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    dividers.forEach((d) => io.observe(d));
  }

  /* ----------------------------------------------------------
     [07] COUNT-UP — stats + tokenomics
     ---------------------------------------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1900;
    const start = performance.now();

    function frame(now) {
      const p = Math.min(1, (now - start) / duration);
      // expo.out easing
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = fmtInt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = fmtInt(target) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* generic counters — tokenomics etc. (stats handled by initStats) */
  function initCounters() {
    const counters = $$('[data-count]:not([data-stat])');
    if (!counters.length) return;

    if (prefersReduced) {
      counters.forEach((el) => {
        el.textContent =
          fmtInt(parseFloat(el.dataset.count || '0')) +
          (el.dataset.suffix || '');
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------
     [07b] STATS BAR — live API data + count-up + silent refresh
     GET /api/status → { agents_active, prophecies_cast,
                         watch_hours, skills_available }
     ---------------------------------------------------------- */
  const STAT_KEYS = {
    'agents-active':    'agents_active',
    'prophecies-cast':  'prophecies_cast',
    'watch-hours':      'watch_hours',
    'skills-available': 'skills_available'
  };

  function initStats() {
    const els = $$('.stat__num[data-stat]');
    if (!els.length) return;

    const byStat = {};
    els.forEach((el) => { byStat[el.dataset.stat] = el; });

    let dataReady = false;
    const visible = new Set();

    /* run the count-up (or snap, if reduced motion) exactly once */
    function reveal(el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      if (prefersReduced) {
        el.textContent =
          fmtInt(parseFloat(el.dataset.count || '0')) +
          (el.dataset.suffix || '');
      } else {
        animateCount(el);
      }
    }

    /* fold a /status payload onto the stat elements */
    function apply(data, animate) {
      Object.keys(STAT_KEYS).forEach((stat) => {
        const el = byStat[stat];
        const val = data[STAT_KEYS[stat]];
        if (!el || typeof val !== 'number') return;
        el.dataset.count = String(val);
        // silent refresh: just write the new value, no re-animation
        if (!animate && el.dataset.revealed) {
          el.textContent = fmtInt(val) + (el.dataset.suffix || '');
        }
      });
    }

    /* hold the count-up until live data lands (or fetch settles) */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          if (dataReady) reveal(entry.target);
          else visible.add(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    els.forEach((el) => io.observe(el));

    function release() {
      dataReady = true;
      visible.forEach(reveal);
      visible.clear();
    }

    apiGet('/status')
      .then((data) => { apply(data, true); release(); })
      .catch((err) => {
        console.warn('[vigil] /status fetch failed — keeping static stats', err);
        release();
      });

    /* silent background refresh every 30s, no animation re-trigger */
    setInterval(() => {
      apiGet('/status')
        .then((data) => apply(data, false))
        .catch((err) => console.warn('[vigil] /status refresh failed', err));
    }, 30000);
  }

  /* ----------------------------------------------------------
     [08] LIVE TERMINAL — real beacon data, 5-skill cycle
     GET /api/skills/<skill> every ~8s, fading transitions
     ---------------------------------------------------------- */
  const TERMINAL_SKILLS = [
    'whale-watch',
    'liquidation-radar',
    'funding-arb',
    'narrative-scanner',
    'kol-tracker'
  ];

  /* level → [css class, label, optional inline colour] */
  function levelTag(level) {
    const L = String(level || '').toUpperCase();
    switch (L) {
      case 'HIT':  return '<span class="log-hit">[HIT ]</span>';
      case 'WARN': return '<span class="log-warn">[WARN]</span>';
      case 'ERR':
      case 'ERROR':return '<span class="log-err">[ERR ]</span>';
      case 'DONE': return '<span class="log-hit" style="color:#5BD98A">[DONE]</span>';
      case 'INFO':
      default:     return '<span class="log-info">[INFO]</span>';
    }
  }

  const tok = (cls, v) => '<span class="' + cls + '">' + esc(v) + '</span>';

  /* a /skills/<skill> payload → flat list of renderable lines */
  function buildRunLines(data) {
    const lines = [];
    (data.beacons || []).forEach((b) => {
      lines.push({ kind: 'log', time: fmtClock(b.timestamp), level: b.level,
                   msg: b.message });
      if (b.address) lines.push({ kind: 'out', text: 'addr  ' + tok('tok-addr', b.address) });
      if (b.flow)    lines.push({ kind: 'out', text: 'flow  ' + tok('tok-num', b.flow) });
      if (b.asset)   lines.push({ kind: 'out', text: 'asset ' + tok('tok-str', b.asset) });
    });
    const done = fmtClock(data.ran_at);
    lines.push({
      kind: 'log',
      level: 'DONE',
      time: done,
      msg: 'Beacon sent · ' + done + '  · duration: ' +
           (data.duration_ms || 0) + 'ms · source: ' +
           (data.data_source || 'mock')
    });
    return lines;
  }

  function makeLine(line) {
    const el = document.createElement('span');
    el.className = 'live-line';
    if (line.kind === 'out') {
      el.innerHTML = '<span class="log-out">         ' + line.text + '</span>';
    } else {
      el.innerHTML =
        '<span class="log-time">' + line.time + '</span> ' +
        levelTag(line.level) + ' ' + esc(line.msg);
    }
    return el;
  }

  function initLiveTerminal() {
    const output = $('#live-output');
    const skillName = $('#live-skill');
    const tabsWrap = $('#live-tabs');
    if (!output || !skillName) return;

    let runIndex = 0;
    let lineTimers = [];
    let cycleTimer = null;

    output.style.transition = 'opacity .3s ease';

    /* build the cycling tabs */
    TERMINAL_SKILLS.forEach((skill, i) => {
      const tab = document.createElement('span');
      tab.className = 'terminal__foot-tab';
      tab.textContent = skill;
      tab.dataset.index = i;
      tab.addEventListener('click', () => {
        clearTimers();
        runIndex = i;
        playRun();
      });
      tabsWrap.appendChild(tab);
    });

    function clearTimers() {
      lineTimers.forEach((t) => clearTimeout(t));
      lineTimers = [];
      if (cycleTimer) clearTimeout(cycleTimer);
    }

    function setActiveTab() {
      $$('.terminal__foot-tab', tabsWrap).forEach((tab) => {
        tab.classList.toggle(
          'is-active',
          Number(tab.dataset.index) === runIndex
        );
      });
    }

    function scheduleNext() {
      cycleTimer = setTimeout(() => {
        runIndex = (runIndex + 1) % TERMINAL_SKILLS.length;
        playRun();
      }, 8000);
    }

    function paintLines(lines) {
      const stepDelay = prefersReduced ? 0 : 300;
      lines.forEach((line, i) => {
        const t = setTimeout(() => {
          output.appendChild(makeLine(line));
          if (i === lines.length - 1) {
            const cur = document.createElement('span');
            cur.className = 'log-cursor';
            cur.textContent = '_';
            output.appendChild(document.createTextNode('\n'));
            output.appendChild(cur);
          }
          output.scrollTop = output.scrollHeight;
        }, i * stepDelay);
        lineTimers.push(t);
      });
    }

    async function playRun() {
      const skill = TERMINAL_SKILLS[runIndex];
      setActiveTab();

      // fade the current output out while the request is in flight
      output.style.opacity = '0';

      let data = null;
      try {
        const [payload] = await Promise.all([
          apiGet('/skills/' + skill),
          wait(300)
        ]);
        data = payload;
      } catch (err) {
        console.warn('[vigil] terminal fetch failed: ' + skill, err);
        await wait(300);
      }

      output.innerHTML = '';
      output.style.opacity = '1';

      if (!data) {
        // graceful fallback — surface the error, then move to next skill
        skillName.textContent = skill;
        output.appendChild(makeLine({
          kind: 'log',
          time: nowClock(),
          level: 'ERR',
          msg: 'failed to reach watcher · retrying in 8s'
        }));
        scheduleNext();
        return;
      }

      skillName.textContent = skill + ' · ' + (data.tier || 'free');
      paintLines(buildRunLines(data));
      scheduleNext();
    }

    /* only start cycling when the terminal scrolls into view */
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            playRun();
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(output);
  }

  /* ----------------------------------------------------------
     [08b] SKILLS GRID — augment cards with live "last ran"
     GET /api/skills → { skills: [{ name, last_ran_at, ... }] }
     ---------------------------------------------------------- */
  function initSkillsGrid() {
    apiGet('/skills')
      .then((res) => {
        const skills = (res && res.skills) || [];
        const byName = {};
        skills.forEach((s) => { byName[s.name] = s; });

        $$('.skill-card').forEach((card) => {
          const nameEl = $('.skill-card__name', card);
          const cronEl = $('.skill-card__cron', card);
          if (!nameEl || !cronEl) return;
          const skill = byName[nameEl.textContent.trim()];
          if (!skill || !skill.last_ran_at) return;
          cronEl.textContent =
            cronEl.textContent.trim() +
            ' · last ran: ' + relTime(skill.last_ran_at);
        });
      })
      .catch((err) => {
        console.warn('[vigil] /skills fetch failed — keeping static cron text', err);
      });
  }

  /* ----------------------------------------------------------
     [09] FAQ ACCORDION — one open at a time
     ---------------------------------------------------------- */
  function initFaq() {
    const items = $$('.faq__item');
    items.forEach((item) => {
      const summary = $('.faq__q', item);
      summary.addEventListener('click', () => {
        // closing happens natively; when opening, close the others
        if (!item.open) {
          items.forEach((other) => {
            if (other !== item) other.open = false;
          });
        }
        // let ScrollTrigger recompute after height change
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 320);
        }
      });
    });
  }

  /* ----------------------------------------------------------
     [10] CONTRACT — copy to clipboard
     ---------------------------------------------------------- */
  function initContract() {
    const caText = $('#ca-text');
    const copyBtn = $('#copy-ca');
    const copyState = $('#copy-state');
    if (!caText || !copyBtn) return;

    caText.textContent = CA;

    copyBtn.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(CA);
        ok = true;
      } catch (e) {
        // fallback for non-secure contexts
        const tmp = document.createElement('textarea');
        tmp.value = CA;
        tmp.style.position = 'fixed';
        tmp.style.opacity = '0';
        document.body.appendChild(tmp);
        tmp.select();
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(tmp);
      }

      copyBtn.classList.add('is-copied');
      copyState.textContent = ok ? '[ copied ]' : '[ failed ]';
      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        copyState.textContent = '[ copy ]';
      }, 1900);
    });
  }

  /* ----------------------------------------------------------
     [11] MARQUEE — sync duration to content width
     ---------------------------------------------------------- */
  function initMarquee() {
    const track = $('.marquee__track');
    const set = $('.marquee__set');
    if (!track || !set || prefersReduced) return;

    // ~80px travelled per second feels right for a slow ticker
    const width = set.offsetWidth;
    const duration = Math.max(28, Math.round(width / 80));
    track.style.animationDuration = duration + 's';
  }

  /* ----------------------------------------------------------
     [12] BOOT
     ---------------------------------------------------------- */
  function boot() {
    initLenis();
    initAnchors();
    initClocks();
    initNav();
    initDrawer();
    initParallax();
    initReveals();
    initDividers();
    initCounters();
    initStats();
    initLiveTerminal();
    initSkillsGrid();
    initFaq();
    initContract();
    initMarquee();

    // final layout settle
    if (typeof ScrollTrigger !== 'undefined') {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }

    document.documentElement.classList.add('vigil-ready');
    console.log(
      '%c VIGIL ORACLE %c the oracle that never sleeps · CA: ' + CA,
      'background:#FFB347;color:#0A0A0B;font-weight:700;padding:2px 6px;border-radius:3px;',
      'color:#8B8B85;'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

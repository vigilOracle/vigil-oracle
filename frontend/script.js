/* ============================================================
   VIGIL ORACLE — landing page script
   Lenis smooth scroll · GSAP ScrollTrigger reveals · counters
   live terminal cycle · FAQ accordion · drawer · clipboard
   ============================================================ */

const CA = 'TBA';

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

  function initCounters() {
    const counters = $$('[data-count]');
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
     [08] LIVE TERMINAL — 5-skill cycle
     ---------------------------------------------------------- */
  const LIVE_RUNS = [
    {
      skill: 'whale-watch',
      lines: [
        ['09:14:01', 'info', 'skill <s>whale-watch</s> started'],
        ['09:14:02', 'info', 'window 05:14 &#8594; 09:14 UTC'],
        ['09:14:04', 'info', 'pulled <n>388</n> transfers &gt; $250k'],
        ['09:14:05', 'warn', 'cluster of <n>3</n> wallets, one entity'],
        ['09:14:07', 'hit',  'net accumulation detected'],
        ['out', 'addr  <a>9pQr4T&#8230;mB2xK7</a>'],
        ['out', 'flow  <n>+$2,140,000</n> <up>&#9650; IN</up> · SOL'],
        ['09:14:09', 'info', 'narrative match: <s>"SOL strength"</s>'],
        ['09:14:11', 'hit',  'Beacon sent · 09:14:11']
      ]
    },
    {
      skill: 'liquidation-radar',
      lines: [
        ['09:15:00', 'info', 'skill <s>liquidation-radar</s> started'],
        ['09:15:01', 'info', 'scanning <n>7</n> perp venues'],
        ['09:15:03', 'info', 'open interest <n>$4.18B</n> aggregate'],
        ['09:15:05', 'warn', 'leverage wall forming below spot'],
        ['09:15:06', 'hit',  'cascade level identified'],
        ['out', 'pair  <s>BTC-PERP</s> long liquidations'],
        ['out', 'level <n>$61,420</n> · depth <n>$88M</n>'],
        ['09:15:08', 'warn', 'price <n>1.9%</n> from trigger'],
        ['09:15:10', 'hit',  'Beacon sent · 09:15:10']
      ]
    },
    {
      skill: 'funding-arb',
      lines: [
        ['09:16:00', 'info', 'skill <s>funding-arb</s> started'],
        ['09:16:02', 'info', 'comparing funding across <n>4</n> venues'],
        ['09:16:04', 'info', 'normalising to 8h intervals'],
        ['09:16:05', 'hit',  'carry window detected'],
        ['out', 'asset <s>HYPE</s> · delta-neutral'],
        ['out', 'long  <n>-0.011%</n> / short <n>+0.092%</n>'],
        ['out', 'net   <n>+0.103%</n> per 8h'],
        ['09:16:08', 'info', 'spread holds &gt; <n>6h</n> backtest'],
        ['09:16:09', 'hit',  'Beacon sent · 09:16:09']
      ]
    },
    {
      skill: 'narrative-scanner',
      lines: [
        ['09:17:00', 'info', 'skill <s>narrative-scanner</s> started'],
        ['09:17:03', 'info', 'ingested <n>9,402</n> posts, <n>61</n> sources'],
        ['09:17:05', 'info', 'clustering by semantic theme'],
        ['09:17:07', 'hit',  'narrative accelerating'],
        ['out', 'theme <s>"RWA rotation"</s>'],
        ['out', 'vel   <n>3.4&#215;</n> 24h baseline <up>&#9650;</up>'],
        ['out', 'tail  ONDO · CFG · POLYX'],
        ['09:17:10', 'info', 'cross-ref kol-tracker memory'],
        ['09:17:12', 'hit',  'Beacon sent · 09:17:12']
      ]
    },
    {
      skill: 'kol-tracker',
      lines: [
        ['09:18:00', 'info', 'skill <s>kol-tracker</s> started'],
        ['09:18:02', 'info', 'watching <n>142</n> tracked wallets'],
        ['09:18:04', 'warn', 'correlated entries inside <n>18m</n>'],
        ['09:18:05', 'hit',  'conviction cluster flagged'],
        ['out', 'wallets <n>3</n> KOL-tagged &#8594; <s>WIF</s>'],
        ['out', 'lead    <a>Hn7Yt3&#8230;Lp9Qd4</a>'],
        ['out', 'size    <n>$612,000</n> combined'],
        ['09:18:08', 'info', 'follow-through score <n>0.81</n>'],
        ['09:18:10', 'hit',  'Beacon sent · 09:18:10']
      ]
    }
  ];

  function renderLogToken(html) {
    return html
      .replace(/<s>/g, '<span class="tok-str">')
      .replace(/<\/s>/g, '</span>')
      .replace(/<n>/g, '<span class="tok-num">')
      .replace(/<\/n>/g, '</span>')
      .replace(/<a>/g, '<span class="tok-addr">')
      .replace(/<\/a>/g, '</span>')
      .replace(/<up>/g, '<span class="tok-up">')
      .replace(/<\/up>/g, '</span>');
  }

  function levelTag(level) {
    switch (level) {
      case 'info': return '<span class="log-info">[INFO]</span>';
      case 'warn': return '<span class="log-warn">[WARN]</span>';
      case 'hit':  return '<span class="log-hit">[HIT ]</span>';
      case 'err':  return '<span class="log-err">[ERR ]</span>';
      default:     return '';
    }
  }

  function initLiveTerminal() {
    const output = $('#live-output');
    const skillName = $('#live-skill');
    const tabsWrap = $('#live-tabs');
    if (!output || !skillName) return;

    let runIndex = 0;
    let lineTimers = [];
    let cycleTimer = null;

    /* build the cycling tabs */
    LIVE_RUNS.forEach((run, i) => {
      const tab = document.createElement('span');
      tab.className = 'terminal__foot-tab';
      tab.textContent = run.skill;
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

    function playRun() {
      const run = LIVE_RUNS[runIndex];
      output.innerHTML = '';
      skillName.textContent = run.skill;
      setActiveTab();

      const stepDelay = prefersReduced ? 0 : 360;

      run.lines.forEach((line, i) => {
        const t = setTimeout(() => {
          const el = document.createElement('span');
          el.className = 'live-line';

          if (line[0] === 'out') {
            el.innerHTML =
              '<span class="log-out">         ' +
              renderLogToken(line[1]) +
              '</span>';
          } else {
            const [time, level, msg] = line;
            el.innerHTML =
              '<span class="log-time">' + time + '</span> ' +
              levelTag(level) + ' ' +
              renderLogToken(msg);
          }
          output.appendChild(el);

          // append blinking cursor on the final line
          if (i === run.lines.length - 1) {
            const cur = document.createElement('span');
            cur.className = 'log-cursor';
            cur.textContent = '_';
            output.appendChild(document.createTextNode('\n'));
            output.appendChild(cur);
          }
        }, i * stepDelay);
        lineTimers.push(t);
      });

      // schedule the next skill
      const runDuration = run.lines.length * stepDelay + 3200;
      cycleTimer = setTimeout(() => {
        runIndex = (runIndex + 1) % LIVE_RUNS.length;
        playRun();
      }, runDuration);
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
    initLiveTerminal();
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

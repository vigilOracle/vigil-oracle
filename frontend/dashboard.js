/* ============================================================
   VIGIL ORACLE — dashboard.html shell script
   Sidebar collapse · ⌘K command palette · search · mock links
   Note: live terminal, clocks, count-ups and reveals are driven
   by the shared script.js runtime — this file is shell-only.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) {
    return Array.prototype.slice.call((c || document).querySelectorAll(s));
  };

  /* ----------------------------------------------------------
     [01] SIDEBAR — collapse to icons (manual + responsive)
     ---------------------------------------------------------- */
  var dash   = $('#dash');
  var toggle = $('#side-toggle');

  if (dash && toggle) {
    toggle.addEventListener('click', function () {
      dash.classList.toggle('is-collapsed');
    });

    /* auto-collapse on tablet / narrow viewports — never force-expand */
    function syncWidth() {
      if (window.innerWidth <= 1000) dash.classList.add('is-collapsed');
    }
    syncWidth();
    window.addEventListener('resize', syncWidth, { passive: true });
  }

  /* ----------------------------------------------------------
     [02] COMMAND PALETTE — ⌘K / Ctrl+K opens a "coming soon" modal
     ---------------------------------------------------------- */
  var modal  = $('#dash-modal');
  var search = $('#dash-search');

  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (modal) {
    /* keyboard — ⌘K (mac) / Ctrl+K (win/linux) */
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modal.classList.contains('is-open') ? closeModal() : openModal();
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });

    /* clicking the backdrop closes */
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    /* the search box is a focus-ring-only mockup — opening it
       routes the user to the same command palette */
    if (search) {
      search.addEventListener('click', function () {
        openModal();
        var input = $('input', search);
        if (input) input.blur();
      });
    }
  }

  /* ----------------------------------------------------------
     [03] MOCK LINKS — keep href="#" anchors from jumping the page
     ---------------------------------------------------------- */
  $$('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  console.log(
    '%c VIGIL ORACLE %c dashboard · overview',
    'background:#FFB347;color:#0A0A0B;font-weight:700;padding:2px 6px;border-radius:3px;',
    'color:#8B8B85;'
  );
})();

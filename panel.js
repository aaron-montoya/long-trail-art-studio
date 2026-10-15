// Sidebar helpers for the Long Trail tools. Each <details data-cat="..."> section is color coded by what it
// changes (see studio.css), and the panel gets a find bar under its header: a search box that shows only the
// matching settings, colored chips that jump to each section, and expand / collapse all.
// The open and closed sections are remembered per tab. Every drop-down menu gets small up/down buttons that step
// to the previous / next choice, so you can flick through coat patterns, hats and so on without opening the menu.
(function () {
  const CATS = {
    shape: 'Shape', color: 'Look & colors', text: 'Text', card: 'Card & effects', scene: 'Scene & light', placed: 'Placed items'
  };
  // Units the search shows or hides as a whole (the outermost one wins when they nest)
  const UNITS = '.control-group, .fx-row, .band, .row, .btn-grid3, .btn-grid4, .item-grid, .pose-btns, .preset-btns, .action-row, .chips, .pattern-row';
  const storeKey = 'lt-panel:' + location.pathname.split('/').pop();
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(storeKey)) || null; } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(storeKey, JSON.stringify(v)); } catch (e) {} }
  };

  // ---- up/down steppers beside every drop-down ----
  function addStepper(sel) {
    if (sel.dataset.stepper || sel.multiple || sel.size > 1 || !sel.parentNode) return; // list boxes scroll on their own
    sel.dataset.stepper = '1';
    const wrap = document.createElement('div');
    wrap.className = 'sel-step';
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(sel);
    const btns = document.createElement('div');
    btns.className = 'step-btns';
    [['prev', 'Previous choice', 'M6 15l6-6 6 6'], ['next', 'Next choice', 'M6 9l6 6 6-6']].forEach(([dir, title, d]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
      b.addEventListener('click', () => step(sel, dir === 'next' ? 1 : -1));
      btns.appendChild(b);
    });
    wrap.appendChild(btns);
  }
  // move to the next usable option (wrapping around) and tell the tool, just as if it had been picked
  function step(sel, d) {
    const n = sel.options.length;
    if (!n || sel.disabled) return;
    let i = sel.selectedIndex;
    for (let k = 0; k < n; k++) {
      i = (i + d + n) % n;
      if (!sel.options[i].disabled) break;
    }
    if (i === sel.selectedIndex) return;
    sel.selectedIndex = i;
    sel.dispatchEvent(new Event('input', { bubbles: true }));
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function init() {
    const panel = document.getElementById('ui-panel');
    if (!panel) return;
    panel.querySelectorAll('select').forEach(addStepper);
    // tools that build menus later (the border bands, item styles) get steppers too
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.tagName === 'SELECT') addStepper(n); else n.querySelectorAll && n.querySelectorAll('select').forEach(addStepper);
    }))).observe(panel, { childList: true, subtree: true });
    const sections = [...panel.querySelectorAll('details[data-cat]')];
    if (!sections.length) return;
    const titleOf = d => d.dataset.chip || d.querySelector('summary').textContent.trim();

    // put back the sections that were open last time
    const saved = store.get();
    if (saved) sections.forEach(d => { if (saved[titleOf(d)] !== undefined) d.open = saved[titleOf(d)]; });
    const remember = () => { const v = {}; sections.forEach(d => v[titleOf(d)] = d.open); store.set(v); };
    sections.forEach(d => d.addEventListener('toggle', () => { if (!searching) remember(); }));

    // ---- the find bar ----
    const bar = document.createElement('div');
    bar.className = 'panel-tools';
    bar.innerHTML = `
      <div class="find-row">
        <input type="text" class="panel-find" placeholder="Find a setting…" title="Type part of a setting's name, like outline, tail or snow" aria-label="Find a setting">
        <button type="button" class="tool-btn" data-act="open" title="Open every section">Expand</button>
        <button type="button" class="tool-btn" data-act="close" title="Close every section">Collapse</button>
      </div>
      <div class="jump"></div>`;
    const header = panel.querySelector('.panel-header');
    header ? header.after(bar) : panel.prepend(bar);
    const jump = bar.querySelector('.jump'), find = bar.querySelector('.panel-find');

    const chips = sections.map(d => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip-jump';
      b.dataset.cat = d.dataset.cat;
      b.title = `${CATS[d.dataset.cat] || ''}: ${titleOf(d)}`;
      b.addEventListener('click', () => {
        if (find.value) { find.value = ''; runSearch(); }
        d.open = true;
        // scroll only the sidebar (scrollIntoView would also nudge the page), landing just under the find bar
        const top = panel.scrollTop + d.getBoundingClientRect().top - panel.getBoundingClientRect().top - bar.offsetHeight - 6;
        panel.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        d.classList.remove('flash'); void d.offsetWidth; d.classList.add('flash');
      });
      jump.appendChild(b);
      return b;
    });
    // chips follow the sections: renamed titles (the Gear tab's item name) and sections a tool hides
    function syncChips() {
      sections.forEach((d, i) => {
        chips[i].textContent = titleOf(d);
        chips[i].style.display = d.style.display === 'none' ? 'none' : '';
      });
    }
    syncChips();
    panel.addEventListener('click', () => setTimeout(syncChips, 0));
    panel.addEventListener('change', () => setTimeout(syncChips, 0));

    bar.querySelector('[data-act="open"]').addEventListener('click', () => { sections.forEach(d => d.open = true); remember(); });
    bar.querySelector('[data-act="close"]').addEventListener('click', () => { sections.forEach(d => d.open = false); remember(); });

    // ---- search ----
    let searching = false, before = null;
    function runSearch() {
      const q = find.value.trim().toLowerCase();
      panel.querySelectorAll('.ps-hide').forEach(e => e.classList.remove('ps-hide'));
      if (!q) {
        if (searching) { sections.forEach(d => { d.classList.remove('ps-none'); d.open = before.get(d); }); }
        searching = false;
        panel.classList.remove('ps-search');
        return;
      }
      if (!searching) { before = new Map(sections.map(d => [d, d.open])); searching = true; }
      panel.classList.add('ps-search');
      const text = el => (el.textContent + ' ' + [...el.querySelectorAll('[title]')].map(t => t.title).join(' ')).toLowerCase();
      sections.forEach(d => {
        const content = d.querySelector('.details-content') || d;
        if (titleOf(d).toLowerCase().includes(q)) { d.classList.remove('ps-none'); d.open = true; return; } // the whole section matches
        d.open = true; // open it to see which settings are actually showing (a tool may hide some)
        const units = [...content.querySelectorAll(UNITS)].filter(u => !u.parentElement.closest(UNITS) || !content.contains(u.parentElement.closest(UNITS)));
        let hits = 0;
        units.forEach(u => { if (u.getClientRects().length && text(u).includes(q)) hits++; else u.classList.add('ps-hide'); });
        d.classList.toggle('ps-none', !hits);
        d.open = hits > 0;
      });
    }
    find.addEventListener('input', runSearch);
    find.addEventListener('keydown', e => { if (e.key === 'Escape') { find.value = ''; runSearch(); find.blur(); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

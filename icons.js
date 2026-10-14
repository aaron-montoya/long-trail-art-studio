// Shared line icons for the Long Trail tools (24x24, drawn with currentColor so they match the text).
// Usage in HTML: <i data-icon="dice"></i>  — each placeholder is swapped for an inline SVG on load.
(function () {
  const dot = (x, y, r = 1.1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
  const ICONS = {
    dice: `<rect x="3.5" y="3.5" width="17" height="17" rx="3"/>${dot(8.5, 8.5)}${dot(15.5, 8.5)}${dot(12, 12)}${dot(8.5, 15.5)}${dot(15.5, 15.5)}`,
    palette: `<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.9-1 1.5-2-.4-1.1.4-2.2 1.6-2.2H17a4 4 0 0 0 4-4C21 7.3 17 3 12 3z"/>${dot(7.5, 11.5)}${dot(9.5, 7.5)}${dot(14.5, 7.5)}`,
    download: `<path d="M12 4v11"/><path d="M7 10.5l5 5 5-5"/><path d="M4.5 19.5h15"/>`,
    folder: `<path d="M3.5 7.5a2 2 0 0 1 2-2h3.8l2 2h7.2a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>`,
    cube: `<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5"/><path d="M12 12v9"/>`,
    send: `<path d="M4.5 12h14"/><path d="M13 6.5l5.5 5.5-5.5 5.5"/>`,
    target: `<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>`,
    close: `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,
    menu: `<path d="M4.5 7h15M4.5 12h15M4.5 17h15"/>`,
    up: `<path d="M6.5 14.5l5.5-5.5 5.5 5.5"/>`,
    down: `<path d="M6.5 9.5l5.5 5.5 5.5-5.5"/>`,
    trail: `<path d="M12 3.5v10"/><path d="M8 9.5l4 4 4-4"/><path d="M4.5 19.5c4-2.4 11-2.4 15 0"/>`,
    copy: `<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>`,
    image: `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 16l4-4 3 3 2-2 5 5"/><circle cx="14.5" cy="8.5" r="1.5"/>`,
    paw: `<circle cx="6.5" cy="10" r="1.8"/><circle cx="10" cy="5.8" r="1.8"/><circle cx="14" cy="5.8" r="1.8"/><circle cx="17.5" cy="10" r="1.8"/><path d="M12 11.5c-2.9 0-5.2 3-5.2 5.3 0 1.5 1.2 2.2 2.6 2.2 1.1 0 1.7-.6 2.6-.6s1.5.6 2.6.6c1.4 0 2.6-.7 2.6-2.2 0-2.3-2.3-5.3-5.2-5.3z"/>`,
    dog: `<path d="M6 9.5L4.5 4l4 2.5h7l4-2.5L18 9.5"/><path d="M6 9.5v3.5a6 6 0 0 0 12 0V9.5"/>${dot(9.5, 11.5, 0.9)}${dot(14.5, 11.5, 0.9)}<path d="M11 15h2l-1 1.3z" fill="currentColor"/>`,
    person: `<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>`,
    mountain: `<path d="M2.5 19.5l7-11.5 4.2 6.8 2.3-3.3 5.5 8z"/><path d="M7.4 11.5l2.1 1.4 1.8-1.4"/>`,
    chevron: `<path d="M9.5 6.5l5.5 5.5-5.5 5.5"/>`,
    reset: `<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4.5 4.5v4h4"/>`,
    snowflake: `<path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5"/><path d="M9.5 4l2.5 2.5L14.5 4M9.5 20l2.5-2.5 2.5 2.5"/>`,
    ribbon: `<path d="M5 6.5h14v7H5z"/><path d="M5 9H2l1.5 2.5L2 14h3M19 9h3l-1.5 2.5L22 14h-3"/>`,
    lantern: `<path d="M9 4.5h6"/><path d="M12 2.5v2"/><path d="M8.5 7h7l1 2v8.5l-1 2h-7l-1-2V9z"/><path d="M12 11c1 1 1.2 2 .8 3s-1.6 1-1.8 0c-.2-1 .4-1.8 1-3z"/>`
  };

  function renderIcons(root = document) {
    root.querySelectorAll('i[data-icon]').forEach(el => {
      const svg = `<svg class="icon" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2"` +
                  ` stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[el.dataset.icon] || ''}</svg>`;
      el.insertAdjacentHTML('beforebegin', svg);
      el.remove();
    });
  }

  // default look; pages can override .icon in their own CSS
  const style = document.createElement('style');
  style.textContent = '.icon{width:1.15em;height:1.15em;vertical-align:-0.22em;flex:none}' +
                      'button .icon{margin-right:7px}';
  document.head.appendChild(style);

  window.renderIcons = renderIcons;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => renderIcons());
  else renderIcons();
})();

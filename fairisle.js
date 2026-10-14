// Fair Isle patterns for the Long Trail tools: a motif library, bands of motifs stacked into a border,
// and a stitch painter (knit, cross-stitch, low-poly tiles or flat) for a 2D canvas.
// Used by the Borders tab (frames, strips, card backs) and the Banners tab (trim).
//
// A motif is a chart that repeats sideways: '#' = main color, '+' = accent color, '.' = background.
(function () {
  const chart = s => s.trim().split(/\s+/);

  // 8-point star: eight rhombi around the center, with a gap along the axes and diagonals
  function starChart(L) {
    const N = 4 * L + 1, c = 2 * L, rows = [];
    const dirs = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
    for (let y = 0; y < N; y++) {
      let row = '';
      for (let x = 0; x < N; x++) {
        const dx = x - c, dy = c - y;
        let on = Math.abs(dx) + Math.abs(dy) <= 1 ? '+' : '.'; // a little accent diamond in the middle
        for (let k = 0; k < 8 && on === '.'; k++) {
          const A = dirs[k], D = dirs[(k + 1) % 8], det = A[0] * D[1] - A[1] * D[0];
          const s = (dx * D[1] - dy * D[0]) / det, t = (A[0] * dy - A[1] * dx) / det;
          if (s >= 1 && t >= 1 && s <= L && t <= L && Number.isInteger(s) && Number.isInteger(t)) on = '#';
        }
        row += on;
      }
      rows.push(row);
    }
    return rows;
  }

  // Lay charts side by side (vertically centered) to make one repeat
  function join(...parts) {
    const h = Math.max(...parts.map(p => p.length));
    return Array.from({ length: h }, (_, y) => parts.map(p => {
      const top = Math.floor((h - p.length) / 2), w = p[0].length;
      return y >= top && y < top + p.length ? p[y - top] : '.'.repeat(w);
    }).join(''));
  }
  const gap = n => ['.'.repeat(n)];

  const O = chart(`
    ..###..
    .#...#.
    #..+..#
    #.+++.#
    #..+..#
    .#...#.
    ..###..`);
  const X = chart(`
    #.....#
    .#...#.
    ..#.#..
    ...+...
    ..#.#..
    .#...#.
    #.....#`);
  const FLAKE = chart(`
    ....#....
    .#..#..#.
    ..#.#.#..
    ...#+#...
    ####+####
    ...#+#...
    ..#.#.#..
    .#..#..#.
    ....#....`);
  const MINI_DIAMOND = chart(`
    .#.
    #+#
    .#.`);
  const TREE = chart(`
    ....#....
    ...###...
    ..#####..
    ...###...
    ..#####..
    .#######.
    ..#####..
    .#######.
    #########
    ....+....
    ....+....`);
  const DEER = chart(`
    #.#.#.......
    .###........
    ..#.........
    .##.........
    ###.........
    .###.....#..
    ..########..
    ..#########.
    ...#######..
    ...#.#..#.#.
    ...#.#..#.#.`);
  const PAW = chart(`
    ..##.##..
    ..##.##..
    ##.....##
    ##.....##
    ...###...
    ..#####..
    .#######.
    .#######.
    ..##.##..`);
  const HEART = chart(`
    .##.##.
    #######
    #######
    .#####.
    ..###..
    ...#...`);
  // concentric diamonds, like the lozenge band in traditional borders
  function diamondChart(r) {
    const n = 2 * r + 1, rows = [];
    for (let y = 0; y < n; y++) {
      let row = '';
      for (let x = 0; x < n; x++) {
        const d = Math.abs(x - r) + Math.abs(y - r);
        row += d === r || d === r - 2 ? '#' : d === 0 ? '+' : '.';
      }
      rows.push(row);
    }
    return rows;
  }

  const MOTIFS = {
    // rules and peeries (small bands)
    solid:    { label: 'Solid line', group: 'Rules', rows: ['#'] },
    accent:   { label: 'Accent line', group: 'Rules', rows: ['+'] },
    dashes:   { label: 'Dashes', group: 'Rules', rows: ['##..'] },
    checks:   { label: 'Checks', group: 'Peerie (small)', rows: chart(`#. .#`) },
    dots:     { label: 'Dots', group: 'Peerie (small)', rows: chart(`#... .... ..#. ....`) },
    lice:     { label: 'Seeds', group: 'Peerie (small)', rows: chart(`#... ..+.`) },
    zigzag:   { label: 'Zigzag', group: 'Peerie (small)', rows: chart(`#..... .#...# ..#.#. ...+..`) },
    waves:    { label: 'Waves', group: 'Peerie (small)', rows: chart(`...##... ..#..#.. ##....##`) },
    diamonds: { label: 'Little diamonds', group: 'Peerie (small)', rows: chart(`.#.... #+#.+. .#....`) },
    crosses:  { label: 'Crosses', group: 'Peerie (small)', rows: chart(`#...#. .#.#.. ..+... .#.#.. #...#.`) },
    triangles:{ label: 'Teeth', group: 'Peerie (small)', rows: chart(`###### .####. ..##..`) },
    hearts:   { label: 'Hearts', group: 'Peerie (small)', rows: join(HEART, gap(2)) },
    // main bands
    oxo:      { label: 'OXO', group: 'Bands', rows: join(O, gap(1), X, gap(1)) },
    lozenge:  { label: 'Nested diamonds', group: 'Bands', rows: join(diamondChart(4), gap(1)) },
    flakes:   { label: 'Snowflakes', group: 'Bands', rows: join(FLAKE, gap(1), MINI_DIAMOND, gap(1)) },
    paws:     { label: 'Paw prints', group: 'Bands', rows: join(PAW, gap(2), MINI_DIAMOND, gap(2)) },
    trees:    { label: 'Spruce trees', group: 'Bands', rows: join(TREE, gap(1)) },
    deer:     { label: 'Reindeer', group: 'Bands', rows: join(DEER, gap(2)) },
    star:     { label: 'Star', group: 'Stars (big)', rows: join(starChart(3), gap(1), MINI_DIAMOND, gap(1)) },
    bigStar:  { label: 'Big star', group: 'Stars (big)', rows: join(starChart(4), gap(2)) }
  };
  // a mirrored copy faces the other way (reindeer walking right)
  MOTIFS.deerRight = { label: 'Reindeer (facing right)', group: 'Bands', rows: MOTIFS.deer.rows.map(r => [...r].reverse().join('')) };

  // Color palettes: background, main, accent (traditional Shetland and Nordic combinations)
  const PALETTES = {
    trail:    { label: 'Long Trail', colors: ['#1E2D4A', '#F2EEE3', '#C8423B', '#7FB3D5'] },
    shetland: { label: 'Shetland', colors: ['#2B3A55', '#E9DFC6', '#B33A2E', '#D9A441'] },
    nordic:   { label: 'Nordic red', colors: ['#B3262E', '#F6F1E7', '#1F2A44', '#F6F1E7'] },
    forest:   { label: 'Forest', colors: ['#25402F', '#EDE6D3', '#C9933A', '#8FB08A'] },
    ice:      { label: 'Ice', colors: ['#EAF2F8', '#2E5A87', '#7FB3D5', '#B9D7EA'] },
    earth:    { label: 'Earth', colors: ['#5A3B2A', '#EADBC0', '#A85C32', '#C9A66B'] },
    aurora:   { label: 'Aurora', colors: ['#0D1B2E', '#7FD3C6', '#B48CF0', '#E8F6F3'] },
    candy:    { label: 'Mitten', colors: ['#F4EEE4', '#C8423B', '#2F6B4F', '#E6B84C'] }
  };

  // ---- color helpers ----
  function rgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  // k > 0 lightens toward white, k < 0 darkens toward black
  function shade(hex, k) {
    const c = rgb(hex).map(v => k >= 0 ? v + (255 - v) * k : v * (1 + k));
    return `rgb(${c.map(v => Math.round(Math.max(0, Math.min(255, v)))).join(',')})`;
  }
  const luma = hex => { const [r, g, b] = rgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b; };
  const contrast = (h1, h2) => Math.abs(luma(h1) - luma(h2));
  function mix(h1, h2, t) {
    const a = rgb(h1), b = rgb(h2);
    return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }
  // stable 0..1 noise per stitch, so the facets don't jump when other settings change
  function hash(x, y, s) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1103515245);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }

  // ---- bands → rows ----
  // bands: [{ motif, bg, fg, accent, shade }], outer edge first. Each stitch row records its band and chart row.
  function buildRows(bands, mirror) {
    const rows = [];
    bands.forEach(b => {
      const M = MOTIFS[b.motif] || MOTIFS.solid;
      M.rows.forEach((chartRow, r) => rows.push({ band: b, chartRow, r, n: M.rows.length }));
    });
    if (mirror) {
      // repeat the bands (not the last one) in reverse order so the border reads the same from both edges;
      // each band keeps its own rows upright, so reindeer and trees never stand on their heads
      for (let i = bands.length - 2; i >= 0; i--) rows.push(...rows.filter(row => row.band === bands[i]));
    }
    return rows;
  }

  // Color of one stitch. Shaded bands lighten the main color toward the middle row, the Fair Isle way.
  function stitchColor(row, ch, crossFabric) {
    const b = row.band;
    if (crossFabric) { // cross-stitch only stitches the motif: use whichever band color stands out from the fabric
      if (ch === '+') return b.accent;
      return contrast(b.fg, crossFabric) >= contrast(b.bg, crossFabric) ? b.fg : b.bg;
    }
    if (ch === '.') return b.bg;
    if (ch === '+') return b.accent;
    if (!b.shade || row.n < 3) return b.fg;
    const mid = (row.n - 1) / 2, t = 1 - Math.abs(row.r - mid) / mid;
    return mix(b.fg, b.accent, t * 0.75);
  }

  // ---- stitch painters: each paints one stitch in the box x, y, w, h ----
  const poly = (g, pts) => { g.beginPath(); g.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.closePath(); g.fill(); };

  // Knit: a V of two faceted legs over a dark gap. Each leg is lit on one side and shaded on the other.
  function knitStitch(g, x, y, w, h, color, j, facet) {
    g.fillStyle = shade(color, -0.45);
    g.fillRect(x, y, w + 0.5, h + 0.5);
    const lift = (j - 0.5) * facet * 0.3;
    for (const side of [-1, 1]) {
      const X = u => x + (side < 0 ? u : 1 - u) * w; // the right leg mirrors the left
      const P = (u, v) => [X(u), y + v * h];
      const top = P(0.06, -0.12), inTop = P(0.44, 0.08), tip = P(0.5, 0.98), outLow = P(0.24, 0.9), outMid = P(0.02, 0.36);
      g.fillStyle = shade(color, (side < 0 ? 0.16 : 0.04) * facet + lift);
      poly(g, [...top, ...inTop, ...tip]);
      g.fillStyle = shade(color, (side < 0 ? -0.06 : -0.2) * facet + lift);
      poly(g, [...top, ...tip, ...outLow, ...outMid]);
    }
  }

  // Cross-stitch: two faceted bars over the fabric, the second one on top
  function crossStitch(g, x, y, w, h, color, j, facet) {
    const t = 0.15, lift = (j - 0.5) * facet * 0.25;
    const bar = (x0, y0, x1, y1, k) => {
      const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len * t * w, ny = dx / len * t * h;
      g.fillStyle = shade(color, k + 0.12 * facet + lift);
      poly(g, [x0 + nx, y0 + ny, x1 + nx, y1 + ny, x1, y1, x0, y0]);
      g.fillStyle = shade(color, k - 0.12 * facet + lift);
      poly(g, [x0, y0, x1, y1, x1 - nx, y1 - ny, x0 - nx, y0 - ny]);
    };
    const m = 0.12;
    bar(x + w * m, y + h * m, x + w * (1 - m), y + h * (1 - m), -0.12);
    bar(x + w * (1 - m), y + h * m, x + w * m, y + h * (1 - m), 0.02);
  }

  // Low-poly tile: the square split into two triangles, light from the top left
  function facetStitch(g, x, y, w, h, color, j, facet, flip) {
    const lift = (j - 0.5) * facet * 0.22;
    g.fillStyle = shade(color, 0.07 * facet + lift);
    if (flip) poly(g, [x, y, x + w + 0.5, y, x, y + h + 0.5]); else poly(g, [x, y, x + w + 0.5, y, x + w + 0.5, y + h + 0.5]);
    g.fillStyle = shade(color, -0.09 * facet + lift);
    if (flip) poly(g, [x + w + 0.5, y, x + w + 0.5, y + h + 0.5, x, y + h + 0.5]); else poly(g, [x, y, x + w + 0.5, y + h + 0.5, x, y + h + 0.5]);
  }

  const STITCHES = {
    knit:  { label: 'Knit', aspect: 1.2 },          // knit stitches are wider than tall
    cross: { label: 'Cross-stitch', aspect: 1 },
    facet: { label: 'Low-poly tiles', aspect: 1 },
    flat:  { label: 'Flat pixels', aspect: 1 }
  };

  // Paint a strip of stitch rows in local coordinates: x along [0, length], y down from 0 (the outer edge).
  // opts: { style, rowH, facet, fabric (cross-stitch background), seed }. Returns the strip's thickness.
  function drawStrip(g, rows, length, opts) {
    const style = opts.style || 'knit', rowH = opts.rowH, facet = opts.facet == null ? 1 : opts.facet;
    const count = opts.count || Math.max(1, Math.round(length / (rowH * STITCHES[style].aspect))), w = length / count;
    const thick = rows.length * rowH, seed = opts.seed || 1;
    if (style === 'cross') { // fabric with a faint weave
      g.fillStyle = opts.fabric;
      g.fillRect(0, 0, length, thick);
      g.fillStyle = shade(opts.fabric, -0.06);
      for (let c = 0; c <= count; c++) g.fillRect(c * w - 0.5, 0, Math.max(0.6, w * 0.04), thick);
      for (let r = 0; r <= rows.length; r++) g.fillRect(0, r * rowH - 0.5, length, Math.max(0.6, rowH * 0.04));
    }
    // center the repeat so the pattern is symmetric along the strip
    rows.forEach((row, r) => {
      const W = row.chartRow.length, offset = Math.floor(W / 2) - Math.floor(count / 2);
      for (let c = 0; c < count; c++) {
        const x = c * w, y = r * rowH, j = hash(c, r, seed);
        const ch = row.chartRow[((c + offset) % W + W) % W];
        const color = stitchColor(row, ch, style === 'cross' && opts.fabric);
        if (style === 'knit') knitStitch(g, x, y, w, rowH, color, j, facet);
        else if (style === 'cross') { if (ch !== '.') crossStitch(g, x, y, w, rowH, color, j, facet); }
        else if (style === 'facet') facetStitch(g, x, y, w, rowH, color, j, facet, (c + r) % 2);
        else { g.fillStyle = color; g.fillRect(x, y, w + 0.5, rowH + 0.5); }
      }
    });
    return thick;
  }

  // Stitches before every band's pattern starts over together (the least common multiple of their widths).
  // A strip this long, or a whole number of these, lines up end to end with copies of itself.
  function repeatWidth(rows) {
    const gcd = (a, b) => b ? gcd(b, a % b) : a;
    return rows.reduce((l, row) => l / gcd(l, row.chartRow.length) * row.chartRow.length, 1);
  }

  // A card frame: one strip per edge, rotated around the card and mitered at 45° in the corners
  function drawFrame(g, rows, W, H, opts) {
    const T = rows.length * opts.rowH;
    const edges = [
      { L: W, t: [1, 0, 0, 1, 0, 0] },        // top
      { L: H, t: [0, 1, -1, 0, W, 0] },       // right
      { L: W, t: [-1, 0, 0, -1, W, H] },      // bottom
      { L: H, t: [0, -1, 1, 0, 0, H] }        // left
    ];
    edges.forEach((e, i) => {
      g.save();
      g.transform(...e.t);
      const o = Math.max(1, opts.rowH * 0.1); // overlap the miters a hair so no seam shows
      g.beginPath(); g.moveTo(-o, 0); g.lineTo(e.L + o, 0); g.lineTo(e.L - T + o, T); g.lineTo(T - o, T); g.closePath();
      g.clip();
      drawStrip(g, rows, e.L, { ...opts, seed: (opts.seed || 1) + i * 101 });
      g.restore();
    });
    return T;
  }

  window.FairIsle = { MOTIFS, PALETTES, STITCHES, buildRows, repeatWidth, drawStrip, drawFrame, shade, mix, hash };
})();

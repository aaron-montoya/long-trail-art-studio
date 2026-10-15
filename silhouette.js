// Silhouette look for the Long Trail tools: a model drawn in one flat color, and a textured low-poly
// background to set it on. Used by the Dog, Gear and Scenes tabs (needs three.js).
(function () {
  const materials = {};
  // One flat, unlit color; double-sided so open shapes (lantern glass) stay solid
  function material(color) {
    if (!materials[color]) materials[color] = new THREE.MeshBasicMaterial({ color, fog: false, side: THREE.DoubleSide });
    return materials[color];
  }

  // Render once with every mesh under `root` in the silhouette color, then put the real materials back,
  // so saving or exporting the 3D model is never affected. Faint see-through parts (a headlamp beam)
  // are left out instead of turning into solid shapes.
  function render(renderer, scene, camera, root, color) {
    const m = material(color), saved = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      saved.push([o, o.material, o.visible]);
      const list = Array.isArray(o.material) ? o.material : [o.material];
      if (list.some(x => x.opacity < 0.3)) o.visible = false;
      o.material = Array.isArray(o.material) ? list.map(() => m) : m;
    });
    try { renderer.render(scene, camera); }
    finally { saved.forEach(([o, mat, visible]) => { o.material = mat; o.visible = visible; }); }
  }

  function hash(x, y, s) {
    let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1103515245);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function rng(a) {
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Low-poly facets shading from `color` toward `shade`, plus a fine paper grain. fr is the card in g's
  // pixels: the facets are sized and placed from it (and spill past it to fill the canvas), so the same
  // card and seed give the same pattern at any size. o: { color, shade, facets (across the card), texture 0-1, seed }
  function drawBackground(g, fr, o) {
    const W = g.canvas.width, H = g.canvas.height, tex = o.texture == null ? 0.5 : o.texture, seed = o.seed || 1;
    const cw = fr.w / (o.facets || 6), rh = cw * 0.9, unit = Math.min(fr.w, fr.h);
    const base = new THREE.Color(o.color), shade = new THREE.Color(o.shade), col = new THREE.Color();
    g.save();
    g.fillStyle = o.color;
    g.fillRect(0, 0, W, H);
    const P = (i, j) => [fr.x + (i + (hash(i, j, seed) - 0.5) * 0.7) * cw, fr.y + (j + (hash(j, i, seed + 5) - 0.5) * 0.7) * rh];
    const tri = (a, b, d, k) => {
      const ty = Math.min(1, Math.max(0, ((a[1] + b[1] + d[1]) / 3 - fr.y) / fr.h)); // a touch more shade toward the bottom
      col.copy(base).lerp(shade, tex * (0.08 + 0.62 * hash(k, 7, seed)) * (0.7 + 0.3 * ty));
      g.fillStyle = g.strokeStyle = '#' + col.getHexString();
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...d); g.closePath(); g.fill(); g.stroke(); // stroke hides hairline seams
    };
    const i0 = Math.floor(-fr.x / cw) - 1, i1 = Math.ceil((W - fr.x) / cw) + 1, j0 = Math.floor(-fr.y / rh) - 1, j1 = Math.ceil((H - fr.y) / rh) + 1;
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      const p = P(i, j), q = P(i + 1, j), s = P(i, j + 1), t = P(i + 1, j + 1), k = ((i + 500) * 1000 + j + 500) * 2;
      if ((i + j) & 1) { tri(p, q, t, k); tri(p, t, s, k + 1); } else { tri(p, q, s, k); tri(q, t, s, k + 1); }
    }
    const r = rng(seed * 31 + 7);
    for (let k = 0, n = Math.round(3000 * tex); k < n; k++) { // grain, placed in card space
      const x = fr.x + (r() * 1.4 - 0.2) * fr.w, y = fr.y + (r() * 1.4 - 0.2) * fr.h, dark = r() < 0.5;
      g.fillStyle = dark ? `rgba(40, 50, 70, ${0.03 + r() * 0.05})` : `rgba(255, 255, 255, ${0.3 + r() * 0.4})`;
      g.fillRect(x, y, unit * 0.003, unit * 0.003);
    }
    g.restore();
  }

  window.Silhouette = { material, render, drawBackground };
})();

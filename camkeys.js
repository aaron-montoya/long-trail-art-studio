// Keyboard camera movement shared by the Long Trail tools.
// W/S forward and back, A/D left and right, E up, Q down; hold Shift to move faster.
// The orbit target moves with the camera, so dragging to orbit afterwards still pivots
// around whatever you were looking at.
function enableCameraKeys(camera, controls, { speed = 5 } = {}) {
  const held = new Set();
  const KEYS = ['w', 'a', 's', 'd', 'q', 'e'];
  // letters typed into a name field or menu shouldn't fly the camera around
  const typing = el => el && (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' ||
                              (el.tagName === 'INPUT' && ['text', 'number', 'search'].includes(el.type)));

  window.addEventListener('keydown', e => {
    if (e.key === 'Shift') { held.add('shift'); return; }
    if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (KEYS.includes(k)) { held.add(k); e.preventDefault(); }
  });
  window.addEventListener('keyup', e => held.delete(e.key === 'Shift' ? 'shift' : e.key.toLowerCase()));
  window.addEventListener('blur', () => held.clear());

  const fwd = new THREE.Vector3(), right = new THREE.Vector3(), move = new THREE.Vector3();
  let last = performance.now();

  // call once per frame, before controls.update()
  return function step() {
    // time-based so speed stays steady even when a big scene drops frames (capped to avoid jumps after a pause)
    const now = performance.now(), dt = Math.min(0.3, (now - last) / 1000);
    last = now;
    move.set(0, 0, 0);
    if (!held.size) return;
    camera.getWorldDirection(fwd);
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, -1); // looking straight down: treat "forward" as into the scene
    fwd.normalize();
    right.set(-fwd.z, 0, fwd.x);
    if (held.has('w')) move.add(fwd);
    if (held.has('s')) move.sub(fwd);
    if (held.has('d')) move.add(right);
    if (held.has('a')) move.sub(right);
    if (held.has('e')) move.y += 1;
    if (held.has('q')) move.y -= 1;
    if (!move.lengthSq()) return;
    move.normalize().multiplyScalar(speed * dt * (held.has('shift') ? 3 : 1));
    camera.position.add(move);
    controls.target.add(move);
  };
}

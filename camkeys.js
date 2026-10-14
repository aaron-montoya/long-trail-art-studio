// Camera controls shared by the Long Trail tools.
//   Keys:  W/S forward and back, A/D left and right, E up, Q down; hold Shift to move faster.
//   Mouse: left-drag turns the view around the point you clicked (or the current center when
//          you click empty sky); right-drag pans; scroll zooms.
// OrbitControls still handles pan and zoom; its target is kept in front of the camera so the two agree.

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

  // Clicking the 3D view must give this page the keyboard. Inside the Art Studio each tool is a frame,
  // and OrbitControls' preventDefault would otherwise leave the keys going to the studio page.
  controls.domElement.addEventListener('pointerdown', () => window.focus(), true);

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

// Left-drag turns the camera around whatever is under the cursor when the drag starts.
// pickTargets() returns the objects that can be clicked on (ground, characters, trees...).
function enableClickOrbit(camera, controls, pickTargets, { speed = 0.005 } = {}) {
  controls.enableRotate = false; // we do the turning; OrbitControls keeps pan + zoom
  // OrbitControls' own up/down limits would yank the camera when looking up; we stop flips ourselves
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI;
  const el = controls.domElement, raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const UP = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion();
  const right = new THREE.Vector3(), fwd = new THREE.Vector3(), offset = new THREE.Vector3();
  let drag = null;

  function pivotAt(e) {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(pickTargets(), true).find(h => h.object.visible !== false && !h.object.isPoints && !h.object.isLine);
    return hit ? hit.point.clone() : controls.target.clone();
  }

  // rotate the camera rigidly about `pivot`, so the clicked point stays under the cursor
  function turn(pivot, axis, angle) {
    q.setFromAxisAngle(axis, angle);
    offset.copy(camera.position).sub(pivot).applyQuaternion(q);
    camera.position.copy(pivot).add(offset);
    camera.quaternion.premultiply(q);
  }

  el.addEventListener('pointerdown', e => {
    // Shift/Ctrl + left-drag still pans (OrbitControls)
    if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.metaKey) return;
    drag = { pivot: pivotAt(e), x: e.clientX, y: e.clientY, id: e.pointerId };
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    turn(drag.pivot, UP, -dx * speed);                        // look left / right
    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    camera.getWorldDirection(fwd);
    const pitch = -dy * speed;
    const newY = fwd.clone().applyAxisAngle(right, pitch).y;
    if (Math.abs(newY) < 0.97) turn(drag.pivot, right, pitch); // look up / down, never flipping over
    // keep OrbitControls' center straight ahead, at the pivot's distance, so pan/zoom continue smoothly
    camera.getWorldDirection(fwd);
    controls.target.copy(camera.position).addScaledVector(fwd, Math.max(0.5, camera.position.distanceTo(drag.pivot)));
  });

  const end = e => { if (drag && e.pointerId === drag.id) drag = null; };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

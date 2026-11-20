/* SublimeHR — Glass Universe: real-time 3D hero (three.js) */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const canvas = document.querySelector("[data-gl]");
const hero = document.querySelector("[data-hero]");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function fail() { document.documentElement.classList.add("no-gl"); }

try {
  if (!canvas) throw 0;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(1.6, devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* lights add colour to the glass */
  const l1 = new THREE.PointLight(0x46d3c7, 60, 30); l1.position.set(4, 3, 4); scene.add(l1);
  const l2 = new THREE.PointLight(0x4c8fe0, 70, 30); l2.position.set(-5, -2, 3); scene.add(l2);
  const l3 = new THREE.PointLight(0x8c7cf0, 40, 30); l3.position.set(0, 5, -4); scene.add(l3);

  /* world group: shifted right on desktop so text sits left */
  const world = new THREE.Group(); scene.add(world);

  /* 1. breathing iridescent glass core */
  const coreGeo = new THREE.IcosahedronGeometry(1.35, 24);
  const base = coreGeo.attributes.position.array.slice();
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.08, roughness: 0.06, transmission: 0.96, thickness: 2.2, ior: 1.5,
    iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 520], clearcoat: 1, clearcoatRoughness: 0.05,
    envMapIntensity: 1.4, attenuationColor: new THREE.Color(0x7fc8ff), attenuationDistance: 4.5
  });
  const core = new THREE.Mesh(coreGeo, coreMat); world.add(core);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), new THREE.MeshBasicMaterial({ color: 0x5fe3d6, transparent: true, opacity: 0.55 }));
  world.add(glow);

  /* 2. orbit rings */
  const ringMat = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o });
  const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.008, 8, 200), ringMat(0x46d3c7, 0.55)); r1.rotation.x = 1.25; world.add(r1);
  const r2 = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.006, 8, 220), ringMat(0x4c8fe0, 0.4)); r2.rotation.set(1.05, 0.4, 0); world.add(r2);
  const beads = [];
  [[r1, 2.25, 0x9ff5ec], [r2, 2.9, 0xa9cbff]].forEach(([ring, rad, c]) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshBasicMaterial({ color: c })); ring.add(b); beads.push([b, rad, Math.random() * 6]);
  });

  /* 3. stardust */
  const DUST = 900, pos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { const r = 4 + Math.random() * 14, a = Math.random() * Math.PI * 2, y = (Math.random() - .5) * 12; pos.set([Math.cos(a) * r, y, Math.sin(a) * r - 4], i * 3); }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xbfe8ff, size: 0.035, transparent: true, opacity: 0.8, depthWrite: false }));
  scene.add(dust);

  /* 4. glass HR cards (live canvas textures) */
  const pad = (n) => (n < 10 ? "0" : "") + n;
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  const F = "600 30px Sora, Inter, sans-serif", FS = "500 22px Inter, sans-serif";
  const cardDefs = [
    { t: "Clock in", draw(c, w, h) { const d = new Date(); text(c, "LIVE ATTENDANCE", 34, 54, "#7FE8DD", "600 18px JetBrains Mono, monospace"); text(c, pad(d.getHours()) + ":" + pad(d.getMinutes()), 34, 128, "#fff", "700 64px Sora, sans-serif"); pill(c, 34, 160, "✓ Selfie · GPS · Geofence", "#46D3C7"); text(c, "396 of 412 present", 34, 232, "#B8C7DD", FS); } },
    { t: "Leave", draw(c) { text(c, "LEAVE REQUEST", 34, 54, "#A9C9FF", "600 18px JetBrains Mono, monospace"); avatar(c, 58, 116, "OM", "#8C7CF0"); text(c, "Omar M.", 100, 108, "#fff", F); text(c, "Annual · 23–24 Apr", 100, 140, "#B8C7DD", FS); pill(c, 34, 176, "Approved ✓", "#46D3C7"); } },
    { t: "Payslip", draw(c) { text(c, "PAYSLIP · MARCH", 34, 54, "#FFD39A", "600 18px JetBrains Mono, monospace"); text(c, "Net pay", 34, 104, "#B8C7DD", FS); text(c, "5,215.00", 34, 160, "#fff", "700 54px Sora, sans-serif"); bar(c, 34, 196, 360, .82, "#4C8FE0"); text(c, "Sent to 412 phones", 34, 244, "#B8C7DD", FS); } },
    { t: "Profile", draw(c) { avatar(c, 74, 104, "SN", "#3FBDB3", 40); text(c, "Sara Nasser", 130, 96, "#fff", F); text(c, "Finance · Dubai", 130, 128, "#B8C7DD", FS); pill(c, 34, 168, "14 days leave left", "#4C8FE0"); text(c, "Joined 2023 · ID 0142", 34, 240, "#B8C7DD", FS); } },
    { t: "Shift", draw(c) { text(c, "NIGHT SHIFT · THU", 34, 54, "#C9BEFF", "600 18px JetBrains Mono, monospace"); avatar(c, 58, 112, "RV", "#4C8FE0"); text(c, "⇄", 108, 124, "#fff", "700 40px Sora"); avatar(c, 182, 112, "KJ", "#3FBDB3"); text(c, "Swap approved", 34, 196, "#fff", F); text(c, "Coverage OK", 34, 234, "#B8C7DD", FS); } },
    { t: "Reports", draw(c) { text(c, "HEADCOUNT", 34, 54, "#7FE8DD", "600 18px JetBrains Mono, monospace"); text(c, "+4.2%", 34, 116, "#fff", "700 52px Sora, sans-serif"); [40, 62, 52, 80, 96].forEach((v, i) => { c.fillStyle = i === 4 ? "#46D3C7" : "rgba(127,180,255,.75)"; rr(c, 34 + i * 62, 250 - v * 1.2, 40, v * 1.2, 8); c.fill(); }); } }
  ];
  function text(c, s, x, y, col, f) { c.fillStyle = col; c.font = f; c.fillText(s, x, y); }
  function pill(c, x, y, s, col) { c.font = "600 22px Inter, sans-serif"; const w = c.measureText(s).width + 32; c.fillStyle = col + "33"; rr(c, x, y, w, 40, 20); c.fill(); c.fillStyle = col; c.fillText(s, x + 16, y + 28); }
  function avatar(c, x, y, s, col, r = 26) { c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = "#06121A"; c.font = "700 " + (r * .7 | 0) + "px Inter"; c.textAlign = "center"; c.fillText(s, x, y + r * .25); c.textAlign = "left"; }
  function bar(c, x, y, w, p, col) { c.fillStyle = "rgba(255,255,255,.12)"; rr(c, x, y, w, 12, 6); c.fill(); c.fillStyle = col; rr(c, x, y, w * p, 12, 6); c.fill(); }
  const CW = 460, CH = 280;
  const cards = cardDefs.map((def, i) => {
    const cv = document.createElement("canvas"); cv.width = CW; cv.height = CH;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const paint = () => {
      const c = cv.getContext("2d"); c.clearRect(0, 0, CW, CH);
      const g = c.createLinearGradient(0, 0, CW, CH); g.addColorStop(0, "rgba(40,62,96,.88)"); g.addColorStop(1, "rgba(14,24,44,.82)");
      c.fillStyle = g; rr(c, 2, 2, CW - 4, CH - 4, 34); c.fill();
      c.strokeStyle = "rgba(255,255,255,.28)"; c.lineWidth = 2.5; rr(c, 2, 2, CW - 4, CH - 4, 34); c.stroke();
      const hl = c.createLinearGradient(0, 0, 0, CH * .5); hl.addColorStop(0, "rgba(255,255,255,.14)"); hl.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = hl; rr(c, 2, 2, CW - 4, CH * .5, 34); c.fill();
      def.draw(c, CW, CH); tex.needsUpdate = true;
    };
    paint();
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.75, 1.75 * CH / CW), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    const a = i / cardDefs.length * Math.PI * 2;
    mesh.userData = { a, r: 2.75 + (i % 2) * .45, y: ((i % 3) - 1) * 1.25, sp: .06 + (i % 3) * .015, paint };
    world.add(mesh); return mesh;
  });
  document.fonts && document.fonts.ready.then(() => cards.forEach((m) => m.userData.paint()));
  setInterval(() => cards[0].userData.paint(), 20000);

  /* sizing + layout */
  let W = 0, H = 0;
  function size() {
    const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
    const narrow = W < 860;
    world.position.set(narrow ? 0 : 2.75, narrow ? 2.35 : 0, 0);
    world.scale.setScalar(narrow ? .56 : 1);
  }
  size(); addEventListener("resize", size);

  /* interaction: gentle parallax (no push) + scroll fly-through */
  let mx = 0, my = 0, sx = 0, sy = 0, prog = 0, visible = true;
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  function onScroll() {
    const r = hero.getBoundingClientRect(), total = r.height - innerHeight;
    prog = Math.min(1, Math.max(0, -r.top / total)); visible = r.bottom > 0;
    document.documentElement.style.setProperty("--hp", prog.toFixed(3));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const clock = new THREE.Clock();
  let t = 0;
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    const dt = Math.min(.05, clock.getDelta()); t += reduce ? 0 : dt;
    // breathing core: soft travelling waves over the surface
    const p = coreGeo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const x = base[i], y = base[i + 1], z = base[i + 2];
      const n = 1 + .09 * Math.sin(x * 2.1 + t * 1.3) * Math.cos(y * 2.4 + t * 1.1) + .05 * Math.sin(z * 3 + t * 1.7);
      p[i] = x * n; p[i + 1] = y * n; p[i + 2] = z * n;
    }
    coreGeo.attributes.position.needsUpdate = true; coreGeo.computeVertexNormals();
    core.rotation.y = t * .18; core.rotation.x = Math.sin(t * .3) * .2;
    glow.scale.setScalar(1 + Math.sin(t * 2) * .06);
    r1.rotation.z = t * .25; r2.rotation.z = -t * .18;
    beads.forEach(([b, rad, o]) => { const a = t * .9 + o; b.position.set(Math.cos(a) * rad, Math.sin(a) * rad, 0); });
    dust.rotation.y = t * .015;
    // cards orbit and always face the camera
    cards.forEach((m) => { const u = m.userData, a = u.a + t * u.sp; m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t * .6 + u.a) * .18, Math.sin(a) * u.r); m.quaternion.copy(camera.quaternion); });
    // camera: auto drift + parallax + scroll fly-through
    sx += (mx - sx) * .04; sy += (my - sy) * .04;
    const fly = prog * prog;
    camera.position.x = sx * 1.4 + Math.sin(t * .2) * .3 + (W < 860 ? 0 : fly * 2.6);
    camera.position.y = -sy * 1 + Math.cos(t * .17) * .2 + fly * .4;
    camera.position.z = 9 - fly * 6.6;
    camera.lookAt(W < 860 ? 0 : 1.2 + fly * 1.4, W < 860 ? .6 : 0, 0);
    renderer.render(scene, camera);
  });
  document.documentElement.classList.add("has-gl");
} catch (e) { fail(); }

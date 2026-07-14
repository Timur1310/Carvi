/* ============================================================
   Carvi — low-poly 3D sports coupe in the homepage hero.
   Progressive enhancement over the hero image:
   • skipped entirely on prefers-reduced-motion or no WebGL
   • Three.js lazy-loaded from CDN only after window load
   • pauses when offscreen (IntersectionObserver) or tab hidden
   • the hero <img> stays as the graceful fallback
   ============================================================ */
(function () {
  var mount = document.getElementById('hero3d');
  var art = document.querySelector('.hero-art');
  if (!mount || !art) return;

  // 1) respect reduced-motion → keep the static image
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 2) bail if WebGL is unavailable → keep the static image
  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  }
  if (!hasWebGL()) return;

  // 3) lazy-load Three.js after the page has loaded (never render-blocking)
  function loadThree() {
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.defer = true;
    s.onload = init;
    s.onerror = function () { /* keep the image fallback */ };
    document.head.appendChild(s);
  }
  if (document.readyState === 'complete') loadThree();
  else window.addEventListener('load', loadThree, { once: true });

  function init() {
    if (!window.THREE) return;
    var THREE = window.THREE;

    var W = mount.clientWidth || 640, H = mount.clientHeight || 274;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(0, 2.15, 8.2);
    camera.lookAt(0, 0.5, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // cap pixelRatio at 2
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;';
    mount.appendChild(renderer.domElement);

    // ── lights: ambient + one directional ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.78));
    var dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(5, 9, 6);
    scene.add(dir);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9a927f, 0.25));

    // ── palette (from css/styles.css accents + hero navy) ──
    var COL_BODY = 0x34557d, COL_TIRE = 0x1a1a1e, COL_RIM = 0xcbc3b0,
        COL_HEAD = 0xffd38a, COL_TAIL = 0xff4d4d, COL_GLASS = 0x1f2b3a;

    var car = new THREE.Group();

    // body: extrude a coupe side-profile → low-poly faceted volume
    var p = new THREE.Shape();
    p.moveTo(2.00, 0.15);
    p.lineTo(2.05, 0.35);
    p.lineTo(1.90, 0.48);
    p.lineTo(1.15, 0.52);
    p.lineTo(0.80, 0.54);
    p.lineTo(0.30, 0.94);
    p.lineTo(-0.25, 0.95);
    p.lineTo(-1.35, 0.66);
    p.lineTo(-1.85, 0.56);
    p.lineTo(-2.02, 0.46);
    p.lineTo(-2.02, 0.15);
    p.lineTo(2.00, 0.15);
    var bodyGeo = new THREE.ExtrudeGeometry(p, { depth: 1.7, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 1 });
    bodyGeo.translate(0, 0, -0.85);
    var bodyMat = new THREE.MeshStandardMaterial({ color: COL_BODY, roughness: 0.55, metalness: 0.2, flatShading: true });
    car.add(new THREE.Mesh(bodyGeo, bodyMat));

    // glass greenhouse (subtle darker cabin strip)
    var gp = new THREE.Shape();
    gp.moveTo(0.78, 0.56); gp.lineTo(0.33, 0.90); gp.lineTo(-0.22, 0.91); gp.lineTo(-1.15, 0.66); gp.lineTo(0.78, 0.56);
    var glassGeo = new THREE.ExtrudeGeometry(gp, { depth: 1.5, bevelEnabled: false });
    glassGeo.translate(0, 0, -0.75);
    car.add(new THREE.Mesh(glassGeo, new THREE.MeshStandardMaterial({ color: COL_GLASS, roughness: 0.25, metalness: 0.1, flatShading: true })));

    // wheels: tire + rim
    function wheel(x, z) {
      var g = new THREE.Group();
      var tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.30, 20), new THREE.MeshStandardMaterial({ color: COL_TIRE, roughness: 0.85, flatShading: true }));
      tire.rotation.x = Math.PI / 2;
      g.add(tire);
      var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.32, 8), new THREE.MeshStandardMaterial({ color: COL_RIM, roughness: 0.4, metalness: 0.6, flatShading: true }));
      rim.rotation.x = Math.PI / 2;
      g.add(rim);
      g.position.set(x, 0.42, z);
      return g;
    }
    car.add(wheel(1.28, 0.86)); car.add(wheel(1.28, -0.86));
    car.add(wheel(-1.28, 0.86)); car.add(wheel(-1.28, -0.86));

    // lights
    var headMat = new THREE.MeshStandardMaterial({ color: COL_HEAD, emissive: COL_HEAD, emissiveIntensity: 0.8, flatShading: true });
    var tailMat = new THREE.MeshStandardMaterial({ color: COL_TAIL, emissive: COL_TAIL, emissiveIntensity: 0.7, flatShading: true });
    [0.55, -0.55].forEach(function (z) {
      var hl = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.18), headMat); hl.position.set(2.02, 0.44, z); car.add(hl);
      var tl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.22), tailMat); tl.position.set(-2.04, 0.5, z); car.add(tl);
    });

    car.rotation.y = -0.55;
    scene.add(car);

    // soft round shadow under the car (radial-gradient sprite, no shadow maps)
    var sc = document.createElement('canvas'); sc.width = sc.height = 128;
    var sx = sc.getContext('2d');
    var grd = sx.createRadialGradient(64, 64, 6, 64, 64, 62);
    grd.addColorStop(0, 'rgba(20,18,12,0.42)'); grd.addColorStop(1, 'rgba(20,18,12,0)');
    sx.fillStyle = grd; sx.fillRect(0, 0, 128, 128);
    var shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 3.4),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01;
    scene.add(shadow);

    // ── interaction: drag / swipe to spin, auto-rotation resumes ──
    var AUTO = 0.0045, dragging = false, lastX = 0, userVel = 0;
    var dom = renderer.domElement;
    dom.addEventListener('pointerdown', function (e) {
      dragging = true; lastX = e.clientX; userVel = 0; dom.style.cursor = 'grabbing';
      try { dom.setPointerCapture(e.pointerId); } catch (_) {}
    });
    dom.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var d = (e.clientX - lastX) * 0.008; lastX = e.clientX;
      car.rotation.y += d; userVel = d;
    });
    function endDrag() { dragging = false; dom.style.cursor = 'grab'; }
    dom.addEventListener('pointerup', endDrag);
    dom.addEventListener('pointercancel', endDrag);

    // ── run only when visible & tab active ──
    var inView = true, tabActive = !document.hidden, raf = 0;
    function frame() {
      if (!dragging) { car.rotation.y += AUTO + userVel; userVel *= 0.9; }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function update() {
      var run = inView && tabActive;
      if (run && !raf) raf = requestAnimationFrame(frame);
      else if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) { inView = ents[0].isIntersecting; update(); }, { threshold: 0.05 }).observe(mount);
    }
    document.addEventListener('visibilitychange', function () { tabActive = !document.hidden; update(); });

    // responsive
    function resize() {
      var w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', resize);

    // reveal 3D, fade the fallback image
    renderer.render(scene, camera);
    art.classList.add('show3d');
    update();
  }
})();

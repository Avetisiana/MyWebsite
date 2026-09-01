/* Fond "soie" verte animé (WebGL, aucune dépendance). Même effet sur desktop ET mobile,
   sur les 3 surfaces : hero, footer, bloc étude de cas.
   - hero : canvas OPAQUE (le shader dessine l'ivoire + la soie) -> compositing fiable partout.
   - footer / étude de cas : canvas transparent, sortie prémultipliée (`vec4(rgb*a, a)`) -> fiable
     iOS Safari inclus ; raccord des bords géré par mask-image en CSS.
   Se coupe tout seul : prefers-reduced-motion, onglet caché, élément hors écran, WebGL absent,
   perte de contexte. Mobile : DPR ≤ 1,25 et rendu 0,5× (économie), chaque canvas en pause hors écran.
   <canvas class="silk-canvas"> : data-opaque ("1" = fond opaque), data-dark ("1" = surface foncée),
   data-strength (multiplicateur d'intensité). Servi tel quel (CSP : script-src 'self'). Max 4. */
(function () {
  'use strict';

  var list = document.querySelectorAll('.silk-canvas');
  if (!list.length) return;

  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mqReduce && mqReduce.matches) return;
  var isMobile = !!(window.matchMedia && window.matchMedia('(max-width: 640px)').matches);

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 u_res;uniform float u_time;uniform float u_dark;uniform float u_strength;uniform float u_opaque;',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/u_res;',
    ' vec2 asp=u_res/min(u_res.x,u_res.y);', // corrige l'aspect -> densité de plis constante (portrait inclus)
    ' vec2 p=uv*asp*3.4;',
    ' float t=u_time*0.10;',
    ' for(int i=1;i<6;i++){',
    '   float fi=float(i);',
    '   p.x+=0.62/fi*sin(fi*2.3*p.y+t)+0.35;',
    '   p.y+=0.62/fi*cos(fi*1.7*p.x+t*1.1)+0.28;',
    ' }',
    ' float folds=0.5+0.5*sin(p.x+p.y);',
    ' float streak=pow(0.5+0.5*sin(p.x*1.7-p.y*0.6+t*2.4),3.0);',
    ' float glow=pow(folds,1.6);',
    ' vec3 lo=mix(vec3(0.086,0.188,0.157),vec3(0.176,0.322,0.271),u_dark);',
    ' vec3 hi=mix(vec3(0.404,0.556,0.478),vec3(0.62,0.71,0.63),u_dark);',
    ' vec3 tint=mix(lo,hi,clamp(glow*0.45+streak*0.6,0.0,1.0));',
    ' float a=glow*0.14+streak*0.11;',
    // hero : dissipation continue du haut (plein, derrière le nav) vers le bas (0), très progressive
    ' float fadeBot=pow(smoothstep(0.0,mix(0.14,1.0,u_opaque),uv.y),mix(1.0,1.8,u_opaque));',
    ' a*=fadeBot;',                                                           // pas de fondu gauche/droite
    ' float cd=mix(0.46+0.54*smoothstep(0.14,0.66,length((uv-vec2(0.5,0.46))*vec2(1.15,1.55))),1.0,u_dark);',
    ' a*=cd*u_strength;',
    ' float peak=mix(0.46,0.16,u_dark);',
    ' float A=clamp(a,0.0,peak);',
    ' vec3 ivory=vec3(0.980,0.965,0.937);',
    // transparent -> prémultiplié (vec4(rgb*a, a)) ; opaque -> ivoire mélangé, alpha ignoré
    ' gl_FragColor=mix(vec4(tint*A,A),vec4(mix(ivory,tint,A),1.0),u_opaque);',
    '}'
  ].join('\n');

  var pausers = [];

  function initSilk(canvas) {
    var dark = canvas.getAttribute('data-dark') === '1' ? 1 : 0;
    var opaque = canvas.hasAttribute('data-opaque') ? 1 : 0;
    var strength = parseFloat(canvas.getAttribute('data-strength'));
    if (isNaN(strength)) strength = 1;
    if (!isMobile) strength *= 0.78; // desktop un cran plus discret ; mobile inchangé

    var opts = {
      alpha: !opaque, premultipliedAlpha: true, preserveDrawingBuffer: true,
      antialias: false, depth: false, stencil: false, powerPreference: 'low-power'
    };
    var gl = canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
    if (!gl) {
      // WebGL indisponible (Chrome sans accélération matérielle, GPU blocklisté, très vieux appareil)
      // -> fallback CSS animé pour le hero (voir .silk-css dans styles/main.css)
      if (canvas.hasAttribute('data-opaque')) document.documentElement.classList.add('silk-css');
      return;
    }

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'u_res');
    var uTime = gl.getUniformLocation(prog, 'u_time');
    gl.uniform1f(gl.getUniformLocation(prog, 'u_dark'), dark);
    gl.uniform1f(gl.getUniformLocation(prog, 'u_strength'), strength);
    gl.uniform1f(gl.getUniformLocation(prog, 'u_opaque'), opaque);
    // évite un flash noir sur le canvas opaque avant la 1re frame
    if (opaque) gl.clearColor(0.980, 0.965, 0.937, 1.0);
    else gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.5);
    var SCALE = isMobile ? 0.5 : 0.55;
    var sized = false;
    function resize() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) { sized = false; return; }
      canvas.width = Math.max(2, Math.round(w * DPR * SCALE));
      canvas.height = Math.max(2, Math.round(h * DPR * SCALE));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      sized = true;
    }

    var raf = 0, playing = false, elapsed = 0, last = 0;
    var inView = false, visible = true, alive = true;

    function loop(now) {
      if (!playing) return;
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      elapsed += dt;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (playing || !alive || !inView || !visible || !sized) return;
      playing = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }
    function pause() {
      playing = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    pausers.push(function () { alive = false; pause(); });

    resize();
    if (window.ResizeObserver) new ResizeObserver(function () { resize(); play(); }).observe(canvas);
    else window.addEventListener('resize', function () { resize(); play(); });

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        inView = entries[entries.length - 1].isIntersecting;
        inView ? play() : pause();
      }, { threshold: 0.01, rootMargin: '120px' }).observe(canvas);
    } else {
      inView = true;
      play();
    }
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      visible ? play() : pause();
    });
    canvas.addEventListener('webglcontextlost', function (ev) {
      ev.preventDefault();
      alive = false;
      pause();
    }, false);
  }

  var max = Math.min(list.length, 4);
  for (var i = 0; i < max; i++) initSilk(list[i]);

  if (mqReduce && mqReduce.addEventListener) {
    mqReduce.addEventListener('change', function (e) {
      if (e.matches) pausers.forEach(function (f) { f(); });
    });
  }
})();

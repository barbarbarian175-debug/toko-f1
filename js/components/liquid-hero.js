/* =========================================================
   LIQUID GRADIENT - cahaya blur transparan di DALAM pinggiran
   kotak hero (versi JavaScript biasa dari komponen Liquid).
   Ganti warna di COLORS, lebar cahaya di EDGE_WIDTH,
   kekuatan di CSS .hero-liquid-edge { opacity }.
   ========================================================= */
(function () {
    'use strict';

    /* warna terang/transparan (putih kebiruan sangat lembut) */
    var COLORS = ['#FFFFFF', '#F3E9F7', '#D9D4EC', '#FFFFFF', '#E6E1F3', '#FDF1F5', '#C9C4E2', '#FFFFFF'];
    var EDGE_WIDTH = 120;     /* seberapa jauh cahaya masuk ke dalam kotak (px) */
    var MAX_ALPHA = 0.9;     /* ketebalan cahaya di pinggir paling luar (0 - 1) */

    var hero = document.querySelector('#home-page .hero');
    if (!hero || hero.querySelector('.hero-liquid-edge')) return;

    function hexToRgb(h) {
        var n = parseInt(h.slice(1), 16);
        return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    }

    var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FRAG = [
        'precision mediump float;',
        'uniform vec2 r;uniform float t;uniform float rad;uniform float w;uniform float amax;uniform vec3 c[9];',
        'vec3 pal(float f){',
        '  f=fract(f)*8.;vec3 col=c[0];',
        '  for(int i=0;i<8;i++){',
        '    vec3 a=c[i];vec3 b=c[i+1];',
        '    if(f>=float(i)&&f<float(i)+1.)col=mix(a,b,smoothstep(float(i),float(i)+1.,f));',
        '  }',
        '  return col;',
        '}',
        'float sdBox(vec2 p,vec2 b,float rr){vec2 q=abs(p)-b+rr;return length(max(q,0.))+min(max(q.x,q.y),0.)-rr;}',
        'void main(){',
        '  vec2 fc=gl_FragCoord.xy;',
        '  float depth=-sdBox(fc-r*.5,r*.5,rad);',      /* jarak ke pinggir, positif = di dalam */
        '  float edge=1.-smoothstep(0.,w,depth);',
        '  edge=edge*edge*(3.-2.*edge);',
        '  vec2 q=fc/r.y*2.4;',
        '  for(int i=0;i<4;i++){',
        '    float fi=float(i)+1.;',
        '    q+=vec2(sin(q.y*1.3*fi+t*.55+fi),cos(q.x*1.1*fi-t*.45))*.55/fi;',
        '  }',
        '  float v=.5+.5*sin(q.x*1.4+q.y*1.1+t*.3);',
        '  vec3 col=pal(v);',
        '  float rib=pow(.5+.5*sin(q.x*2.6+q.y*1.7-t*.5),5.);',   /* garis-garis cahaya mengkilap */
        '  col=mix(col,vec3(1.),rib*.8);',
        '  float a=edge*amax*(.4+.6*v+.5*rib);',
        '  a=clamp(a,0.,1.);',
        '  gl_FragColor=vec4(col*a,a);',                /* premultiplied alpha */
        '}'
    ].join('\n');

    var canvas = document.createElement('canvas');
    canvas.className = 'hero-liquid-edge';
    canvas.setAttribute('aria-hidden', 'true');
    hero.insertBefore(canvas, hero.firstChild);

    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) { canvas.remove(); return; }
    function sh(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.remove(); return; }
    var pr = gl.createProgram();
    gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['r', 't', 'rad', 'w', 'amax', 'c'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var flat = [];
    COLORS.concat(COLORS[0]).forEach(function (h) { flat.push.apply(flat, hexToRgb(h)); });
    gl.uniform3fv(U.c, new Float32Array(flat));

    var SCALE = 0.5;
    function draw(time) {
        var w = Math.max(2, Math.round(canvas.clientWidth * SCALE));
        var h = Math.max(2, Math.round(canvas.clientHeight * SCALE));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        var radius = parseFloat(getComputedStyle(hero).borderTopLeftRadius) || 30;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.r, w, h);
        gl.uniform1f(U.t, time);
        gl.uniform1f(U.rad, radius * SCALE);
        gl.uniform1f(U.w, EDGE_WIDTH * SCALE);
        gl.uniform1f(U.amax, MAX_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var speed = 1, target = 1, time = 0, last = 0, visible = true, raf = 0;
    hero.addEventListener('mouseenter', function () { target = 3; });
    hero.addEventListener('mouseleave', function () { target = 1; });

    function frame(now) {
        raf = 0;
        if (!visible || document.hidden) return;
        var dt = last ? Math.min(.05, (now - last) / 1000) : 0;
        last = now;
        speed += (target - speed) * .06;
        time += dt * speed;
        draw(time);
        if (!reduce) raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
            visible = e[0].isIntersecting;
            if (visible) start();
        }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) start(); });
    window.addEventListener('resize', start);
    start();
})();
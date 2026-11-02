import React, { CSSProperties, useEffect, useRef } from 'react';
import './Galaxy.css';

const MAX_LAYERS = 4;
const MAX_COLORS = 4;
const INTRO_SECONDS = 1.8;

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
precision mediump int;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform vec2 uVelocity;
uniform float uGloss;
uniform float uDepth;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uStarGlow;
uniform float uFlareGain;
uniform float uSquash;
uniform float uSaturation;
uniform float uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationAngle;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform int uLayers;
uniform vec3 uColors[${MAX_COLORS}];
uniform int uColorCount;
uniform float uWarp;
uniform float uReveal;
uniform float uMode;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare, vec2 radial, float invReach) {
#ifdef WARP
  float along = dot(uv, radial);
  float d = sqrt(max(dot(uv, uv) - uSquash * along * along, 0.0001));
#else
  float d = length(uv) + 0.0001;
#endif
  float m = uStarGlow / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uFlareGain;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uFlareGain;
  m *= smoothstep(1.0, 0.2, d * invReach);
#ifdef WARP
  m *= mix(1.0, smoothstep(1.0, 0.55, length(uv) * invReach), min(uWarp * 4.0, 1.0));
#endif
  return m;
}

vec3 StarLayer(vec2 uv, vec2 radial, vec2 repelAt, float pushCells, float spread) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uGloss / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

#ifdef PALETTE
      float pick = Hash21(si + 7.0) * float(uColorCount);
      vec3 base = uColors[int(min(floor(pick), float(uColorCount - 1)))];
#else
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / 6.28318 + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
#endif

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      vec2 shift = vec2(0.0);
      float invReach = 1.0;
#ifdef REPEL
      vec2 away = si + 0.5 + pad - repelAt;
      float dist = length(away);
      float q = dist * spread;
      float cells = pushCells * exp(-q * q);
      float moved = cells * inversesqrt(1.0 + cells * cells * 2.78);
      shift = away * (moved / max(dist, 0.0001));
      invReach = 1.0 / (1.0 - moved);
#endif
      float star = Star(gv - offset - pad - shift, flareSize, radial, invReach);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      col += star * twinkle * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution;
  vec2 uv = (gl_FragCoord.xy - focalPx) / uResolution.y;

  vec2 repelAt = vec2(0.0);
  float strength = 0.0;
  float push = 0.0;
  if (uAutoCenterRepulsion > 0.0) {
    strength = uAutoCenterRepulsion;
    push = strength * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    repelAt = (uMouse * uResolution - focalPx) / uResolution.y;
    strength = max(uRepulsionStrength, 0.0);
    push = strength * 0.05 * uMouseActiveFactor;
  }
  float radius = 0.16 + 0.04 * strength;

  vec2 radial = length(uv) > 0.0001 ? normalize(uv) : vec2(1.0, 0.0);
  float angle = uRotationAngle;
  mat2 rotAngle = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  mat2 rotFixed = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x);
  mat2 fullRot = rotFixed * rotAngle;

  uv = fullRot * uv;
  radial = fullRot * radial;
  repelAt = fullRot * repelAt;

  vec3 col = vec3(0.0);
  float layers = float(uLayers);
  for (int k = 0; k < ${MAX_LAYERS}; k++) {
    if (k >= uLayers) break;
    float i = float(k) / layers;
    float depth = fract(i + uDepth);
    float scale = mix(16.0 * uDensity, 0.6 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    vec2 offset = vec2(i * 453.32) + uVelocity * uTime * 0.12;
    col += StarLayer(uv * scale + offset, radial, repelAt * scale + offset, push * scale, 1.0 / (scale * radius)) * fade;
  }
  col *= uReveal;

  if (uMode > 0.5) {
    float alpha = min(smoothstep(0.0, 0.08, length(col)), 1.0) * uOpacity;
    outColor = vec4(col * uOpacity, alpha);
  } else {
    outColor = vec4(mix(uBackground, col, uOpacity), 1.0);
  }
}`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const keyOf = (palette: boolean, repel: boolean, warp: boolean) =>
  (palette ? 4 : 0) + (repel ? 2 : 0) + (warp ? 1 : 0);

const start = (gl: WebGL2RenderingContext, palette: boolean, repel: boolean, warp: boolean) => {
  const defines = `${palette ? '#define PALETTE\n' : ''}${repel ? '#define REPEL\n' : ''}${warp ? '#define WARP\n' : ''}`;
  const program = gl.createProgram();
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  if (!program || !vertex || !fragment) return null;
  gl.shaderSource(vertex, VERTEX);
  gl.shaderSource(fragment, FRAGMENT.replace('\n', `\n${defines}`));
  gl.compileShader(vertex);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
};

const finish = (gl: WebGL2RenderingContext, program: WebGLProgram) => {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name.replace('[0]', '')] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
};

// Fast hex/color converter with zero GC/probe overhead
function hexToRgb(str: string): [number, number, number] {
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return [r, g, b];
    } else if (hex.length >= 6) {
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return [r, g, b];
    }
  }
  return [1, 1, 1];
}

export interface GalaxyProps {
  focal?: [number, number];
  rotation?: [number, number];
  velocity?: [number, number];
  starSpeed?: number;
  density?: number;
  hueShift?: number;
  disableAnimation?: boolean;
  speed?: number;
  mouseInteraction?: boolean;
  glowIntensity?: number;
  saturation?: number;
  mouseRepulsion?: boolean;
  repulsionStrength?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  autoCenterRepulsion?: number;
  transparent?: boolean;
  lightMode?: boolean;
  starColors?: string[];
  starSize?: number;
  flareIntensity?: number;
  layers?: number;
  direction?: 'forward' | 'backward';
  clickWarp?: boolean;
  intro?: boolean;
  backgroundColor?: string;
  opacity?: number;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: any;
}

const Galaxy: React.FC<GalaxyProps> = ({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  velocity = [0.0, 0.0],
  starSpeed = 0.35,
  density = 1.0,
  hueShift = 0,
  disableAnimation = false,
  speed = 0.8,
  mouseInteraction = false,
  glowIntensity = 0.34,
  saturation = 0.0,
  mouseRepulsion = false,
  repulsionStrength = 0,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.005,
  autoCenterRepulsion = 0,
  transparent = true,
  lightMode = false,
  starColors = ['#ffffff', '#f8fafc', '#e2e8f0'],
  starSize = 0.95,
  flareIntensity = 0.85,
  layers = 3,
  direction = 'forward',
  clickWarp = false,
  intro = false,
  backgroundColor = '#000000',
  opacity = 1,
  dpr = 0.85,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const palette = Array.isArray(starColors) ? starColors.filter(Boolean).slice(0, MAX_COLORS) : [];

  const settings = {
    focal: Array.isArray(focal) ? focal : [0.5, 0.5],
    rotation: Array.isArray(rotation) ? rotation : [1, 0],
    velocity: Array.isArray(velocity) ? velocity : [0.0, 0.0],
    starSpeed,
    density: Math.max(0.01, density),
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity: Math.max(0, glowIntensity),
    saturation: Math.max(0, saturation),
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity: clamp(twinkleIntensity, 0, 1),
    rotationSpeed,
    autoCenterRepulsion: Math.max(0, autoCenterRepulsion),
    transparent,
    lightMode,
    palette,
    starSize: Math.max(0, starSize),
    flareIntensity: Math.max(0, flareIntensity),
    layers: clamp(Math.round(layers), 2, MAX_LAYERS),
    reverse: direction === 'backward',
    clickWarp,
    intro,
    backgroundColor,
    opacity: clamp(opacity, 0, 1),
    dpr: clamp(dpr, 0.5, 1.0)
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance'
    });
    if (!container || !canvas || !gl) return undefined;

    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    const programs = new Map<number, { program: WebGLProgram | null; linked: any; done: boolean }>();
    const entry = (hasPalette: boolean, repel: boolean, warp: boolean) => {
      const key = keyOf(hasPalette, repel, warp);
      let found = programs.get(key);
      if (!found) {
        found = { program: start(gl, hasPalette, repel, warp), linked: null, done: false };
        programs.set(key, found);
      }
      return found;
    };
    const variant = (hasPalette: boolean, repel: boolean, warp: boolean, wait: boolean) => {
      const found = entry(hasPalette, repel, warp);
      if (!found.done && found.program) {
        if (!wait && parallel && !gl.getProgramParameter(found.program, parallel.COMPLETION_STATUS_KHR)) return null;
        found.linked = finish(gl, found.program);
        found.done = true;
      }
      return found.linked;
    };
    const initial = settingsRef.current;
    if (!variant(initial.palette.length > 0, false, false, true)) {
      programs.forEach(found => found.program && gl.deleteProgram(found.program));
      return undefined;
    }

    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const colors = new Float32Array(MAX_COLORS * 3);
    const pointer = { x: 0.5, y: 0.5, inside: false };
    const state = {
      time: 0,
      gloss: 0,
      depth: 0,
      angle: 0,
      mx: 0.5,
      my: 0.5,
      active: 0,
      boost: 0,
      reveal: settingsRef.current.intro ? 0 : 1
    };
    let raf = 0;
    let last = 0;
    let visible = true;

    // Cache palette colors upfront
    initial.palette.forEach((val, idx) => {
      const [r, g, b] = hexToRgb(val);
      colors[idx * 3] = r;
      colors[idx * 3 + 1] = g;
      colors[idx * 3 + 2] = b;
    });

    const render = () => {
      const s = settingsRef.current;
      const mode = s.transparent ? 1 : 0;
      const [br, bg, bb] = hexToRgb(s.backgroundColor || '#000000');
      const reveal = state.reveal;
      const hasPalette = s.palette.length > 0;
      const repel = s.autoCenterRepulsion > 0 || (s.mouseRepulsion && s.repulsionStrength > 0 && state.active > 0);
      const warp = state.boost > 0;
      const base = variant(hasPalette, false, false, true);
      if (!base) return;
      const program = (repel || warp ? variant(hasPalette, repel, warp, false) : null) ?? base;
      const u = program.uniforms;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program.program);
      gl.bindVertexArray(vao);
      gl.uniform1f(u.uTime, state.time);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform2f(u.uFocal, s.focal[0], s.focal[1]);
      gl.uniform2f(u.uRotation, s.rotation[0], s.rotation[1]);
      gl.uniform2f(u.uVelocity, s.velocity[0], s.velocity[1]);
      gl.uniform1f(u.uGloss, state.gloss);
      gl.uniform1f(u.uDepth, state.depth);
      gl.uniform1f(u.uDensity, s.density);
      gl.uniform1f(u.uHueShift, s.hueShift);
      gl.uniform1f(u.uSpeed, s.speed);
      gl.uniform2f(u.uMouse, state.mx, state.my);
      const stretch = 1 + state.boost * 3;
      gl.uniform1f(u.uStarGlow, (0.04 * s.glowIntensity * s.starSize) / Math.pow(stretch, 0.5));
      gl.uniform1f(u.uFlareGain, s.glowIntensity * s.flareIntensity);
      gl.uniform1f(u.uSquash, 1 - 1 / (stretch * stretch));
      gl.uniform1f(u.uSaturation, s.saturation);
      gl.uniform1f(u.uMouseRepulsion, s.mouseRepulsion ? 1 : 0);
      gl.uniform1f(u.uTwinkleIntensity, s.twinkleIntensity);
      gl.uniform1f(u.uRotationAngle, state.angle);
      gl.uniform1f(u.uRepulsionStrength, s.repulsionStrength);
      gl.uniform1f(u.uMouseActiveFactor, state.active);
      gl.uniform1f(u.uAutoCenterRepulsion, s.autoCenterRepulsion);
      gl.uniform1i(u.uLayers, s.layers);
      gl.uniform3fv(u.uColors, colors);
      gl.uniform1i(u.uColorCount, s.palette.length);
      gl.uniform1f(u.uWarp, state.boost);
      const fade = Math.min(1, reveal / 0.35);
      gl.uniform1f(u.uReveal, fade * fade * (3 - 2 * fade));
      gl.uniform1f(u.uMode, mode);
      gl.uniform3f(u.uBackground, br, bg, bb);
      gl.uniform1f(u.uOpacity, s.opacity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuRenderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpuRenderer);

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if ((window as unknown as { __PAUSE_WEBGL__?: boolean }).__PAUSE_WEBGL__) {
        raf = window.setTimeout(() => frame(performance.now()), 200) as unknown as number;
        return;
      }
      const s = settingsRef.current;
      const dt = last ? clamp((now - last) / 1000, 0.001, 0.04) : 1 / 60;
      last = now;

      if (s.intro && state.reveal < 1) {
        state.reveal = Math.min(1, state.reveal + dt / INTRO_SECONDS);
        state.boost = Math.max(state.boost, Math.pow(1 - state.reveal, 2) * 0.25);
      } else {
        state.reveal = 1;
      }

      const flight = (s.starSpeed / 12) * (s.reverse ? -1 : 1);
      state.time += dt * 0.65;
      state.gloss += dt * flight;
      state.depth += dt * flight * s.speed * (1 + state.boost * 1.2);
      state.angle += dt * s.rotationSpeed;
      state.boost *= Math.exp(-dt * 2.0);
      if (state.boost < 0.001) state.boost = 0;

      if (s.mouseInteraction && pointer.inside) {
        const follow = 1 - Math.exp(-dt / 0.3);
        state.mx += (pointer.x - state.mx) * follow;
        state.my += (pointer.y - state.my) * follow;
        state.active += (1 - state.active) * follow;
      } else if (state.active > 0) {
        state.active *= 0.9;
        if (state.active < 0.001) state.active = 0;
      }

      render();
      if (isSoftwareGl) {
        raf = window.setTimeout(() => {
          if (visible && !document.hidden) {
            raf = requestAnimationFrame(frame);
          }
        }, 140) as unknown as number;
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const s = settingsRef.current;
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      // Hard clamp dpr to 1.0 max for zero lag (0.5 in software WebGL)
      const ratio = isSoftwareGl ? 0.5 : clamp(s.dpr || 1.0, 0.5, 1.0);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      render();
      wake();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) {
        last = 0;
        wake();
      }
    });
    intersection.observe(container);

    resize();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf);
      wakeRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      programs.forEach(found => found.program && gl.deleteProgram(found.program));
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return (
    <div ref={containerRef} className={`galaxy-container${className ? ` ${className}` : ''}`} style={style} {...rest}>
      <canvas ref={canvasRef} className="galaxy-canvas" aria-hidden="true" />
    </div>
  );
};

export default Galaxy;

const fs = require('fs');
const filePath = 'remix-remix-earthui-designer/src/components/EarthGlobeCanvas.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Add uSim uniforms to cloudShellMat.uniforms
const oldUniforms = `          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
        },`;

const newUniforms = `          uTsunamiWavePhase: { value: 0.0 },
          uTsunamiSurge: { value: 0.0 },
          uRainStormIntensity: { value: 0.0 },
          uSimCenter: { value: new THREE.Vector2(0.0, 0.0) },
          uSimRadius: { value: 0.0 },
          uSimIntensity: { value: 0.0 },
          uSimType: { value: 0.0 },
        },`;

code = code.replace(oldUniforms.replace(/\n/g, '\r\n'), newUniforms.replace(/\n/g, '\r\n'));

// 2. Add uSim uniforms to cloudShellMat fragmentShader
const oldFrag = `          uniform vec2 uTsunamiCenter;
          uniform float uRainStormIntensity;
          varying vec2 vUv;`;

const newFrag = `          uniform vec2 uTsunamiCenter;
          uniform float uRainStormIntensity;
          uniform vec2 uSimCenter;
          uniform float uSimRadius;
          uniform float uSimIntensity;
          uniform float uSimType;
          varying vec2 vUv;`;

code = code.replace(oldFrag.replace(/\n/g, '\r\n'), newFrag.replace(/\n/g, '\r\n'));

fs.writeFileSync(filePath, code, 'utf8');
console.log('Fixed cloudShellMat simulation uniforms successfully!');

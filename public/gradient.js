function normalizeColor(a) {
  return [((a >> 16) & 255) / 255, ((a >> 8) & 255) / 255, (255 & a) / 255]
}
;["SCREEN", "LINEAR_LIGHT"].reduce((a, b, c) => Object.assign(a, { [b]: c }), {})
class MiniGl {
  constructor(f, b, c, g = !1) {
    let a = this,
      h = -1 !== document.location.search.toLowerCase().indexOf("debug=webgl")
    ;(a.canvas = f), (a.gl = a.canvas.getContext("webgl", { antialias: !0 })), (a.meshes = [])
    let i = a.gl
    b && c && this.setSize(b, c),
      a.lastDebugMsg,
      (a.debug =
        g && h
          ? function (c) {
              let b = new Date()
              b - a.lastDebugMsg > 1e3 && console.log("---"),
                console.log(
                  b.toLocaleTimeString() + Array(Math.max(0, 32 - c.length)).join(" ") + c + ": ",
                  ...Array.from(arguments).slice(1)
                ),
                (a.lastDebugMsg = b)
            }
          : () => {}),
      Object.defineProperties(a, {
        Material: {
          enumerable: !1,
          value: class {
            constructor(h, j, d = {}) {
              let b = this
              function f(d, c) {
                let b = i.createShader(d)
                return (
                  i.shaderSource(b, c),
                  i.compileShader(b),
                  i.getShaderParameter(b, i.COMPILE_STATUS) || console.error(i.getShaderInfoLog(b)),
                  a.debug("Material.compileShaderSource", { source: c }),
                  b
                )
              }
              function c(a, b) {
                return Object.entries(a)
                  .map(([a, c]) => c.getDeclaration(a, b))
                  .join("\n")
              }
              ;(b.uniforms = d), (b.uniformInstances = [])
              let g = "\n              precision highp float;\n            "
              ;(b.vertexSource = `
              ${g}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${c(a.commonUniforms, "vertex")}
              ${c(d, "vertex")}
              ${h}
            `),
                (b.Source = `
              ${g}
              ${c(a.commonUniforms, "fragment")}
              ${c(d, "fragment")}
              ${j}
            `),
                (b.vertexShader = f(i.VERTEX_SHADER, b.vertexSource)),
                (b.fragmentShader = f(i.FRAGMENT_SHADER, b.Source)),
                (b.program = i.createProgram()),
                i.attachShader(b.program, b.vertexShader),
                i.attachShader(b.program, b.fragmentShader),
                i.linkProgram(b.program),
                i.getProgramParameter(b.program, i.LINK_STATUS) ||
                  console.error(i.getProgramInfoLog(b.program)),
                i.useProgram(b.program),
                b.attachUniforms(void 0, a.commonUniforms),
                b.attachUniforms(void 0, b.uniforms)
            }
            attachUniforms(c, b) {
              let d = this
              void 0 === c
                ? Object.entries(b).forEach(([a, b]) => {
                    d.attachUniforms(a, b)
                  })
                : "array" == b.type
                ? b.value.forEach((a, b) => d.attachUniforms(`${c}[${b}]`, a))
                : "struct" == b.type
                ? Object.entries(b.value).forEach(([a, b]) => d.attachUniforms(`${c}.${a}`, b))
                : (a.debug("Material.attachUniforms", { name: c, uniform: b }),
                  d.uniformInstances.push({
                    uniform: b,
                    location: i.getUniformLocation(d.program, c),
                  }))
            }
          },
        },
        Uniform: {
          enumerable: !1,
          value: class {
            constructor(a) {
              ;(this.type = "float"),
                Object.assign(this, a),
                (this.typeFn =
                  {
                    float: "1f",
                    int: "1i",
                    vec2: "2fv",
                    vec3: "3fv",
                    vec4: "4fv",
                    mat4: "Matrix4fv",
                  }[this.type] || "1f"),
                this.update()
            }
            update(a) {
              void 0 !== this.value &&
                i[`uniform${this.typeFn}`](
                  a,
                  0 === this.typeFn.indexOf("Matrix") ? this.transpose : this.value,
                  0 === this.typeFn.indexOf("Matrix") ? this.value : null
                )
            }
            getDeclaration(a, d, b) {
              if (this.excludeFrom !== d) {
                if ("array" === this.type)
                  return (
                    this.value[0].getDeclaration(a, d, this.value.length) +
                    `
const int ${a}_length = ${this.value.length};`
                  )
                if ("struct" === this.type) {
                  let c = a.replace("u_", "")
                  return (
                    `uniform struct ${(c = c.charAt(0).toUpperCase() + c.slice(1))} 
                                {
` +
                    Object.entries(this.value)
                      .map(([a, b]) => b.getDeclaration(a, d).replace(/^uniform/, ""))
                      .join("") +
                    `
} ${a}${b > 0 ? `[${b}]` : ""};`
                  )
                }
                return `uniform ${this.type} ${a}${b > 0 ? `[${b}]` : ""};`
              }
            }
          },
        },
        PlaneGeometry: {
          enumerable: !1,
          value: class {
            constructor(b, c, d, f, g) {
              i.createBuffer(),
                (this.attributes = {
                  position: new a.Attribute({ target: i.ARRAY_BUFFER, size: 3 }),
                  uv: new a.Attribute({ target: i.ARRAY_BUFFER, size: 2 }),
                  uvNorm: new a.Attribute({ target: i.ARRAY_BUFFER, size: 2 }),
                  index: new a.Attribute({
                    target: i.ELEMENT_ARRAY_BUFFER,
                    size: 3,
                    type: i.UNSIGNED_SHORT,
                  }),
                }),
                this.setTopology(d, f),
                this.setSize(b, c, g)
            }
            setTopology(h = 1, i = 1) {
              let b = this
              ;(b.xSegCount = h),
                (b.ySegCount = i),
                (b.vertexCount = (b.xSegCount + 1) * (b.ySegCount + 1)),
                (b.quadCount = b.xSegCount * b.ySegCount * 2),
                (b.attributes.uv.values = new Float32Array(2 * b.vertexCount)),
                (b.attributes.uvNorm.values = new Float32Array(2 * b.vertexCount)),
                (b.attributes.index.values = new Uint16Array(3 * b.quadCount))
              for (let d = 0; d <= b.ySegCount; d++)
                for (let f = 0; f <= b.xSegCount; f++) {
                  let c = d * (b.xSegCount + 1) + f
                  if (
                    ((b.attributes.uv.values[2 * c] = f / b.xSegCount),
                    (b.attributes.uv.values[2 * c + 1] = 1 - d / b.ySegCount),
                    (b.attributes.uvNorm.values[2 * c] = (f / b.xSegCount) * 2 - 1),
                    (b.attributes.uvNorm.values[2 * c + 1] = 1 - (d / b.ySegCount) * 2),
                    f < b.xSegCount && d < b.ySegCount)
                  ) {
                    let g = d * b.xSegCount + f
                    ;(b.attributes.index.values[6 * g] = c),
                      (b.attributes.index.values[6 * g + 1] = c + 1 + b.xSegCount),
                      (b.attributes.index.values[6 * g + 2] = c + 1),
                      (b.attributes.index.values[6 * g + 3] = c + 1),
                      (b.attributes.index.values[6 * g + 4] = c + 1 + b.xSegCount),
                      (b.attributes.index.values[6 * g + 5] = c + 2 + b.xSegCount)
                  }
                }
              b.attributes.uv.update(),
                b.attributes.uvNorm.update(),
                b.attributes.index.update(),
                a.debug("Geometry.setTopology", {
                  uv: b.attributes.uv,
                  uvNorm: b.attributes.uvNorm,
                  index: b.attributes.index,
                })
            }
            setSize(f = 1, g = 1, h = "xz") {
              let b = this
              ;(b.width = f),
                (b.height = g),
                (b.orientation = h),
                (b.attributes.position.values &&
                  b.attributes.position.values.length === 3 * b.vertexCount) ||
                  (b.attributes.position.values = new Float32Array(3 * b.vertexCount))
              let j = -(f / 2),
                k = -(g / 2),
                l = f / b.xSegCount,
                m = g / b.ySegCount
              for (let c = 0; c <= b.ySegCount; c++) {
                let n = k + c * m
                for (let d = 0; d <= b.xSegCount; d++) {
                  let o = j + d * l,
                    i = c * (b.xSegCount + 1) + d
                  ;(b.attributes.position.values[3 * i + "xyz".indexOf(h[0])] = o),
                    (b.attributes.position.values[3 * i + "xyz".indexOf(h[1])] = -n)
                }
              }
              b.attributes.position.update(),
                a.debug("Geometry.setSize", { position: b.attributes.position })
            }
          },
        },
        Mesh: {
          enumerable: !1,
          value: class {
            constructor(c, d) {
              let b = this
              ;(b.geometry = c),
                (b.material = d),
                (b.wireframe = !1),
                (b.attributeInstances = []),
                Object.entries(b.geometry.attributes).forEach(([c, a]) => {
                  b.attributeInstances.push({
                    attribute: a,
                    location: a.attach(c, b.material.program),
                  })
                }),
                a.meshes.push(b),
                a.debug("Mesh.constructor", { mesh: b })
            }
            draw() {
              i.useProgram(this.material.program),
                this.material.uniformInstances.forEach(({ uniform: a, location: b }) =>
                  a.update(b)
                ),
                this.attributeInstances.forEach(({ attribute: a, location: b }) => a.use(b)),
                i.drawElements(
                  this.wireframe ? i.LINES : i.TRIANGLES,
                  this.geometry.attributes.index.values.length,
                  i.UNSIGNED_SHORT,
                  0
                )
            }
            remove() {
              a.meshes = a.meshes.filter((a) => a != this)
            }
          },
        },
        Attribute: {
          enumerable: !1,
          value: class {
            constructor(a) {
              ;(this.type = i.FLOAT),
                (this.normalized = !1),
                (this.buffer = i.createBuffer()),
                Object.assign(this, a),
                this.update()
            }
            update() {
              void 0 !== this.values &&
                (i.bindBuffer(this.target, this.buffer),
                i.bufferData(this.target, this.values, i.STATIC_DRAW))
            }
            attach(b, c) {
              let a = i.getAttribLocation(c, b)
              return (
                this.target === i.ARRAY_BUFFER &&
                  (i.enableVertexAttribArray(a),
                  i.vertexAttribPointer(a, this.size, this.type, this.normalized, 0, 0)),
                a
              )
            }
            use(a) {
              i.bindBuffer(this.target, this.buffer),
                this.target === i.ARRAY_BUFFER &&
                  (i.enableVertexAttribArray(a),
                  i.vertexAttribPointer(a, this.size, this.type, this.normalized, 0, 0))
            }
          },
        },
      })
    let d = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    a.commonUniforms = {
      projectionMatrix: new a.Uniform({ type: "mat4", value: d }),
      modelViewMatrix: new a.Uniform({ type: "mat4", value: d }),
      resolution: new a.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio: new a.Uniform({ type: "float", value: 1 }),
    }
  }
  setSize(a = 640, b = 480) {
    ;(this.width = a),
      (this.height = b),
      (this.canvas.width = a),
      (this.canvas.height = b),
      this.gl.viewport(0, 0, a, b),
      (this.commonUniforms.resolution.value = [a, b]),
      (this.commonUniforms.aspectRatio.value = a / b),
      this.debug("MiniGL.setSize", { width: a, height: b })
  }
  setOrthographicCamera(a = 0, b = 0, c = 0, d = -2e3, f = 2e3) {
    ;(this.commonUniforms.projectionMatrix.value = [
      2 / this.width,
      0,
      0,
      0,
      0,
      2 / this.height,
      0,
      0,
      0,
      0,
      2 / (d - f),
      0,
      a,
      b,
      c,
      1,
    ]),
      this.debug("setOrthographicCamera", this.commonUniforms.projectionMatrix.value)
  }
  render() {
    this.gl.clearColor(0, 0, 0, 0), this.gl.clearDepth(1), this.meshes.forEach((a) => a.draw())
  }
}
function e(a, b, c) {
  return (
    b in a
      ? Object.defineProperty(a, b, { value: c, enumerable: !0, configurable: !0, writable: !0 })
      : (a[b] = c),
    a
  )
}
class Gradient {
  constructor(...a) {
    e(this, "el", void 0),
      e(this, "cssVarRetries", 0),
      e(this, "maxCssVarRetries", 200),
      e(this, "angle", 0),
      e(this, "isLoadedClass", !1),
      e(this, "isScrolling", !1),
      e(this, "scrollingTimeout", void 0),
      e(this, "scrollingRefreshDelay", 200),
      e(this, "isIntersecting", !1),
      e(this, "shaderFiles", void 0),
      e(this, "vertexShader", void 0),
      e(this, "sectionColors", void 0),
      e(this, "computedCanvasStyle", void 0),
      e(this, "conf", void 0),
      e(this, "uniforms", void 0),
      e(this, "t", 1253106),
      e(this, "last", 0),
      e(this, "width", void 0),
      e(this, "minWidth", 1111),
      e(this, "height", 600),
      e(this, "xSegCount", void 0),
      e(this, "ySegCount", void 0),
      e(this, "mesh", void 0),
      e(this, "material", void 0),
      e(this, "geometry", void 0),
      e(this, "minigl", void 0),
      e(this, "scrollObserver", void 0),
      e(this, "amp", 320),
      e(this, "seed", 5),
      e(this, "freqX", 14e-5),
      e(this, "freqY", 29e-5),
      e(this, "freqDelta", 1e-5),
      e(this, "activeColors", [1, 1, 1, 1]),
      e(this, "isMetaKey", !1),
      e(this, "isGradientLegendVisible", !1),
      e(this, "isMouseDown", !1),
      e(this, "handleScroll", () => {
        clearTimeout(this.scrollingTimeout),
          (this.scrollingTimeout = setTimeout(this.handleScrollEnd, this.scrollingRefreshDelay)),
          this.isGradientLegendVisible && this.hideGradientLegend(),
          this.conf.playing && ((this.isScrolling = !0), this.pause())
      }),
      e(this, "handleScrollEnd", () => {
        ;(this.isScrolling = !1), this.isIntersecting && this.play()
      }),
      e(this, "resize", () => {
        ;(this.width = window.innerWidth),
          this.minigl.setSize(this.width, this.height),
          this.minigl.setOrthographicCamera(),
          (this.xSegCount = Math.ceil(this.width * this.conf.density[0])),
          (this.ySegCount = Math.ceil(this.height * this.conf.density[1])),
          this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
          this.mesh.geometry.setSize(this.width, this.height),
          (this.mesh.material.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6)
      }),
      e(this, "handleMouseDown", (a) => {
        this.isGradientLegendVisible &&
          ((this.isMetaKey = a.metaKey),
          (this.isMouseDown = !0),
          !1 === this.conf.playing && requestAnimationFrame(this.animate))
      }),
      e(this, "handleMouseUp", () => {
        this.isMouseDown = !1
      }),
      e(this, "animate", (a) => {
        if (!this.shouldSkipFrame(a) || this.isMouseDown) {
          if (((this.t += Math.min(a - this.last, 1e3 / 15)), (this.last = a), this.isMouseDown)) {
            let b = 160
            this.isMetaKey && (b = -160), (this.t += b)
          }
          ;(this.mesh.material.uniforms.u_time.value = this.t), this.minigl.render()
        }
        if (0 !== this.last && this.isStatic) return this.minigl.render(), void this.disconnect()
        ;(this.conf.playing || this.isMouseDown) && requestAnimationFrame(this.animate)
      }),
      e(this, "addIsLoadedClass", () => {
        this.isLoadedClass ||
          ((this.isLoadedClass = !0),
          this.el.classList.add("isLoaded"),
          setTimeout(() => {
            this.el.parentElement.classList.add("isLoaded")
          }, 3e3))
      }),
      e(this, "pause", () => {
        this.conf.playing = !1
      }),
      e(this, "play", () => {
        requestAnimationFrame(this.animate), (this.conf.playing = !0)
      }),
      e(this, "initGradient", (a) => ((this.el = document.querySelector(a)), this.connect(), this))
  }
  async connect() {
    ;(this.shaderFiles = {
      vertex:
        "varying vec3 v_color;\n\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n\n  vec2 st = 1. - uvNorm.xy;\n\n  //\n  // Tilting the plane\n  //\n\n  // Front-to-back tilt\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n\n  // Left-to-right angle\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n\n  // Up-down shift to offset incline\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n\n  //\n  // Vertex noise\n  //\n\n  float noise = snoise(vec3(\n    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,\n    noiseCoord.y * u_vertDeform.noiseFreq.y,\n    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed\n  )) * u_vertDeform.noiseAmp;\n\n  // Fade noise to zero at edges\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n\n  // Clamp to 0\n  noise = max(0.0, noise);\n\n  vec3 pos = vec3(\n    position.x,\n    position.y + tilt + incline + noise - offset,\n    position.z\n  );\n\n  //\n  // Vertex color, to be passed to fragment shader\n  //\n\n  if (u_active_colors[0] == 1.) {\n    v_color = u_baseColor;\n  }\n\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n\n      float noise = smoothstep(\n        layer.noiseFloor,\n        layer.noiseCeil,\n        snoise(vec3(\n          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,\n          noiseCoord.y * layer.noiseFreq.y,\n          time * layer.noiseSpeed + layer.noiseSeed\n        )) / 2.0 + 0.5\n      );\n\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n\n  //\n  // Finish\n  //\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
      noise:
        "//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}",
      blend:
        "//\n// https://github.com/jamieowen/glsl-blend\n//\n\n// Normal\n\nvec3 blendNormal(vec3 base, vec3 blend) {\n	return blend;\n}\n\nvec3 blendNormal(vec3 base, vec3 blend, float opacity) {\n	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Screen\n\nfloat blendScreen(float base, float blend) {\n	return 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Multiply\n\nvec3 blendMultiply(vec3 base, vec3 blend) {\n	return base*blend;\n}\n\nvec3 blendMultiply(vec3 base, vec3 blend, float opacity) {\n	return (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Overlay\n\nfloat blendOverlay(float base, float blend) {\n	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n	return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n	return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Hard light\n\nvec3 blendHardLight(vec3 base, vec3 blend) {\n	return blendOverlay(blend,base);\n}\n\nvec3 blendHardLight(vec3 base, vec3 blend, float opacity) {\n	return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Soft light\n\nfloat blendSoftLight(float base, float blend) {\n	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend) {\n	return vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {\n	return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color dodge\n\nfloat blendColorDodge(float base, float blend) {\n	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend) {\n	return vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {\n	return (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color burn\n\nfloat blendColorBurn(float base, float blend) {\n	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend) {\n	return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {\n	return (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Vivid Light\n\nfloat blendVividLight(float base, float blend) {\n	return (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend) {\n	return vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend, float opacity) {\n	return (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Lighten\n\nfloat blendLighten(float base, float blend) {\n	return max(blend,base);\n}\n\nvec3 blendLighten(vec3 base, vec3 blend) {\n	return vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));\n}\n\nvec3 blendLighten(vec3 base, vec3 blend, float opacity) {\n	return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear burn\n\nfloat blendLinearBurn(float base, float blend) {\n	// Note : Same implementation as BlendSubtractf\n	return max(base+blend-1.0,0.0);\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend) {\n	// Note : Same implementation as BlendSubtract\n	return max(base+blend-vec3(1.0),vec3(0.0));\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {\n	return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear dodge\n\nfloat blendLinearDodge(float base, float blend) {\n	// Note : Same implementation as BlendAddf\n	return min(base+blend,1.0);\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend) {\n	// Note : Same implementation as BlendAdd\n	return min(base+blend,vec3(1.0));\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {\n	return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear light\n\nfloat blendLinearLight(float base, float blend) {\n	return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend) {\n	return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {\n	return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));\n}",
      fragment:
        "varying vec3 v_color;\n\nvoid main() {\n  vec3 color = v_color;\n  if (u_darken_top == 1.0) {\n    vec2 st = gl_FragCoord.xy/resolution.xy;\n    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n  }\n  gl_FragColor = vec4(color, 1.0);\n}",
    }),
      (this.conf = {
        presetName: "",
        wireframe: !1,
        density: [0.06, 0.16],
        zoom: 1,
        rotation: 0,
        playing: !0,
      }),
      document.querySelectorAll("canvas").length < 1
        ? console.log("DID NOT LOAD HERO STRIPE CANVAS")
        : ((this.minigl = new MiniGl(this.el, null, null, !0)),
          requestAnimationFrame(() => {
            this.el &&
              ((this.computedCanvasStyle = getComputedStyle(this.el)), this.waitForCssVars())
          }))
  }
  disconnect() {
    this.scrollObserver &&
      (window.removeEventListener("scroll", this.handleScroll),
      window.removeEventListener("mousedown", this.handleMouseDown),
      window.removeEventListener("mouseup", this.handleMouseUp),
      window.removeEventListener("keydown", this.handleKeyDown),
      this.scrollObserver.disconnect()),
      window.removeEventListener("resize", this.resize)
  }
  initMaterial() {
    this.uniforms = {
      u_time: new this.minigl.Uniform({ value: 0 }),
      u_shadow_power: new this.minigl.Uniform({ value: 5 }),
      u_darken_top: new this.minigl.Uniform({ value: "" === this.el.dataset.jsDarkenTop ? 1 : 0 }),
      u_active_colors: new this.minigl.Uniform({ value: this.activeColors, type: "vec4" }),
      u_global: new this.minigl.Uniform({
        value: {
          noiseFreq: new this.minigl.Uniform({ value: [this.freqX, this.freqY], type: "vec2" }),
          noiseSpeed: new this.minigl.Uniform({ value: 5e-6 }),
        },
        type: "struct",
      }),
      u_vertDeform: new this.minigl.Uniform({
        value: {
          incline: new this.minigl.Uniform({ value: Math.sin(this.angle) / Math.cos(this.angle) }),
          offsetTop: new this.minigl.Uniform({ value: -0.5 }),
          offsetBottom: new this.minigl.Uniform({ value: -0.5 }),
          noiseFreq: new this.minigl.Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp: new this.minigl.Uniform({ value: this.amp }),
          noiseSpeed: new this.minigl.Uniform({ value: 10 }),
          noiseFlow: new this.minigl.Uniform({ value: 3 }),
          noiseSeed: new this.minigl.Uniform({ value: this.seed }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new this.minigl.Uniform({
        value: this.sectionColors[0],
        type: "vec3",
        excludeFrom: "fragment",
      }),
      u_waveLayers: new this.minigl.Uniform({ value: [], excludeFrom: "fragment", type: "array" }),
    }
    for (let a = 1; a < this.sectionColors.length; a += 1)
      this.uniforms.u_waveLayers.value.push(
        new this.minigl.Uniform({
          value: {
            color: new this.minigl.Uniform({ value: this.sectionColors[a], type: "vec3" }),
            noiseFreq: new this.minigl.Uniform({
              value: [2 + a / this.sectionColors.length, 3 + a / this.sectionColors.length],
              type: "vec2",
            }),
            noiseSpeed: new this.minigl.Uniform({ value: 11 + 0.3 * a }),
            noiseFlow: new this.minigl.Uniform({ value: 6.5 + 0.3 * a }),
            noiseSeed: new this.minigl.Uniform({ value: this.seed + 10 * a }),
            noiseFloor: new this.minigl.Uniform({ value: 0.1 }),
            noiseCeil: new this.minigl.Uniform({ value: 0.63 + 0.07 * a }),
          },
          type: "struct",
        })
      )
    return (
      (this.vertexShader = [
        this.shaderFiles.noise,
        this.shaderFiles.blend,
        this.shaderFiles.vertex,
      ].join("\n\n")),
      new this.minigl.Material(this.vertexShader, this.shaderFiles.fragment, this.uniforms)
    )
  }
  initMesh() {
    ;(this.material = this.initMaterial()),
      (this.geometry = new this.minigl.PlaneGeometry()),
      (this.mesh = new this.minigl.Mesh(this.geometry, this.material))
  }
  shouldSkipFrame(a) {
    return !!window.document.hidden || !this.conf.playing || parseInt(a, 10) % 2 == 0 || void 0
  }
  updateFrequency(a) {
    ;(this.freqX += a), (this.freqY += a)
  }
  toggleColor(a) {
    this.activeColors[a] = 0 === this.activeColors[a] ? 1 : 0
  }
  showGradientLegend() {
    this.width > this.minWidth &&
      ((this.isGradientLegendVisible = !0), document.body.classList.add("isGradientLegendVisible"))
  }
  hideGradientLegend() {
    ;(this.isGradientLegendVisible = !1), document.body.classList.remove("isGradientLegendVisible")
  }
  init() {
    this.initGradientColors(),
      this.initMesh(),
      this.resize(),
      requestAnimationFrame(this.animate),
      window.addEventListener("resize", this.resize)
  }
  waitForCssVars() {
    if (
      this.computedCanvasStyle &&
      -1 !== this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#")
    )
      this.init(), this.addIsLoadedClass()
    else {
      if (((this.cssVarRetries += 1), this.cssVarRetries > this.maxCssVarRetries))
        return (this.sectionColors = [16711680, 16711680, 16711935, 65280, 255]), void this.init()
      requestAnimationFrame(() => this.waitForCssVars())
    }
  }
  initGradientColors() {
    this.sectionColors = [
      "--gradient-color-1",
      "--gradient-color-2",
      "--gradient-color-3",
      "--gradient-color-4",
    ]
      .map((b) => {
        let a = this.computedCanvasStyle.getPropertyValue(b).trim()
        if (4 === a.length) {
          let c = a
            .substr(1)
            .split("")
            .map((a) => a + a)
            .join("")
          a = `#${c}`
        }
        return a && `0x${a.substr(1)}`
      })
      .filter(Boolean)
      .map(normalizeColor)
  }
}
var gradient = new Gradient()
gradient.initGradient("#gradient")

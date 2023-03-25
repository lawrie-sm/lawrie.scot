let gl = null;
let glCanvas = null;

function initGL() {
  glCanvas = document.getElementById("gl-canvas");
  gl = glCanvas.getContext("webgl");
}

function compileShader(elementId, shaderType) {
  let code = document.getElementById(elementId).firstChild.nodeValue;
  let shader = gl.createShader(shaderType);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error compiling shader:\n${elementId}\n${gl.getShaderInfoLog(shader)}`);
    return null;
  }

  return shader;
}

function linkProgram(shaders, uniforms, attributes) {
  let program = gl.createProgram();

  shaders.forEach((desc) => {
    let shader = compileShader(desc.id, desc.type);
    if (shader) {
      gl.attachShader(program, shader);
    }
  });

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking program: " + gl.getProgramInfoLog(program));
    return null;
  }

  let uniformLocations = {};
  uniforms.forEach((uniform) => {
    uniformId = gl.getUniformLocation(program, uniform);
    uniformLocations[uniform] = uniformId;
  });

  let attributeLocations = {};
  attributes.forEach((attribute) => {
    attributeId = gl.getAttribLocation(program, attribute);
    attributeLocations[attribute] = attributeId;
  });

  return {
    program,
    uniformLocations,
    attributeLocations
  };
}

function resize(canvas) {
  let displayWidth = canvas.clientWidth;
  let displayHeight = canvas.clientHeight;

  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

let vertexBuffer;
let vertexCount;

let currentTime = 0;
let previousTime = 0;
let deltaTime = 0;

let mouseX = 0;
let mouseY = 0;

function animate(time) {
  resize(glCanvas);
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  gl.useProgram(shaderProgram.program);

  gl.enableVertexAttribArray(shaderProgram.attributeLocations["aVertexPosition"]);
  gl.vertexAttribPointer(shaderProgram.attributeLocations["aVertexPosition"], 2, gl.FLOAT, false, 16, 0);

  // gl.enableVertexAttribArray(shaderProgram.attributeLocations["aTexturePosition"]);
  // gl.vertexAttribPointer(shaderProgram.attributeLocations["aTexturePosition"], 2, gl.FLOAT, false, 16, 8);

  gl.uniform2f(shaderProgram.uniformLocations["uResolution"], glCanvas.width, glCanvas.height);
  gl.uniform2f(shaderProgram.uniformLocations["uMouse"], mouseX, mouseY);

  currentTime = time * 0.001;
  deltaTime = currentTime - previousTime;
  previousTime = currentTime;
  gl.uniform1f(shaderProgram.uniformLocations["uTime"], currentTime);
  gl.uniform1f(shaderProgram.uniformLocations["uDeltaTime"], deltaTime);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);

  window.requestAnimationFrame(animate)
}

function startup() {
  window.addEventListener("mousemove", (event) => {
    const rect = glCanvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = glCanvas.height - (event.clientY - rect.top);
  });

  initGL();

  const shaders = [
    {
      id: "vertex-shader",
      type: gl.VERTEX_SHADER
    },
    {
      id: "fragment-shader",
      type: gl.FRAGMENT_SHADER
    }
  ];

  const uniforms = ["uTime", "uDeltaTime", "uResolution", "uMouse"];
  const attributes = ["aVertexPosition"];
  shaderProgram = linkProgram(shaders, uniforms, attributes);

  let vertices = new Float32Array([
    -1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 1.0
  ]);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  vertexCount = vertices.length / 4;

  animate();
}

window.addEventListener("load", startup, false);

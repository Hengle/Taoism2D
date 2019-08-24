"use strict";

engine.graphics = (function () {
  let gl = null;
  const _SHADER_TYPES = Object.freeze(["VERTEX_SHADER", "FRAGMENT_SHADER"]);

  const init = canvas => {
    gl = canvas.getContext("webgl", { alpha: false, depth: true, stencil: true });
    if (gl == null) {
      document.write("<p><b>WebGL is not supported</b></p>");
      throw new Error(`WebGL is not supported`);
    }

    // allows transperency with textures.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // set images to flip y axis to match the texture coordinate space.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // make sure depth testing is enabled
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    console.debug(`GL_VERSION:               ${gl.getParameter(gl.VERSION)}`);
    console.debug(`GL_VENDOR:                ${gl.getParameter(gl.VENDOR)}`);
    console.debug(`GL_RENDERER:              ${gl.getParameter(gl.RENDERER)}`);
    console.debug(`SHADING_LANGUAGE_VERSION: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);

    // attempt to load additional information.
    const debugRendererExtension = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugRendererExtension !== undefined && debugRendererExtension !== null) {
      console.debug(`UNMASKED_VENDOR_WEBGL:    ${gl.getParameter(debugRendererExtension.UNMASKED_VENDOR_WEBGL)}`);
      console.debug(`UNMASKED_RENDERER_WEBGL:  ${gl.getParameter(debugRendererExtension.UNMASKED_RENDERER_WEBGL)}`);
    }
  };


  /**
   * Creates a shader.
   * @param {string} shaderSource The shader source.
   * @param {number} shaderType The type of shader.
   * @return {WebGLShader} The created shader.
   */
  const createShader = (shaderSource, shaderType) => {
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);
    console.error(`Error compiling shader "${shader}": ${lastError}`);
    gl.deleteShader(shader);
  };

  /**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   * @param {WebGLShader[]} shaders The shaders to attach
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @return {WebGLShader} The created shader.
   */
  const createProgramFromShaders = (shaders, opt_attribs = [], opt_locations = []) => {
    const program = gl.createProgram();
    shaders.forEach(shader => gl.attachShader(program, shader));
    opt_attribs.forEach((attrib, i) => {
      gl.bindAttribLocation(
        program,
        opt_locations[i] || i,
        attrib);
    });
    gl.linkProgram(program);

    // Check the link success
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    console.error(`Error linking ${program}: ${lastError}`);
    gl.deleteProgram(program);
  };


  /**
   * Creates a program from 2 sources.
   * @param {string[]} shaderSourcess Array of sources for the
   *        shaders. The first is assumed to be the vertex shader,
   *        the second the fragment shader.
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @return {WebGLProgram} The created program.
   */
  const createProgram = (shaderSources, opt_attribs, opt_locations) => {
    const shaders = shaderSources.map(createShader(shaderSources[i], gl[_SHADER_TYPES[i]]));
    return createProgram(shaders, opt_attribs, opt_locations);
  };

  /**
   * Returns the corresponding bind point for a given sampler type
   */
  const getBindPointForSamplerType = type => {
    if (type === gl.SAMPLER_2D) return gl.TEXTURE_2D;        // eslint-disable-line
    if (type === gl.SAMPLER_CUBE) return gl.TEXTURE_CUBE_MAP;  // eslint-disable-line
    return undefined;
  };

  /**
   * Creates a setter for a uniform of the given program with it's
   * location embedded in the setter.
   * @param {WebGLProgram} program
   * @param {WebGLUniformInfo} uniformInfo
   * @returns {function} the created setter.
   */
  const createUniformSetter = (program, uniformInfo) => {
    const location = gl.getUniformLocation(program, uniformInfo.name);
    const type = uniformInfo.type;
    // Check if this uniform is an array
    const isArray = (uniformInfo.size > 1 && uniformInfo.name.substring(-3) === "[0]");
    if (type === gl.FLOAT && isArray) {
      return function (v) {
        gl.uniform1fv(location, v);
      };
    }
    if (type === gl.FLOAT) {
      return function (v) {
        gl.uniform1f(location, v);
      };
    }
    if (type === gl.FLOAT_VEC2) {
      return function (v) {
        gl.uniform2fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC3) {
      return function (v) {
        gl.uniform3fv(location, v);
      };
    }
    if (type === gl.FLOAT_VEC4) {
      return function (v) {
        gl.uniform4fv(location, v);
      };
    }
    if (type === gl.INT && isArray) {
      return function (v) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.INT) {
      return function (v) {
        gl.uniform1i(location, v);
      };
    }
    if (type === gl.INT_VEC2) {
      return function (v) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.INT_VEC3) {
      return function (v) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.INT_VEC4) {
      return function (v) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.BOOL) {
      return function (v) {
        gl.uniform1iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC2) {
      return function (v) {
        gl.uniform2iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC3) {
      return function (v) {
        gl.uniform3iv(location, v);
      };
    }
    if (type === gl.BOOL_VEC4) {
      return function (v) {
        gl.uniform4iv(location, v);
      };
    }
    if (type === gl.FLOAT_MAT2) {
      return function (v) {
        gl.uniformMatrix2fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT3) {
      return function (v) {
        gl.uniformMatrix3fv(location, false, v);
      };
    }
    if (type === gl.FLOAT_MAT4) {
      return function (v) {
        gl.uniformMatrix4fv(location, false, v);
      };
    }
    if ((type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) && isArray) {
      const units = [];
      for (let i = 0; i < info.size; ++i) {
        units.push(textureUnit++);
      }
      return function (bindPoint, units) {
        return function (textures) {
          gl.uniform1iv(location, units);
          textures.forEach(function (texture, index) {
            gl.activeTexture(gl.TEXTURE0 + units[index]);
            gl.bindTexture(bindPoint, texture);
          });
        };
      }(getBindPointForSamplerType(type), units);
    }
    if (type === gl.SAMPLER_2D || type === gl.SAMPLER_CUBE) {
      return function (bindPoint, unit) {
        return function (texture, option) {
          gl.uniform1i(location, unit);
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(bindPoint, texture);
          // To prevent texture wrappings
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

          // For pixel-graphics where you want the texture to look "sharp".
          if (option.sharp) {
            // Handles how magnification and minimization filters will work.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          }
        };
      }(getBindPointForSamplerType(type), textureUnit++);
    }
    throw ("unknown type: 0x" + type.toString(16)); // we should never get here.
  };

  /**
   * @typedef {Object.<string, function>} Setters
   */

  /**
   * Creates setter functions for all uniforms of a shader
   * program.
   *
   * @see {@link module:GLUtils.setUniforms}
   *
   * @param {WebGLProgram} program the program to create setters for.
   * @returns {Object.<string, function>} an object with a setter by name for each uniform
   * @memberOf module:GLUtils
   */
  const createUniformSetters = program => {
    const textureUnit = 0;

    const uniformSetters = {};
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numUniforms; ++i) {
      const uniformInfo = gl.getActiveUniform(program, i);
      if (!uniformInfo) {
        break;
      }
      const name = uniformInfo.name;
      // remove the array suffix.
      if (name.substring(-3) === "[0]") {
        name = name.substring(0, name.length - 3);
      }
      const setter = createUniformSetter(program, uniformInfo);
      uniformSetters[name] = setter;
    }
    return uniformSetters;
  };

  /**
   * Set uniforms and binds related textures.
   *
   * example:
   *
   *     let programInfo = createProgramInfo(["some-vs", "some-fs");
   *
   *     let tex1 = gl.createTexture();
   *     let tex2 = gl.createTexture();
   *
   *     ... assume we setup the textures with data ...
   *
   *     let uniforms = {
   *       u_someSampler: tex1,
   *       u_someOtherSampler: tex2,
   *       u_someColor: [1,0,0,1],
   *       u_somePosition: [0,1,1],
   *       u_someMatrix: [
   *         1,0,0,0,
   *         0,1,0,0,
   *         0,0,1,0,
   *         0,0,0,0,
   *       ],
   *     };
   *
   *     gl.useProgram(program);
   *
   * This will automatically bind the textures AND set the
   * uniforms.
   *
   *     setUniforms(programInfo.uniformSetters, uniforms);
   *
   * For the example above it is equivalent to
   *
   *     let texUnit = 0;
   *     gl.activeTexture(gl.TEXTURE0 + texUnit);
   *     gl.bindTexture(gl.TEXTURE_2D, tex1);
   *     gl.uniform1i(u_someSamplerLocation, texUnit++);
   *     gl.activeTexture(gl.TEXTURE0 + texUnit);
   *     gl.bindTexture(gl.TEXTURE_2D, tex2);
   *     gl.uniform1i(u_someSamplerLocation, texUnit++);
   *     gl.uniform4fv(u_someColorLocation, [1, 0, 0, 1]);
   *     gl.uniform3fv(u_somePositionLocation, [0, 1, 1]);
   *     gl.uniformMatrix4fv(u_someMatrix, false, [
   *         1,0,0,0,
   *         0,1,0,0,
   *         0,0,1,0,
   *         0,0,0,0,
   *       ]);
   *
   * Note it is perfectly reasonable to call `setUniforms` multiple times. For example
   *
   *     let uniforms = {
   *       u_someSampler: tex1,
   *       u_someOtherSampler: tex2,
   *     };
   *
   *     let moreUniforms {
   *       u_someColor: [1,0,0,1],
   *       u_somePosition: [0,1,1],
   *       u_someMatrix: [
   *         1,0,0,0,
   *         0,1,0,0,
   *         0,0,1,0,
   *         0,0,0,0,
   *       ],
   *     };
   *
   *     setUniforms(programInfo.uniformSetters, uniforms);
   *     setUniforms(programInfo.uniformSetters, moreUniforms);
   *
   * @param {Object.<string, function>|module:GLUtils.ProgramInfo} setters the setters returned from
   *        `createUniformSetters` or a ProgramInfo from {@link module:GLUtils.createProgramInfo}.
   * @param {Object.<string, value>} an object with values for the
   *        uniforms.
   * @memberOf module:GLUtils
   */
  const setUniforms = (setters, values) => {
    setters = setters.uniformSetters || setters;
    Object.keys(values).forEach(function (name) {
      const setter = setters[name];
      if (setter) {
        setter(values[name]);
      } else {
        console.warn(`There's not a setter in ${setters} for ${name}`);
      }
    });
  };

  const createAttribSetter = index => attrib => {
    gl.bindBuffer(gl.ARRAY_BUFFER, attrib.buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(
      index, attrib.numComponents || attrib.size, attrib.type || gl.FLOAT, attrib.normalize || false, attrib.stride || 0, attrib.offset || 0);
  };

  /**
   * Creates setter functions for all attributes of a shader
   * program. You can pass this to {@link module:GLUtils.setBuffersAndAttributes} to set all your buffers and attributes.
   *
   * @see {@link module:GLUtils.setAttributes} for example
   * @param {WebGLProgram} program the program to create setters for.
   * @return {Object.<string, function>} an object with a setter for each attribute by name.
   * @memberOf module:GLUtils
   */
  const createAttributeSetters = program => {
    const attribSetters = {};

    const numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < numAttribs; ++i) {
      const attribInfo = gl.getActiveAttrib(program, i);
      if (!attribInfo) {
        break;
      }
      const index = gl.getAttribLocation(program, attribInfo.name);
      attribSetters[attribInfo.name] = createAttribSetter(index);
    }

    return attribSetters;
  };

  /**
   * Sets attributes and binds buffers (deprecated... use {@link module:GLUtils.setBuffersAndAttributes})
   *
   * Example:
   *
   *     let program = createProgramFromScripts(["some-vs", "some-fs");
   *
   *     let attribSetters = createAttributeSetters(program);
   *
   *     let positionBuffer = gl.createBuffer();
   *     let texcoordBuffer = gl.createBuffer();
   *
   *     let attribs = {
   *       a_position: {buffer: positionBuffer, numComponents: 3},
   *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
   *     };
   *
   *     gl.useProgram(program);
   *
   * This will automatically bind the buffers AND set the
   * attributes.
   ,*
   *     setAttributes(attribSetters, attribs);
   *
   * Properties of attribs. For each attrib you can add
   * properties:
   *
   * *   type: the type of data in the buffer. Default = gl.FLOAT
   * *   normalize: whether or not to normalize the data. Default = false
   * *   stride: the stride. Default = 0
   * *   offset: offset into the buffer. Default = 0
   *
   * For example if you had 3 value float positions, 2 value
   * float texcoord and 4 value uint8 colors you'd setup your
   * attribs like this
   *
   *     let attribs = {
   *       a_position: {buffer: positionBuffer, numComponents: 3},
   *       a_texcoord: {buffer: texcoordBuffer, numComponents: 2},
   *       a_color: {
   *         buffer: colorBuffer,
   *         numComponents: 4,
   *         type: gl.UNSIGNED_BYTE,
   *         normalize: true,
   *       },
   *     };
   *
   * @param {Object.<string, function>|model:GLUtils.ProgramInfo} setters Attribute setters as returned from createAttributeSetters or a ProgramInfo as returned {@link module:GLUtils.createProgramInfo}
   * @param {Object.<string, module:GLUtils.AttribInfo>} attribs AttribInfos mapped by attribute name.
   * @memberOf module:GLUtils
   * @deprecated use {@link module:GLUtils.setBuffersAndAttributes}
   */
  const setAttributes = (setters, attribs) => {
    setters = setters.attribSetters || setters;
    Object.keys(attribs).forEach(function (name) {
      const setter = setters[name];
      if (setter) {
        setter(attribs[name]);
      }
    });
  };

  /**
   * @typedef {Object} ProgramInfo
   * @property {WebGLProgram} program A shader program
   * @property {Object<string, function>} uniformSetters: object of setters as returned from createUniformSetters,
   * @property {Object<string, function>} attribSetters: object of setters as returned from createAttribSetters,
   * @memberOf module:webgl-utils
   */

  /**
   * Creates a ProgramInfo from 2 sources.
   *
   * A ProgramInfo contains
   *
   *     programInfo = {
   *        program: WebGLProgram,
   *        uniformSetters: object of setters as returned from createUniformSetters,
   *        attribSetters: object of setters as returned from createAttribSetters,
   *     }
   *
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext
   *        to use.
   * @param {string[]} shaderSourcess Array of sources for the
   *        shaders or ids. The first is assumed to be the vertex shader,
   *        the second the fragment shader.
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   * @param {number[]} [opt_locations] The locations for the. A parallel array to opt_attribs letting you assign locations.
   * @param {module:webgl-utils.ErrorCallback} errorCallback callback for errors. By default it just prints an error to the console
   *        on error. If you want something else pass an callback. It's passed an error message.
   * @return {module:webgl-utils.ProgramInfo} The created program.
   * @memberOf module:webgl-utils
   */
  const createProgramInfo = (shaderSources, opt_attribs, opt_locations) => {
    const program = createProgram(shaderSources, opt_attribs, opt_locations);
    if (!program) {
      return null;
    }
    const uniformSetters = createUniformSetters(program);
    const attribSetters = createAttributeSetters(program);
    return {
      program,
      uniformSetters,
      attribSetters,
    };
  };

  const _createBufferFromTypedArray = (array, type = gl.ARRAY_BUFFER, drawType = gl.STATIC_DRAW) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, array, drawType);
    return buffer;
  };

  const _getGLTypeForTypedArray = (typedArray) => {
    if (typedArray instanceof Int8Array) { return gl.BYTE; }
    if (typedArray instanceof Uint8Array) { return gl.UNSIGNED_BYTE; }
    if (typedArray instanceof Int16Array) { return gl.SHORT; }
    if (typedArray instanceof Uint16Array) { return gl.UNSIGNED_SHORT; }
    if (typedArray instanceof Int32Array) { return gl.INT; }
    if (typedArray instanceof Uint32Array) { return gl.UNSIGNED_INT; }
    if (typedArray instanceof Float32Array) { return gl.FLOAT; }
    throw "unsupported typed array type";
  };

  // This is really just a guess. Though I can't really imagine using
  // anything else? Maybe for some compression?
  const _guessNormalizationForTypedArray = typedArray => {
    if (typedArray instanceof Int8Array) { return true; }
    if (typedArray instanceof Uint8Array) { return true; }
    return false;
  };

  const _guessNumComponentsFromName = (name, length) => {
    let numComponents;
    if (name.indexOf("coord") >= 0) {
      numComponents = 2;
    } else if (name.indexOf("color") >= 0) {
      numComponents = 4;
    } else {
      numComponents = 3;  // position, normals, indices ...
    }

    if (length % numComponents > 0) {
      throw "can not guess numComponents. You should specify it.";
    }

    return numComponents;
  };


  /**
   * Creates a BufferInfo from an object of arrays.
   *
   * This can be passed to {@link module:GLUtils.setBuffersAndAttributes} and to
   * {@link module:GLUtils:drawBufferInfo}.
   *
   * Given an object like
   *
   *     let arrays = {
   *       a_position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
   *       a_texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
   *       a_normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
   *       indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
   *     };
   *
   *  Creates an BufferInfo like this
   *
   *     bufferInfo = {
   *       numElements: 4,        // or whatever the number of elements is
   *       indices: WebGLBuffer,  // this property will not exist if there are no indices
   *       attribs: {
   *         a_position: { buffer: WebGLBuffer, numComponents: 3, },
   *         a_normal:   { buffer: WebGLBuffer, numComponents: 3, },
   *         a_texcoord: { buffer: WebGLBuffer, numComponents: 2, },
   *       },
   *     };
   *
   *  The properties of arrays can be JavaScript arrays in which case the number of components
   *  will be guessed.
   *
   *     let arrays = {
   *        a_position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
   *        a_texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
   *        a_normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
   *        indices:  [0, 1, 2, 1, 2, 3],
   *     };
   *
   *  They can also by TypedArrays
   *
   *     let arrays = {
   *        a_position: new Float32Array([0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0]),
   *        a_texcoord: new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]),
   *        a_normal:   new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
   *        indices:  new Uint16Array([0, 1, 2, 1, 2, 3]),
   *     };
   *
   * For the last example it is equivalent to
   *
   *     let bufferInfo = {
   *       attribs: {
   *         a_position: { numComponents: 3, buffer: gl.createBuffer(), },
   *         a_texcoods: { numComponents: 2, buffer: gl.createBuffer(), },
   *         a_normals: { numComponents: 3, buffer: gl.createBuffer(), },
   *       },
   *       indices: gl.createBuffer(),
   *       numElements: 6,
   *     };
   *
   *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_position.buffer);
   *     gl.bufferData(gl.ARRAY_BUFFER, arrays.position, gl.STATIC_DRAW);
   *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_texcoord.buffer);
   *     gl.bufferData(gl.ARRAY_BUFFER, arrays.texcoord, gl.STATIC_DRAW);
   *     gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.attribs.a_normal.buffer);
   *     gl.bufferData(gl.ARRAY_BUFFER, arrays.normal, gl.STATIC_DRAW);
   *     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
   *     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, arrays.indices, gl.STATIC_DRAW);
   */

  const _isTypedArray = obj => (obj.buffer && obj.buffer instanceof ArrayBuffer);

  const createBufferInfoFromArrays = arrayInfos => {
    const bufferInfo = {};
    Object.keys(arrayInfos).forEach(name => {
      // make arrayInfo valid
      let arrayInfo = arrayInfos[name];
      if (Array.isArray(arrayInfo)) {
        const type = arrayInfo.type || Float32Array;
        arrayInfo = {
          data: TypedArray.from(arrayInfo.data),
        };
      } else if (_isTypedArray(arrayInfo)) {
        arrayInfo = {
          data: arrayInfo,
        }
      }
      // create buffer info
      if (name == "indeces") {
        bufferInfo.indices = _createBufferFromTypedArray(arrayInfo.data, gl.ELEMENT_ARRAY_BUFFER, arrayInfo.drawType);
        bufferInfo.numElements = arrayInfo.data.length;
      } else {
        attribs[name] = {
          buffer: _createBufferFromTypedArray(arrayInfo.data, gl.ARRAY_BUFFER, arrayInfo.drawType),
          numComponents: arrayInfo.numComponents || _guessNumComponentsFromName(name, arrayInfo.data.length),
          type: _getGLTypeForTypedArray(arrayInfo.data),
          normalize: _guessNormalizationForTypedArray(arrayInfo.data),
        };
        if (!bufferInfo.numElements) {
          bufferInfo.numElements = arrayInfo.data.length / numComponents;
        }
      }
    });
    return attribs;
  };

  /*
   * @param {Object.<string, function>} setters Attribute setters as returned from `createAttributeSetters`
   * @param {module:webgl-utils.BufferInfo} buffers a BufferInfo as returned from `createBufferInfoFromArrays`.
   */

  const setIndicesAndAttributes = (setters, bufferInfo) => {
    setAttributes(setters, bufferInfo.attribs);
    if (buffers.indices) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    }
  }

  /**
   * @typedef {Object} drawObjectInfo
   * @property {module:GLUtils.ProgramInfo} programInfo A ProgramInfo as returned from createProgramInfo
   * @property {module:GLUtils.BufferInfo} bufferInfo A BufferInfo as returned from createBufferInfoFromArrays
   * @property {number} count The count of drawing.
   */

  /**
   * Draws a list of objectInfo
   * @param {WebGLRenderingContext} gl A WebGLRenderingContext
   * @param {DrawObject[]} objectInfosToDraw an array of objectInfo to draw.
   * @memberOf module:GLUtils
   */
  const draw = (function () {
    let lastUsedProgramInfo = null;
    let lastUsedBufferInfo = null;
    let lastUniforms = {};

    return drawingInfo => {
      const { programInfo, bufferInfo, uniforms, count, primitiveType = gl.TRIANGLES, offset = 0, } = drawingInfo;
      count = count || bufferInfo.numElements;

      let programInfoChanged = false;

      if (programInfo !== lastUsedProgramInfo) {
        lastUsedProgramInfo = programInfo;
        gl.useProgram(programInfo.program);
        let programInfoChanged = true;
      }

      // Setup all the needed attributes.
      if (programInfoChanged || bufferInfo !== lastUsedBufferInfo) {
        lastUsedBufferInfo = bufferInfo;
        setIndicesAndAttributes(programInfo.attribSetters, bufferInfo);
      }

      // Set the uniforms.
      setUniforms(programInfo.uniformSetters, object.uniforms);

      // Draw
      if (bufferInfo.indices) {
        gl.drawElements(primitiveType, count, obj.elementType || gl.UNSIGNED_SHORT, offset);
      } else {
        gl.drawArrays(primitiveType, offset, count);
      }
    };
  })();

  /**
   * Resize a canvas to match the size its displayed.
   * @param {number} [multiplier] amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   * @memberOf module:webgl-utils
   */
  const resizeCanvasToDisplaySize = (multiplier = 1) => {
    const displayWidth = canvas.clientWidth * multiplier;
    const displayHeight = canvas.clientHeight * multiplier;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      return true;
    }
    return false;
  };

  /**
   * Clears the draw area
   * @memberOf engine.Core
   * @param {Float} color [R, G, B, A] Color array
   * @returns {void}
   */

  const clear = color => {
    gl.clearColor(color[0], color[1], color[2], color[3]);     // set the color to be cleared
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear to the color, stencil bit, and depth buffer bits
  };

  return {
    get gl() { return gl; },

    init,

    createShader,
    createProgramFromShaders,
    createProgram,
    createUniformSetters,
    createAttributeSetters,
    setUniforms,
    setAttributes,
    createProgramInfo,

    createBufferInfoFromArrays,
    setIndicesAndAttributes,

    draw,
    resizeCanvasToDisplaySize,
    clear,

  };
})();


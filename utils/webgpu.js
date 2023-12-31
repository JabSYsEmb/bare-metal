export async function initWebGPU() {
  if (!navigator.gpu) {
    throw Error("GPU isn't supported");
  }

  const adapter = await navigator.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();

  if (!device) {
    throw Error("need a browser that supports WebGPU");
  }

  /** @type {HTMLCanvasElement} canvas */
  const canvas = document.getElementById("webgpu");
  const context = canvas.getContext("webgpu");
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
  });

  const module = device.createShaderModule({
    label: "our hardcoded red triangle shaders",
    code: `
      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> @builtin(position) vec4f {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5),  // bottom right
        );
        return vec4f(pos[vertexIndex], 0.0, 1.0);
      }
      @fragment fn fs() -> @location(0) vec4f {
        return vec4f(1.0, 0.7, 0.9, 0.8);
      }
    `,
  });

  const pipeline = device.createRenderPipeline({
    label: "our hardcoded red triangle pipeline",
    layout: "auto",
    vertex: {
      module,
      entryPoint: "vs",
    },
    fragment: {
      module,
      entryPoint: "fs",
      targets: [{ format: presentationFormat }],
    },
  });

  const renderPassDescriptor = {
    label: "our hardcoded red triangle renderPassDes",
    colorAttachments: [
      {
        clearValue: [0.3, 0.3, 0.3, 1],
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  };

  function render() {
    // Get the current texture from the canvas context and
    // set it as the texture to render to.
    renderPassDescriptor.colorAttachments[0].view = context
      .getCurrentTexture()
      .createView();
    //
    // make a command encoder to start encoding commands
    const encoder = device.createCommandEncoder({ label: "our encoder" });
    //
    // make a render pass encoder to encode render specific commands
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.draw(3); // call our vertex shader 3 times
    pass.end();
    //
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);
  }

  render();
}

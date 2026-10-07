export async function register() {
  // Only load Node modules in the Node.js runtime. A static import (or an
  // Edge-analyzed dynamic import graph) breaks Hostinger's Next build with
  // "Can't resolve 'fs' / 'path' / 'child_process'".
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { registerNode } = await import("./instrumentation-node");
  await registerNode();
}

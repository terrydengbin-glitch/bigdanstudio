import { build } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
await build({
  absWorkingDir:root,
  entryPoints:['scripts/main.js'],
  outfile:resolve(root, 'scripts/app.bundle.js'),
  bundle:true,
  format:'iife',
  platform:'browser',
  target:'es2020',
  splitting:false,
  minify:true,
  sourcemap:false,
  legalComments:'eof',
  charset:'utf8',
  logLevel:'info'
});

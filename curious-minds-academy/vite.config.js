import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically find all HTML files at the root directory to build them as MPA inputs
const getHtmlInputs = () => {
  const inputs = {};
  const files = readdirSync(__dirname);
  
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace('.html', '');
      inputs[name] = resolve(__dirname, file);
    }
  });
  
  // Include index.html explicitly
  inputs['main'] = resolve(__dirname, 'index.html');
  
  return inputs;
};

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
});

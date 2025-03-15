// @ts-check
import fs from 'fs';
import path from 'path';
import * as sass from 'sass';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const COMPONENTS_DIR = path.join(__dirname, 'components');
const SCRIPTS_DIR = path.join(COMPONENTS_DIR, 'scripts');
const STYLES_DIR = path.join(__dirname, 'styles');
const STATIC_DIR = path.join(__dirname, 'static');

// Ensure static directory exists
if (!fs.existsSync(STATIC_DIR)) {
  fs.mkdirSync(STATIC_DIR, { recursive: true });
}

/**
 * Copy JS files from source to static directory
 */
function copyJsFiles(): void {
  const jsFiles = ['mobile-optimizations.js', 'performance-metrics.js'];
  
  jsFiles.forEach((file: string) => {
    const sourcePath = path.join(SCRIPTS_DIR, file);
    const destPath = path.join(STATIC_DIR, file);
    
    try {
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to static directory`);
      } else {
        console.warn(`Warning: ${file} not found in scripts directory`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
}

/**
 * Compile SCSS files to CSS
 */
function compileSassFiles(): void {
  const sassFiles = ['mobile-performance.scss'];
  
  sassFiles.forEach((file: string) => {
    const sourcePath = path.join(STYLES_DIR, file);
    const destPath = path.join(STATIC_DIR, file.replace('.scss', '.css'));
    
    try {
      if (fs.existsSync(sourcePath)) {
        const result = sass.compile(sourcePath);
        fs.writeFileSync(destPath, result.css);
        console.log(`Compiled ${file} to CSS in static directory`);
      } else {
        console.warn(`Warning: ${file} not found in styles directory`);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  });
}

/**
 * Main build function
 */
function buildMobilePerformance(): void {
  console.log('Building mobile performance optimization files...');
  copyJsFiles();
  compileSassFiles();
  console.log('Mobile performance build complete!');
}

// Run the build
buildMobilePerformance();

// Export the function
export default buildMobilePerformance;

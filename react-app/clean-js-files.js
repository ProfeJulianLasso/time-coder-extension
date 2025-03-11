const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');

// Función para eliminar archivos JS, map y d.ts generados
function cleanGeneratedFiles() {
  console.log('Limpiando archivos generados en src...');

  const patterns = [
    'src/**/*.js',
    'src/**/*.js.map',
    'dev/**/*.js',
    'dev/**/*.js.map',
  ];

  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    if (files.length > 0) {
      files.forEach(file => {
        try {
          fs.unlinkSync(file);
          console.log(`Eliminado: ${file}`);
        } catch (err) {
          console.error(`Error al eliminar ${file}:`, err);
        }
      });
    } else {
      console.log(`No se encontraron archivos con patrón: ${pattern}`);
    }
  });

  // Limpiamos también la carpeta dist/tsc-out y dist/js si existen
  ['dist/tsc-out', 'dist/js'].forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        rimraf.sync(dir);
        console.log(`Carpeta eliminada: ${dir}`);
      } catch (err) {
        console.error(`Error al eliminar carpeta ${dir}:`, err);
      }
    }
  });

  console.log('Limpieza completada.');
}

// Ejecutar la limpieza
cleanGeneratedFiles();
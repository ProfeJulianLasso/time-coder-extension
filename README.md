# TimeCoder
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/ProfeJulianLasso/time-coder-extension/releases/tag/v1.0.0) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/ProfeJulianLasso/time-coder-extension/actions) [![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/) [![Bun Version](https://img.shields.io/badge/bun-%3E%3D1.2-brightgreen.svg)](https://bun.sh/) [![GitHub Issues](https://img.shields.io/github/issues/ProfeJulianLasso/time-coder-extension.svg)](https://github.com/ProfeJulianLasso/time-coder-extension/issues) [![GitHub Stars](https://img.shields.io/github/stars/ProfeJulianLasso/time-coder-extension.svg)](https://github.com/ProfeJulianLasso/time-coder-extension/stargazers) [![GitHub Forks](https://img.shields.io/github/forks/ProfeJulianLasso/time-coder-extension.svg)](https://github.com/ProfeJulianLasso/time-coder-extension/network/members) [![GitHub License](https://img.shields.io/github/license/ProfeJulianLasso/time-coder-extension.svg)](https://opensource.org/licenses/MIT)

## Descripción

TimeCoder es una extensión para Visual Studio Code que te permite medir y analizar tu tiempo de codificación. Obtén informes detallados de tu actividad de programación por lenguaje, proyecto, plataforma y rama git.

![TimeCoder Reporte Diario](https://github.com/ProfeJulianLasso/time-coder-extension/raw/main/resources/screenshot-daily.png) ![TimeCoder Reporte Semanal](https://github.com/ProfeJulianLasso/time-coder-extension/raw/main/resources/screenshot-weekly.png)

## Características

- ✅ **Seguimiento automático de actividad** - Mide tu tiempo de codificación sin interrumpir tu flujo de trabajo
- 📊 **Informes detallados** - Visualiza estadísticas diarias y semanales en un panel integrado
- 🔄 **Sincronización en la nube** - Accede a tus datos desde cualquier dispositivo
- 🔎 **Análisis por lenguaje** - Descubre en qué lenguajes pasas más tiempo
- 🌳 **Seguimiento de ramas git** - Analiza el tiempo dedicado a cada rama de tus proyectos
- 🔍 **Monitoreo de sesiones de depuración** - Diferencia entre tiempo de codificación y depuración
- 🔌 **Integración multiplataforma** - Compatible con Windows, macOS y Linux

## Requisitos

- Visual Studio Code 1.97.0 o superior
- Extensión Git de VS Code para funcionalidades de ramas
- Conexión a internet para sincronización de datos

## Instalación

Puedes instalar esta extensión de varias maneras:

### Desde VS Code Marketplace

1. Abre VS Code
2. Ve a la vista de extensiones (`Ctrl+Shift+X`) 
3. Busca "TimeCoder"
4. Haz clic en "Instalar"

### Desde VSIX

1. Descarga el archivo timecoder-1.0.0.vsix desde el repositorio oficial
2. Abre VS Code
3. Ve a la vista de extensiones (`Ctrl+Shift+X`)
4. Haz clic en el menú "..." en la esquina superior derecha
5. Selecciona "Instalar desde VSIX..."
6. Navega hasta el archivo `.vsix` descargado y selecciónalo

## Configuración inicial

Para comenzar a utilizar TimeCoder necesitas configurar una API Key:

1. Después de instalar la extensión, verás una notificación solicitando configurar la API Key
2. Puedes configurarla de dos formas:
   - **Automáticamente**: Haz clic en "Obtener API Key desde el portal", inicia sesión en el portal web y autoriza la conexión
   - **Manualmente**: Haz clic en "Configurar API Key manualmente" e introduce tu clave

También puedes configurar la API Key en cualquier momento:
1. Abre la paleta de comandos con `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (Mac)
2. Busca y selecciona "TimeCoder: Configurar API Key"

## Uso

Una vez configurada la extensión, comenzará a rastrear automáticamente tu tiempo de codificación.

### Ver informes

Para ver tus informes de actividad:

1. Haz clic en el ícono de TimeCoder en la barra de actividades (lateral)
2. O usa el comando "TimeCoder: Mostrar reporte" desde la paleta de comandos

### Tipos de informes

- **Informe diario**: Muestra estadísticas del día actual, incluyendo:
  - Tiempo total de codificación
  - Distribución por lenguaje
  - Distribución por proyecto y plataforma
  - Tiempo de depuración vs. codificación

- **Informe semanal**: Muestra estadísticas de la semana actual, incluyendo:
  - Resumen de actividad diaria
  - Lenguajes más utilizados
  - Proyectos y plataformas con más actividad

## Cómo funciona

TimeCoder realiza un seguimiento de tu actividad mientras programas:

1. Registra eventos como cambios en archivos y cambios de documento activo
2. Detecta periodos de inactividad y los excluye de las métricas
3. Identifica las ramas de git en las que trabajas
4. Detecta sesiones de depuración
5. Envía datos bajo tu usuario al servidor para procesamiento
6. Recibe informes procesados y los muestra en la interfaz

Toda la información se envía de forma segura y puedes ver exactamente qué datos se están recopilando.

## Privacidad

TimeCoder solo recopila datos relacionados con tu actividad de programación:
- Nombres de proyectos y archivos
- Lenguajes utilizados
- Tiempo de actividad
- Nombres de ramas git
- Plataforma y nombre de máquina

No se recopilan datos personales ni el contenido de tus archivos.

## Solución de problemas

Si experimentas problemas:

1. Verifica que tu API Key esté configurada correctamente
2. Asegúrate de tener conexión a internet
3. Reinicia VS Code si los informes no se cargan
4. Verifica que la extensión Git esté instalada para el seguimiento de ramas

## Desarrollo

### Estructura del proyecto
- src: Código fuente de la extensión principal
- react-app: Aplicación React para la UI de los informes
- resources: Recursos estáticos (iconos, etc.)

### Comandos útiles

```bash
# Instalar dependencias
bun install

# Desarrollo (compila la extensión y React en modo watch)
bun run dev

# Compilar la extensión y la UI
bun run build

# Empaquetar para distribución
bun run package
```

## Contribución

¡Las contribuciones son bienvenidas! Si quieres contribuir:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Desarrollado por

[Sofka Technologies](https://github.com/ProfeJulianLasso)

---

¿Tienes preguntas o comentarios? [Abre un issue](https://github.com/ProfeJulianLasso/time-coder-extension/issues) en nuestro repositorio.
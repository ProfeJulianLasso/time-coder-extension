# Registro de cambios

Todos los cambios notables en la extensión TimeCoder serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-03-12

### Cambiado
- Actualizado el nombre de comandos de `timecoder.` a `time-coder.` para mantener consistencia
- Renombrado ID del contenedor de la vista lateral de `timecoder-sidebar` a `time-coder-sidebar`
- Actualizado título de la extensión agregando un signo de exclamación: "TimeCoder!"
- Renombrado ID de la vista de webview de `timecoderReport` a `timeCoderReport`
- Corregido el comando de enfoque en extension.ts para usar `timeCoderReport.focus`
- Actualizado el prefijo de configuración de `timecoder.apiKey` a `time-coder.apiKey`

## [1.0.1] - 2025-03-12

### Corregido
- Orden correcto de los días de la semana en el reporte semanal. El array ahora inicia correctamente con "Domingo".

## [1.0.0] - 2025-03-11

### Añadido
- Versión inicial de TimeCoder
- Seguimiento automático del tiempo de codificación
- Informes detallados con estadísticas diarias y semanales
- Análisis por lenguaje de programación
- Seguimiento de ramas git
- Diferenciación entre tiempo de codificación y depuración
- Integración con API externa para sincronización de datos
- Interfaz de usuario con React para visualización de informes

### Características principales
- Panel de visualización en la barra lateral de VS Code
- Configuración de API Key para autenticación
- Detección automática de periodos de inactividad
- Análisis por proyecto y plataforma
- Compatibilidad con Windows, macOS y Linux
# DevTimer para VSCode

Esta extensión mide tu tiempo de desarrollo en VSCode y proporciona estadísticas útiles sobre tu productividad.

## Características

- Seguimiento automático del tiempo de desarrollo
- Monitoreo por proyecto, archivo y lenguaje
- Visualización de estadísticas diarias y semanales
- Integración con backend NestJS para almacenamiento persistente

## Instalación

1. Descarga el archivo VSIX de la extensión
2. En VSCode, ve a la pestaña de Extensiones
3. Haz clic en el menú (...) y selecciona "Instalar desde VSIX..."
4. Selecciona el archivo VSIX descargado

## Configuración

1. Configura la URL del servidor:
   - Abre la configuración de VSCode (Archivo > Preferencias > Configuración)
   - Busca "DevTimer"
   - Establece `devtimer.apiUrl` (por defecto: http://localhost:3000)

2. Configura tu API Key:
   - Obtén una API Key registrándote en el servidor DevTimer
   - En la configuración de VSCode, establece `devtimer.apiKey`

## Uso

1. Haz clic en el icono de DevTimer en la barra de actividad
2. Visualiza tus estadísticas de tiempo en el panel lateral
3. Haz clic en "Actualizar" para obtener las estadísticas más recientes

## Solución de problemas

Si no puedes ver tus datos:
1. Verifica que el servidor esté ejecutándose
2. Comprueba que la URL y la API Key sean correctas
3. Revisa los logs de la extensión en la consola de desarrollo

## Soporte

Para más información, visita [el repositorio del proyecto](https://github.com/tu-usuario/devtimer)
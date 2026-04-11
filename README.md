# 🔦 Lighthouse Audit Tool

**Lighthouse Audit Tool** es una aplicación gratuita para Windows que te permite analizar la calidad de cualquier sitio web: qué tan rápido carga, qué tan accesible es, si sigue las buenas prácticas y cómo está posicionado en buscadores (SEO). Todo desde tu computadora, sin necesidad de conocimientos técnicos.

---

## 📋 Tabla de Contenidos

1. [¿Qué hace esta aplicación?](#-qué-hace-esta-aplicación)
2. [Guía rápida — Usar el archivo .exe](#-guía-rápida--usar-el-archivo-exe)
3. [Cómo usar la aplicación paso a paso](#-cómo-usar-la-aplicación-paso-a-paso)
4. [Entender los resultados](#-entender-los-resultados)
5. [Exportar el informe a PDF](#-exportar-el-informe-a-pdf)
6. [Preguntas frecuentes](#-preguntas-frecuentes)
7. [Para desarrolladores — Instalar desde el código fuente](#-para-desarrolladores--instalar-desde-el-código-fuente)
8. [Tecnologías utilizadas](#-tecnologías-utilizadas)
9. [Créditos](#-créditos)
10. [Contribuciones](#-contribuciones)
11. [Licencia](#-licencia)

---

## ✨ ¿Qué hace esta aplicación?

Lighthouse Audit Tool analiza cualquier sitio web y te muestra una puntuación en cuatro áreas:

| Área                 | ¿Qué mide?                                                             |
| -------------------- | ---------------------------------------------------------------------- |
| **Rendimiento**      | Qué tan rápido carga la página                                         |
| **Accesibilidad**    | Si puede usarla cualquier persona, incluidas personas con discapacidad |
| **Buenas Prácticas** | Si el sitio sigue estándares modernos de desarrollo web                |
| **SEO**              | Qué tan bien optimizado está para aparecer en Google                   |

También podés exportar un **informe PDF** listo para compartir con clientes o colegas.

---

## 🚀 Guía rápida — Usar el archivo .exe

> Esta es la forma más sencilla de usar la app. **No necesitás instalar nada extra.**

### Paso 1 — Requisito: tener un navegador instalado

La aplicación necesita que tengas al menos uno de estos navegadores en tu computadora:

- **Google Chrome** ✅ (recomendado)
- **Microsoft Edge** ✅ (ya viene en Windows)
- **Brave Browser**
- **Opera**

Si tenés Windows 10 u 11, ya tenés **Microsoft Edge** instalado, así que no necesitás instalar nada más.

### Paso 2 — Descargar la aplicación

Descargá el archivo `Lighthouse Audit Tool.exe` desde la sección [Releases](../../releases) de este repositorio.

### Paso 3 — Ejecutar la aplicación

1. Hacé **doble clic** sobre el archivo `Lighthouse Audit Tool.exe`.
2. Si Windows muestra una advertencia de seguridad ("Windows protegió tu PC"), hacé clic en **"Más información"** y luego en **"Ejecutar de todos modos"**.
   > Esto es normal para aplicaciones portables que no tienen certificado de firma. El archivo es seguro.
3. La aplicación se abre directamente. **No requiere instalación.**

> El archivo `.exe` es **portable**: podés guardarlo en cualquier carpeta, en un pendrive, o en el escritorio. No modifica tu sistema ni deja entradas en el registro de Windows.

---

## 🖥️ Cómo usar la aplicación paso a paso

Una vez abierta la app, verás esta pantalla principal:

### 1. Ingresar la URL del sitio

En el campo de texto que dice **"https://ejemplo.com"**, escribí la dirección del sitio web que querés analizar.

- Siempre incluí `https://` o `http://` al principio.
- Ejemplos válidos: `https://www.google.com`, `https://miempresa.com.ar`

### 2. Elegir un navegador

La app detecta automáticamente los navegadores instalados en tu computadora y los muestra en un menú desplegable.

- Si ves navegadores en la lista, elegí uno (se recomienda **Chrome** o **Edge**).
- Si ningún navegador fue detectado, hacé clic en **"Usar otro navegador"**. Se abrirá el explorador de archivos para que ubiques manualmente el ejecutable del navegador (archivo `.exe`).

### 3. Iniciar la auditoría

Hacé clic en el botón **"Iniciar Auditoría"**.

- Verás una **barra de progreso** que indica en qué etapa está el análisis.
- El **log de actividad** (panel inferior) muestra en tiempo real lo que está haciendo la app.
- La auditoría suele tardar entre **30 y 60 segundos** dependiendo del sitio y tu conexión.

### 4. Ver los resultados

Cuando termine, aparecerán **cuatro tarjetas de puntuación** con medidores animados:

- 🟢 **Verde (90–100):** Excelente
- 🟡 **Naranja (50–89):** Necesita mejoras
- 🔴 **Rojo (0–49):** Crítico, requiere atención

---

## 📊 Entender los resultados

### Puntuaciones

Cada tarjeta muestra un número del 0 al 100. Cuanto más alto, mejor.

| Puntuación | Significado                                      |
| ---------- | ------------------------------------------------ |
| 90 – 100   | Excelente, el sitio está bien optimizado         |
| 50 – 89    | Aceptable, hay oportunidades de mejora           |
| 0 – 49     | Problemas importantes que afectan a los usuarios |

### Core Web Vitals

En el informe PDF también encontrarás los **Core Web Vitals**, que son las métricas que Google usa para medir la experiencia del usuario:

- **LCP (Largest Contentful Paint):** Tiempo hasta que carga el elemento principal de la página.
- **FID / TBT (Total Blocking Time):** Tiempo en que la página no responde a clics.
- **CLS (Cumulative Layout Shift):** Si los elementos de la página "saltan" mientras carga.

---

## 📄 Exportar el informe a PDF

1. Después de una auditoría exitosa, hacé clic en el botón **"Exportar PDF"**.
2. Se abrirá una ventana para elegir dónde guardar el archivo.
3. El PDF incluye: puntuaciones por categoría, Core Web Vitals y oportunidades de mejora.

> El archivo PDF queda guardado en la ubicación que elegiste y podés compartirlo libremente.

---

## ❓ Preguntas frecuentes

**¿Necesito conexión a internet?**  
Sí. La app necesita internet para poder acceder al sitio que querés analizar. El análisis se ejecuta localmente en tu computadora.

**¿La app guarda mis datos?**  
No. Lighthouse Audit Tool no envía ni almacena ningún dato tuyo en servidores externos. Todo se procesa localmente.

**La auditoría tarda mucho, ¿es normal?**  
Sí. Dependiendo del sitio y tu velocidad de internet, puede tardar entre 30 segundos y 2 minutos. Los sitios lentos o con muchos recursos tardan más.

**Aparece un error "No se detectó ningún navegador", ¿qué hago?**  
Usá el botón **"Usar otro navegador"** y seleccioná manualmente el `.exe` de tu navegador. Por ejemplo, en Windows Edge suele estar en:  
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

**Windows dice que el archivo es peligroso, ¿lo abro?**  
Sí, es seguro. Windows muestra esa advertencia porque el archivo no tiene firma digital de código. Hacé clic en "Más información" → "Ejecutar de todos modos".

**¿Funciona en Mac o Linux?**  
El archivo `.exe` es solo para Windows. Para Mac y Linux, necesitás compilar la app desde el código fuente (ver sección de desarrolladores).

---

## 🛠️ Para desarrolladores — Instalar desde el código fuente

> Esta sección es para personas con conocimientos técnicos que quieran modificar o contribuir al proyecto.

### Requisitos

- [Node.js](https://nodejs.org/) v18 o superior
- Al menos uno de los navegadores mencionados anteriormente

### Instalación

```bash
git clone https://github.com/joaquincalligaro/lighthouse-app.git
cd lighthouse-app
npm install
```

### Ejecutar en modo desarrollo

```bash
npm start
```

### Compilar el archivo .exe portable

```bash
npm run build
```

### Compilar el instalador .exe (con asistente de instalación)

```bash
npm run build:installer
```

El archivo generado queda en la carpeta de salida configurada en `package.json`.

### Tests

```bash
# Verifica que todos los módulos carguen correctamente (sin navegador, rápido)
npm run test:smoke

# Ejecuta una auditoría real contra una URL en vivo
npm run test:lighthouse
```

### Estructura del proyecto

```
lighthouse-app/
├── src/
│   ├── main/                    # Proceso principal de Electron
│   │   ├── app.js               # Creación de ventana y ciclo de vida
│   │   ├── ipcHandlers.js       # Registro de canales IPC
│   │   └── pdfExporter.js       # Generación de PDF con printToPDF
│   ├── core/                    # Lógica de negocio
│   │   ├── lighthouseRunner.js  # Lanza Chrome y ejecuta Lighthouse
│   │   └── browserDetector.js   # Detecta navegadores instalados
│   ├── icons/svg/browsers/      # Iconos SVG de cada navegador
│   └── renderer/                # Interfaz de usuario
│       ├── ui.html
│       ├── renderer.js
│       ├── style.css
│       └── hooks/
│           ├── useProgress.js
│           ├── useBrowsers.js
│           ├── useAudit.js
│           ├── useLog.js
│           ├── useDarkMode.js
│           └── usePdfReport.js
├── tests/
│   ├── smoke.test.js
│   └── lighthouse.test.js
├── package.json
└── README.md
```

---

## 🔧 Tecnologías utilizadas

| Tecnología              | Versión | Propósito                            |
| ----------------------- | ------- | ------------------------------------ |
| **Electron**            | ^41.2.0 | Shell de escritorio multiplataforma  |
| **Google Lighthouse**   | ^12.8.2 | Motor de auditoría web               |
| **chrome-launcher**     | ^1.2.1  | Lanza el navegador programáticamente |
| **Tailwind CSS**        | CDN     | Estilos y diseño                     |
| **tailwind-animations** | ^1.0.1  | Animaciones                          |
| **electron-builder**    | ^25.1.8 | Empaquetado e instaladores           |

---

## 🙏 Créditos

### Google Lighthouse

Esta app funciona gracias a [**Google Lighthouse**](https://github.com/GoogleChrome/lighthouse), desarrollada por el equipo de Chrome y licenciada bajo Apache 2.0.

### tailwind-animations by midudev

Las animaciones se construyeron con [**tailwind-animations**](https://github.com/midudev/tailwind-animations), creada por [Miguel Ángel Durán (midudev)](https://github.com/midudev).

### Tailwind CSS

Los estilos están construidos con [**Tailwind CSS**](https://tailwindcss.com).

### Iconos de navegadores

Los iconos SVG de Chrome, Brave, Edge y Opera fueron obtenidos de [**icons8.com**](https://icons8.com) bajo su licencia de uso gratuito con atribución.

---

## 🤝 Contribuciones

Este es un **proyecto de código abierto** — ¡contribuciones, issues y pull requests son bienvenidos!

1. Hacé un fork del repositorio
2. Creá tu rama: `git checkout -b feature/nombre-de-tu-feature`
3. Commiteá tus cambios: `git commit -m "feat: agrega mi feature"`
4. Pusheá la rama: `git push origin feature/nombre-de-tu-feature`
5. Abrí un Pull Request

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.

---

<p align="center">Made with ❤️ and powered by open source</p>

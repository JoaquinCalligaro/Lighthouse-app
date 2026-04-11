const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Carga los iconos SVG desde los archivos fuente para tener una única fuente de verdad.
// Cada archivo se lee una sola vez al iniciar y se cachea aquí.
const ICONS_DIR = path.join(__dirname, '../../icons/svg/browsers');

function loadSvg(name) {
  try {
    const raw = fs.readFileSync(path.join(ICONS_DIR, `${name}.svg`), 'utf8');
    // Fuerza un tamaño fijo de visualización independientemente de lo que declare el archivo
    return raw.replace(
      /<svg /,
      '<svg width="20" height="20" style="min-width:20px" ',
    );
  } catch {
    return null;
  }
}

const ICONS = {
  chrome: loadSvg('chrome'),
  brave: loadSvg('brave'),
  edge: loadSvg('edge'),
  opera: loadSvg('opera'),
  // Fallback para rutas personalizadas — no requiere archivo SVG
  custom: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
  </svg>`,
};

// Todos los navegadores soportados, siempre visibles en el dropdown sin importar si se detectaron
const BROWSER_CATALOG = [
  { name: 'Chrome', icon: 'chrome' },
  { name: 'Brave', icon: 'brave' },
  { name: 'Edge', icon: 'edge' },
  { name: 'Opera', icon: 'opera' },
];

function useBrowsers() {
  let isOpen = false;

  function openList() {
    const list = document.getElementById('browser-list');
    const chevron = document.getElementById('browser-chevron');
    if (!list) return;
    list.classList.remove('hidden');
    if (chevron) chevron.style.transform = 'translateY(-50%) rotate(180deg)';
    isOpen = true;
  }

  function closeList() {
    const list = document.getElementById('browser-list');
    const chevron = document.getElementById('browser-chevron');
    if (!list) return;
    list.classList.add('hidden');
    if (chevron) chevron.style.transform = 'translateY(-50%) rotate(0deg)';
    isOpen = false;
  }

  function selectEntry({ path, name, icon }) {
    const input = document.getElementById('browsers');
    const triggerIcon = document.getElementById('browser-trigger-icon');
    const triggerName = document.getElementById('browser-trigger-name');

    if (input) input.value = path;
    if (triggerIcon) triggerIcon.innerHTML = ICONS[icon] || ICONS.custom;
    if (triggerName) {
      triggerName.textContent = name;
      triggerName.classList.remove('text-slate-400', 'dark:text-slate-500');
    }
    // Resalta el elemento seleccionado en la lista
    const list = document.getElementById('browser-list');
    if (list) {
      list.querySelectorAll('li').forEach((el) => {
        el.classList.toggle('bg-blue-50', el.dataset.path === path);
        el.classList.toggle('dark:bg-slate-600', el.dataset.path === path);
      });
    }
    closeList();
  }

  function buildListItem(browser) {
    const li = document.createElement('li');
    li.role = 'option';
    li.dataset.path = browser.path || '';

    if (!browser.path) {
      // No detectado — elemento deshabilitado, no se puede hacer clic
      li.className =
        'flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed select-none';
      li.innerHTML = `
        <span class="flex-shrink-0 opacity-40">${ICONS[browser.icon] || ICONS.custom}</span>
        <span class="flex-1">${browser.name}</span>
        <span class="text-xs bg-red-500 dark:bg-red-800 text-white dark:text-white rounded px-1.5 py-0.5">No detectado</span>`;
    } else {
      // Disponible — totalmente seleccionable
      li.className =
        'flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer text-sm text-slate-800 dark:text-slate-100 transition-colors duration-100';
      li.innerHTML = `<span class="flex-shrink-0">${ICONS[browser.icon] || ICONS.custom}</span><span>${browser.name}</span>`;
      li.addEventListener('click', () =>
        selectEntry({
          path: browser.path,
          name: browser.name,
          icon: browser.icon,
        }),
      );
    }
    return li;
  }

  async function load() {
    const trigger = document.getElementById('browser-trigger');
    const list = document.getElementById('browser-list');
    const fallback = document.getElementById('browser-fallback');
    const otherBtn = document.getElementById('other-browser-btn');

    const detected = await ipcRenderer.invoke('get-browsers');

    // Construye un mapa de rutas por nombre a partir de los resultados detectados
    const detectedMap = {};
    detected.forEach((b) => {
      detectedMap[b.name] = b.path;
    });

    // Combina el catálogo con las rutas detectadas
    const allBrowsers = BROWSER_CATALOG.map((b) => ({
      ...b,
      path: detectedMap[b.name] || null,
    }));

    const anyDetected = detected.length > 0;

    // ── Poblar lista ────────────────────────────────────────────────
    list.innerHTML = '';
    allBrowsers.forEach((b) => list.appendChild(buildListItem(b)));

    if (!anyDetected) {
      if (fallback) fallback.classList.remove('hidden');
      if (trigger) trigger.disabled = true;
    } else {
      if (fallback) fallback.classList.add('hidden');
      if (trigger) trigger.disabled = false;
      // Auto-selecciona el primer navegador detectado
      selectEntry(detected[0]);
    }

    // ── Alternar listbox al hacer clic en el disparador ──────────────────────
    if (trigger) {
      trigger.addEventListener('click', () => {
        isOpen ? closeList() : openList();
      });
    }

    // ── Cerrar al hacer clic fuera del componente ──────────────────────────
    document.addEventListener('click', (e) => {
      const wrapper = document.getElementById('browser-dropdown-wrapper');
      if (wrapper && !wrapper.contains(e.target)) closeList();
    });

    // ── Botón "Usar otro navegador" ─────────────────────────────────────────
    if (otherBtn) {
      otherBtn.addEventListener('click', async () => {
        const chosen = await ipcRenderer.invoke('select-browser-path');
        if (!chosen) return;

        const name = `Personalizado: ${chosen.split(/[\\/]/).pop()}`;
        const browser = { path: chosen, name, icon: 'custom' };

        // Reemplaza la entrada personalizada existente si la hay
        const existing = list.querySelector('li[data-custom="true"]');
        if (existing) existing.remove();
        const li = buildListItem(browser);
        li.dataset.custom = 'true';
        list.appendChild(li);

        if (fallback) fallback.classList.add('hidden');
        if (trigger) trigger.disabled = false;

        selectEntry(browser);
      });
    }
  }

  return { load };
}

module.exports = { useBrowsers };

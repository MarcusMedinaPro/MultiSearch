/**
 * MultiSearch - Chrome Extension
 * Instantly switch between search engines without retyping your query.
 * 
 * @author Marcus Ackre Medina
 * @license MIT
 */

const searchEngines = {
    google: {
        name: 'Google',
        icon: '🔍',
        color: '#4285f4',
        url: (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        icon: '🦆',
        color: '#de5833',
        url: (q) => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    ecosia: {
        name: 'Ecosia',
        icon: '🌱',
        color: '#60b515',
        url: (q) => `https://www.ecosia.org/search?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    brave: {
        name: 'Brave',
        icon: '🦁',
        color: '#fb542b',
        url: (q) => `https://search.brave.com/search?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    startpage: {
        name: 'Startpage',
        icon: '⭐',
        color: '#1b5cff',
        url: (q) => `https://www.startpage.com/do/search?query=${encodeURIComponent(q)}`,
        querySelector: 'input[name="query"], input[name="q"]'
    },
    mojeek: {
        name: 'Mojeek',
        icon: '🛰️',
        color: '#f28c28',
        url: (q) => `https://www.mojeek.com/search?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    yahoo: {
        name: 'Yahoo',
        icon: '🟣',
        color: '#6001d2',
        url: (q) => `https://search.yahoo.com/search?p=${encodeURIComponent(q)}`,
        querySelector: 'input[name="p"]'
    },
    ask: {
        name: 'Ask',
        icon: '❓',
        color: '#f05a28',
        url: (q) => `https://www.ask.com/web?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    qwant: {
        name: 'Qwant',
        icon: '🧭',
        color: '#5f5af4',
        url: (q) => `https://www.qwant.com/?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    },
    bing: {
        name: 'Bing',
        icon: '🅱️',
        color: '#008373',
        url: (q) => `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
        querySelector: 'input[name="q"]'
    }
};

function detectCurrentEngine() {
    const hostname = window.location.hostname;

    if (hostname.includes('google.')) return 'google';
    if (hostname.includes('bing.')) return 'bing';
    if (hostname.includes('duckduckgo.')) return 'duckduckgo';
    if (hostname.includes('ecosia.')) return 'ecosia';
    if (hostname.includes('search.brave.com')) return 'brave';
    if (hostname.includes('startpage.')) return 'startpage';
    if (hostname.includes('qwant.')) return 'qwant';
    if (hostname.includes('mojeek.')) return 'mojeek';
    if (hostname.includes('search.yahoo.com')) return 'yahoo';
    if (hostname.includes('ask.')) return 'ask';

    return null;
}

function getSearchQuery(engine) {
    const searchInput = document.querySelector(engine.querySelector);
    return searchInput ? searchInput.value.trim() : '';
}

function createSearchButtons() {
    const currentEngineName = detectCurrentEngine();
    if (!currentEngineName) return;

    const currentEngine = searchEngines[currentEngineName];
    const otherEngines = Object.entries(searchEngines)
        .filter(([key]) => key !== currentEngineName);

    if (document.getElementById('multisearch-strip')) return;

    if (!document.getElementById('multisearch-styles')) {
        const style = document.createElement('style');
        style.id = 'multisearch-styles';
        style.textContent = `
            #multisearch-strip {
                position: fixed;
                top: 50%;
                left: 0;
                transform: translateY(-50%) translateX(-100%);
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: none;
                border-radius: 0 8px 8px 0;
                padding: 6px 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                z-index: 999999;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            #multisearch-strip.visible {
                transform: translateY(-50%) translateX(0);
            }
            #multisearch-tab {
                position: fixed;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 20px;
                height: 48px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-left: none;
                border-radius: 0 6px 6px 0;
                cursor: pointer;
                z-index: 999998;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            #multisearch-tab:hover {
                width: 24px;
                background: linear-gradient(135deg, #2a2a4e 0%, #1e2a4e 100%);
            }
            #multisearch-tab::after {
                content: '›';
                color: rgba(255, 255, 255, 0.7);
                font-size: 18px;
                font-weight: bold;
            }
            #multisearch-tab.open::after {
                content: '‹';
            }
            .multisearch-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                font-size: 18px;
                text-decoration: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
                position: relative;
            }
            .multisearch-icon:hover {
                transform: scale(1.15);
            }
            .multisearch-icon:active {
                transform: scale(0.95);
            }
            .multisearch-icon[data-disabled="true"] {
                opacity: 0.4;
                pointer-events: none;
            }
            .multisearch-tooltip {
                position: absolute;
                left: calc(100% + 8px);
                top: 50%;
                transform: translateY(-50%);
                background: #1a1a2e;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.15s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                z-index: 1000000;
            }
            .multisearch-icon:hover .multisearch-tooltip {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    const tab = document.createElement('div');
    tab.id = 'multisearch-tab';

    const strip = document.createElement('div');
    strip.id = 'multisearch-strip';

    const engineButtons = [];

    const updateButtonState = (button, engine) => {
        const query = getSearchQuery(currentEngine);
        const hasQuery = query.length > 0;
        button.href = hasQuery ? engine.url(query) : '#';
        button.dataset.disabled = !hasQuery;
    };

    otherEngines.forEach(([key, engine]) => {
        const button = document.createElement('a');
        button.className = 'multisearch-icon';
        button.dataset.engine = key;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.style.background = engine.color;
        button.textContent = engine.icon;

        const tooltip = document.createElement('span');
        tooltip.className = 'multisearch-tooltip';
        tooltip.textContent = engine.name;
        button.appendChild(tooltip);

        updateButtonState(button, engine);
        engineButtons.push({ button, engine });

        button.addEventListener('click', (e) => {
            if (button.dataset.disabled === 'true') {
                e.preventDefault();
            }
        });

        strip.appendChild(button);
    });

    let isOpen = false;
    const toggleStrip = () => {
        isOpen = !isOpen;
        strip.classList.toggle('visible', isOpen);
        tab.classList.toggle('open', isOpen);
    };

    tab.addEventListener('click', toggleStrip);

    strip.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!strip.matches(':hover') && !tab.matches(':hover')) {
                isOpen = false;
                strip.classList.remove('visible');
                tab.classList.remove('open');
            }
        }, 300);
    });

    document.body.appendChild(tab);
    document.body.appendChild(strip);

    const searchInput = document.querySelector(currentEngine.querySelector);
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            engineButtons.forEach(({ button, engine }) => {
                updateButtonState(button, engine);
            });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchButtons);
} else {
    createSearchButtons();
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('multisearch-strip')) {
        createSearchButtons();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

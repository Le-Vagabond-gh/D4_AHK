// ==UserScript==
// @name         Diablo Trade Rune Price Checker
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a button to check rune prices on diablo.trade
// @author       Le Vagabond
// @match        https://diablo.trade/*
// @grant        none
// @run-at       document-start
// @updateURL    https://github.com/Le-Vagabond-gh/D4_AHK/raw/refs/heads/main/d4.trade_rune-price-check.user.js
// @downloadURL  https://github.com/Le-Vagabond-gh/D4_AHK/raw/refs/heads/main/d4.trade_rune-price-check.user.js
// ==/UserScript==

(function() {
  'use strict';

  async function searchJsFilesForNextAction() {
    try {
      const scripts = document.querySelectorAll('script[src]');
      const resources = performance.getEntriesByType('resource');
      const jsResources = resources.filter(r => 
        r.initiatorType === 'script' || 
        r.name.endsWith('.js') || 
        r.name.includes('.js?')
      );

      const jsUrls = new Set();
      scripts.forEach(script => {
        if (script.src) jsUrls.add(script.src);
      });
      jsResources.forEach(resource => {
        jsUrls.add(resource.name);
      });

      for (const url of jsUrls) {
        try {
          const response = await fetch(url, { cache: 'force-cache' });
          const content = await response.text();

          if (content.includes('unifiedSearchAction')) {
            const searchString = 'unifiedSearchAction';
            let index = content.indexOf(searchString);
            
            while (index !== -1) {
              let parenStart = content.indexOf('(', index);
              
              if (parenStart !== -1) {
                let parenCount = 1;
                let parenEnd = parenStart + 1;
                
                while (parenEnd < content.length && parenCount > 0) {
                  if (content[parenEnd] === '(') {
                    parenCount++;
                  } else if (content[parenEnd] === ')') {
                    parenCount--;
                  }
                  parenEnd++;
                }
                
                if (parenCount === 0) {
                  let contextStart = index;
                  while (contextStart > 0 && content[contextStart] !== ';') {
                    contextStart--;
                  }
                  if (content[contextStart] === ';') {
                    contextStart++;
                  }
                  
                  let contextEnd = parenEnd;
                  while (contextEnd < content.length && content[contextEnd] !== ';') {
                    contextEnd++;
                  }
                  if (content[contextEnd] === ';') {
                    contextEnd++;
                  }
                  
                  const context = content.substring(contextStart, contextEnd).trim();
                  
                  if (context.length > 0) {
                    const refIndex = context.indexOf('createServerReference');
                    if (refIndex !== -1) {
                      const openParen = context.indexOf('(', refIndex);
                      if (openParen !== -1) {
                        const firstQuote = context.indexOf('"', openParen);
                        const firstSingleQuote = context.indexOf("'", openParen);
                        
                        let quotePos = -1;
                        let quoteChar = '"';
                        if (firstQuote !== -1 && (firstSingleQuote === -1 || firstQuote < firstSingleQuote)) {
                          quotePos = firstQuote;
                          quoteChar = '"';
                        } else if (firstSingleQuote !== -1) {
                          quotePos = firstSingleQuote;
                          quoteChar = "'";
                        }
                        
                        if (quotePos !== -1) {
                          const closeQuote = context.indexOf(quoteChar, quotePos + 1);
                          if (closeQuote !== -1) {
                            const hash = context.substring(quotePos + 1, closeQuote);
                            console.log('[Rune Price Checker] Found nextAction hash:', hash);
                            nextHeadersCache.nextAction = hash;
                            nextHeadersCache.updatedAt = Date.now();
                            return hash;
                          }
                        }
                      }
                    }
                  }
                }
              }
              
              index = content.indexOf(searchString, index + 1);
            }
          }
        } catch (err) {
        }
      }
    } catch (error) {
      console.error('[Rune Price Checker] Error searching for nextAction:', error);
    }
    return null;
  }

  const nextHeadersCache = {
    nextAction: null,
    nextRouterStateTree: '%5B%22%22%2C%7B%22children%22%3A%5B%22(app)%22%2C%7B%22children%22%3A%5B%22(session)%22%2C%7B%22children%22%3A%5B%22listings%22%2C%7B%22children%22%3A%5B%22(search)%22%2C%7B%22children%22%3A%5B%22items%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
    updatedAt: 0
  };

  function normalizeHeadersToLowerMap(headers) {
    const out = {};
    if (!headers) return out;
    try {
      if (headers instanceof Headers) {
        headers.forEach((v, k) => {
          out[String(k).toLowerCase()] = String(v);
        });
        return out;
      }
      if (Array.isArray(headers)) {
        for (const pair of headers) {
          if (!pair || pair.length < 2) continue;
          out[String(pair[0]).toLowerCase()] = String(pair[1]);
        }
        return out;
      }
      for (const k of Object.keys(headers)) {
        out[String(k).toLowerCase()] = String(headers[k]);
      }
    } catch {
    }
    return out;
  }

  function captureNextHeadersFromMap(map) {
    if (!map) return;
    const action = map['next-action'];
    const tree = map['next-router-state-tree'];

    let changed = false;
    if (action && action !== nextHeadersCache.nextAction) {
      nextHeadersCache.nextAction = action;
      changed = true;
    }
    if (tree && tree !== nextHeadersCache.nextRouterStateTree) {
      nextHeadersCache.nextRouterStateTree = tree;
      changed = true;
    }

    if (changed) nextHeadersCache.updatedAt = Date.now();
  }

  function tryCaptureNextHeadersFromFetchArgs(input, init) {
    try {
      if (input && typeof input === 'object' && input.headers) {
        captureNextHeadersFromMap(normalizeHeadersToLowerMap(input.headers));
      }
      if (init && init.headers) {
        captureNextHeadersFromMap(normalizeHeadersToLowerMap(init.headers));
      }
    } catch {
    }
  }

  function installFetchCaptureHook() {
    try {
      if (window.__d4TradeFetchHookInstalled) return;
      window.__d4TradeFetchHookInstalled = true;

      const originalFetch = window.fetch;
      if (typeof originalFetch !== 'function') return;

      window.fetch = function(input, init) {
        tryCaptureNextHeadersFromFetchArgs(input, init);
        return originalFetch.call(this, input, init);
      };
    } catch {
    }
  }

  installFetchCaptureHook();

  async function getListingsItemsNextHeaders() {
    let nextAction = nextHeadersCache.nextAction;

    if (!nextAction) {
      console.log('[Rune Price Checker] nextAction not in cache, searching JS files...');
      nextAction = await searchJsFilesForNextAction();
      if (!nextAction) {
        throw new Error('Could not find nextAction in any JS files');
      }
    }

    return {
      'next-action': nextAction,
      'next-router-state-tree': nextHeadersCache.nextRouterStateTree
    };
  }

  function chunkArray(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  function extractListingIdsFromRscText(text) {
    const key = '"listings":[';
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    let best = [];
    let fromIndex = 0;

    while (true) {
      const keyIndex = text.indexOf(key, fromIndex);
      if (keyIndex === -1) break;

      const start = keyIndex + key.length - 1;
      let i = start;
      let depth = 0;
      let inString = false;
      let escaped = false;

      for (; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (ch === '\\') {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
          continue;
        }

        if (ch === '[') depth++;
        if (ch === ']') {
          depth--;
          if (depth === 0) {
            const arrayText = text.slice(start, i + 1);
            try {
              const parsed = JSON.parse(arrayText);
              if (
                Array.isArray(parsed) &&
                parsed.length > 0 &&
                parsed.every(v => typeof v === 'string' && uuidRe.test(v))
              ) {
                if (parsed.length > best.length) best = parsed;
              }
            } catch {
            }
            break;
          }
        }
      }

      fromIndex = i + 1;
    }

    return best;
  }

  let runeBtnObserver = null;
  let addButtonAttempts = 0;
  let lastInjectAt = 0;
  let injectQueued = false;

  function getMainNavUl() {
    return (
      document.querySelector('header nav[aria-label="Main"] ul[data-orientation="horizontal"]') ||
      document.querySelector('header nav[aria-label="Main"] ul') ||
      document.querySelector('header nav ul[data-orientation="horizontal"]') ||
      document.querySelector('header nav ul')
    );
  }

  function findSupportUsLi(root) {
    if (!root) return null;
    const koFiLink = root.querySelector('a[href="https://ko-fi.com/diablotrade"]');
    if (koFiLink) return koFiLink.closest('li');

    const candidates = root.querySelectorAll('a,button');
    for (const el of candidates) {
      const text = (el.textContent || '').trim();
      if (text.includes('Support Us')) {
        const li = el.closest('li');
        if (li) return li;
      }
    }
    return null;
  }

  function queueAddButton() {
    const now = Date.now();
    if (injectQueued) return;
    if (now - lastInjectAt < 750) return;
    injectQueued = true;
    setTimeout(() => {
      injectQueued = false;
      lastInjectAt = Date.now();
      addButtonWhenReady();
    }, 0);
  }

  function ensureButtonObserver() {
    if (runeBtnObserver) return;
    runeBtnObserver = new MutationObserver(() => {
      if (!document.getElementById('rune-price-checker-btn-li')) {
        queueAddButton();
      }
    });
    const root = document.body || document.documentElement;
    if (root) runeBtnObserver.observe(root, { childList: true, subtree: true });
  }

  // Wait for the header to be available
  function addButtonWhenReady() {
    if (document.getElementById('rune-price-checker-btn-li')) return;

    const navUl = getMainNavUl();
    const supportLi = findSupportUsLi(navUl);
    if (!navUl || !supportLi) {
      ensureButtonObserver();
      addButtonAttempts++;
      if (addButtonAttempts === 30) {
        console.warn('[RunePriceChecker] Header nav target not found yet.');
      }
      setTimeout(addButtonWhenReady, 500);
      return;
    }

    ensureButtonObserver();

    // Create the LI container (required by the site header)
    const li = document.createElement('li');
    li.id = 'rune-price-checker-btn-li';
    li.style.position = 'relative';

    // Create the button
    const runeBtn = document.createElement('button');
    runeBtn.type = 'button';
    // Remove text, add image
    runeBtn.style.background = '#222';
    runeBtn.style.color = '#ffd700';
    runeBtn.style.border = '1px solid #444';
    runeBtn.style.borderRadius = '4px';
    runeBtn.style.padding = '4px 8px';
    runeBtn.style.cursor = 'pointer';
    runeBtn.style.fontWeight = 'bold';
    runeBtn.style.marginLeft = '8px';
    runeBtn.style.display = 'flex';
    runeBtn.style.alignItems = 'center';
    runeBtn.style.justifyContent = 'center';

    // Tooltip span (hidden by default)
    const tooltip = document.createElement('span');
    tooltip.textContent = 'Rune Price Checker';
    tooltip.style.visibility = 'hidden';
    tooltip.style.background = '#333';
    tooltip.style.color = '#ffd700';
    tooltip.style.textAlign = 'center';
    tooltip.style.borderRadius = '4px';
    tooltip.style.padding = '4px 10px';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '10001';
    tooltip.style.bottom = '-36px';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.fontSize = '13px';
    tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    tooltip.style.pointerEvents = 'none';

    li.appendChild(runeBtn);
    li.appendChild(tooltip);

    const runeImg = document.createElement('img');
    runeImg.src = 'https://cdn.static.diablo.trade/game/materials/rune/jah.webp';
    runeImg.alt = 'Rune Price Checker';
    runeImg.style.width = '24px';
    runeImg.style.height = '24px';
    runeImg.style.display = 'block';
    runeImg.style.objectFit = 'contain';
    runeBtn.appendChild(runeImg);

    runeBtn.addEventListener('mouseover', () => {
      runeBtn.style.background = '#333';
      tooltip.style.visibility = 'visible';
    });
    runeBtn.addEventListener('mouseout', () => {
      runeBtn.style.background = '#222';
      tooltip.style.visibility = 'hidden';
    });
    runeBtn.addEventListener('click', showRunePriceChecker);

    if (supportLi.nextSibling) {
      navUl.insertBefore(li, supportLi.nextSibling);
    } else {
      navUl.appendChild(li);
    }
  }

  // Main logic moved to a function
  async function showRunePriceChecker() {
    // Prevent multiple containers
    if (document.getElementById('rune-price-checker-container')) return;

    // Dark theme colors
    const colors = {
      background: '#1e1e1e',
      text: '#e0e0e0',
      border: '#444444',
      headerBg: '#2d2d2d',
      buttonBg: '#3a3a3a',
      buttonHover: '#505050',
      tableBorder: '#444444',
      tableRowEven: '#2a2a2a',
      tableRowOdd: '#252525'
    };

    // List of runes from runes.txt
    const runes = [
      "Ahu", "Bac", "Cem", "Cip", "Cir", "Feo", "Hak", "Igni", "Kaa", "Lith", "Moni", "Nagu", "Neo", "Noc", "Pac", "Poc", "Tam", "Tza", "Ur", "Xol", "Yax", "Yul", "Zan", "Ceh", "Cha", "Chac", "Ehe", "Eom", "Gar", "Ixk", "Ixt", "Jah", "Kel", "Kry", "Lac", "Lum", "May", "Met", "Mot", "Nam", "Ner", "Ohm", "Ono", "Qax", "Qua", "Que", "Tal", "Teb", "Tec", "Thar", "Thul", "Ton", "Tun", "Tzic", "Ura", "Vex", "Wat", "Xal", "Xan", "Yom", "Zec", "Zid"
    ];

    // Create a container for our results
    const container = document.createElement('div');
    container.id = 'rune-price-checker-container';
    container.style.position = 'fixed';
    container.style.top = '70px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.backgroundColor = colors.background;
    container.style.color = colors.text;
    container.style.padding = '20px';
    container.style.zIndex = '10000';
    container.style.border = `1px solid ${colors.border}`;
    container.style.borderRadius = '5px';
    container.style.maxHeight = '90vh';
    container.style.overflow = 'auto';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.maxWidth = '650px';
    container.style.width = '95%';

    // --- Modal header with title and close button ---
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '10px';

    const title = document.createElement('h2');
    title.textContent = 'Rune Price Checker (online sellers only)';
    title.style.color = colors.text;
    title.style.margin = '0';
    title.style.borderBottom = `1px solid ${colors.border}`;
    title.style.paddingBottom = '10px';
    title.style.flex = '1';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.backgroundColor = colors.buttonBg;
    closeButton.style.color = colors.text;
    closeButton.style.border = `1px solid ${colors.border}`;
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '6px 16px';
    closeButton.style.marginLeft = '16px';
    closeButton.style.fontWeight = 'bold';
    closeButton.addEventListener('mouseover', () => {
      closeButton.style.backgroundColor = colors.buttonHover;
    });
    closeButton.addEventListener('mouseout', () => {
      closeButton.style.backgroundColor = colors.buttonBg;
    });
    closeButton.addEventListener('click', () => {
      container.remove();
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);

    // Add a loading message
    const loading = document.createElement('p');
    loading.textContent = 'Loading rune prices...';
    loading.style.color = colors.text;
    container.appendChild(loading);

    // Add a progress list for runes being loaded
    const progressList = document.createElement('ul');
    progressList.style.listStyle = 'none';
    progressList.style.padding = '0';
    progressList.style.margin = '0 0 10px 0';
    progressList.style.fontSize = '13px';
    container.appendChild(progressList);

    // Create the table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.maxWidth = '600px';
    table.style.margin = '0 auto';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    table.style.color = colors.text;
    
    // Add table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = colors.headerBg;
    // Add Median Price column to the header
    ['Rune', 'Lowest Price', 'Highest Price', 'Median Price', 'Average Price'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.border = `1px solid ${colors.tableBorder}`;
      th.style.padding = '10px';
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    // Add the container to the page
    document.body.appendChild(container);
    container.appendChild(table);

    // Ensure headers are populated before fetching prices
    try {
      loading.textContent = 'Initializing headers...';
      await getListingsItemsNextHeaders();
      loading.textContent = 'Loading rune prices...';
    } catch (error) {
      loading.textContent = 'Error: ' + error.message;
      console.error('[Rune Price Checker]', error);
      return;
    }

    // Add indicator for data source
    const info = document.createElement('div');
    info.textContent = 'Showing prices from online SELL listings (first 100 results, outliers removed)';
    info.style.fontSize = '12px';
    info.style.color = '#aaa';
    info.style.margin = '8px 0 0 0';
    container.appendChild(info);

    // Helper function to filter outliers using the IQR method
    function filterOutliers(prices) {
      const sorted = (prices || [])
        .filter(p => typeof p === 'number' && Number.isFinite(p) && p > 0)
        .sort((a, b) => a - b);

      if (sorted.length < 4) return sorted;
      const q1 = sorted[Math.floor((sorted.length / 4))];
      const q3 = sorted[Math.floor((sorted.length * (3 / 4)))];
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;

      let filtered = sorted.filter(p => p >= lower && p <= upper);

      if (filtered.length >= 4) {
        const trim = filtered.length >= 20 ? Math.floor(filtered.length * 0.05) : 0;
        if (trim > 0) filtered = filtered.slice(trim, filtered.length - trim);

        const med = calculateMedian(filtered);
        if (med > 0) {
          const relativeFloor = med * 0.10;
          filtered = filtered.filter(p => p >= relativeFloor);
        }
      }

      return filtered;
    }

    // Helper function to calculate median
    function calculateMedian(prices) {
      if (prices.length === 0) return 0;
      const sorted = [...prices].sort((a, b) => a - b);
      const middle = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
      }
      return sorted[middle];
    }

    // Helper function to fetch prices for a rune
    async function getRunePrices(rune) {
      const formData = new FormData();
      const queryPayload = {
        listingType: "ITEM",
        name: rune,
        gameMode: "SEASONAL_SOFTCORE",
        listingMode: "SELLING",
        onlineStatus: "ONLINE",
        itemCategory: "",
        itemRarity: "",
        sockets: "",
        greaterAffixes: "",
        classType: "",
        auctionType: "",
        listPeriod: "",
        priceMin: "",
        priceMax: "",
        itemPowerMin: "0",
        itemPowerMax: "800",
        levelRequirementMin: "0",
        levelRequirementMax: "60",
        statFilters: [],
        priceVisibility: "ANY",
        sortAttributeDirection: "desc"
      };

      formData.append("1_input", JSON.stringify(queryPayload));
      formData.append("0", JSON.stringify([{ "error": "" }, "$K1"]));

      try {
        const nextHeaders = await getListingsItemsNextHeaders();
        const searchResponse = await fetch("https://diablo.trade/listings/items", {
          method: "POST",
          headers: {
            "Accept": "text/x-component",
            ...nextHeaders
          },
          credentials: "include",
          body: formData
        });

        if (!searchResponse.ok && searchResponse.status !== 303) {
          return [];
        }

        const searchText = await searchResponse.text();
        const listingIds = extractListingIdsFromRscText(searchText);
        if (listingIds.length === 0) return [];

        const limitedIds = listingIds.slice(0, 100);
        const idChunks = chunkArray(limitedIds, 10);
        let items = [];

        const detailsConcurrency = 3;
        for (let i = 0; i < idChunks.length; i += detailsConcurrency) {
          const batch = idChunks.slice(i, i + detailsConcurrency);
          const parts = await Promise.all(
            batch.map(async (ids) => {
              const detailsResponse = await fetch(`https://diablo.trade/api/listing/get?ids=${ids.join(',')}`, {
                method: "GET",
                headers: { "Accept": "application/json" },
                credentials: "include"
              });
              if (!detailsResponse.ok) return [];
              const part = await detailsResponse.json();
              return Array.isArray(part) ? part : [];
            })
          );
          for (const part of parts) items = items.concat(part);
        }

        const prices = items
          .map(i => i && i.rawPrice)
          .filter(p => typeof p === 'number' && !isNaN(p) && p > 0);

        return filterOutliers(prices);
      } catch (error) {
        console.error(`Error fetching ${rune}:`, error);
        return [];
      }
    }

    // Process all runes and update the table
    async function processRunes() {
      // Map rune name to result or status
      const runeRows = {};
      const runeResults = {};
      tbody.innerHTML = ''; // Clear table before starting

      // Initialize table rows with loading indicators
      runes.forEach((rune, idx) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = idx % 2 === 0 ? colors.tableRowEven : colors.tableRowOdd;

        // Rune name
        const nameCell = document.createElement('td');
        nameCell.textContent = rune;
        nameCell.style.border = `1px solid ${colors.tableBorder}`;
        nameCell.style.padding = '8px';
        row.appendChild(nameCell);

        // Bottom Price
        const bottomCell = document.createElement('td');
        bottomCell.textContent = '⏳';
        bottomCell.style.border = `1px solid ${colors.tableBorder}`;
        bottomCell.style.padding = '8px';
        row.appendChild(bottomCell);

        // Top Price
        const topCell = document.createElement('td');
        topCell.textContent = '⏳';
        topCell.style.border = `1px solid ${colors.tableBorder}`;
        topCell.style.padding = '8px';
        row.appendChild(topCell);

        // Median Price (new)
        const medianCell = document.createElement('td');
        medianCell.textContent = '⏳';
        medianCell.style.border = `1px solid ${colors.tableBorder}`;
        medianCell.style.padding = '8px';
        row.appendChild(medianCell);

        // Avg Price
        const avgCell = document.createElement('td');
        avgCell.textContent = '⏳';
        avgCell.style.border = `1px solid ${colors.tableBorder}`;
        avgCell.style.padding = '8px';
        row.appendChild(avgCell);

        tbody.appendChild(row);

        runeRows[rune] = { row, bottomCell, topCell, medianCell, avgCell };
      });

      const concurrency = 8;
      let completed = 0;

      async function runBatches() {
        let i = 0;
        while (i < runes.length) {
          const batch = [];
          for (let j = 0; j < concurrency && i < runes.length; j++, i++) {
            const rune = runes[i];
            batch.push(
              (async () => {
                const prices = await getRunePrices(rune);
                let result;
                if (prices.length > 0) {
                  const sortedGold = [...prices].sort((a, b) => a - b);
                  const minGold = sortedGold[0];
                  const maxGold = sortedGold[sortedGold.length - 1];
                  const medianGold = calculateMedian(sortedGold);
                  const avgGold = sortedGold.reduce((a, b) => a + b, 0) / sortedGold.length;
                  result = {
                    rune,
                    topPrice: Math.ceil(maxGold / 1_000_000),
                    bottomPrice: Math.ceil(minGold / 1_000_000),
                    medianPrice: Math.ceil(medianGold / 1_000_000),
                    avgPrice: Math.ceil(avgGold / 1_000_000)
                  };
                } else {
                  result = {
                    rune,
                    topPrice: 0,
                    bottomPrice: 0,
                    medianPrice: 0,
                    avgPrice: 0
                  };
                }
                // Update the table row for this rune
                const { bottomCell, topCell, medianCell, avgCell } = runeRows[rune];
                bottomCell.textContent = Number.isFinite(result.bottomPrice) && result.bottomPrice > 0 ? result.bottomPrice.toLocaleString() + 'm' : '0';
                topCell.textContent = Number.isFinite(result.topPrice) && result.topPrice > 0 ? result.topPrice.toLocaleString() + 'm' : '0';
                medianCell.textContent = Number.isFinite(result.medianPrice) && result.medianPrice > 0 ? result.medianPrice.toLocaleString() + 'm' : '0';
                avgCell.textContent = Number.isFinite(result.avgPrice) && result.avgPrice > 0 ? result.avgPrice.toLocaleString() + 'm' : '0';
                runeResults[rune] = result;
                completed++;
                loading.textContent = `Loading runes... (${completed}/${runes.length})`;
              })()
            );
          }
          await Promise.all(batch);
        }
      }

      loading.textContent = `Loading runes... (0/${runes.length})`;
      await runBatches();
      loading.textContent = '';

      // --- Sort rows by avgPrice descending ---
      // Remove all rows
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      // Sort runes by avgPrice descending
      const sortedRunes = Object.values(runeResults)
        .filter(res => [res.bottomPrice, res.topPrice, res.medianPrice, res.avgPrice].some(v => Number.isFinite(v) && v > 0))
        .sort((a, b) => b.avgPrice - a.avgPrice)
        .map(res => res.rune);
      // Append rows in sorted order
      sortedRunes.forEach((rune, idx) => {
        const { row } = runeRows[rune];
        row.style.backgroundColor = idx % 2 === 0 ? colors.tableRowEven : colors.tableRowOdd;
        tbody.appendChild(row);
      });
    }

    // Start processing
    processRunes();
  }

  // Run when page is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureButtonObserver();
      setTimeout(addButtonWhenReady, 1500);
    });
  } else {
    ensureButtonObserver();
    setTimeout(addButtonWhenReady, 1500);
  }

  window.addEventListener('load', () => {
    ensureButtonObserver();
    queueAddButton();
  });
})();

// ==UserScript==
// @name         Diablo Trade Rune Price Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to check rune prices on diablo.trade
// @author       Le Vagabond
// @match        https://diablo.trade/*
// @grant        none
// @updateURL    https://github.com/Le-Vagabond-gh/D4_AHK/raw/refs/heads/main/d4.trade_rune-price-check.user.js
// @downloadURL  https://github.com/Le-Vagabond-gh/D4_AHK/raw/refs/heads/main/d4.trade_rune-price-check.user.js
// ==/UserScript==

(function() {
  'use strict';

  // Wait for the header to be available
  function addButtonWhenReady() {
    const targetDiv = document.querySelector('header.sticky nav div.flex.items-center.gap-2');
    if (!targetDiv) {
      setTimeout(addButtonWhenReady, 500);
      return;
    }

    // Create the button
    const runeBtn = document.createElement('button');
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

    // Container for positioning relative to button
    const btnWrapper = document.createElement('span');
    btnWrapper.style.position = 'relative';
    btnWrapper.appendChild(runeBtn);
    btnWrapper.appendChild(tooltip);

    const runeImg = document.createElement('img');
    runeImg.src = 'https://diablo.trade/_next/image?url=%2Fassets%2Frunes%2Fjah.webp&w=64&q=75';
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

    targetDiv.appendChild(btnWrapper);
  }

  // Main logic moved to a function
  function showRunePriceChecker() {
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
      "Ahu", "Bac", "Ceh", "Cem", "Chac", "Cir", "Eom", "Feo", "Gar", "Igni", "Jah", "Kry", "Lac", "Lith", "Lum", "Met", "Moni", "Mot", "Nagu", "Neo", "Ner", "Noc", "Ohm", "Poc", "Qax", "Qua", "Que", "Tal", "Tam", "Teb", "Tec", "Thul", "Ton", "Tun", "Tzic", "Ur", "Vex", "Wat", "Xal", "Xan", "Xol", "Yax", "Yom", "Yul", "Zan", "Zec"
    ];

    // Create a container for our results
    const container = document.createElement('div');
    container.id = 'rune-price-checker-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
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
    title.textContent = 'Rune Price Checker';
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
    // Columns: Rune, Bottom Price, Top Price, Average Price
    ['Rune', 'Bottom Price', 'Top Price', 'Average Price'].forEach(text => {
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

    // Add indicator for data source
    const info = document.createElement('div');
    info.textContent = 'Showing prices from the most recent 100 results (last 2 days max)';
    info.style.fontSize = '12px';
    info.style.color = '#aaa';
    info.style.margin = '8px 0 0 0';
    container.appendChild(info);

    // Helper function to filter outliers using the IQR method
    function filterOutliers(prices) {
      if (prices.length < 4) return prices; // Not enough data to filter
      const sorted = [...prices].sort((a, b) => a - b);
      const q1 = sorted[Math.floor((sorted.length / 4))];
      const q3 = sorted[Math.floor((sorted.length * (3 / 4)))];
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      return prices.filter(p => p >= lower && p <= upper);
    }

    // Helper function to fetch prices for a rune
    async function getRunePrices(rune) {
      // Use createdAt filter for last 2 days, no limit param
      const url = `${location.origin}/api/items/search?cursor=1&mode=season+softcore&rune=${encodeURIComponent(rune)}&sort=newest&type=WTB&price=500000,1000000000`;
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        // Debug: log the raw data for this rune
        console.log(`[RunePriceChecker] ${rune} raw data:`, data);

        // Only include items created in the last 2 days, then take the most recent 100
        const now = Date.now();
        const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
        const filtered = (data.data || [])
          .filter(item =>
            typeof item.price === 'number' &&
            item.createdAt &&
            (now - new Date(item.createdAt).getTime() <= twoDaysMs)
          )
          .slice(0, 100);

        let prices = filtered.map(item => item.price);

        // Remove outliers
        prices = filterOutliers(prices);

        // Debug: log filtered prices for this rune
        console.log(`[RunePriceChecker] ${rune} filtered prices (outliers removed):`, prices);

        return prices;
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

        // Avg Price
        const avgCell = document.createElement('td');
        avgCell.textContent = '⏳';
        avgCell.style.border = `1px solid ${colors.tableBorder}`;
        avgCell.style.padding = '8px';
        row.appendChild(avgCell);

        tbody.appendChild(row);

        runeRows[rune] = { row, bottomCell, topCell, avgCell };
      });

      const concurrency = 4;
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
                  const pricesM = prices.map(p => p / 1_000_000);
                  const avg = Math.ceil(pricesM.reduce((a, b) => a + b, 0) / pricesM.length);
                  result = {
                    rune,
                    topPrice: Math.max(...pricesM),
                    bottomPrice: Math.min(...pricesM),
                    avgPrice: avg
                  };
                } else {
                  result = {
                    rune,
                    topPrice: 0,
                    bottomPrice: 0,
                    avgPrice: 0
                  };
                }
                // Update the table row for this rune
                const { bottomCell, topCell, avgCell } = runeRows[rune];
                bottomCell.textContent = result.bottomPrice ? result.bottomPrice.toLocaleString(undefined, {maximumFractionDigits: 2}) + 'm' : '0';
                topCell.textContent = result.topPrice ? result.topPrice.toLocaleString(undefined, {maximumFractionDigits: 2}) + 'm' : '0';
                avgCell.textContent = result.avgPrice ? result.avgPrice.toLocaleString() + 'm' : '0';
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
    document.addEventListener('DOMContentLoaded', addButtonWhenReady);
  } else {
    addButtonWhenReady();
  }
})();
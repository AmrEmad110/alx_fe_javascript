 document.addEventListener('DOMContentLoaded', function () {
      // ===== initial data =====
      const quotes = [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
        { text: "Simplicity is the soul of efficiency.", category: "Programming" }
      ];

      // ===== DOM refs (may be null if HTML changed) =====
      const quoteDisplay   = document.getElementById('quoteDisplay');
      const newQuoteBtn    = document.getElementById('newQuoteBtn');
      const exportBtn      = document.getElementById('exportBtn');
      const importFile     = document.getElementById('importFile');
      const categoryFilter = document.getElementById('categoryFilter');

      // ===== helpers =====
      function safeParseJSON(str) {
        try { return JSON.parse(str); } catch (e) { return null; }
      }

      function saveQuotes() {
        try {
          localStorage.setItem('quotes', JSON.stringify(quotes));
        } catch (e) {
          console.warn('saveQuotes error:', e);
        }
      }

      function loadQuotes() {
        try {
          const s = localStorage.getItem('quotes');
          const parsed = s ? safeParseJSON(s) : null;
          if (Array.isArray(parsed)) {
            quotes.length = 0;
            quotes.push(...parsed);
          }
        } catch (e) {
          console.warn('loadQuotes error:', e);
        }
      }

      function getRandomQuote(pool) {
        if (!Array.isArray(pool) || pool.length === 0) return null;
        const i = Math.floor(Math.random() * pool.length);
        return pool[i];
      }

      function populateCategories() {
        if (!categoryFilter) return;
        const cats = quotes.map(q => q.category).filter(Boolean);
        const unique = [...new Set(cats)].sort();
        // remove all except first ("all")
        while (categoryFilter.options.length > 1) categoryFilter.remove(1);
        unique.forEach(cat => {
          const opt = document.createElement('option');
          opt.value = cat;
          opt.textContent = cat;
          categoryFilter.appendChild(opt);
        });
      }

      function showMessage(msg) {
        if (quoteDisplay) quoteDisplay.textContent = msg;
      }

      function filterQuotes() {
        if (!categoryFilter) {
          // fallback: just show random
          const r = getRandomQuote(quotes);
          showMessage(r ? `${r.text} — (${r.category})` : 'No quotes available.');
          return;
        }

        const selected = categoryFilter.value || 'all';
        try { localStorage.setItem('selectedCategory', selected); } catch (e) { /* ignore */ }

        const pool = (selected === 'all') ? quotes : quotes.filter(q => q.category === selected);
        const r = getRandomQuote(pool);
        if (r) {
          showMessage(`${r.text} — (${r.category})`);
          try { sessionStorage.setItem('lastQuote', JSON.stringify(r)); } catch (e) {}
        } else {
          showMessage('No quotes in this category.');
        }
      }

      function addQuote() {
        const textInput = document.getElementById('newQuoteText');
        const categoryInput = document.getElementById('newQuoteCategory');
        const quoteText = textInput ? textInput.value.trim() : '';
        const quoteCategory = categoryInput ? categoryInput.value.trim() : '';

        if (!quoteText || !quoteCategory) {
          alert('Please enter both a quote and a category.');
          return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        populateCategories();

        // auto-select new category so user sees it right away
        if (categoryFilter) categoryFilter.value = quoteCategory;

        showMessage(`${quoteText} — (${quoteCategory})`);

        if (textInput) textInput.value = '';
        if (categoryInput) categoryInput.value = '';
      }

      function createAddQuoteForm() {
        let textInput = document.getElementById('newQuoteText');
        let categoryInput = document.getElementById('newQuoteCategory');
        let addBtn = document.getElementById('addQuoteBtn');

        if (!textInput || !categoryInput || !addBtn) {
          const wrapper = document.createElement('div');
          wrapper.style.marginTop = '12px';

          textInput = document.createElement('input');
          textInput.id = 'newQuoteText';
          textInput.placeholder = 'Enter a new quote';
          textInput.style.width = '60%';
          textInput.style.marginRight = '8px';

          categoryInput = document.createElement('input');
          categoryInput.id = 'newQuoteCategory';
          categoryInput.placeholder = 'Enter quote category';
          categoryInput.style.marginRight = '8px';

          addBtn = document.createElement('button');
          addBtn.id = 'addQuoteBtn';
          addBtn.textContent = 'Add Quote';

          wrapper.appendChild(textInput);
          wrapper.appendChild(categoryInput);
          wrapper.appendChild(addBtn);

          (newQuoteBtn?.parentNode || document.body).appendChild(wrapper);
        }

        // attach listener once
        if (addBtn && !addBtn._hasListener) {
          addBtn.addEventListener('click', addQuote);
          addBtn._hasListener = true;
        }
      }

      function exportToJsonFile() {
        try {
          const dataStr = JSON.stringify(quotes, null, 2);
          const blob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'quotes.json';
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('export error', e);
        }
      }

      function importFromJsonFile(evt) {
        const f = evt?.target?.files && evt.target.files[0];
        if (!f) return alert('No file selected.');
        const reader = new FileReader();
        reader.onload = function (e) {
          const parsed = safeParseJSON(e.target.result);
          if (!Array.isArray(parsed)) return alert('Invalid JSON format: expected array of quotes.');
          // validate items minimally
          const valid = parsed.filter(it => it && typeof it.text === 'string' && typeof it.category === 'string');
          if (valid.length === 0) return alert('No valid quotes found in file.');
          quotes.push(...valid);
          saveQuotes();
          populateCategories();
          alert('Imported ' + valid.length + ' quotes.');
        };
        reader.onerror = function () { alert('File read error'); };
        reader.readAsText(f);
      }

      // ===== event bindings (guarded) =====
      if (newQuoteBtn) newQuoteBtn.addEventListener('click', filterQuotes);
      if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);
      if (importFile) importFile.addEventListener('change', importFromJsonFile);
      if (categoryFilter) categoryFilter.addEventListener('change', filterQuotes);

      // ===== initialization =====
      loadQuotes();
      populateCategories();

      const saved = localStorage.getItem('selectedCategory');
      if (saved && categoryFilter) {
        const exists = Array.from(categoryFilter.options).some(opt => opt.value === saved);
        categoryFilter.value = exists ? saved : 'all';
      } else if (categoryFilter) {
        categoryFilter.value = 'all';
      }

      const last = sessionStorage.getItem('lastQuote');
      if (last) {
        const q = safeParseJSON(last);
        if (q && q.text) showMessage(`${q.text} — (${q.category})`);
        else filterQuotes();
      } else {
        filterQuotes();
      }

      createAddQuoteForm();
    });



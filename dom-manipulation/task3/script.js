document.addEventListener('DOMContentLoaded', function () {
  // ===== initial data =====
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Simplicity is the soul of efficiency.", category: "Programming" }
  ];

  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API
  const SYNC_INTERVAL = 20000; // 20s

  // ===== DOM refs =====
  const quoteDisplay   = document.getElementById('quoteDisplay');
  const newQuoteBtn    = document.getElementById('newQuoteBtn');
  const exportBtn      = document.getElementById('exportBtn');
  const importFile     = document.getElementById('importFile');
  const categoryFilter = document.getElementById('categoryFilter');
  const notification   = document.getElementById('notification');

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

  function showNotification(msg) {
    if (!notification) return;
    notification.textContent = msg;
    setTimeout(() => notification.textContent = "", 4000);
  }

  function filterQuotes() {
    const selected = categoryFilter.value || 'all';
    try { localStorage.setItem('selectedCategory', selected); } catch (e) {}

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

    if (categoryFilter) categoryFilter.value = quoteCategory;
    showMessage(`${quoteText} — (${quoteCategory})`);

    if (textInput) textInput.value = '';
    if (categoryInput) categoryInput.value = '';

    // send to server simulation
    postQuoteToServer({ text: quoteText, category: quoteCategory });
  }

  // ====== SERVER FUNCTIONS ======

  // ✅ 1) جلب بيانات من السيرفر
  async function fetchQuotesFromServer() {
    try {
      const res = await fetch(SERVER_URL);
      const data = await res.json();
      if (!Array.isArray(data)) return [];

      // نحول بيانات API لشكل اقتباسات
      return data.slice(0, 5).map(p => ({
        text: p.title,
        category: "Server"
      }));
    } catch (err) {
      console.warn("Fetch server error:", err);
      return [];
    }
  }

  // ✅ 2) إرسال بيانات جديدة للسيرفر
  async function postQuoteToServer(newQuote) {
    try {
      await fetch(SERVER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote)
      });
      showNotification("Quote posted to server.");
    } catch (err) {
      console.warn("Post server error:", err);
    }
  }

  // ✅ 3) المزامنة: server wins
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length > 0) {
      quotes.length = 0;
      quotes.push(...serverQuotes);
      saveQuotes();
      populateCategories();
      showNotification("Quotes synced with server!");
    }
  }

  // ===== periodic sync =====
  setInterval(syncQuotes, SYNC_INTERVAL);

  // ===== event bindings =====
  if (newQuoteBtn) newQuoteBtn.addEventListener('click', filterQuotes);
  if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);
  if (importFile) importFile.addEventListener('change', importFromJsonFile);
  if (categoryFilter) categoryFilter.addEventListener('change', filterQuotes);

  // ===== init =====
  loadQuotes();
  populateCategories();
  syncQuotes(); // أول مزامنة عند التشغيل
});

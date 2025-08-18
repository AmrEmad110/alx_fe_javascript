document.addEventListener("DOMContentLoaded", function () {
  // المصفوفة الأساسية
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Simplicity is the soul of efficiency.", category: "Programming" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const exportBtn = document.getElementById("exportBtn");
  const importFile = document.getElementById("importFile");

  // ---- 1) Local Storage ----
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }

  function loadQuotes() {
    const stored = localStorage.getItem("quotes");
    if (stored) {
      quotes.length = 0; // نفرغ الأول
      quotes.push(...JSON.parse(stored));
    }
  }

  // ---- 2) عرض اقتباس عشوائي + Session Storage ----
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `${randomQuote.text} — (${randomQuote.category})`;

    // نحفظ آخر اقتباس
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  }

  // ---- 3) إضافة اقتباس جديد ----
  function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    const quoteText = textInput ? textInput.value.trim() : "";
    const quoteCategory = categoryInput ? categoryInput.value.trim() : "";

    if (!quoteText || !quoteCategory) {
      alert("Please enter both a quote and a category.");
      return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });
    saveQuotes(); // نخزن في localStorage
    quoteDisplay.innerHTML = `${quoteText} — (${quoteCategory})`;

    if (textInput) textInput.value = "";
    if (categoryInput) categoryInput.value = "";
  }

  // ---- 4) إنشاء فورم الإضافة ديناميكياً ----
  function createAddQuoteForm() {
    let textInput = document.getElementById("newQuoteText");
    let categoryInput = document.getElementById("newQuoteCategory");
    let addBtn = document.getElementById("addQuoteBtn");

    if (!textInput || !categoryInput || !addBtn) {
      const wrapper = document.createElement("div");

      textInput = document.createElement("input");
      textInput.type = "text";
      textInput.id = "newQuoteText";
      textInput.placeholder = "Enter a new quote";

      categoryInput = document.createElement("input");
      categoryInput.type = "text";
      categoryInput.id = "newQuoteCategory";
      categoryInput.placeholder = "Enter quote category";

      addBtn = document.createElement("button");
      addBtn.id = "addQuoteBtn";
      addBtn.textContent = "Add Quote";

      wrapper.appendChild(textInput);
      wrapper.appendChild(categoryInput);
      wrapper.appendChild(addBtn);

      (newQuoteButton?.parentNode || document.body).appendChild(wrapper);
    }

    addBtn.addEventListener("click", addQuote);
  }

  // ---- 5) Export / Import JSON ----
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      const importedQuotes = JSON.parse(e.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }

  // ---- Event Listeners ----
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToJsonFile);
  }
  if (importFile) {
    importFile.addEventListener("change", importFromJsonFile);
  }

  // ---- Initialization ----
  loadQuotes(); // نجيب من localStorage
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `${q.text} — (${q.category})`;
  }

  window.addQuote = addQuote;
  createAddQuoteForm();
});
//-----------------------------------
// =============================
// Step 1: Simulate Server Interaction
// =============================

// العنصر اللي هيعرض الاقتباس
const quoteDisplay = document.getElementById("quoteDisplay");

// زرار الاقتباس الجديد
const newQuoteBtn = document.getElementById("newQuote");

// مصفوفة مؤقتة لحفظ الاقتباسات اللي جايه من السيرفر
let serverQuotes = [];

// ✅ دالة لعرض اقتباس عشوائي من البيانات اللي جايه من السيرفر
function displayRandomQuote() {
  if (serverQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available yet. Please wait for server sync...";
    return;
  }
  const randomIndex = Math.floor(Math.random() * serverQuotes.length);
  quoteDisplay.textContent = serverQuotes[randomIndex].title;
}

// ✅ جلب بيانات من السيرفر (GET)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await res.json();
    serverQuotes = data; // حفظ الاقتباسات
    console.log("Fetched from server:", serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

// ✅ إرسال بيانات جديدة للسيرفر (POST)
async function addQuoteToServer(newQuoteText) {
  const newQuote = {
    title: newQuoteText,
    body: "Extra details about the quote",
    userId: 1
  };

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    const data = await res.json();
    console.log("Quote added to server simulation:", data);
    alert("Quote added to server simulation!");
  } catch (error) {
    console.error("Error adding quote:", error);
  }
}

// ✅ عند الضغط على زرار "New Quote" يعرض اقتباس عشوائي
newQuoteBtn.addEventListener("click", displayRandomQuote);

// ✅ تحديث دوري كل 10 ثواني لمحاكاة استلام بيانات جديدة من السيرفر
setInterval(fetchQuotesFromServer, 10000);

// ✅ استدعاء أول مرة عند تشغيل الصفحة
fetchQuotesFromServer();



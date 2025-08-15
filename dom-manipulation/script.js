document.addEventListener("DOMContentLoaded", function () {
  // مصفوفة الاقتباسات
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
    { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
    { text: "Simplicity is the soul of efficiency.", category: "Programming" }
  ];

  const quoteDisplay = document.getElementById("quoteDisplay");
  const newQuoteButton = document.getElementById("newQuote");
  const newQuoteText = document.getElementById("newQuoteText");
  const newQuoteCategory = document.getElementById("newQuoteCategory");
  const addQuoteBtn = document.getElementById("addQuoteBtn");

  // دالة عرض اقتباس عشوائي
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `${randomQuote.text} — (${randomQuote.category})`;
  }

  // دالة إضافة اقتباس جديد
  function addQuote() {
    const quoteText = newQuoteText.value.trim();
    const quoteCategory = newQuoteCategory.value.trim();

    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      quoteDisplay.innerHTML = `${quoteText} — (${quoteCategory})`;
      newQuoteText.value = "";
      newQuoteCategory.value = "";
    } else {
      alert("Please enter both a quote and a category.");
    }
  }

  // إضافة Event Listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
});

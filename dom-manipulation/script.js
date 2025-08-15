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

  // 1) عرض اقتباس عشوائي
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `${randomQuote.text} — (${randomQuote.category})`;
  }

  // 2) إضافة اقتباس جديد + تحديث الـ DOM
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
    quoteDisplay.innerHTML = `${quoteText} — (${quoteCategory})`;

    if (textInput) textInput.value = "";
    if (categoryInput) categoryInput.value = "";
  }

  // 3) إنشاء نموذج الإضافة ديناميكيًا (الاسم المطلوب من الـ checker)
  function createAddQuoteForm() {
    let textInput = document.getElementById("newQuoteText");
    let categoryInput = document.getElementById("newQuoteCategory");
    let addBtn = document.getElementById("addQuoteBtn");

    // لو الفورم مش موجود في الـ HTML، نولّده
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

      // نحطّه بعد زر "Show New Quote"
      (newQuoteButton?.parentNode || document.body).appendChild(wrapper);
    }

    // نربط زر الإضافة بالدالة
    addBtn.addEventListener("click", addQuote);
  }

  // 4) Event listener لزر "Show New Quote"
  if (newQuoteButton) {
    newQuoteButton.addEventListener("click", showRandomQuote);
  }

  // نكشف addQuote للعالمية لو بتستخدم onclick في الـ HTML
  window.addQuote = addQuote;

  // نولّد/نجهّز الفورم
  createAddQuoteForm();
});

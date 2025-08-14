document.addEventListener("DOMContentLoaded", function() {

const quotes = [
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', category: 'Motivation' },
  { text: 'Code is like humor. When you have to explain it, it’s bad.', category: 'Programming' },
  { text: 'Life is what happens when you’re busy making other plans.', category: 'Life' },
  { text: 'Simplicity is the soul of efficiency.', category: 'Programming' },
];
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
function showRandomQuote() {
  // نختار رقم عشوائي من 0 لحد طول المصفوفة - 1
  const randomIndex = Math.floor(Math.random() * quotes.length);

  // نجيب الاقتباس اللي في المكان ده
  const randomQuote = quotes[randomIndex];

  // نعرضه في الصندوق
  quoteDisplay.textContent = `${randomQuote.text} — (${randomQuote.category})`;
}
newQuoteButton.addEventListener('click', showRandomQuote);

function addQuote() {
  // ناخد القيم اللي المستخدم كتبها
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();

  // نتأكد إنهم مش فاضيين
  if (quoteText && quoteCategory) {
    // نضيفهم للمصفوفة
    quotes.push({ text: quoteText, category: quoteCategory });

    // نعرض الاقتباس الجديد مباشرة
    quoteDisplay.textContent = `${quoteText} — (${quoteCategory})`;

    // نفرغ الحقول
    newQuoteText.value = '';
    newQuoteCategory.value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}
addQuoteBtn.addEventListener('click', addQuote);



});
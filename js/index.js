
let quotes = [];

const loadQuote = async () => {
    // Fetch the quotes from the JSON file  
  const response = await fetch("quotes.json");
  const data = await response.json();
  quotes = data.quotes;
  console.log(quotes);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const quoteElement = document.getElementById("quote");
  quoteElement.innerHTML = randomQuote.quote;
  const authorElement = document.getElementById("author");
  authorElement.innerHTML = randomQuote.by;         
}

const loadImage = async () => { 

const ri = Math.floor(Math.random() * 5);
const imageElement = document.getElementById("image");
imageElement.src = `images/piclist/pic${ri}.jpeg`;

}


loadImage();
loadQuote();
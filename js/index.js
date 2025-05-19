



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
const pics =["pic1.jpeg", "pic2.jpeg", "pic3.jpeg", "pic4.jpeg"];
const randomPic = pics[Math.floor(Math.random() * pics.length)];
const imageElement = document.getElementById("image");
imageElement.src = "images/piclist/"+ randomPic;

}


loadImage();
loadQuote();
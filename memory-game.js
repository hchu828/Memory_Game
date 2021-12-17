"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);
let firstCard, secondCard;
let event1, event2;
let numPairs = colors.length / 2;

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  let row1 = document.createElement("div");
  let row2 = document.createElement("div");

  row1.classList.add("row");
  row1.setAttribute("id", "row1");
  row2.classList.add("row");
  row2.setAttribute("id", "row2");
  gameBoard.appendChild(row1);
  gameBoard.appendChild(row2);
  
  const rows = document.getElementsByClassName("row");
  let cardCount = 0;

  for (let color of colors) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.style.color = color;
    card.addEventListener("click", function(e){
      setTimeout(handleCardClick(e), 1000);
    });
    (cardCount < colors.length / 2) ? rows[0].appendChild(card) : rows[1].appendChild(card);
    cardCount++;
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.target.style.backgroundColor = card.target.style.color;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  setTimeout(function (){
    card.target.style.backgroundColor = "white";
  }, 1000);  
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(e) {
  if(firstCard === undefined) {
    firstCard = e.target;
    event1 = e;
    console.log("first card: " + firstCard);
    flipCard(e);
  } else if(secondCard === undefined) {
    secondCard = e.target;
    event2 = e;
    console.log("second card: " + secondCard);
    flipCard(e);

    setTimeout(function(){
      if(isPair()){
        console.log("Found pair!");
        event1.target.removeEventListener("click", event1);
        event2.target.removeEventListener("click", event2);
        numPairs--;
        if(gameOver()) displayWinner();
      } 
      else {
        console.log("Not a pair!");
        unFlipCard(event1);
        unFlipCard(event2);
      }
      setTimeout(function(){
        firstCard = undefined;
        secondCard = undefined;
      }, 1000);
    }, 250);
  }
}

/** Check if first card and second card form a pair */

function isPair(){
  return (firstCard.style.color === secondCard.style.color) && (firstCard !== secondCard);
}

/** Check if all cards have been flipped */

function gameOver(){
  return numPairs === 0;
}

/** Display winner message */

function displayWinner() {
  const message = document.getElementById("title");
  message.innerHTML = "Congrats! You beat the game!";
}
import '../style.css'

interface Card {
  value: string
}

let deckId: string
let computerScore = 0
let myScore = 0
const cardsContainer = document.getElementById('cards')
const newDeckBtn = document.getElementById('new-deck') as HTMLButtonElement
const drawCardBtn = document.getElementById('draw-cards') as HTMLButtonElement
const header = document.getElementById('header')
const remainingText = document.getElementById('remaining')
const computerScoreEl = document.getElementById('computer-score')
const myScoreEl = document.getElementById('my-score')

newDeckBtn!.addEventListener('click', initGame)
drawCardBtn!.addEventListener('click', drawCards)

function initGame() {
  newDeckBtn!.disabled = true
  drawCardBtn!.disabled = false
  remainingText!.textContent = ''
  header!.textContent = 'Game of War'
  computerScore = 0
  myScore = 0
  computerScoreEl!.textContent = `Computer score: ${computerScore}`
  myScoreEl!.textContent = `My score: ${myScore}`
  cardsContainer!.children[0].innerHTML = ''
  cardsContainer!.children[1].innerHTML = ''
  getDeck()
}

async function getDeck() {
  const res = await fetch('https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/')
  const data = await res.json()
  remainingText!.textContent = `Remaining cards: ${data.remaining}`
  deckId = data.deck_id
}

async function drawCards() {
  const res = await fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
  const data = await res.json()
  remainingText!.textContent = `Remaining cards: ${data.remaining}`
  cardsContainer!.children[0].innerHTML = `
      <img src=${data.cards[0].image} class='card'>
  `
  cardsContainer!.children[1].innerHTML = `
      <img src=${data.cards[1].image} class='card'>
  `
  const winnerText = determineCardWinner(data.cards[0], data.cards[1])
  header!.textContent = winnerText
  
  if (data.remaining === 0) {
      drawCardBtn!.disabled = true
      if (computerScore > myScore) {
        header!.textContent = 'The computer won the game!'
      } else if (myScore > computerScore) {
        header!.textContent = 'You won the game!'
      } else {
        header!.textContent = "It's a tie game!"
      }

      setTimeout(() => {newDeckBtn!.disabled = false}, 1000)
  }
}

function determineCardWinner(card1: Card, card2: Card) {
  const valueOptions = ['2', '3', '4', '5', '6', '7', '8', '9', 
  '10', 'JACK', 'QUEEN', 'KING', 'ACE']
  const card1ValueIndex = valueOptions.indexOf(card1.value)
  const card2ValueIndex = valueOptions.indexOf(card2.value)
  
  if (card1ValueIndex > card2ValueIndex) {
      computerScore++
      computerScoreEl!.textContent = `Computer score: ${computerScore}`
      return 'Computer wins!'
  } else if (card1ValueIndex < card2ValueIndex) {
      myScore++
      myScoreEl!.textContent = `My score: ${myScore}`
      return 'You win!'
  } else {
      return 'War!'
  }
}

let deckId
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const determineWinner = document.getElementById("winner")
const remainingCards = document.getElementById("remaining")
const player1Score = document.getElementById("player1")
const player2Score = document.getElementById("player2")

let Player1 =0
let Player2 =0
let topScore =0

async function getNewDeck(){
    const response = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const card = await response.json() 

    drawCardBtn.disabled = false
    determineWinner.textContent = "Game of War"
    player1Score.textContent =  "Computer Score: " + 0
    player2Score.textContent =  "My Score: " + 0
    Player1 =0
    Player2 =0

    deckId = card.deck_id
    console.log(deckId)
    remainingCards.textContent = "Remaining cards :" + card.remaining            
}

newDeckBtn.addEventListener("click", getNewDeck)

drawCardBtn.addEventListener("click", async () => {

    if (deckId === undefined) {
        await getNewDeck()
    }
    const res = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()        
                       
    cardsContainer.children[0].innerHTML 
                            = `<img src=${data.cards[0].image} class="card" />`
    cardsContainer.children[1].innerHTML 
                            = `<img src=${data.cards[1].image} class="card" />`            

    let winnerText = determineCardWinner(data.cards[0], data.cards[1])
    determineWinner.textContent = winnerText
    remainingCards.textContent = `"Remaining cards : " + ${data.remaining}`
    
    if (data.remaining === 0) {
        if (Player1 > Player2) {
            determineWinner.textContent = "Final Winner :Computer!"
        }
        else if (Player1 < Player2) {
            determineWinner.textContent = "Final Winner :You!"
        } else {            
            determineWinner.textContent = "Its a TIE game!"
        }
        drawCardBtn.disabled = true
    }    
})


function determineCardWinner(card1, card2) {

    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]

    card1ValueIndex = valueOptions.indexOf(card1.value) 
    card2ValueIndex = valueOptions.indexOf(card2.value)
    console.log("card 1: ", card1ValueIndex)
    console.log("card 2: ", card2ValueIndex)
    
    if (card1ValueIndex > card2ValueIndex) {
        Player1 += 1
        player1Score.textContent =  "Computer Score: " + Player1    
        return "Computer Wins!"
    } else if(card1ValueIndex < card2ValueIndex) {
        Player2 += 1
        player2Score.textContent = "My Score: " + Player2
        return "You Win!"
    } else {
        return "War"
    }   
}


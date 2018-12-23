import PokerHand from '../src/index.js'

let holeCards = ['Ac', 'As', 'Ah']
let firstHand = PokerHand.Hand.make(holeCards)
console.log(firstHand.cards)
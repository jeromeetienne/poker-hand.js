import PokerHand from '../src/index.js'

let cardA = 'Ac'
let cardB = 'Ts'


console.assert(PokerHand.Card.getRank(cardA) === 13)
console.assert(PokerHand.Card.getValue(cardA) === 'A')
console.assert(PokerHand.Card.getSuit(cardA) === 'c')

console.assert(PokerHand.Card.getRank(cardB) === 9)
console.assert(PokerHand.Card.getValue(cardB) === 'T')
console.assert(PokerHand.Card.getSuit(cardB) === 's')


console.assert(PokerHand.Card.getRank(cardA) > PokerHand.Card.getRank(cardB))


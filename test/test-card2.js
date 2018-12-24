import PokerHand from '../src/index.js'

let cardA = 'Ac'
let cardB = 'Ts'


console.assert(PokerHand.Card2.getRank(cardA) === 13)
console.assert(PokerHand.Card2.getValue(cardA) === 'A')
console.assert(PokerHand.Card2.getSuit(cardA) === 'c')

console.assert(PokerHand.Card2.getRank(cardB) === 9)
console.assert(PokerHand.Card2.getValue(cardB) === 'T')
console.assert(PokerHand.Card2.getSuit(cardB) === 's')


console.assert(PokerHand.Card2.getRank(cardA) > PokerHand.Card2.getRank(cardB))


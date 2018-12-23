import PokerHand from '../src/index.js'

var card1 = new PokerHand.Card('Ac')
var card2 = new PokerHand.Card('Ts')

console.assert(card1.rank > card2.rank)

console.assert(card1.toString() === 'Ac')
console.assert(card2.toString() === 'Ts')
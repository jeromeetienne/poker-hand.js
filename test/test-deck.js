import PokerHand from '../src/index.js'

let holeCards = ['Ac', 'As']
let communityCards = ['5c', '5c']

var deck = new PokerHand.Deck()
// deck.shuffle()
// console.log(deck.cards)

// deck.removeCards(holeCards)
// deck.removeCards(communityCards)



console.assert( deck.containsCard('Ac') === true )
deck.removeCard('Ac')
console.assert( deck.containsCard('Ac') === false )

// console.log(deck.cards)


import PokerHand from '../index.js'

var deck = new PokerHand.Deck()
deck.shuffle()
console.log(deck.toArray())
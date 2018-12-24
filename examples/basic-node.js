// import {myBundle} from "../tmp/bundle.mjs"
let hoyle = require('../build/poker-hand.mjs')


var deck = new hoyle.Deck()
deck.shuffle()
console.log(deck.toArray())

let holeCards = ['Ac', 'As', 'Ah']
let firstHand = hoyle.Hand.make(holeCards)
console.log(''+firstHand.cards)
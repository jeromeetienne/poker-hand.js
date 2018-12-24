let PokerHand = require('../build/poker-hand.mjs')

// get those data from command line
let holeCards = ['Kc', 'Ks']
let communityCards = []
let nbOtherPlayers = 2

console.time('simulateMultipleRound')
var handLikelyHoodToWin = PokerHand.Montecarlo2.simulateMultipleRound(5000, holeCards, communityCards, nbOtherPlayers)
console.timeEnd('simulateMultipleRound')
console.log('handLikelyHoodtoWin', handLikelyHoodToWin)


// let hoyle = require('hoyle')
// let myHand = hoyle.Hand.make(['As', '2s', '2c'])

// debugger
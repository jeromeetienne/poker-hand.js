let PokerHand = require('../build/poker-hand.mjs')

// get those data from command line
let holeCards = ['Ac', 'As']
let communityCards = []
let nbOtherPlayers = 2

console.time('simulateOddsIfAllIn')
var oddsIfAllIn = PokerHand.MonteCarlo.simulateOddsIfAllIn(5000, holeCards, communityCards, nbOtherPlayers)
console.timeEnd('simulateOddsIfAllIn')
console.log('oddsIfAllIn', oddsIfAllIn)

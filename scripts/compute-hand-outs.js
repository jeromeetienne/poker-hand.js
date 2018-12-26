let PokerHand = require('../build/poker-hand.mjs')

let holeCards = ['Ac', 'As']
let communityCards = ['5c', '5c']

console.log('holeCards', holeCards)
console.log('communityCards', communityCards)

let firstHand = PokerHand.Hand.make(holeCards.concat(communityCards))
let requireHandRank = firstHand.handRank + 1
console.log(`firstHand minimalCards ${firstHand.minimalCards} handName ${firstHand.handName} handRank ${firstHand.handRank}`)


let nSimulations = 1000
let outCards = PokerHand.MonteCarlo.simulateOutsCount(holeCards, communityCards, requireHandRank, nSimulations)
console.log(`nOuts ${outCards.length} outCards ${outCards}`)
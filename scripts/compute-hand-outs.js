let PokerHand = require('../build/poker-hand.mjs')

let holeCards = ['Ac', 'As']
let communityCards = ['5c', '5c']

console.log('holeCards', holeCards)
console.log('communityCards', communityCards)

let firstHand = PokerHand.Hand.make(holeCards.concat(communityCards))
let requireHandRank = firstHand.handRank + 1
console.log(`firstHand minimalCards ${firstHand.minimalCards} handName ${firstHand.handName} handRank ${firstHand.handRank}`)


let outCards = PokerHand.Utils.computeOutCards(holeCards, communityCards, requireHandRank)
console.log(`nOuts ${outCards.length} outCards ${outCards}`)

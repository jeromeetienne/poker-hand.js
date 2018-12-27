let PokerHand = require('../build/poker-hand.mjs')

let handNameCounters = {}
Object.keys(PokerHand.Hand.HandEvaluator.HandRanks).forEach((handName)=>{
	handNameCounters[handName] = 0
})

// initial hand
let cards = []

let initialDeck = new PokerHand.Deck()
initialDeck.removeCards(cards)

// only 3 cards
countHandsFrequency(cards, 3, initialDeck)

function countHandsFrequency(cardPool, nRemainingCards, deck){
	if( nRemainingCards === 0 ){
		// console.log('cardPool', cardPool)
		let hand = PokerHand.Hand.make(cardPool)
	
		// console.log('cardPool', cardPool, 'minimalCards', hand.minimalCards, hand.handName)
	
		handNameCounters[hand.handName] ++
		return
	}

	let possibleCards = deck.cards.slice()
	for(let possibleCard of possibleCards ){
		let newDeck = deck.clone().removeCard(possibleCard)
		let newCardPool = cardPool.concat([possibleCard])
		countHandsFrequency(newCardPool, nRemainingCards-1, newDeck)
	}	
}

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

let handsTotal = 0
Object.keys(handNameCounters).forEach((handName) => {
	handsTotal += handNameCounters[handName]
})


Object.keys(handNameCounters).forEach((handName) => {
	if( handNameCounters[handName] === 0 )	return
	let percent = handNameCounters[handName] / handsTotal
	console.log('handName', handName, (percent*100).toFixed(2)+'%')
})
console.log('handNameCounters', handNameCounters)



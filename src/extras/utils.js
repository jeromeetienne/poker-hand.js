import Deck from '../core/deck.js'
import Hand from '../core/hand.js'


////////////////////////////////////////////////////////////////////////
//		Utils to generate random cards from a deck
////////////////////////////////////////////////////////////////////////

function pickRandomCard() {
	var SUITS = ['s', 'h', 'c', 'd']
	var VALUES=['2','3','4','5','6','7','8','9','T','J','Q','K','A']
	var cardValue = VALUES[Math.floor(Math.random() * VALUES.length)]
	var cardSuit = SUITS[Math.floor(Math.random() * SUITS.length)]
	var card = cardValue + cardSuit
	return card
}

function pickUnusedCards(nbCards, usedCards) {
	var unusedCards = []
	while (unusedCards.length !== nbCards) {
		var randomCard = pickRandomCard()
		if (usedCards.indexOf(randomCard) !== -1) continue
		if (unusedCards.indexOf(randomCard) !== -1) continue
		unusedCards.push(randomCard)
	}
	return unusedCards
}

////////////////////////////////////////////////////////////////////////
//		Pot related
////////////////////////////////////////////////////////////////////////


function computePotSize(gameData) {
	let allWages = gameData.players.map((player) => player.wagered)
	let potSize = allWages.reduce((accumulator, currentValue) => accumulator + currentValue)
	return potSize
}


/**
 * - based on https://www.cardschat.com/poker-odds-pot-odds-implied-odds.php
 * @param {Object} gameData 
 */
function computePotOdds(gameData) {
	var potSize = computePotSize(gameData)
	var potOdds = gameData.betting.call / potSize
	return potOdds
}


////////////////////////////////////////////////////////////////////////
//		compute positions
////////////////////////////////////////////////////////////////////////


function computePositionIndex(gameData) {
	let positionIndex = gameData.players.findIndex((player) => player.name === gameData.self.name)
	return positionIndex
}

/**
 * compute the position label
 * - based on https://www.pokerstarsschool.com/article/Poker-Position-Overview
 * 
 * @param {Object} gameData 
 */
function computePositionLabel(gameData) {
	let positionLabel = null
	// determine positionLabel based on positionIndex and gameData.players.length
	let positionIndex = computePositionIndex(gameData)
	if (positionIndex === 0) positionLabel = 'latePosition-dealer'			// dealer
	else if (positionIndex === gameData.players.length - 1) positionLabel = 'latePosition'	// player on the right of the dealer
	else if (positionIndex === 1) positionLabel = 'earlyPosition-smallblind'	// small blind
	else if (positionIndex === 2) positionLabel = 'earlyPosition-bigblind'		// big blind
	else if (positionIndex === 3) positionLabel = 'earlyPosition-underthegun'	// under the gun
	else if (positionIndex === 4) positionLabel = 'earlyPosition-underthegun+1'	// under the gun+1
	else positionLabel = 'middlePosition'	// all the others
	// return positionLabel
	return positionLabel
}

function computePositionLabelRaw(gameData) {
	let positionLabel = computePositionLabel(gameData)
	let positionLabelRaw = positionLabel.split('-')[0]
	return positionLabelRaw
}

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

function computeOutCards(holeCards, communityCards, requiredHandRank) {
	const outCardsSet = new Set();

	console.assert(holeCards.length === 2)
	console.assert(communityCards.length >= 0)

	let deck = new Deck()
	deck.removeCards(holeCards).removeCards(communityCards)
	let unusedCards = deck.cards

	let cardsPool = holeCards.concat(communityCards)

	for(let randomCard of unusedCards){
		let finalHand = Hand.make(cardsPool.concat([randomCard]))

		let involvedMyHoleCards = finalHand.minimalCards.indexOf(holeCards[0]) !== -1
			|| finalHand.minimalCards.indexOf(holeCards[1]) !== -1

		if (finalHand.handRank >= requiredHandRank && involvedMyHoleCards === true) {
			// console.log(`${randomCard} IS an out`)
			outCardsSet.add(randomCard.toString())
		} else {
			// console.log(`${randomCard} IS NOT an out`)
		}
	}

	let outCards = Array.from(outCardsSet).sort()
	// console.log(`nOuts ${outCards.length} outCards ${outCards}`)
	return outCards
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

export default {
	pickRandomCard,
	pickUnusedCards,

	computePotSize,
	computePotOdds,

	computePositionIndex,	
	computePositionLabel,
	computePositionLabelRaw,

	computeOutCards,
}
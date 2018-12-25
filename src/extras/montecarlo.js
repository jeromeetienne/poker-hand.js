import Hand from '../core/hand.js'
import Utils from './utils.js'

function simulateOutsCount(holeCards, communityCards, requiredHandRank, nSimulations) {
	const outCardsSet = new Set();

	console.assert(holeCards.length === 2)
	console.assert(communityCards.length >= 0)

	for (let i = 0; i < nSimulations; i++) {
		let randomCard = Utils.pickUnusedCards(1, holeCards.concat(communityCards))
		// console.log(`draw cards ${randomCard}`)
		let newCommunityCards = communityCards.concat(randomCard)

		// console.log(`newCommunityCards ${newCommunityCards}`)

		let finalHand = Hand.make(holeCards.concat(newCommunityCards))
		// let communityHand = PokerHand.Hand.make(newCommunityCards)
		// console.log(`finalHand ${finalHand.minimalCards} name ${finalHand.handName} rank ${finalHand.handRank}`)
		// console.log(`communityHand ${communityHand} name ${communityHand.handName} rank ${communityHand.handRank}`)

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


/**
 * - good link on poker-odd and expected value
 *   https://www.cardschat.com/poker-odds-expected-value.php
 */

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////
function simulateOddsIfAllIn(nbRounds, holeCards, communityCards, nbOtherPlayers) {
	var result = 0
	for (let roundIndex = 0; roundIndex < nbRounds; roundIndex++) {
		var amIWinning = simulateOneRound(holeCards, communityCards, nbOtherPlayers)
		if (amIWinning === true) {
			result += 1
		} else {
			result += 0
		}
	}
	let average = result / nbRounds
	return average
}


function simulateOneRound(holeCards, communityCards, nbOtherPlayers) {
	// generate finalCommunityCards
	let randomCommunityCards = Utils.pickUnusedCards(5 - communityCards.length, holeCards.concat(communityCards))
	let finalCommunityCards = communityCards.concat(randomCommunityCards)

	// generate otherPlayersHoleCards
	let otherPlayersHoleCards = []
	let unusedCards = Utils.pickUnusedCards(nbOtherPlayers * 2, holeCards.concat(finalCommunityCards))
	for (let i = 0; i < nbOtherPlayers; i++) {
		let otherPlayerHoleCards = unusedCards.slice(i * 2, i * 2 + 2)
		otherPlayersHoleCards[i] = otherPlayerHoleCards
	}

	// compute myFinalHand
	let myFinalCards = holeCards.concat(finalCommunityCards)
	let myFinalHand = new Hand(myFinalCards)

	// compute all otherPlayersFinalHand
	let otherPlayersFinalHand = []
	for (let i = 0; i < nbOtherPlayers; i++) {
		let otherPlayerFinalCards = otherPlayersHoleCards[i].concat(finalCommunityCards)
		otherPlayersFinalHand[i] = new Hand(otherPlayerFinalCards)
	}

	// determine who will win
	let allFinalHands = [myFinalHand].concat(otherPlayersFinalHand)
	let winnersHand = Hand.pickWinners(allFinalHands)
	let winnerIndex = allFinalHands.indexOf(winnersHand[0])

	////////////////////////////////////////////////////////////////////////
	//		display result
	////////////////////////////////////////////////////////////////////////


	// console.log('###########################')
	// console.log('my holeCards', holeCards)
	// console.log('----')
	// for (let i = 0; i < nbOtherPlayers; i++) {
	// 	let otherPlayerHoleCards = otherPlayersHoleCards[i]
	// 	console.log(`other player #${i} hole`, otherPlayerHoleCards)
	// }
	// console.log('----')
	// console.log('finalCommunityCards', finalCommunityCards)
	// console.log('###########################')
	// console.log('myFinalHand', myFinalHand.name, 'with', myFinalHand.toString(), 'of rank', myFinalHand.rank)
	// for (let i = 0; i < nbOtherPlayers; i++) {
	// 	let otherPlayerFinalHand = otherPlayersFinalHand[i]
	// 	console.log(`other player #${i} hand`, otherPlayerFinalHand.name, 'with', otherPlayerFinalHand.toString(), 'of rank', otherPlayerFinalHand.rank)
	// }
	// console.log('winnerIndex', winnerIndex)

	let amIWinning = winnerIndex === 0 ? true : false
	return amIWinning
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

export default {
	simulateOddsIfAllIn,
	simulateOutsCount,
}

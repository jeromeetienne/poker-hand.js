import Hand from '../core/hand.js'
import Utils from '../extras/utils.js'



/**
 * - good link on poker-odd and expected value
 *   https://www.cardschat.com/poker-odds-expected-value.php
 */

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////
function simulateMultipleRound(nbRounds, holeCards, communityCards, nbOtherPlayers) {
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
	let myFinalHand = Hand.make(myFinalCards)

	// compute all otherPlayersFinalHand
	let otherPlayersFinalHand = []
	for (let i = 0; i < nbOtherPlayers; i++) {
		let otherPlayerFinalCards = otherPlayersHoleCards[i].concat(finalCommunityCards)
		otherPlayersFinalHand[i] = Hand.make(otherPlayerFinalCards)
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
	simulateMultipleRound
}

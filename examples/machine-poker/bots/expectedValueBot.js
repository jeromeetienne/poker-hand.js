let PokerHand = require('../../../build/poker-hand.mjs')

/**
 * 
 * @param {Object} gameData - all the data about this hand
 */
function update(gameData) {
	if (gameData.state === "complete") return

	let myHoleCards = gameData.self.cards
	let communityCards = gameData.community
	let nbOtherPlayers = gameData.players.length - 1

	var oddsIfAllIn = PokerHand.MonteCarlo.simulateOddsIfAllIn(1000, myHoleCards, communityCards, nbOtherPlayers)
	// console.log('handoddsIfAllIn', oddsIfAllIn)

	var potSize = PokerHand.Utils.computePotSize(gameData)
	var potOdds = gameData.betting.call / potSize

	var oddRatio = oddsIfAllIn / potOdds

	console.log('oddRatio', oddRatio)

	var bigBlindAmount = 50

	if (oddRatio > 1.2 && potSize / bigBlindAmount < 10) {
		return gameData.betting.raise
	}
	else if (oddRatio >= 1.0) {
		return gameData.betting.call
	}
	else {
		return 0
	}
};


////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

module.exports = function () {
	var info = {
		name: "ExpectedValueBot"
	};

	return { update: update, info: info }
}

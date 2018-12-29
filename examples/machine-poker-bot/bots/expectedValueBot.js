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

	var oddsIfAllIn = PokerHand.MonteCarlo.simulateOddsIfAllIn(500, myHoleCards, communityCards, nbOtherPlayers)

	var potOdds = PokerHand.Utils.computePotOdds(gameData)

	var oddRatio = oddsIfAllIn / potOdds

	console.log('oddsIfAllIn', (oddsIfAllIn*100).toFixed(0)+'%', 'potOdds', (potOdds*100).toFixed(0)+'%', 'oddRatio', oddRatio.toFixed(2), this.info.name)


	var potSize = PokerHand.Utils.computePotSize(gameData)
	let maxPotSize = 50*10

	if (oddRatio > 1.2 && potSize <= maxPotSize ) {
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

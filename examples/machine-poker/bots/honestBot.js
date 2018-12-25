let PokerHand = require('../../../build/poker-hand.mjs')


module.exports = function () {

	var info = {
		name: "HonestPlayer Bot"
	};

	function update(gameData) {
		if (gameData.state === "complete") return

		let myHoleCards = gameData.self.cards
		let communityCards = gameData.community
		let nbOtherPlayers = gameData.players.length - 1

		var oddsIfAllIn = PokerHand.MonteCarlo.simulateOddsIfAllIn(100, myHoleCards, communityCards, nbOtherPlayers)
		// console.log('chips', gameData.self.chips)

		if (oddsIfAllIn > 0.5 / nbOtherPlayers) {
			return gameData.betting.call
		} else {
			return 0
		}
	};

	return { update: update, info: info }
}

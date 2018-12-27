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

	var oddsIfAllIn = PokerHand.MonteCarlo.simulateOddsIfAllIn(100, myHoleCards, communityCards, nbOtherPlayers)
	// console.log('handoddsIfAllIn', oddsIfAllIn)

	var potSize = PokerHand.Utils.computePotSize(gameData)
	var potOdds = gameData.betting.call / potSize
	var pokerEquity = oddsIfAllIn
	var potEquity = Math.round(oddsIfAllIn*potSize)
	// console.log('potSize', potSize, 'potEquity', potEquity, 'potOdds', potOdds)


	// my own version of expected value
	// - this is 'another' version - it seems very similar - https://www.cardschat.com/poker-odds-expected-value.php
	// - is that the expected value before i do my move from update() or after... it is a one-off
	// - TODO do read this post, it seems right on point, and then apply it
	// - build another bot using expectedValue. expectedValueBot.js
	var probabilityToWin = oddsIfAllIn
	var probabilityToLoose = (1-probabilityToWin)
	var expectedValue = probabilityToWin * (potSize - gameData.self.wagered) - probabilityToLoose * gameData.self.wagered
	// console.log('expectedValue', expectedValue)

	// var positionIndex = computePositionIndex(gameData)
	// console.log('positionIndex', positionIndex)

	// let positionLabel = utils.computePositionLabel(gameData)
	// console.log('positionLabel', positionLabel)

	// if (oddsIfAllIn < 0.3 && gameData.self.wagered === 0 )	return 0

	// console.log('chips', gameData.self.chips, gameData.betting.raise, gameData.betting.call)
	// debugger
	if (oddsIfAllIn > 2 / nbOtherPlayers) {
		return gameData.betting.raise * 6
	} else 
	if (oddsIfAllIn > 1 / nbOtherPlayers) {
		return gameData.betting.raise * 2
	} else 
	if (oddsIfAllIn > 0.7 / nbOtherPlayers) {
		return gameData.betting.raise
	} else 
	if (oddsIfAllIn > 0.4 / nbOtherPlayers) {
		return gameData.betting.call
	} else 
	{
		return 0
	}
};


////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

module.exports = function () {
	var info = {
		name: "Poker Hand Player"
	};

	return { update: update, info: info }
}

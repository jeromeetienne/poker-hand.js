
function update(gameData) {
	if (gameData.state === "complete") return

	if (gameData.state === 'pre-flop') {

		var hasPair = gameData.self.cards[0][0] === gameData.self.cards[1][0] ? true : false
		if (hasPair === true) {
			var hasHighPair = ['A', 'K', 'Q', 'J'].indexOf(gameData.self.cards[0][0]) >= 0 ? true : false
			if (hasHighPair >= 0) {
				return gameData.betting.raise * 10;
			} else {
				return gameData.betting.call;
			}
		} else if (['A', 'K'].indexOf(gameData.self.cards[0][0]) >= 0) {
			// if high high-card
			return gameData.betting.call;
		} else {
			return 0;
		}
	}
	return gameData.betting.call;
}


module.exports = function () {

	var info = {
		name: "SmartBot"
	};

	return { update: update, info: info }

}

module.exports = function () {

	var info = {
		name: "RandBot"
	};

	function update(gameData) {
		if (gameData.state !== "complete") {
			var heads = Math.random() > 0.5;
			if (heads) {
				return gameData.betting.raise;
			} else { return gameData.betting.call }
		}
	};

	return { update: update, info: info }

}

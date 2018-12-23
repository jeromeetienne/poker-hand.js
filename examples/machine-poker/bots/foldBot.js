module.exports = function () {

	var info = {
		name: "FoldBot"
	};

	function update(gameData) {
		if (gameData.state !== "complete") {
			return 0
		}
	};

	return { update: update, info: info }

}

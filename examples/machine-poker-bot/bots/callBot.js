
function update(gameData) {
	if (gameData.state === "complete") return
	return gameData.betting.call
};


module.exports = function () {

	var info = {
		name: "CallBot"
	};

	return { update: update, info: info }

}

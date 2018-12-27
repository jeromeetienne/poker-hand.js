
function update(gameData) {
	if (gameData.state === "complete") return

	if( Math.random() > 0.5 ){
		return gameData.betting.raise
	}
	return gameData.betting.call
};


module.exports = function () {

	var info = {
		name: "CallRandomRaiseBot"
	};

	return { update: update, info: info }

}

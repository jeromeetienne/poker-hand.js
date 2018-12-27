
function update(gameData) {
	if (gameData.state === "complete") return
	if( gameData.betting.canRaise ){
		return gameData.self.chips
	}
	return gameData.betting.call
};


module.exports = function () {

	var info = {
		name: "AlwayAllInBot"
	};

	return { update: update, info: info }

}

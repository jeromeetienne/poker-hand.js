let PokerHand = require('../build/poker-hand.mjs')
var SimpleStats = require('simple-statistics')

// get those data from command line
let holeCards = ['Ac', 'As']
let communityCards = ['2s']
let nbOtherPlayers = 2;


[100, 500, 1000, 2000, 3000, 5000, 10000].forEach(function(nRounds){
	let nSimulations = 20
	let results = []
	for(let i = 0; i < nSimulations; i++){
		// console.log(`do simulation ${i} with ${nRounds} rounds`)
		var result = PokerHand.MonteCarlo.simulateMultipleRound(nRounds, holeCards, communityCards, nbOtherPlayers)
		results.push(result)
	}
	
	// compute stats on the results
	let mean = SimpleStats.mean(results)
	let stddev = SimpleStats.standardDeviation(results)
	let max = SimpleStats.max(results)
	let min = SimpleStats.min(results)
	console.log(`nRounds ${nRounds.toString().padStart(5)} : mean ${mean.toFixed(6)} (${Math.round(mean*100).toString().padStart(2)}%) - stddev ${stddev.toFixed(6)} - delta min/max [${(min-mean).toFixed(6)}, ${(max-mean).toFixed(6)}]`)	
})






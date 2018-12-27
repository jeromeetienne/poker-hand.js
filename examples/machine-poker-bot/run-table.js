var MachinePoker = require('machine-poker')

// include all bots
var CallBot = require('./bots/callBot')
var RandBot = require('./bots/randBot')
var FoldBot = require('./bots/foldBot')
var botAlwaysAllIn = require('./bots/always-all-in')
var botCallRandomRaise = require('./bots/call-random-raise.js')
var botHighPair = require('./bots/high-pair.js')
var HonestBot = require('./bots/honestBot.js')
var PokerHandBot = require('./bots/pokerHandBot.js')
var ExpectedValueBot = require('./bots/expectedValueBot.js')

// players at the table
var players = [
	MachinePoker.seats.JsLocal.create(RandBot),
	MachinePoker.seats.JsLocal.create(RandBot),
	MachinePoker.seats.JsLocal.create(RandBot),
	MachinePoker.seats.JsLocal.create(RandBot),
	// MachinePoker.seats.JsLocal.create(RandBot),
	// MachinePoker.seats.JsLocal.create(RandBot),
	// MachinePoker.seats.JsLocal.create(FoldBot),
	// MachinePoker.seats.JsLocal.create(CallBot),
	// MachinePoker.seats.JsLocal.create(botAlwaysAllIn),
	// MachinePoker.seats.JsLocal.create(botCallRandomRaise),
	// MachinePoker.seats.JsLocal.create(HonestBot),
	// MachinePoker.seats.JsLocal.create(botHighPair),
	// MachinePoker.seats.JsLocal.create(PokerHandBot),

	MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	// MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	// MachinePoker.seats.JsLocal.create(ExpectedValueBot),
	// MachinePoker.seats.JsLocal.create(PokerHandBot),
	// MachinePoker.seats.JsLocal.create(PokerHandBot),

	// MachinePoker.seats.JsLocal.create(PokerHandBot),
];

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

// create a table
var table = MachinePoker.create({
	maxRounds: 50,
	betting: MachinePoker.betting.noLimit(50,100),
	chips: 3000,
});

table.addPlayers(players);

// Add a narrator observer
table.addObserver(MachinePoker.observers.narrator);

// Add a narrator fileLogger
// var fileLogger = MachinePoker.observers.fileLogger('./examples/results.json');
// table.addObserver(fileLogger);

table.on('tournamentClosed', function () { process.exit() });
table.start();
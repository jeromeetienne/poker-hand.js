'use strict';

class Card {
	static getValue(cardString){
		let value = cardString[0];
		return value
	}
	static getSuit(cardString){
		let suit = cardString[1];
		return suit
	}
	static getRank(cardString){
		let rank = Card.RANKS.indexOf(Card.getValue(cardString));
		console.assert(rank !== -1);
		return rank
	}
	static sort(cardA, cardB){
		if (Card.getRank(cardA) > Card.getRank(cardB)) {
			return -1;
		} else if (Card.getRank(cardA) < Card.getRank(cardB)) {
			return 1;
		} else {
			return 0;
		}
	}
}
Card.SUITS = ['s', 'h', 'c', 'd'];
Card.DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
Card.RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

class Hand {
	// Need to take 7 cards, and return a best hand
	constructor(cardPool, doNotEvaluate) {
		this.cardPool = [];
		this.suits = {};
		this.ranks = [];
		this.cardPool = cardPool.slice();
		this.cardPool.sort(Card.sort);
		for (let card of Array.from(this.cardPool)) {
			let suit = Card.getSuit(card);
			let rank = Card.getRank(card);
			// init arrays if needed
			if (this.suits[suit] === undefined) { this.suits[suit] = []; }
			if (this.ranks[rank] === undefined) { this.ranks[rank] = []; }
			// populate arrays
			this.suits[suit].push(card);
			this.ranks[rank].push(card);
		}
		// TODO is this needed??? this seems super weird
		// - give a compare() with result inverse from standard
		// - if confirmed, change it
		this.ranks.reverse();

		// values sets by the hand evaluator
		this.fullCards = null;
		this.minimalCards = null;
		this.handName = null;
		this.handRank = null;

		if( doNotEvaluate !== true ){
			HandEvaluator.evaluate(this);
		}
	}

	compare(otherHand) {
		// if the rank is different
		if (this.handRank < otherHand.handRank) {
			return 1;
		} else if (this.handRank > otherHand.handRank) {
			return -1;
		}
		// highest card.rank if hand.rank is the same
		for (let cardIndex = 0; cardIndex <= 4; cardIndex++) {
			if (Card.getRank(this.fullCards[cardIndex]) < Card.getRank(otherHand.fullCards[cardIndex])) {
				return 1
			} else if (Card.getRank(this.fullCards[cardIndex]) > Card.getRank(otherHand.fullCards[cardIndex])) {
				return -1
			}
		}
		// if both hands are equalt
		return 0
	}

	static make(cardPool, doNotEvaluate){
		let hand = new Hand(cardPool, doNotEvaluate);
		return hand
	}

	beats(otherHand) {
		const result = this.compare(otherHand);
		if (result < 0) {
			return true;
		} else {
			return false;
		}
	}

	losesTo(otherHand) {
		const result = this.compare(otherHand);
		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}

	ties(otherHand) {
		const result = this.compare(otherHand);
		if (result === 0) {
			return true;
		} else {
			return false;
		}
	}
	// TODO move that in HandEvaluator
	nextHighest(excluding) {
		if (!excluding) { excluding = []; }
		excluding = excluding.concat(this.fullCards);
		let picks = this.cardPool.filter(function (card) {
			if (excluding.indexOf(card) < 0) {
				return true;
			}
		});
		return picks
	}
}


Hand.pickWinners = function (hands) {
	// Find highest ranked hands
	// reject any that lose another hand
	const byRank = hands.map(h => h.handRank);
	const highestRank = Math.max.apply(Math, byRank);
	hands = hands.filter(h => h.handRank === highestRank);
	hands = hands.filter(function (h) {
		let loses = false;
		for (let hand of Array.from(hands)) {
			loses = h.losesTo(hand);
			if (loses) { break; }
		}
		return !loses;
	});
	return hands;
};

////////////////////////////////////////////////////////////////////////
//		HandEvaluator
////////////////////////////////////////////////////////////////////////

class HandEvaluator {
	static evaluate( hand ) {
		for (let handTestFunction of HandEvaluator._handTestFunctions) {
			// test if this hand is a match
			let isValid = handTestFunction(hand);
			if (isValid === false) continue
			// populate hand.fullCards if enough cards are available
			let nextHighestCards = hand.nextHighest(hand.minimalCards);
			let nextHighestCardsNeeded = Math.max(0, 5 - hand.minimalCards.length);
			if (nextHighestCards.length >= nextHighestCardsNeeded) {
				hand.fullCards = hand.minimalCards.concat(nextHighestCards.slice(0, nextHighestCardsNeeded));
			}
			// populate hand.handRank
			hand.handRank = HandEvaluator.HandRanks[hand.handName];
			// leave the loop
			break
		}
	}
	////////////////////////////////////////////////////////////////////////
	//		Code
	////////////////////////////////////////////////////////////////////////
	
	static _testStraightFlush(hand) {
		for (let suit in hand.suits) {
			let cards = hand.suits[suit];
			if (cards.length < 5) continue
	
			const tmpHand = new Hand(cards, true);
			let isValid = HandEvaluator._testStraight(tmpHand);
			if (isValid === false) continue
	
			hand.minimalCards = tmpHand.minimalCards;
			hand.handName = 'StraightFlush';
			hand.handRank = 8;
			return true
		}
		return false
	}
	static _testFourOfaKind(hand) {
		for (let cards of Array.from(hand.ranks)) {
			if (cards === undefined) continue
			if (cards.length === 4) {
				hand.minimalCards = cards.slice();
				hand.handName = 'FourOfaKind';
				hand.handRank = 7;
				return true
			}
		}
		return false
	}
	static _testFullHouse(hand) {
		let minimalCards = [];
		for (let cards of Array.from(hand.ranks)) {
			if (cards && (cards.length === 3)) {
				minimalCards = cards;
				break;
			}
		}
		if (minimalCards.length === 3) {
			for (let cards of Array.from(hand.ranks)) {
				if (cards && (cards.length >= 2)) {
					if (Card.getValue(minimalCards[0]) !== Card.getValue(cards[0])) {
						hand.minimalCards = minimalCards.concat(cards.slice(0, 2));
						hand.handName = 'FullHouse';
						hand.handRank = 6;
						return true
					}
				}
			}
		}
		return false
	}
	static _testFlush(hand) {
		for (let suit in hand.suits) {
			let cards = hand.suits[suit];
			if (cards.length >= 5) {
				hand.minimalCards = cards.slice(0, 5);
				hand.handName = 'Flush';
				hand.handRank = 5;
				return true
			}
		}
		return false
	}
	static _testStraight(hand) {
		let minimalCards = [];
		// build new cardPool with special card of '1s' for all 'As' thus Aces can have both values
		let cardPool = hand.cardPool.slice();
		for (let card of Array.from(cardPool)) {
			// Handle a ace low straight
			if (Card.getValue(card) === 'A') {
				cardPool.push(`1${Card.getSuit(card)}`);
			}
		}
	
		for (let card of cardPool) {
			const previousCard = minimalCards[minimalCards.length - 1];
			let diff = null;
			if (previousCard) {
				diff = Card.getRank(previousCard) - Card.getRank(card);
			}
			if (diff > 1) {
				minimalCards = []; // Start over
				minimalCards.push(card);
			} else if (diff === 1) {
				minimalCards.push(card);
				//first time through the loop
			} else if (diff === null) {
				minimalCards.push(card);
			}
			if (minimalCards.length === 5) {
				hand.minimalCards = minimalCards;
				hand.minimalCards = hand.minimalCards.map((card) => {
					if (Card.getValue(card) === '1') return 'A' + Card.getSuit(card)
					return card
				});
				hand.handName = 'Straight';
				hand.handRank = 4;
				return true
			}
		}
		return false
	}
	static _testThreeOfaKind(hand) {
		for (let cards of Array.from(hand.ranks)) {
			if (cards === undefined) continue
			if (cards.length === 3) {
				hand.minimalCards = cards.slice();
				hand.handName = 'ThreeOfaKind';
				hand.handRank = 3;
				return true
			}
		}
		return false
	}
	
	static _testTwoPair(hand) {
		let minimalCards = [];
		for (let cards of Array.from(hand.ranks)) {
			if (cards === undefined) continue
			if (minimalCards.length === 2 && cards.length === 2) {
				// update and return hand
				hand.minimalCards = minimalCards.concat(cards);
				hand.handName = 'TwoPair';
				hand.handRank = 2;
				return true
			} else if (minimalCards.length === 0 && cards.length === 2) {
				minimalCards = cards;
			}
		}
		return false
	}
	static _testOnePair(hand) {
		for (let cards of hand.ranks) {
			if (cards === undefined) continue
			if (cards.length === 2) {
				// update and return hand
				hand.minimalCards = cards.slice();
				hand.handName = 'OnePair';
				hand.handRank = 1;
				return true
			}
		}
		return false
	}
	static _testHighCard(hand) {
		// update and return hand
		hand.minimalCards = hand.cardPool.slice(0, 1);
		hand.handName = 'HighCard';
		hand.handRank = 0;
		return true
	}
	
}

Hand.HandEvaluator = HandEvaluator;

HandEvaluator._handTestFunctions = [];
HandEvaluator._handTestFunctions.push(HandEvaluator._testStraightFlush);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFourOfaKind);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFullHouse);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFlush);
HandEvaluator._handTestFunctions.push(HandEvaluator._testStraight);
HandEvaluator._handTestFunctions.push(HandEvaluator._testThreeOfaKind);
HandEvaluator._handTestFunctions.push(HandEvaluator._testTwoPair);
HandEvaluator._handTestFunctions.push(HandEvaluator._testOnePair);
HandEvaluator._handTestFunctions.push(HandEvaluator._testHighCard);

HandEvaluator.HandRanks = {
	'StraightFlush' : 8,
	'FourOfaKind': 7,
	'FullHouse': 6,
	'Flush': 5,
	'Straight': 4,
	'ThreeOfaKind': 3,
	'TwoPair': 2,
	'OnePair': 1,
	'HighCard': 0,
};

////////////////////////////////////////////////////////////////////////
//		Utils to generate random cards from a deck
////////////////////////////////////////////////////////////////////////

function pickRandomCard() {
	var SUITS = ['s', 'h', 'c', 'd'];
	var VALUES=['2','3','4','5','6','7','8','9','T','J','Q','K','A'];
	var cardValue = VALUES[Math.floor(Math.random() * VALUES.length)];
	var cardSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
	var card = cardValue + cardSuit;
	return card
}

function pickUnusedCards(nbCards, usedCards) {
	var unusedCards = [];
	while (unusedCards.length !== nbCards) {
		var randomCard = pickRandomCard();
		if (usedCards.indexOf(randomCard) !== -1) continue
		if (unusedCards.indexOf(randomCard) !== -1) continue
		unusedCards.push(randomCard);
	}
	return unusedCards
}

////////////////////////////////////////////////////////////////////////
//		Pot related
////////////////////////////////////////////////////////////////////////


function computePotSize(gameData) {
	let allWages = gameData.players.map((player) => player.wagered);
	let potSize = allWages.reduce((accumulator, currentValue) => accumulator + currentValue);
	return potSize
}


/**
 * - based on https://www.cardschat.com/poker-odds-pot-odds-implied-odds.php
 * @param {Object} gameData 
 */
function computePotOdds(gameData) {
	var potSize = utils.computePotSize(gameData);
	var potOdds = gameData.betting.call / potSize;
	return potOdds
}


////////////////////////////////////////////////////////////////////////
//		compute positions
////////////////////////////////////////////////////////////////////////


function computePositionIndex(gameData) {
	let positionIndex = gameData.players.findIndex((player) => player.name === gameData.self.name);
	return positionIndex
}

/**
 * compute the position label
 * - based on https://www.pokerstarsschool.com/article/Poker-Position-Overview
 * 
 * @param {Object} gameData 
 */
function computePositionLabel(gameData) {
	let positionLabel = null;
	// determine positionLabel based on positionIndex and gameData.players.length
	let positionIndex = computePositionIndex(gameData);
	if (positionIndex === 0) positionLabel = 'latePosition-dealer';			// dealer
	else if (positionIndex === gameData.players.length - 1) positionLabel = 'latePosition';	// player on the right of the dealer
	else if (positionIndex === 1) positionLabel = 'earlyPosition-smallblind';	// small blind
	else if (positionIndex === 2) positionLabel = 'earlyPosition-bigblind';		// big blind
	else if (positionIndex === 3) positionLabel = 'earlyPosition-underthegun';	// under the gun
	else if (positionIndex === 4) positionLabel = 'earlyPosition-underthegun+1';	// under the gun+1
	else positionLabel = 'middlePosition';	// all the others
	// return positionLabel
	return positionLabel
}

function computePositionLabelRaw(gameData) {
	let positionLabel = computePositionLabel(gameData);
	let positionLabelRaw = positionLabel.split('-')[0];
	return positionLabelRaw
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

var Utils = {
	pickRandomCard,
	pickUnusedCards,

	computePotSize,
	computePotOdds,

	computePositionIndex,	
	computePositionLabel,
	computePositionLabelRaw,
};

function simulateOutsCount(holeCards, communityCards, requiredHandRank, nSimulations) {
	const outCardsSet = new Set();

	console.assert(holeCards.length === 2);
	console.assert(communityCards.length >= 0);

	for (let i = 0; i < nSimulations; i++) {
		let randomCard = Utils.pickUnusedCards(1, holeCards.concat(communityCards));
		// console.log(`draw cards ${randomCard}`)
		let newCommunityCards = communityCards.concat(randomCard);

		// console.log(`newCommunityCards ${newCommunityCards}`)

		let finalHand = Hand.make(holeCards.concat(newCommunityCards));
		// let communityHand = PokerHand.Hand.make(newCommunityCards)
		// console.log(`finalHand ${finalHand.minimalCards} name ${finalHand.handName} rank ${finalHand.handRank}`)
		// console.log(`communityHand ${communityHand} name ${communityHand.handName} rank ${communityHand.handRank}`)

		let involvedMyHoleCards = finalHand.minimalCards.indexOf(holeCards[0]) !== -1
			|| finalHand.minimalCards.indexOf(holeCards[1]) !== -1;

		if (finalHand.handRank >= requiredHandRank && involvedMyHoleCards === true) {
			// console.log(`${randomCard} IS an out`)
			outCardsSet.add(randomCard.toString());
		}
	}

	let outCards = Array.from(outCardsSet).sort();
	// console.log(`nOuts ${outCards.length} outCards ${outCards}`)
	return outCards
}


/**
 * - good link on poker-odd and expected value
 *   https://www.cardschat.com/poker-odds-expected-value.php
 */

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////
function simulateOddsIfAllIn(nbRounds, holeCards, communityCards, nbOtherPlayers) {
	var result = 0;
	for (let roundIndex = 0; roundIndex < nbRounds; roundIndex++) {
		var amIWinning = simulateOneRound(holeCards, communityCards, nbOtherPlayers);
		if (amIWinning === true) {
			result += 1;
		} else {
			result += 0;
		}
	}
	let average = result / nbRounds;
	return average
}


function simulateOneRound(holeCards, communityCards, nbOtherPlayers) {
	// generate finalCommunityCards
	let randomCommunityCards = Utils.pickUnusedCards(5 - communityCards.length, holeCards.concat(communityCards));
	let finalCommunityCards = communityCards.concat(randomCommunityCards);

	// generate otherPlayersHoleCards
	let otherPlayersHoleCards = [];
	let unusedCards = Utils.pickUnusedCards(nbOtherPlayers * 2, holeCards.concat(finalCommunityCards));
	for (let i = 0; i < nbOtherPlayers; i++) {
		let otherPlayerHoleCards = unusedCards.slice(i * 2, i * 2 + 2);
		otherPlayersHoleCards[i] = otherPlayerHoleCards;
	}

	// compute myFinalHand
	let myFinalCards = holeCards.concat(finalCommunityCards);
	let myFinalHand = new Hand(myFinalCards);

	// compute all otherPlayersFinalHand
	let otherPlayersFinalHand = [];
	for (let i = 0; i < nbOtherPlayers; i++) {
		let otherPlayerFinalCards = otherPlayersHoleCards[i].concat(finalCommunityCards);
		otherPlayersFinalHand[i] = new Hand(otherPlayerFinalCards);
	}

	// determine who will win
	let allFinalHands = [myFinalHand].concat(otherPlayersFinalHand);
	let winnersHand = Hand.pickWinners(allFinalHands);
	let winnerIndex = allFinalHands.indexOf(winnersHand[0]);

	////////////////////////////////////////////////////////////////////////
	//		display result
	////////////////////////////////////////////////////////////////////////


	// console.log('###########################')
	// console.log('my holeCards', holeCards)
	// console.log('----')
	// for (let i = 0; i < nbOtherPlayers; i++) {
	// 	let otherPlayerHoleCards = otherPlayersHoleCards[i]
	// 	console.log(`other player #${i} hole`, otherPlayerHoleCards)
	// }
	// console.log('----')
	// console.log('finalCommunityCards', finalCommunityCards)
	// console.log('###########################')
	// console.log('myFinalHand', myFinalHand.name, 'with', myFinalHand.toString(), 'of rank', myFinalHand.rank)
	// for (let i = 0; i < nbOtherPlayers; i++) {
	// 	let otherPlayerFinalHand = otherPlayersFinalHand[i]
	// 	console.log(`other player #${i} hand`, otherPlayerFinalHand.name, 'with', otherPlayerFinalHand.toString(), 'of rank', otherPlayerFinalHand.rank)
	// }
	// console.log('winnerIndex', winnerIndex)

	let amIWinning = winnerIndex === 0 ? true : false;
	return amIWinning
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

var MonteCarlo = {
	simulateOddsIfAllIn,
	simulateOutsCount,
};

class CardDomElement {

	/**
	 * Create a card DomElement
	 * @param {String} card the card value string
	 * @returns {DomElement}
	 */
	static create(card) {
		let denomination = card[0];
		let suit = card[1];
		let htmlContent = `
		<div class='card' data-card-value='${card}'>
				<div class='denomination'>
					${CardDomElement.htmlDenominations[denomination]}
				</div>
				<div class='suit'>
					${CardDomElement.htmlSuits[suit]}
				</div>
		</div>
		`;

		let domElement = createElementFromHTML(htmlContent);
		return domElement

		function createElementFromHTML(htmlString) {
			var domElement = document.createElement('div');
			domElement.innerHTML = htmlString.trim();
			return domElement.firstChild
		}
	}

	/**
	 * Update a card DomElement
	 * @param {DomElement} cardDomElement 
	 */
	static update(cardDomElement) {
		let denomination = cardDomElement.dataset.cardValue[0];
		let suit = cardDomElement.dataset.cardValue[1];
		cardDomElement.dataset.cardValue = denomination + suit;
		cardDomElement.querySelector('.denomination').innerHTML = CardDomElement.htmlDenominations[denomination];
		cardDomElement.querySelector('.suit').innerHTML = CardDomElement.htmlSuits[suit];
	}
}

CardDomElement.htmlSuits = {
	's': '<span style="color:black">♠</span>',
	'h': '<span style="color:red">♥</span>',
	'c': '<span style="color:black">♣</span>',
	'd': '<span style="color:red">♦</span>',
	' ': '<span style="color:back"> </span>',
};
CardDomElement.htmlDenominations = {
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	'T': '10',
	'J': 'J',
	'Q': 'Q',
	'K': 'K',
	'A': 'A',
	' ': ' ',
};

/**
 * - it requires a css and html part too
 * @param {*} currentCard 
 * @param {*} onSelected 
 */
function cardSelectionStart(currentCard, onSelected) {
	showSelector();
	addEventListeners();
	showHighLight(currentCard);



	/**
	 * - display the card selector 
	 * - display selected card - highlight it somehow
	 * - allow selection change
	 * - if new card selected, notify the callback
	 */

	return

	function showSelector() {
		document.querySelector('#cardSelectionID').style.display = 'block';

	}
	function hideSelector() {
		document.querySelector('#cardSelectionID').style.display = 'none';

	}

	function showHighLight(card) {
		let currentDenomination = card[0];
		let currentSuit = card[1];
		if (currentDenomination !== ' ') {
			document.querySelector(`#cardSelectionID [data-card-denomination='${currentDenomination}']`).classList.add('selected');
		}
		if (currentSuit !== ' ') {
			document.querySelector(`#cardSelectionID [data-card-suit='${currentSuit}']`).classList.add('selected');
		}
	}
	function removeAllHighlight() {
		let domElements = Array.from(document.querySelectorAll('#cardSelectionID .selected'));
		domElements.forEach((domElement) => {
			domElement.classList.remove('selected');
		});
	}

	function onDenominationClick(domEvent) {
		currentCard = domEvent.target.dataset.cardDenomination + currentCard[1];
		onSelectionChange();
	}
	function onSuitClick(domEvent) {
		currentCard = currentCard[0] + domEvent.target.dataset.cardSuit;
		onSelectionChange();
	}
	function onSelectionChange() {
		removeAllHighlight();
		showHighLight(currentCard);

		let isFullyQualified = currentCard[0] !== ' ' && currentCard[1] !== ' ';
		if (isFullyQualified === true) {
			removeAllHighlight();
			removeEventListeners();
			hideSelector();
			onSelected(currentCard);
			return
		}
	}
	function onClearCard() {
		removeAllHighlight();
		removeEventListeners();
		hideSelector();
		onSelected('  ');
	}


	// addEventListener of all events
	function addEventListeners() {
		var DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
		var SUITS = ['s', 'h', 'c', 'd'];

		DENOMINATIONS.forEach((denomination) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-denomination='${denomination}']`);
			domElement.addEventListener('click', onDenominationClick);
		});
		SUITS.forEach((suit) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-suit='${suit}']`);
			domElement.addEventListener('click', onSuitClick);
		});

		document.querySelector(`#cardSelectionID [data-card-denomination=' ']`).addEventListener('click', onClearCard);
	}

	// removeEventListener of all events
	function removeEventListeners() {
		var DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
		var SUITS = ['s', 'h', 'c', 'd'];

		DENOMINATIONS.forEach((denomination) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-denomination='${denomination}']`);
			domElement.removeEventListener('click', onDenominationClick);
		});
		SUITS.forEach((suit) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-suit='${suit}']`);
			domElement.removeEventListener('click', onSuitClick);
		});

		document.querySelector(`#cardSelectionID [data-card-denomination=' ']`).removeEventListener('click', onClearCard);
	}
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

var CardUISelection = {
	modal: cardSelectionStart
};

// es6 export
var index = {
	Card,
	Hand,

	Utils,
	MonteCarlo,

	CardDomElement,
	CardUISelection,
};

module.exports = index;

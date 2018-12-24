import Card2 from './card2.js'

class Hand {
	// Need to take 7 cards, and return a best hand
	constructor(cardPool, doNotEvaluate) {
		this.cardPool = [];
		this.suits = {};
		this.ranks = [];
		this.cardPool = cardPool.slice()
		this.cardPool.sort(Card2.sort);
		for (let card of Array.from(this.cardPool)) {
			let suit = Card2.getSuit(card)
			let rank = Card2.getRank(card)
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
		this.handName = null
		this.handRank = null

		if( doNotEvaluate !== true ){
			this.evaluate()
		}
	}

	evaluate() {
		let handTestFunctions = []
		handTestFunctions.push(testStraightFlush);
		handTestFunctions.push(testFourOfaKind);
		handTestFunctions.push(testFullHouse);
		handTestFunctions.push(testFlush);
		handTestFunctions.push(testStraight);
		handTestFunctions.push(testThreeOfaKind);
		handTestFunctions.push(testTwoPair);
		handTestFunctions.push(testOnePair);
		handTestFunctions.push(testHighCard);
		////////////////////////////////////////////////////////////////////////
		//		Code
		////////////////////////////////////////////////////////////////////////

		for (let handTestFunction of handTestFunctions) {
			// test if this hand is a match
			let isValid = handTestFunction(this)
			if (isValid === false) continue
			// populate this.fullCards
			let nextHighestCards = this.nextHighest(this.minimalCards)
			let nextHighestCardsNeeded = Math.max(0, 5 - this.minimalCards.length)
			if (nextHighestCards.length >= nextHighestCardsNeeded) {
				this.fullCards = this.minimalCards.concat(nextHighestCards.slice(0, nextHighestCardsNeeded))
			}
			// leave the loop
			break
		}
	}

	compare(otherHand) {
		// if the rank is different
		if (this.rank < otherHand.rank) {
			return 1;
		} else if (this.rank > otherHand.rank) {
			return -1;
		}
		// highest card.rank if hand.rank is the same
		for (let cardIndex = 0; cardIndex <= 4; cardIndex++) {
			if (Card2.getRank(this.cards[cardIndex]) < Card2.getRank(otherHand.cards[cardIndex])) {
				return 1
			} else if (Card2.getRank(this.cards[cardIndex]) > Card2.getRank(otherHand.cards[cardIndex])) {
				return -1
			}
		}
		// if both hands are equalt
		return 0
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

	// Handle a generic high card compare
	make() { }
	// Override me

	toString() {
		const cards = this.cards.map(c => c.toString());
		return cards.join(',');
	}
}


Hand.pickWinners = function (hands) {
	// Find highest ranked hands
	// reject any that lose another hand
	const byRank = hands.map(h => h.rank);
	const highestRank = Math.max.apply(Math, byRank);
	hands = hands.filter(h => h.rank === highestRank);
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

export default Hand

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

class HandEvaluator {
	
}


////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////


function testStraightFlush(hand) {
	for (let suit in hand.suits) {
		let cards = hand.suits[suit];
		if (cards.length < 5) continue

		const tmpHand = new Hand(cards, true);
		let isValid = testStraight(tmpHand)
		if (isValid === false) continue

		hand.minimalCards = tmpHand.minimalCards
		hand.handName = 'Straight Flush';
		hand.handRank = 8;
		return true
	}
	return false
}
function testFourOfaKind(hand) {
	for (let cards of Array.from(hand.ranks)) {
		if (cards === undefined) continue
		if (cards.length === 4) {
			hand.minimalCards = cards.slice()
			hand.handName = 'FourOfaKind';
			hand.handRank = 7;
			return true
		}
	}
	return false
}
function testFullHouse(hand) {
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
				if (Card2.getValue(minimalCards[0]) !== Card2.getValue(cards[0])) {
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
function testFlush(hand) {
	for (let suit in hand.suits) {
		let cards = hand.suits[suit];
		if (cards.length >= 5) {
			hand.minimalCards = cards.slice(0, 5)
			hand.handName = 'Flush';
			hand.handRank = 5;
			return true
		}
	}
	return false
}
function testStraight(hand) {
	let card;
	let minimalCards = []
	// build new cardPool with special card of '1s' for all 'As' thus Aces can have both values
	let cardPool = hand.cardPool.slice()
	for (let card of Array.from(cardPool)) {
		// Handle a ace low straight
		if (Card2.getValue(card) === 'A') {
			cardPool.push(`1${Card2.getSuit(card)}`);
		}
	}

	for (let card of cardPool) {
		const previousCard = minimalCards[minimalCards.length - 1];
		let diff = null;
		if (previousCard) {
			diff = Card2.getRank(previousCard) - Card2.getRank(card)
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
			hand.minimalCards = minimalCards
			hand.minimalCards = hand.minimalCards.map((card) => {
				if (Card2.getValue(card) === '1') return 'A' + Card2.getSuit(card)
				return card
			})
			hand.handName = 'Straight'
			hand.handRank = 4
			return true
		}
	}
	return false
}
function testThreeOfaKind(hand) {
	for (let cards of Array.from(hand.ranks)) {
		if (cards === undefined) continue
		if (cards.length === 3) {
			hand.minimalCards = cards.slice()
			hand.handName = 'ThreeOfaKind';
			hand.handRank = 3;
			return true
		}
	}
	return false
}

function testTwoPair(hand) {
	let minimalCards = []
	for (let cards of Array.from(hand.ranks)) {
		if (cards === undefined) continue
		if (minimalCards.length === 2 && cards.length === 2) {
			// update and return hand
			hand.minimalCards = minimalCards.concat(cards);
			hand.handName = 'TwoPair';
			hand.handRank = 2;
			return true
		} else if (minimalCards.length === 0 && cards.length === 2) {
			minimalCards = cards
		}
	}
	return false
}
function testOnePair(hand) {
	for (let cards of hand.ranks) {
		if (cards === undefined) continue
		if (cards.length === 2) {
			// update and return hand
			hand.minimalCards = cards.slice()
			hand.handName = 'OnePair';
			hand.handRank = 1;
			return true
		}
	}
	return false
}
function testHighCard(hand) {
	// update and return hand
	hand.minimalCards = hand.cardPool.slice(0, 1)
	hand.handName = 'HighCard';
	hand.handRank = 0;
	return true
}

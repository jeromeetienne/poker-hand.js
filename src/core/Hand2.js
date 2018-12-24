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
			HandEvaluator.evaluate(this)
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
			if (Card2.getRank(this.fullCards[cardIndex]) < Card2.getRank(otherHand.fullCards[cardIndex])) {
				return 1
			} else if (Card2.getRank(this.fullCards[cardIndex]) > Card2.getRank(otherHand.fullCards[cardIndex])) {
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

export default Hand

////////////////////////////////////////////////////////////////////////
//		HandEvaluator
////////////////////////////////////////////////////////////////////////

class HandEvaluator {
	static evaluate( hand ) {
		for (let handTestFunction of HandEvaluator._handTestFunctions) {
			// test if this hand is a match
			let isValid = handTestFunction(hand)
			if (isValid === false) continue
			// populate hand.fullCards
			let nextHighestCards = hand.nextHighest(hand.minimalCards)
			let nextHighestCardsNeeded = Math.max(0, 5 - hand.minimalCards.length)
			if (nextHighestCards.length >= nextHighestCardsNeeded) {
				hand.fullCards = hand.minimalCards.concat(nextHighestCards.slice(0, nextHighestCardsNeeded))
			}
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
			let isValid = HandEvaluator._testStraight(tmpHand)
			if (isValid === false) continue
	
			hand.minimalCards = tmpHand.minimalCards
			hand.handName = 'Straight Flush';
			hand.handRank = 8;
			return true
		}
		return false
	}
	static _testFourOfaKind(hand) {
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
	static _testFlush(hand) {
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
	static _testStraight(hand) {
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
	static _testThreeOfaKind(hand) {
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
	
	static _testTwoPair(hand) {
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
	static _testOnePair(hand) {
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
	static _testHighCard(hand) {
		// update and return hand
		hand.minimalCards = hand.cardPool.slice(0, 1)
		hand.handName = 'HighCard';
		hand.handRank = 0;
		return true
	}
	
}


HandEvaluator._handTestFunctions = []
HandEvaluator._handTestFunctions.push(HandEvaluator._testStraightFlush);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFourOfaKind);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFullHouse);
HandEvaluator._handTestFunctions.push(HandEvaluator._testFlush);
HandEvaluator._handTestFunctions.push(HandEvaluator._testStraight);
HandEvaluator._handTestFunctions.push(HandEvaluator._testThreeOfaKind);
HandEvaluator._handTestFunctions.push(HandEvaluator._testTwoPair);
HandEvaluator._handTestFunctions.push(HandEvaluator._testOnePair);
HandEvaluator._handTestFunctions.push(HandEvaluator._testHighCard);


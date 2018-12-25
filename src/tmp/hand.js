import Card from './card.js'

class Hand {
	// Need to take 7 cards, and return a best hand
	constructor(cards) {
		this.cardPool = [];
		this.cards = [];
		this.suits = {};
		this.ranks = [];
		this.cardPool = cards.map(function (c) {
			if (typeof c === 'string') {
				return new Card(c);
			} else {
				return c;
			}
		});
		this.cardPool.sort(Card.sort);
		for (let card of Array.from(this.cardPool)) {
			// init arrays if needed
			if (!this.suits[card.suit]) { this.suits[card.suit] = []; }
			if (!this.ranks[card.rank]) { this.ranks[card.rank] = []; }
			// populate arrays
			this.suits[card.suit].push(card);
			this.ranks[card.rank].push(card);
		}
		// TODO is this needed??? this seems super weird
		// - give a compare() with result inverse from standard
		// - if confirmed, change it
		this.ranks.reverse();
		this.isPossible = this.make();
	}

	compare(a) {
		if (this.rank < a.rank) {
			return 1;
		} else if (this.rank > a.rank) {
			return -1;
		}
		let result = 0;
		for (let x = 0; x <= 4; x++) {
			if (this.cards[x].rank < a.cards[x].rank) {
				result = 1;
				break;
			} else if (this.cards[x].rank > a.cards[x].rank) {
				result = -1;
				break;
			}
		}
		return result;
	}

	beats(h) {
		const result = this.compare(h);
		if (result < 0) {
			return true;
		} else {
			return false;
		}
	}

	losesTo(h) {
		const result = this.compare(h);
		if (result > 0) {
			return true;
		} else {
			return false;
		}
	}

	ties(h) {
		const result = this.compare(h);
		if (result === 0) {
			return true;
		} else {
			return false;
		}
	}

	nextHighest(excluding) {
		let picks;
		if (!excluding) { excluding = []; }
		excluding = excluding.concat(this.cards);
		return picks = this.cardPool.filter(function (card) {
			if (excluding.indexOf(card) < 0) {
				return true;
			}
		});
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

Hand.make = function (cards/*, partialOK === false */) {
	// Build and return the best hand
	//
	const hands = [StraightFlush, FourOfAKind, FullHouse, Flush, Straight,
		ThreeOfAKind, TwoPair, OnePair, HighCard];
	let result = null;
	for (let hand of Array.from(hands)) {
		result = new hand(cards)
		// TODO if not partialOK test .isPossible
		// if partialOK, test .isPartial
		if (result.isPossible) { break; }
	}
	return result;
};

////////////////////////////////////////////////////////////////////////
//		Code
////////////////////////////////////////////////////////////////////////

class StraightFlush extends Hand {
	// TODO put that in a constructor
	// - isPossible === got a value hand + 5 cards
	// - isPartial === i got the value hand but not 5 cards
	// - minimalCards === minimal cards to compose this hand
	//   - aka if pair, this is the 2 cards which compose the pair
	//   - aka if set, this is the 3 cards
	//   - etc...
	// - write some test for poker-hand.js
	// - then to know if a new card is an OUT, build a Hand() with those cards
	//   - it has to be superior rank than the Hand without the new cards
	//   - the new Hand.minimalCards MUST include at least one selfPlayer's hold cards
	constructor(cards){
		super(cards)
		this.name = 'Straight Flush';
		this.rank = 8;
	}
	make() {
		let cards;
		let possibleStraight = null;
		for (let suit in this.suits) {
			cards = this.suits[suit];
			if (cards.length >= 5) {
				possibleStraight = cards;
				break;
			}
		}
		if (possibleStraight) {
			const straight = new Straight(possibleStraight);
			if (straight.isPossible) {
				this.cards = straight.cards;
			}
		}
		return this.cards.length === 5;
	}
};

class FourOfAKind extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Four of a kind';
		this.rank = 7;
	}
	make() {
		let cards;
		for (cards of Array.from(this.ranks)) {
			if (cards && (cards.length === 4)) {
				this.cards = cards;
				this.cards.push(this.nextHighest()[0]);
				break;
			}
		}
		return this.cards.length === 5;
	}
};

class FullHouse extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Full house';
		this.rank = 6;
	}
	make() {
		let cards;
		for (cards of Array.from(this.ranks)) {
			if (cards && (cards.length === 3)) {
				this.cards = cards;
				break;
			}
		}
		if (this.cards.length === 3) {
			for (cards of Array.from(this.ranks)) {
				if (cards && (cards.length >= 2)) {
					if (this.cards[0].value !== cards[0].value) {
						this.cards = this.cards.concat(cards.slice(0, 2));
						break;
					}
				}
			}
		}
		return this.cards.length === 5;
	}
}

class Flush extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Flush';
		this.rank = 5;
	}
	make() {
		let cards;
		for (let suit in this.suits) {
			cards = this.suits[suit];
			if (cards.length >= 5) {
				this.cards = cards.slice(0, 5);
				break;
			}
		}
		return this.cards.length === 5;
	}
};

class Straight extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Straight';
		this.rank = 4;
	}
	make() {
		let card;
		for (card of Array.from(this.cardPool)) {
			// Handle a ace low straight
			if (card.value === 'A') {
				this.cardPool.push(new Card(`1${card.suit}`));
			}
		}
		for (card of Array.from(this.cardPool)) {
			const previousCard = this.cards[this.cards.length - 1];
			let diff = null;
			if (previousCard) {
				diff = previousCard.rank - card.rank;
			}
			if (diff > 1) {
				this.cards = []; // Start over
				this.cards.push(card);
			} else if (diff === 1) {
				this.cards.push(card);
				//first time through the loop
			} else if (diff === null) {
				this.cards.push(card);
			}
			if (this.cards.length === 5) { break; }
		}
		return this.cards.length === 5;
	}
};

class ThreeOfAKind extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Three of a kind';
		this.rank = 3;
	}
	make() {
		let cards;
		for (cards of Array.from(this.ranks)) {
			if (cards && (cards.length === 3)) {
				this.cards = cards;
				this.cards = this.cards.concat(this.nextHighest().slice(0, 2));
				break;
			}
		}
		return this.cards.length === 5;
	}
};

class TwoPair extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'Two pair';
		this.rank = 2;
	}
	make() {
		let cards;
		for (cards of Array.from(this.ranks)) {
			if ((this.cards.length > 0) && cards && (cards.length === 2)) {
				this.cards = this.cards.concat(cards);
				this.cards.push(this.nextHighest()[0]);
				break;
			} else if (cards && (cards.length === 2)) {
				this.cards = this.cards.concat(cards);
			}
		}
		return this.cards.length === 5;
	}
};

class OnePair extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'One pair';
		this.rank = 1;
	}
	make() {
		let cards;
		for (cards of Array.from(this.ranks)) {
			if (cards && (cards.length === 2)) {
				this.cards = this.cards.concat(cards);
				this.cards = this.cards.concat((this.nextHighest().slice(0, 3)));
				break;
			}
		}
		return this.cards.length === 5;
	}
};


class HighCard extends Hand {
	constructor(cards){
		super(cards)
		this.name = 'High card';
		this.rank = 0;
	}
	make() {
		this.cards = this.cardPool.slice(0, 5);
		return true;
	}
}

export default Hand

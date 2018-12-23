(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.PokerHand = factory());
}(this, (function () { 'use strict';

	class Card {
		constructor(str) {
			this.value = str.substr(0, 1);
			this.suit = str.substr(1, 1).toLowerCase();
			this.rank = Card.VALUES.indexOf(this.value);
		}

		static fromString(str){
			return new Card(str)
		}

		toString() {
			if (this.rank === 0) {
				return `A${this.suit}(Low)`;
			} else {
				return `${this.value}${this.suit}`;
			}
		}
	}

	Card.VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
	Card.sort = function (a, b) {
		if (a.rank > b.rank) {
			return -1;
		} else if (a.rank < b.rank) {
			return 1;
		} else {
			return 0;
		}
	};

	class Deck {
		constructor() {
			this.reset();
		}

		reset(){
			this.cards = [];
			for (let value of Array.from(Card.VALUES.slice(1, 14))) {
				this.cards.push(new Card(`${value}s`));
				this.cards.push(new Card(`${value}h`));
				this.cards.push(new Card(`${value}d`));
				this.cards.push(new Card(`${value}c`));
			}
		}


		shuffle(nSuffle) {
			nSuffle = nSuffle !== undefined ? nSuffle : 3;
			for (let suffleIndex = 0; suffleIndex < nSuffle; suffleIndex++) {
				// do one suffle
				for (var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
					var rndNo = Math.floor(Math.random() * (this.cards.length - 1));
					var card = this.cards[cardIndex];
					this.cards[cardIndex] = this.cards[rndNo];
					this.cards[rndNo] = card;
				}
			}
		}
		deal() {
			return this.cards.shift();
		}

		////////////////////////////////////////////////////////////////////////
		//		Code
		////////////////////////////////////////////////////////////////////////
		
		toString() {
			const cards = this.cards.map(c => c.toString());
			return cards.join(",");
		}

		toArray() {
			const cards = this.cards.map(c => c.toString());
			return cards
		}
	}

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

	Hand.make = function (cards) {
		// Build and return the best hand
		//
		const hands = [StraightFlush, FourOfAKind, FullHouse, Flush, Straight,
			ThreeOfAKind, TwoPair, OnePair, HighCard];
		let result = null;
		for (let hand of Array.from(hands)) {
			result = new hand(cards);
			if (result.isPossible) { break; }
		}
		return result;
	};

	////////////////////////////////////////////////////////////////////////
	//		Code
	////////////////////////////////////////////////////////////////////////

	class StraightFlush extends Hand {
		static initClass() {
			this.prototype.name = 'Straight Flush';
			this.prototype.rank = 8;
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
	}
	class FourOfAKind extends Hand {
		static initClass() {
			this.prototype.name = 'Four of a kind';
			this.prototype.rank = 7;
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
	}
	class FullHouse extends Hand {
		static initClass() {
			this.prototype.name = 'Full house';
			this.prototype.rank = 6;
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
		static initClass() {
			this.prototype.name = 'Flush';
			this.prototype.rank = 5;
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
	}
	class Straight extends Hand {
		static initClass() {
			this.prototype.name = 'Straight';
			this.prototype.rank = 4;
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
	}
	class ThreeOfAKind extends Hand {
		static initClass() {
			this.prototype.name = 'Three of a kind';
			this.prototype.rank = 3;
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
	}
	class TwoPair extends Hand {
		static initClass() {
			this.prototype.name = 'Two pair';
			this.prototype.rank = 2;
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
	}
	class OnePair extends Hand {
		static initClass() {
			this.prototype.name = 'One pair';
			this.prototype.rank = 1;
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
	}

	class HighCard extends Hand {
		static initClass() {
			this.prototype.name = 'High card';
			this.prototype.rank = 0;
		}
		make() {
			this.cards = this.cardPool.slice(0, 5);
			return true;
		}
	}

	// es6 export
	var index = {
		Card,
		Deck,
		Hand,
	};

	return index;

})));

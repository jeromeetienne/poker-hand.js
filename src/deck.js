import Card from "./card.js"

class Deck {
	constructor() {
		this.reset()
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
		nSuffle = nSuffle !== undefined ? nSuffle : 3
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
};

export default Deck

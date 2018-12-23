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
Card.SUITS = ['s', 'h', 'c', 'd']
Card.DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

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

export default Card

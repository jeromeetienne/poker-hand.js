class Card {
	static getValue(cardString){
		let value = cardString[0]
		return value
	}
	static getSuit(cardString){
		let suit = cardString[1]
		return suit
	}
	static getRank(cardString){
		let rank = Card.RANKS.indexOf(Card.getValue(cardString))
		console.assert(rank !== -1)
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
Card.SUITS = ['s', 'h', 'c', 'd']
Card.DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
Card.RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export default Card

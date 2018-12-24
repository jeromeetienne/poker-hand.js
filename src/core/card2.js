class Card2 {
	static getValue(cardString){
		let value = cardString[0]
		return value
	}
	static getSuit(cardString){
		let suit = cardString[1]
		return suit
	}
	static getRank(cardString){
		let rank = Card2.RANKS.indexOf(Card2.getValue(cardString))
		console.assert(rank !== -1)
		return rank
	}
	static sort(cardA, cardB){
		if (Card2.getRank(cardA) > Card2.getRank(cardB)) {
			return -1;
		} else if (Card2.getRank(cardA) < Card2.getRank(cardB)) {
			return 1;
		} else {
			return 0;
		}
	}
}
Card2.SUITS = ['s', 'h', 'c', 'd']
Card2.DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
Card2.RANKS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export default Card2

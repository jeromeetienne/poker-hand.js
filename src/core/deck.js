import Card from "./card.js"

class Deck {
	constructor() {
		this.reset()
	}

	reset(){
		let newCards = [];
		for (let denomination of Card.DENOMINATIONS) {
			for (let suit of Card.SUITS) {
				let cardLabel = denomination + suit
				newCards.push(cardLabel);
			}
		}
		return this.setCards(newCards)
	}

	setCards(cards){
		this.cards = cards
		return this
	}
	clone(){
		let deck = new Deck()
		deck.setCards(this.cards.slice())
		return deck
	}
	
	shuffle(nSuffle) {
		nSuffle = nSuffle !== undefined ? nSuffle : 10
		for (let suffleIndex = 0; suffleIndex < nSuffle; suffleIndex++) {
			// do one suffle
			for (var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
				var randomIndex = Math.floor(Math.random() * (this.cards.length - 1));
				var card = this.cards[cardIndex];
				this.cards[cardIndex] = this.cards[randomIndex];
				this.cards[randomIndex] = card;
			}
		}
		return this
	}

	deal() {
		let cardOnTop = this.cards.pop();
		return cardOnTop
	}
	////////////////////////////////////////////////////////////////////////
	//		Code
	////////////////////////////////////////////////////////////////////////

	removeCard(cardLabel){
		let cardIndex = this.cards.indexOf(cardLabel)
		if( cardIndex === -1 )	return this

		this.cards.splice(cardIndex, 1)
		return this
	}
	removeCards(cards){
		for(let cardLabel of cards){
			this.removeCard(cardLabel)
		}
		return this
	}
	
	containsCard(cardLabel){
		let indexOf = this.cards.indexOf(cardLabel)
		if( indexOf !== -1 )	return true
		return false
	}
	
	containsCards(cards){
		for(let cardLabel in cards){
			if( this.containsCard(cardLabel) === false ){
				return false
			}
		}
		return true
	}

};

export default Deck

class CardDomElement {

	/**
	 * Create a card DomElement
	 * @param {String} card the card value string
	 * @returns {DomElement}
	 */
	static create(card) {
		let denomination = card[0]
		let suit = card[1]
		let htmlContent = `
		<div class='card' data-card-value='${card}'>
				<div class='denomination'>
					${CardDomElement.htmlDenominations[denomination]}
				</div>
				<div class='suit'>
					${CardDomElement.htmlSuits[suit]}
				</div>
		</div>
		`

		let domElement = createElementFromHTML(htmlContent)
		return domElement

		function createElementFromHTML(htmlString) {
			var domElement = document.createElement('div')
			domElement.innerHTML = htmlString.trim()
			return domElement.firstChild
		}
	}

	/**
	 * Update a card DomElement
	 * @param {DomElement} cardDomElement 
	 */
	static update(cardDomElement) {
		let denomination = cardDomElement.dataset.cardValue[0]
		let suit = cardDomElement.dataset.cardValue[1]
		cardDomElement.dataset.cardValue = denomination + suit
		cardDomElement.querySelector('.denomination').innerHTML = CardDomElement.htmlDenominations[denomination]
		cardDomElement.querySelector('.suit').innerHTML = CardDomElement.htmlSuits[suit]
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

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

export default CardDomElement

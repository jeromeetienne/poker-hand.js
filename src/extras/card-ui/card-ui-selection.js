/**
 * - it requires a css and html part too
 * @param {*} currentCard 
 * @param {*} onSelected 
 */
function cardSelectionModal(title, currentCard, onSelected) {
	showSelector()
	addEventListeners()
	showHighLight(currentCard)



	/**
	 * - display the card selector 
	 * - display selected card - highlight it somehow
	 * - allow selection change
	 * - if new card selected, notify the callback
	 */

	return

	function showSelector() {
		document.querySelector('#cardSelectionID .titleSelection').innerHTML = title;
		document.querySelector('#cardSelectionID').style.display = 'block';
	}
	function hideSelector() {
		document.querySelector('#cardSelectionID').style.display = 'none';

	}

	function showHighLight(card) {
		let currentDenomination = card[0]
		let currentSuit = card[1]
		if (currentDenomination !== ' ') {
			document.querySelector(`#cardSelectionID [data-card-denomination='${currentDenomination}']`).classList.add('selected')
		}
		if (currentSuit !== ' ') {
			document.querySelector(`#cardSelectionID [data-card-suit='${currentSuit}']`).classList.add('selected')
		}
	}
	function removeAllHighlight() {
		let domElements = Array.from(document.querySelectorAll('#cardSelectionID .selected'))
		domElements.forEach((domElement) => {
			domElement.classList.remove('selected')
		})
	}

	function onDenominationClick(domEvent) {
		currentCard = domEvent.target.dataset.cardDenomination + currentCard[1]
		onSelectionChange()
	}
	function onSuitClick(domEvent) {
		currentCard = currentCard[0] + domEvent.target.dataset.cardSuit
		onSelectionChange()
	}
	function onSelectionChange() {
		removeAllHighlight()
		showHighLight(currentCard)

		let isFullyQualified = currentCard[0] !== ' ' && currentCard[1] !== ' '
		if (isFullyQualified === true) {
			removeAllHighlight()
			removeEventListeners()
			hideSelector()
			onSelected(currentCard)
			return
		}
	}
	function onClearCard() {
		removeAllHighlight()
		removeEventListeners()
		hideSelector()
		onSelected('  ')
	}


	// addEventListener of all events
	function addEventListeners() {
		var DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
		var SUITS = ['s', 'h', 'c', 'd']

		DENOMINATIONS.forEach((denomination) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-denomination='${denomination}']`)
			domElement.addEventListener('click', onDenominationClick)
		})
		SUITS.forEach((suit) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-suit='${suit}']`)
			domElement.addEventListener('click', onSuitClick)
		})

		document.querySelector(`#cardSelectionID [data-card-denomination=' ']`).addEventListener('click', onClearCard)
	}

	// removeEventListener of all events
	function removeEventListeners() {
		var DENOMINATIONS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
		var SUITS = ['s', 'h', 'c', 'd']

		DENOMINATIONS.forEach((denomination) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-denomination='${denomination}']`)
			domElement.removeEventListener('click', onDenominationClick)
		})
		SUITS.forEach((suit) => {
			let domElement = document.querySelector(`#cardSelectionID [data-card-suit='${suit}']`)
			domElement.removeEventListener('click', onSuitClick)
		})

		document.querySelector(`#cardSelectionID [data-card-denomination=' ']`).removeEventListener('click', onClearCard)
	}
}

////////////////////////////////////////////////////////////////////////
//		es6 export
////////////////////////////////////////////////////////////////////////

export default {
	modal: cardSelectionModal
}

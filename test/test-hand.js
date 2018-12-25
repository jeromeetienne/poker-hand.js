import PokerHand from '../src/index.js'


var hand = PokerHand.Hand.make(['Tc', 'Ks', '2c'])
console.assert(hand.fullCards === null)
console.assert(testArrayEqual(hand.minimalCards, ['Ks']))
console.assert(hand.handName === 'HighCard')
console.assert(hand.handRank === 0)

var hand = PokerHand.Hand.make(['Kc', 'Ks', '2c'])
console.assert(hand.fullCards === null)
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Ks']))
console.assert(hand.handName === 'OnePair')
console.assert(hand.handRank === 1)

var hand = PokerHand.Hand.make(['Kc', 'Ks', 'Tc', 'Th', '4c', '2c'])
console.assert(testArrayEqual(hand.fullCards, ['Kc', 'Ks', 'Tc', 'Th', '4c']))
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Ks', 'Tc', 'Th']))
console.assert(hand.handName === 'TwoPair')
console.assert(hand.handRank === 2)

var hand = PokerHand.Hand.make(['Kc', 'Ts', 'Tc', 'Th', '4c'])
console.assert(testArrayEqual(hand.fullCards, ['Ts', 'Tc', 'Th', 'Kc', '4c']))
console.assert(testArrayEqual(hand.minimalCards, ['Ts', 'Tc', 'Th']))
console.assert(hand.handName === 'ThreeOfaKind')
console.assert(hand.handRank === 3)

var hand = PokerHand.Hand.make(['Kc', 'Qc', 'Js', 'Th', '2c', '9c'])
console.assert(testArrayEqual(hand.fullCards, ['Kc', 'Qc', 'Js', 'Th', '9c']))
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Qc', 'Js', 'Th', '9c']))
console.assert(hand.handName === 'Straight')
console.assert(hand.handRank === 4)

var hand = PokerHand.Hand.make(['Kc', 'Qc', 'Js', 'Th', '2c', 'Ac'])
console.assert(testArrayEqual(hand.fullCards, ['Ac', 'Kc', 'Qc', 'Js', 'Th']))
console.assert(testArrayEqual(hand.minimalCards, ['Ac', 'Kc', 'Qc', 'Js', 'Th']))
console.assert(hand.handName === 'Straight')
console.assert(hand.handRank === 4)

var hand = PokerHand.Hand.make(['5c', '4c', '3c', '2s', 'Ah', '9c'])
console.assert(testArrayEqual(hand.fullCards, ['5c', '4c', '3c', '2s', 'Ah']))
console.assert(testArrayEqual(hand.minimalCards, ['5c', '4c', '3c', '2s', 'Ah']))
console.assert(hand.handName === 'Straight')
console.assert(hand.handRank === 4)

var hand = PokerHand.Hand.make(['Kc', 'Tc', '9c', '5h', '2c', '4c'])
console.assert(testArrayEqual(hand.fullCards, ['Kc', 'Tc', '9c', '2c', '4c']))
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Tc', '9c', '2c', '4c']))
console.assert(hand.handName === 'Flush')
console.assert(hand.handRank === 5)

var hand = PokerHand.Hand.make(['Kc', 'Ks', 'Kh', 'Td', 'Tc', '2c'])
console.assert(testArrayEqual(hand.fullCards, ['Kc', 'Ks', 'Kh', 'Td', 'Tc']))
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Ks', 'Kh', 'Td', 'Tc']))
console.assert(hand.handName === 'FullHouse')
console.assert(hand.handRank === 6)

var hand = PokerHand.Hand.make(['Kc', 'Ks', 'Kh', 'Kd', '4c', '2c'])
console.assert(testArrayEqual(hand.fullCards, ['Kc', 'Ks', 'Kh', 'Kd', '4c']))
console.assert(testArrayEqual(hand.minimalCards, ['Kc', 'Ks', 'Kh', 'Kd']))
console.assert(hand.handName === 'FourOfaKind')
console.assert(hand.handRank === 7)


var hand = PokerHand.Hand.make(['5c', '4c', '3c', '2c', 'Ac', '9c'])
console.assert(testArrayEqual(hand.fullCards, ['5c', '4c', '3c', '2c', 'Ac']))
console.assert(testArrayEqual(hand.minimalCards, ['5c', '4c', '3c', '2c', 'Ac']))
console.assert(hand.handName === 'StraightFlush')
console.assert(hand.handRank === 8)

////////////////////////////////////////////////////////////////////////
//		Utility function
////////////////////////////////////////////////////////////////////////

function testArrayEqual(arraySource, arrayTemplate){
	for(let item of arrayTemplate){
		if( arraySource.indexOf(item) === -1){
			return false
		}
	}
	return true
}

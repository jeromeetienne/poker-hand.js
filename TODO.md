- use https://github.com/josdejong/workerpool
  in compute-hands-probability.js

- DONE let outCards = PokerHand.MonteCarlo.simulateOutsCount(holeCards, communityCards, requireHandRank, nSimulations)
  - in simulateOutsCount... why more than 52 ???
  - create a deck, remove the used cards, and then use deck.cards
  - move that into Utils.computeOutCards(holeCards, communityCards, requireHandRank)

---

- display poker odds
  - https://www.cardschat.com/odds-for-dummies.php
  - require current pot amount + callAmount
  - simply add 2 input number for the moment
- find a better name - poker-hand.js
  - poker-hand.js is not representative, it is boring
  - poker-analyser.js ?
  - poker-doctor.js ?
- retire machine-poker-bot
  - make a bot using poker-hand.js

---
- DONE rename likelyhoodToWin to oddsIfAllIn ?
  - way more descriptive
  - PokerHand.MonteCarlo.simulateOddsIfAllIn => PokerHand.MonteCarlo.simulateOddsIfAllIn()
  - rename all the variables name
- DONE rename
  - rename PokerHand.MonteCarlo. without 2
  - PokerHand.MonteCarlo.simulateOutsCount => PokerHand.MonteCarlo.simulateOutsCount()
- DONE in hand-evaluator, display requiredHandRank
  - like of possible hand name in a input select
  - create a { handName: handRank } object
  - Hand.HandRanks['Flush'] = 4
  - in this select, add a 'better hand' special case

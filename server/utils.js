function createCards(shuffleCards = true) {
  let n = 7;
  let cards = [];
  for (let i = 0; i < n + 1; i++) {
    cards.push([1]);
    for (let j = 0; j < n; j++) {
      cards[i].push(j + 1 + i * n + 1);
    }
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cards.push([i + 2]);
      for (let k = 0; k < n; k++) {
        let val = n + 1 + n * k + ((i * k + j) % n) + 1;
        cards[cards.length - 1].push(val);
      }
    }
  }

  if (shuffleCards) {
    for (let card of cards) {
      card.sort(() => Math.random() - 0.5);
    }
    cards.sort(() => Math.random() - 0.5);
  }
  return cards;
}
module.exports = createCards;

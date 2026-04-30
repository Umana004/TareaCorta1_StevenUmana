/**
 * Utilidades de aleatoriedad
 * IC-3002 Análisis de Algoritmos
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function randFloat() {
  return Math.random();
}

/** Elemento aleatorio de un array */
function randElement(arr) {
  return arr[randInt(0, arr.length)];
}


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

module.exports = { randInt, randFloat, randElement, shuffle };
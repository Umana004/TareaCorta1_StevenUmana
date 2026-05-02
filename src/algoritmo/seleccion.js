const { randInt } = require('../utils/random');

function seleccionTorneo(poblacion, fitnesses, tamTorneo = 3) {
  let mejorIdx = randInt(0, poblacion.length);
  let mejorFitness = fitnesses[mejorIdx];
 
  for (let i = 1; i < tamTorneo; i++) {
    const idx = randInt(0, poblacion.length);
    if (fitnesses[idx] > mejorFitness) {
      mejorFitness = fitnesses[idx];
      mejorIdx = idx;
    }
  }
 
  return [...poblacion[mejorIdx]]; // copia defensiva
}

module.exports = { seleccionTorneo };
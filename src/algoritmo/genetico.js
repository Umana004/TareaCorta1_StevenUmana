const { randInt } = require('../utils/random');
const { seleccionTorneo } = require('./seleccion');
const { crucePuntoUnico, cruceUniforme } = require('./cruce');
const { mutar } = require('./mutacion');
 
/**
 * Función de adaptabilidad (fitness).
 * f(x) = 1 / (1 + conflictos(x))
 * Rango: (0, 1]. Fitness = 1 implica 0 conflictos (solución perfecta).
 */
function calcularFitness(cromosoma, grafo) {
  const conflictos = grafo.contarConflictos(cromosoma);
  return 1 / (1 + conflictos);
}
 
/**
 * Genera un cromosoma aleatorio.
 * Cada vértice recibe un color en 1, 2, ... k
 */
function cromossomaAleatorio(numVertices, k) {
  return Array.from({ length: numVertices }, () => randInt(1, k + 1));
}


function ejecutarGA(grafo, {
  k = 4,
  tamPoblacion = 50,
  numGen = 100,
  pm = 0.05,
  pc = 0.8,
  tipoCruce = 'punto',
  onGeneracion = null,
} = {}) {
  const n = grafo.numVertices;
  const historial = [];
 
  
  let poblacion = Array.from({ length: tamPoblacion }, () =>
    cromossomaAleatorio(n, k)
  );
 
  let mejorCromosoma = null;
  let mejorFitness = -Infinity;
  let mejorConflictos = Infinity;
 
  
  for (let gen = 0; gen < numGen; gen++) {
    // Evaluar fitness de toda la población
    const fitnesses = poblacion.map(c => calcularFitness(c, grafo));
    const conflictosPob = poblacion.map(c => grafo.contarConflictos(c));
 
    // Estadísticas de esta generación
    const maxFitIdx = fitnesses.indexOf(Math.max(...fitnesses));
    const minConflictos = Math.min(...conflictosPob);
    const avgConflictos = conflictosPob.reduce((a, b) => a + b, 0) / tamPoblacion;
 
    if (fitnesses[maxFitIdx] > mejorFitness) {
      mejorFitness = fitnesses[maxFitIdx];
      mejorCromosoma = [...poblacion[maxFitIdx]];
      mejorConflictos = conflictosPob[maxFitIdx];
    }
 
    historial.push({
      generacion: gen + 1,
      mejorFitness: mejorFitness,
      mejorConflictos: mejorConflictos,
      avgConflictos: parseFloat(avgConflictos.toFixed(2)),
      minConflictosGen: minConflictos,
    });
 
    if (onGeneracion) onGeneracion(historial[historial.length - 1]);
 
    // Condición de parada: solución perfecta
    if (mejorConflictos === 0) break;
 
    
    const nuevaPoblacion = [mejorCromosoma]; 
 
    while (nuevaPoblacion.length < tamPoblacion) {
      // Selección por torneo
      const padre1 = seleccionTorneo(poblacion, fitnesses, 3);
      const padre2 = seleccionTorneo(poblacion, fitnesses, 3);
 
      // Cruce
      let [hijo1, hijo2] = tipoCruce === 'uniforme'
        ? cruceUniforme(padre1, padre2, pc)
        : crucePuntoUnico(padre1, padre2, pc);
 
      // Mutación
      hijo1 = mutar(hijo1, k, pm);
      hijo2 = mutar(hijo2, k, pm);
 
      nuevaPoblacion.push(hijo1);
      if (nuevaPoblacion.length < tamPoblacion) nuevaPoblacion.push(hijo2);
    }
 
    poblacion = nuevaPoblacion;
  }
 
  return {
    mejorCromosoma,
    mejorFitness,
    mejorConflictos,
    historial,
    generacionesEjecutadas: historial.length,
  };
}
 
module.exports = { ejecutarGA, calcularFitness };
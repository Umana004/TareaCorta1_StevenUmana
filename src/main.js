'use strict';
/**
 * main.js — Coloración de Grafos mediante Algoritmo Genético
 * Uso: node src/main.js
 */

const { Grafo }       = require('./grafo/grafo');
const { ejecutarGA }  = require('./algoritmo/genetico');

const NUM_VERTICES   = 30;
const K_COLORES      = 4;
const TAM_POBLACION  = 50;
const NUM_GEN        = 100;
const PROB_CRUCE     = 0.8;
const TIPO_CRUCE     = 'punto';   // 'punto' | 'uniforme'
const TASAS_MUTACION = [0.01, 0.05, 0.1];


const A = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  white:   '\x1b[37m',
  gray:    '\x1b[90m',
};

const c  = (s, ...codes) => codes.join('') + s + A.reset;
const hr = (char = '-', n = 64) => A.gray + char.repeat(n) + A.reset;


console.log();
console.log(hr('='));
console.log(c('  Coloracion de Grafos / Algoritmo Genetico', A.bold, A.white));
console.log(c('  IC-3002 Analisis de Algoritmos', A.dim));
console.log(hr('='));
console.log();

const grafo = Grafo.generarAleatorio(NUM_VERTICES);

console.log(c('Grafo generado', A.bold));
console.log(`  vertices  : ${c(grafo.numVertices, A.cyan)}`);
console.log(`  aristas   : ${c(grafo.getNumAristas(), A.cyan)}`);
console.log(`  colores k : ${c(K_COLORES, A.cyan)}`);
console.log(`  cruce     : ${c(TIPO_CRUCE, A.cyan)}  Pc = ${c(PROB_CRUCE, A.cyan)}`);
console.log();


const resultados = [];

for (const pm of TASAS_MUTACION) {
  console.log(hr());
  console.log(c(`Pm = ${pm}`, A.bold, A.yellow));
  console.log();

  const res = ejecutarGA(grafo, {
    k:           K_COLORES,
    tamPoblacion: TAM_POBLACION,
    numGen:       NUM_GEN,
    pm,
    pc:          PROB_CRUCE,
    tipoCruce:   TIPO_CRUCE,
    onGeneracion: ({ generacion, mejorConflictos, avgConflictos }) => {
      if (generacion % 25 === 0 || mejorConflictos === 0) {
        const filled  = Math.max(0, 12 - mejorConflictos);
        const empty   = Math.min(12, mejorConflictos);
        const bar     = c('#'.repeat(filled), A.cyan) + c('.'.repeat(empty), A.gray);
        process.stdout.write(
          `\r  gen ${String(generacion).padStart(3)}  [${bar}]  conflictos ${String(mejorConflictos).padStart(3)}  avg ${avgConflictos.toFixed(1).padStart(5)}`
        );
      }
    },
  });

  console.log('\n');

  const estado = res.mejorConflictos === 0 ? c('OPTIMO',  A.green, A.bold)
               : res.mejorConflictos < 4   ? c('BUENO',   A.yellow, A.bold)
               :                             c('REGULAR', A.red,    A.bold);

  console.log(`  estado           : ${estado}`);
  console.log(`  conflictos       : ${c(res.mejorConflictos, res.mejorConflictos === 0 ? A.green : A.red, A.bold)}`);
  console.log(`  fitness          : ${c(res.mejorFitness.toFixed(6), A.cyan)}`);
  console.log(`  generaciones     : ${res.generacionesEjecutadas}`);
  console.log(`  coloracion       : [${res.mejorCromosoma.join(', ')}]`);

  resultados.push({ pm, ...res });
}


console.log();
console.log(hr('='));
console.log(c('  Analisis comparativo — tasa de mutacion', A.bold, A.white));
console.log(hr('='));
console.log();
console.log(c('  Pm      Conflictos  Fitness     Generaciones  Resultado', A.dim));
console.log(c('  ' + '-'.repeat(58), A.gray));

for (const r of resultados) {
  const col = r.mejorConflictos === 0 ? A.green
            : r.mejorConflictos < 4   ? A.yellow
            :                           A.red;
  const row = [
    String(r.pm).padEnd(8),
    String(r.mejorConflictos).padStart(10),
    r.mejorFitness.toFixed(6).padStart(12),
    String(r.generacionesEjecutadas).padStart(14),
    '  ' + (r.mejorConflictos === 0 ? 'Optimo' : r.mejorConflictos < 4 ? 'Bueno' : 'Regular'),
  ].join('');
  console.log(c('  ' + row, col));
}

const mejor = resultados.reduce((a, b) => a.mejorConflictos <= b.mejorConflictos ? a : b);
console.log();
console.log(c(`  Mejor Pm: ${mejor.pm}  (${mejor.mejorConflictos} conflictos)`, A.green, A.bold));
console.log();
console.log(hr('='));
console.log();
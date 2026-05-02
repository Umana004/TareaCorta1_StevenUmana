const {randFloat, randInt} = require('../utils/random');

function mutar(cromosoma, k, pm) {
    const mutado = [...cromosoma];

    for (let i = 0; i < mutado.length; i++){

        if (randFloat() < pm){
            // Elegir un color distinto al actual
            let nuevoColor;
            do{
                nuevoColor = randInt(1, k + 1);
            } while (nuevoColor === mutado[i] && k> 1);
            mutado[i] = nuevoColor;
        }
    }
    return mutado;
}

GPUShaderModule.exports = {mutar};
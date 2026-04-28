* Se elige un punto de corte aleatorio y se intercambian los segmentos *

function crucePuntoUnico(padre1, padre2, probCruce){

    if (randFloat() > probCruce){
        return [[...padre1], [...padre2]]
    }

    const punto = randInt(1, padre1.length);
    const hijo1 = [...padre1.slice(0, punto), padre2.slice(punto)];
    const hijo2 = [...padre2.slice(0, punto), padre1.slice(punto)];
    return [hijo1, hijo2];
}


let listaMasculino, listaFemenino;
const maleList = localStorage.getItem('male-list');
const femaleList = localStorage.getItem('female-list');

listaMasculino = maleList.split('\r\n').map(x => {
    [posicion, nombreLista, cantidad, edad] = x.split(';');
    return { posicion: posicion, nombre: nombreLista, cantidad: cantidad, edad: edad }
});
listaFemenino = femaleList.split('\r\n').map(x => {
    [posicion, nombreLista, cantidad, edad] = x.split(';');
    return { posicion: posicion, nombre: nombreLista, cantidad: cantidad, edad: edad }
});

const nombre = document.getElementById('name');
const fileSelector = document.getElementById('input-file');
const maleContainer = document.getElementById('male');
const femaleContainer = document.getElementById('female');
const maleTrue = document.getElementById('male-true');
const maleNeutral = document.getElementById('male-neutral');
const femaleTrue = document.getElementById('female-true');
const femaleNeutral = document.getElementById('female-neutral');
const malePosition = document.getElementById('male-position');
const maleCount = document.getElementById('male-count');
const maleAge = document.getElementById('male-age');
const femalePosition = document.getElementById('female-position');
const femaleCount = document.getElementById('female-count');
const femaleAge = document.getElementById('female-age');
const uploadFile = document.getElementById('upload-file');
const modal = document.getElementById("information");
const info = document.getElementById("info");
const span = document.getElementsByClassName("close")[0];

const deleteLists = document.getElementById('delete-lists');

deleteLists.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});

uploadFile.addEventListener('click', () => {
    fileSelector.click();
});

nombre.addEventListener('input', () => {
    resetSearch();
    const resultado = searchName(nombre.value);

    if (resultado.masculino.seleccion) {
        maleTrue.classList.remove('hide');
        maleNeutral.classList.add('hide');
        malePosition.innerHTML = `Posición: ${resultado.masculino.posicion}`;
        maleCount.innerHTML = `Nº personas: ${resultado.masculino.cantidad}`;
        maleAge.innerHTML = `Edad media: ${resultado.masculino.edad}`;
    }
    if (resultado.femenino.seleccion) {
        femaleTrue.classList.remove('hide');
        femaleNeutral.classList.add('hide');
        femalePosition.innerHTML = `Posición: ${resultado.femenino.posicion}`;
        femaleCount.innerHTML = `Nº personas: ${resultado.femenino.cantidad}`;
        femaleAge.innerHTML = `Edad media: ${resultado.femenino.edad}`;
    }
});

function resetSearch() {
    maleTrue.classList.add('hide');
    maleNeutral.classList.remove('hide');
    femaleTrue.classList.add('hide');
    femaleNeutral.classList.remove('hide');
}

function searchName(valor) {
    let resultado = {
        masculino: {
            seleccion: false,
            indice: -1,
            posicion: 0,
            cantidad: 0,
            edad: 0
        },
        femenino: {
            seleccion: false,
            indice: -1,
            posicion: 0,
            cantidad: 0,
            edad: 0
        }
    }

    const search = valor.normalize('NFD')
        .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1")
        .normalize()
        .toUpperCase();

    resultado.masculino.indice = listaMasculino.findIndex(name => name.nombre === search);
    resultado.femenino.indice = listaFemenino.findIndex(name => name.nombre === search);

    if (resultado.masculino.indice > -1) {
        resultado.masculino.cantidad = listaMasculino[resultado.masculino.indice].cantidad;
        resultado.masculino.edad = listaMasculino[resultado.masculino.indice].edad;
        resultado.masculino.posicion = listaMasculino[resultado.masculino.indice].posicion;

    }
    if (resultado.femenino.indice > -1) {
        resultado.femenino.cantidad = listaFemenino[resultado.femenino.indice].cantidad;
        resultado.femenino.edad = listaFemenino[resultado.femenino.indice].edad;
        resultado.femenino.posicion = listaFemenino[resultado.femenino.indice].posicion;
    }
    resultado.masculino.indice > -1 ? resultado.masculino.seleccion = true : resultado.masculino.seleccion = false;
    resultado.femenino.indice > -1 ? resultado.femenino.seleccion = true : resultado.femenino.seleccion = false;
    return resultado;
}

function devolverLiteral(resultado) {
    if (resultado.masculino.seleccion && resultado.femenino.seleccion) {
        if (resultado.masculino.indice < resultado.femenino.indice) return 'MASCULINO';
        if (resultado.masculino.indice > resultado.femenino.indice) return 'FEMENINO';
        return 'AMBOS';
    }
    if (!resultado.masculino.seleccion && !resultado.femenino.seleccion) return 'NO DETERMINADO';
    if (resultado.masculino.seleccion) return 'MASCULINO';
    if (resultado.femenino.seleccion) return 'FEMENINO';
}

fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    getAsText(fileList[0]);
});

function getAsText(fileToRead) {
    const reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    const req = event.target.result;
    let requests = req.split('\r\n');
    const res = requests.map(x => `${x};${devolverLiteral(searchName(x))}`).join('\r\n');
    saveTextAsFile(res, 'output.txt');
}

function errorHandler(evt) {
    if (evt.target.error.name == 'NotReadableError') {
        alert('No se puede leer el fichero');
    } else {
        alert(evt);
    }
}

function saveTextAsFile(textToWrite, fileNameToSaveAs) {
    const textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    const downloadLink = document.createElement('a');
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
}

info.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
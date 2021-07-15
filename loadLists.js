const malePending = document.getElementById('male-pending');
const femalePending = document.getElementById('female-pending');
const maleLoaded = document.getElementById('male-loaded');
const femaleLoaded = document.getElementById('female-loaded');
const maleFile = document.getElementById('male-file');
const femaleFile = document.getElementById('female-file');
const mensaje = document.getElementById('mensaje');
const continuar = document.getElementById('continuar');
const modal = document.getElementById("information");
const info = document.getElementById("info");
const span = document.getElementsByClassName("close")[0];

const deleteLists = document.getElementById('delete-lists');

deleteLists.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html';
});


checkLoaded();
function checkLoaded() {
    let maleExists = localStorage.getItem('male-list');

    if (!maleExists) {
        maleLoaded.classList.add('hide');
        malePending.classList.remove('hide');
    } else {
        maleLoaded.classList.remove('hide');
        malePending.classList.add('hide');
    }

    let femaleExists = localStorage.getItem('female-list');

    if (!femaleExists) {
        femaleLoaded.classList.add('hide');
        femalePending.classList.remove('hide');
    } else {
        femaleLoaded.classList.remove('hide');
        femalePending.classList.add('hide');
    }

    if (femaleExists && maleExists) {
        mensaje.classList.add('hide');
        continuar.classList.remove('hide');
    } else {
        mensaje.classList.remove('hide');
        continuar.classList.add('hide');
    }

    if(femaleExists || maleExists){
        deleteLists.classList.remove('hide');
    }else{
        deleteLists.classList.add('hide');

    }
}

malePending.addEventListener('click', () => {
    maleFile.click();
});
femalePending.addEventListener('click', () => {
    femaleFile.click();
});


maleFile.addEventListener('change', (event) => {
    const fileList = event.target.files;
    getAsText(fileList[0], 'male');
});

femaleFile.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList[0])
    getAsText(fileList[0], 'female');
});

function getAsText(fileToRead, genre) {
    const reader = new FileReader();
    reader.readAsText(fileToRead);
    reader.onload = () => loadHandler(genre);
    reader.onerror = errorHandler;
}

function loadHandler(genre) {
    const req = event.target.result;
    if (genre == 'male') {
        console.log('male')
        localStorage.setItem('male-list', req);
    } else if (genre == 'female') {
        localStorage.setItem('female-list', req);
        console.log('female')

    }
    checkLoaded();
}

function errorHandler(evt) {
    if (evt.target.error.name == 'NotReadableError') {
        alert('No se puede leer el fichero');
    } else {
        alert(evt);
    }
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
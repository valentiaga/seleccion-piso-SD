function reseteo() {
    // colocar un 0 inicial en la pantalla
    document.querySelector('.inputSeleccion').value = "";
}

function init() {

    //1. buscar todos los botones numericos
    let pad_numerico = document.querySelectorAll('.digit');
    //2. iterar cada boton
    pad_numerico.forEach(function (pad_numero) {
        //3. asignar evento click al boton numerico
        pad_numero.addEventListener('click', function (e) {
            document.querySelector('.inputSeleccion').value = e.target.innerHTML;
        });

    });

}

init();
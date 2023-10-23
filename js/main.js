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

    let btn_ingresar = document.getElementById('btn_ingresar');
    
    btn_ingresar.addEventListener('click',evaluate())
}

function evaluate(){
    // chequea si el id fue ingresado, y si hay piso 
}

function solicitud_acceso(){
    // Cuando ya esta seleccionado un piso
    var ip = 'localhoost'

    const options = {
        hostname: ip,
        port: 4000, // Puerto del Microservicio 1
        path: '/solicitud_acceso', // Ruta específica del Microservicio 1
        // method: 'solicitud_acceso',
      //   headers: req.headers
      };
  
    const proxyRequest = http.request(options, (proxyResponse) => {

        // res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
        // proxyResponse.pipe(res, {
        //   end: true
        // });
        let body = ''

        response.on('data', (chunk) => {
          body += chunk;
        });
      
        response.on('end', () => {
          console.log('2) Received: ' + body);
        });
      
        response.on('close', () => {
            console.log('3) Connection closed');
        });

      });
}

function mostrar_datos(){
    
}

init();

const http = require('http');

let seleccion = -1
let id = -1

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
  btn_ingresar.addEventListener('click', solicitud_acceso)

  let btn_borrarPiso = document.getElementById('btn_borrar')
  btn_borrarPiso.addEventListener('click', reseteo)

}
function solicitud_acceso() {
  seleccion = document.querySelector('.inputSeleccion').value;
  if (seleccion != "") {
    id = document.getElementById('input_id').value
    console.log('Id' + id);
    if (id != '') {

      conecta();
      // var ip = 'localhost'
      // var method = 'POST'

      // const options = {
      //     hostname: ip,
      //     port: 4000, // Puerto del Microservicio 1
      //     path: '/solicitud_acceso', // Ruta específica del Microservicio 1
      //     method: method,
      //   };

      //   const http = require('http');
      //   const request = http.request(options, (proxyResponse) => {


      //     response.on('data', (chunk) => {
      //       result += chunk;
      //     });

      //     response.on('end', () => {
      //       console.log('2) Received: ' + result);
      //     });

      //     response.on('close', () => {
      //       console.log('3) Connection closed');
      //     });
      //   });

      //   let body = {
      //     'id': id,
      //     'piso':seleccion
      //   }


    }
    else {
      alert('Ingrese id')
    }
  }
  else {
    alert("Debes ingresar un piso");
  }


}

function conecta() {

  const request = http.request('http://localhost:3000/', { method: 'POST' }, function (response) {

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
  request.write(JSON.stringify(body))
  request.end();
}

function createRequest(url) {
  var ip = 'localhost'
  var method = 'solicitud_acceso'
  const options = {
    hostname: ip,
    port: 4000, // Puerto del Microservicio 1
    path: url, // Ruta específica del Microservicio 1
    method: method,
  };

}

function mostrar_datos() {

}

init();
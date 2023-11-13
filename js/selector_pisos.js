const { log } = require('console');
const http = require('http');
const { resolve, parse } = require('path');
const URL_PERMISOS = 'http://localhost:9000'
const URL_ASCENSOR = 'http://localhost:9001'

const server = http.createServer(function (request, response) {

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return response.end();
  }

  console.log('URL recibido ' + request.url)
  const parsedUrl = request.url.slice(1).split('/')

  if (request.method == 'GET' && parsedUrl.at(-1) === 'acceso') {

    // console.log('PISO: '+parsedUrl[2])
    request_data = { id: parsedUrl[1] }   
    console.log("Acceso")
    solicita_datos(request_data)
      .then((resp) => {
        console.log('manda la data bien ' + resp)
        response.end(JSON.stringify(resp))
      })
      .catch((error) => {
        response.statusCode = 500
        response.end('Error en el servidor')
      })

  } else if (request.method == 'GET' && parsedUrl.at(-1) === 'ascensor') {

    request_data = { id: parsedUrl[1] }
    console.log('id enviado: ' + request_data.id)
  }
})

function validar_permisos(request, datos) {
    let res = false;
    //verifica que el piso solicitado este en los autorizados
    if (datos.pisos.includes(request.piso)) {
      res = true
    } else {
      res = false
    }
    // console.log(request +" "+datos.pisos);
    return res
  }

async function solicita_datos(request_data) {
    let data = { id: request_data.id }
    let url = URL_PERMISOS + '/visitantes/' + request_data.id + '/info'
    console.log(url);
    let datos = await send_request({ url: url, method: 'GET' });
    console.log("solicita datos " + datos)
    return datos;
  }

async function solicitar_acceso(request_data) {
    let url = URL_PERMISOS + '/visitantes/' + request_data.id + '/permisos'
    //que pasa si no el id no 
    let permisos = await send_request({ url: url, method: 'GET' });
    console.log('PERMISOS ', permisos)
    console.log('DATA SOLICITADA ' + request_data.piso)

    if (validar_permisos(request_data, permisos)) { // enviamos solicitud ascensor
      url = URL_ASCENSOR + '/api/selectorAscensor'
      let asc = await send_request({ data: { piso_origen: 0, piso_destino: request_data.piso }, url: url, method: 'POST' })
      console.log("ASCENSOR :" + asc.nombre);
      respuesta = {
        code: 200,
        ascensor: asc
      }
      // respuesta.ascensor = JSON.parse(respuesta.ascensor)
    } else {
      respuesta = {
        code: 403,
        ascensor: ""
      }
    }
    // console.log("solicitar_acceso respuesta :" + respuesta.ascensor);
    return respuesta
  }

function send_request({ data, url, method } = {}) {
    return new Promise((resolve, reject) => {
      const request = http.request(url, { method: method },
        function (response) {
          console.log("Send request")
          let body = ''
          response.on('data', (chunk) => {
            body += chunk;
          });

          response.on('end', () => {
            console.log("3)El selector recibe del mock " + body)
            body = JSON.parse(body);
            resolve(body)
          });
        });

      if (method != 'GET') {
        data = JSON.stringify(data);
        console.log("2) " + data)
        request.write(data);
      }
      request.end();
    })
  }
  
  server.listen(4000, function () {
    console.log('Selector server started');
  })
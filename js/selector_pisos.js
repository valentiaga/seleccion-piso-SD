const http = require('http');
const URL_PERMISOS = 'http://localhost:9000/permisos'
const URL_ASCENSOR = 'http://localhost:9001/ascensor'
//A modo de prueba agregamos unos JSON con datos de visitantes
const datos = `[
    {
      "id": "A001",
      "nombre": "Juan Pérez",
      "edad": 25,
      "email": "juan.perez@example.com",
      "pisos_permitidos": [1, 3],
      "fecha_checkIn": "2023-09-13T23:09:40.880Z",
      "fecha_checkOut": "2023-09-15T23:09:40.880Z"
    },
    {
      "id": "B002",
      "nombre": "Ana López",
      "edad": 30,
      "email": "ana.lopez@example.com",
      "pisos_permitidos": [2, 4],
      "fecha_checkIn": "2023-09-14T10:30:15.123Z",
      "fecha_checkOut": "2023-09-16T11:45:30.456Z"
    },
    {
      "id": "C003",
      "nombre": "Carlos Rodríguez",
      "edad": 28,
      "email": "carlos.rodriguez@example.com",
      "pisos_permitidos": [1, 2, 3, 4],
      "fecha_checkIn": "2023-09-15T15:20:05.789Z",
      "fecha_checkOut": "2023-09-17T17:10:25.890Z"
    }
  ]`;

const data = JSON.parse(datos);



const server = http.createServer(function (request, response) {

  response.setHeader('Content-Type', 'application/json');

  if (request.url === '/solicitud_acceso') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      console.log("El selector recibe del gateway " + body)
      try {
        request_data = JSON.parse(body)
        console.log("parseado " + request_data);
        console.log("request data id: " + request_data.piso);
        resp = solicitar_acceso(request_data)
        console.log("Respuesta" +resp.ascensor);
        response.statusCode = resp.code
        // response.write(resp.ascensor)
        response.end(resp.ascensor)
      } catch (error) {
        response.statusCode = 400
        response.end('Error en los datos JSON de la solicitud')
      }
    });

  } else if (request.url === '/consulta_datos') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {

      //Paso de JSON para comparar despues
      // const peticion = JSON.parse(body);
      // const objetoEncontrado = data.find((objeto) => objeto.id === peticion.id);

      // console.log('Coincidencia: ', objetoEncontrado)

      // console.log('3) Selector_Pisos recibe: ' + body)
      // console.log('4) URL = '+ request.url)
      objetoEncontrado = 1
      response.end(JSON.stringify(objetoEncontrado))

    });

  } else {
    response.statusCode = 404;
    response.end('Ruta no encontrada');
  }

});

function validar_permisos(request, datos) {
  //verifica que el piso solicitado este en los autorizados
  return true
}

function solicitar_acceso(request_data) {
  console.log("aca toyyyyyyy")
  let data = { id: request_data.id }
  console.log("quiero enviar esto " + data)
  let datos = send_request(data,
    URL_PERMISOS,
    'POST');
  console.log("aca toy de nuevo")
  // no llega acaaaaaaaaaaaa
  if (validar_permisos(request_data, datos)) {

    respuesta = {
      code: 200,
      ascensor: send_request({ piso: request_data.piso },
        URL_ASCENSOR,
        'POST')
    }
  }
  else {
    respuesta = {
      code: 403,
      ascensor: ""
    }
  }
  console.log("solicitar_acceso respuesta :" + respuesta.code);
  return respuesta
}

function send_request(data, url, method) {

  console.log("1)Enviamos al mock" + data)
  let rtaMock = '';
  const request = http.request(url, { method: method },
    function (response) {
      let body = ''
      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        console.log("3)El selector recibe del mock " + body)
        return body
      });
    });

  data = JSON.stringify(data);
  console.log("2) " + data)
  request.write(data);
  request.end();
  
}

server.listen(4000, function () {
  console.log('1) Selector server started');
});

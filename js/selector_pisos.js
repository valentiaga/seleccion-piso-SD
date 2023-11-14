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

  if (request.method == 'GET' && parsedUrl.at(-1) === 'info') {

    request_data = { id: parsedUrl[1] }
    solicita_datos(request_data)
      .then((resp) => {
        let respuesta = resp[0]
        let status = resp[1]

        console.log('manda la data bien ' + respuesta)
        console.log('status ' + status)

        response.statusCode = status
        response.end(JSON.stringify(respuesta))
      })
      .catch((error) => {
        console.log("Error " + error.status)
        response.statusCode = error.status
        response.end('Error')
      })

  } else if (request.method == 'GET' && parsedUrl.at(-1) === 'ascensor') {

    request_data = { id: parsedUrl[1], piso: parsedUrl[2] }
    console.log('id: ' + request_data.id + 'piso: ' + request_data.piso)

    solicita_permisos(request_data)
      .then((respPermisos) => {
        let respuesta = respPermisos[0]
        console.log('Respuestta: '+ typeof (respuesta));
        let status = respPermisos[1]
        console.log('selector manda la data bien ' + respuesta)
        console.log('status ' + status)
        console.log(validar_permisos(request_data, respuesta))
        if (validar_permisos(request_data, respuesta)) {
          console.log("Valida permiso")
          solicitar_ascensor(request_data)
            .then((respAsc) => {
              console.log("LLegamos a la resp");
              response.statusCode = respAsc[1]
              response.end(JSON.stringify(respAsc[0]))
            })
        }
      })
      .catch((error) => {
        console.log("Error " + error.status)
        response.statusCode = error.status
        response.end('Error')
      })
  }
})

function validar_permisos(request, datos) {
  console.log('VALIDANDO PERMISOS')
  let res = false;
  console.log('los pisos de respuesta '+ datos.pisos + ' '+typeof(datos.pisos[0]));
   console.log('el piso solicitado es '+ request.piso+ ' '+typeof(request.piso));
   let piso = Number(request.piso)
  //verifica que el piso solicitado este en los autorizados
  if (datos.pisos.includes(piso)) {
    res = true
  } else {
    res = false
    // throw new Error_request(400)
  }
  return res
}

async function solicita_permisos(request_data) {
  const url = URL_PERMISOS + '/visitantes/' + request_data.id + '/permisos'
  const permisos = await send_request({ url: url, method: 'GET' });
  // let permisos = respPermisos.body
  console.log("permisos obtenidos " + permisos.body)
  console.log("permisos recibe un codigo de " + permisos.statusCode);

  if (permisos.statusCode == 200) {
    console.log("Solicito permisos " + permisos.body.pisos)
  }
  else {
    if (permisos.statusCode != 200)
      throw new Error_request(permisos.statusCode)
  }

  return [permisos.body, permisos.statusCode];
}

async function solicita_datos(request_data) {
  //solicita a el gestor de permisos la informacion del visitante
  let url = URL_PERMISOS + '/visitantes/' + request_data.id + '/info'
  console.log(url);
  let respInfo = await send_request({ url: url, method: 'GET' });
  let datos = respInfo.body
  console.log("datos recibe un codigo de " + respInfo.statusCode);

  //solicita a el gestor de permisos los pisos a los que puede acceder el visitante
  url = URL_PERMISOS + '/visitantes/' + request_data.id + '/permisos'
  const respPermisos = await send_request({ url: url, method: 'GET' });
  let permisos = respPermisos.body
  console.log("permisos obtenidos " + permisos)
  console.log("permisos recibe un codigo de " + respPermisos.statusCode);

  if (respPermisos.statusCode == 200 && respInfo.statusCode == 200) {
    datos.pisos = permisos.pisos
    console.log("entra aca " + permisos.pisos)
  }
  else {
    if (respPermisos.statusCode != 200)
      throw new Error_request(respPermisos.statusCode)
    else if (respInfo.statusCode != 200)
      throw new Error_request(respInfo.statusCode)
  }
  let status = respPermisos.statusCode
  console.log("despues de unir todo: " + JSON.stringify(datos))

  return [datos, status];
}

function send_request({ data, url, method } = {}) {
  return new Promise((resolve, reject) => {
    console.log("Send request")
    const request = http.request(url, { method: method },
      function (response) {
        let body = ''
        response.on('data', (chunk) => {
          body += chunk;
        });

        response.on('end', () => {
          console.log("3)El selector recibe del mock " + body)
          body = JSON.parse(body);
          //estado = stringify(statusCode)
          console.log("el selector recibe un codigo de " + response.statusCode)
          resolve({ "body": body, "statusCode": response.statusCode })
        });
      });

    if (method != 'GET') {
      console.log('Estamos ejecutando un POST')
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

/* Tiene que devolver el ascensor
Devuelve los datos del ascensor (id y nombre) y un statusCode
*/
async function solicitar_ascensor(request_data) {
  console.log("Entra a solicitar ascensor");
  url = URL_ASCENSOR + '/api/selectorAscensor'
  let asc = await send_request({ data: { piso_origen: 0, piso_destino: request_data.piso }, url: url, method: 'POST' })
  console.log("Ascensor :" + asc.body.nombre);
  
  if (asc.statusCode != 200){
    throw new Error_request(asc.statusCode)
  }
  return [asc.body, asc.statusCode];
}

class Error_request extends Error {
  constructor(status) {
    super(mensaje);
    this.status = status;
  }
} 

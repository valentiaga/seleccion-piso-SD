const http = require('http');
const { resolve } = require('path');
const URL_PERMISOS = 'http://localhost:9000/permisos'
const URL_ASCENSOR = 'http://localhost:9001/ascensor'

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
        request_data = JSON.parse(body);
    
        //solictar_acceso es async, entonces devuelve una promesa
        solicitar_acceso(request_data)
          .then((resp) => {
            response.end(JSON.stringify(resp))
          })        
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
      try {
        request_data = JSON.parse(body);
    
        //solictar_acceso es async, entonces devuelve una promesa
        solicita_datos(request_data)
          .then((resp) => {
            response.end(JSON.stringify(resp))
          })        
      } catch (error) {
        response.statusCode = 400
        response.end('Error en los datos JSON de la solicitud')
      }
      

    });

  } else {
    response.statusCode = 404;
    response.end('Ruta no encontrada');
  }

});

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

async function solicita_datos(request_data){
  let data = { id: request_data.id }
  let datos = await send_request(data, URL_PERMISOS,'GET');
  return datos;
}

async function solicitar_acceso(request_data) {
  
  let data = { id: request_data.id }
  let datos = await send_request(data, URL_PERMISOS,'GET');

    // console.log("aca toy de nuevo "+datos)
 
  if (validar_permisos(request_data, datos)) { // enviamos solicitud ascensor

    let asc = await send_request({ piso: request_data.piso },URL_ASCENSOR,'POST')
    // console.log("Luego de la funcion: "+asc.ascensor)
    respuesta = {
      code: 200,
      ascensor: asc.ascensor
    }
    console.log("solicitar_acceso respuesta :" + respuesta.ascensor);
    // respuesta.ascensor = JSON.parse(respuesta.ascensor)
    
  }
  else {
    respuesta = {
      code: 403,
      ascensor: ""
    }
  }
  // console.log("solicitar_acceso respuesta :" + respuesta.ascensor);
  return respuesta
}

function send_request(data, url, method) {
  return new Promise((resolve,reject)=>{
    console.log("1)Enviamos al mock" + data);
    const request = http.request(url, { method: method },
      function (response) {
      
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

    data = JSON.stringify(data);
    console.log("2) " + data)
    if (method!='GET'){
     request.write(data);
    }
    request.end();
  })
}

  server.listen(4000, function () {
  console.log('Selector server started');
  });

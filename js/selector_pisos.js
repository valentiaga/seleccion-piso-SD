const http = require('http');
const URL_PERMISOS = 'http://localhost:8080/'
const URL_ASCENSOR = 'http://localhost:8080/'
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
    if (request.url === '/solicitud_acceso'){
        let body = '';
        
        request.on('data', (chunk) => {
          body += chunk;
        });

        request.on('end', () => {
          try{
            request_data = JSON.parse(body)
            resp = solicitar_acceso(request_data)
            response.statusCode= resp[0]
            response.end(JSON.stringify(resp[1]))
          }catch(error){
            response.statusCode = 400
            response.end('Error en los datos JSON de la solicitud')
          }
        });

    } else if (request.url === '/consulta_datos'){
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

    }else {
        response.statusCode = 404;
        response.end('Ruta no encontrada');
      }

});
  
function validar_permisos(request, datos){
  //verifica que el piso solicitado este en los autorizados
  return true
}

function solicitar_datos(data){
  const id = {"id": data.id}
  let datos = ''
  
  const request = http.request(URL_PERMISOS,{ method: 'GET' },
    function (response) {
      let body = ''
      
      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        datos = body
      });
    });

    request.write(JSON.stringify(id));
    request.end();

  return datos
}

function solicitar_acceso(request_data){
  respuesta = []
  datos = solicitar_datos(request_data) 
  if (validar_permisos(request_data, datos)){
    respuesta[0] = 200
    respuesta[1] = solicitar_ascensor(request_data)
  }
  else{
    respuesta[0] = 403
    respuesta[1] = ""
  }
  return respuesta
}

function solicitar_ascensor(data){
  const piso = {"piso": data.piso}
  let ascensor = ''

  const request = http.request(URL_ASCENSOR,{ method: 'POST' },
    function (response) {
      let body = ''
      
      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        ascensor = body
      });
    });
    request.write(JSON.stringify(piso));
    request.end();
  return ascensor
}

server.listen(4000, function() {
  console.log('1) Server started');
});

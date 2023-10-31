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

const http = require('http');
const path = require('path');

const server = http.createServer(function (request, response) {

  // Configuración de CORS------ que onda esto??
  // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.url === '/solicitud_acceso'){
        let body = '';
        request.on('data', (chunk) => {
          body += chunk;
        });
        request.on('end', () => {
            
          console.log('3) Selector_Pisos recibe: ' + body)
          console.log('4) URL = '+ request.url)

        });
        request.on('close', () => {
            console.log('5) Socket closed');
          });
    } else if (request.url === '/consulta_piso'){
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
          request.on('close', () => {
              console.log('5) Socket closed');
            });
    }else {
        response.statusCode = 404;
        response.end('Ruta no encontrada');
      }

});



server.listen(4000, function() {
    console.log('1) Server started');
  });
  

function acceso(request){

}

function busco_datos(data,objeto) {
    //Para buscar 
 }


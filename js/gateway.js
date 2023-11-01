const http = require('http');
const path = require('path');
const { send } = require('process');

const server = http.createServer(function (request, response) {

  // Configuración de CORS
  // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (request.url === '/solicitud_acceso'){

    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      console.log('3 Gateway');
      console.log('4) Server received: ' + body);
      console.log('5) Write: Mundo');
      console.log('6) URL = '+ request.url);
      // URL del selector de pisos
      const url = 'http://localhost:4000/solicitud_acceso';
      const path = '/solicitud_acceso';

      send_request(url,'POST',body);
      response.end('Gateway1');
      
    });

    request.on('close', () => {
      console.log('6) Socket closed');
    });

  } else if (request.url === '/consulta_datos'){
      let body = '';
      request.on('data', (chunk) => {
      body += chunk;
      });
    
      request.on('end', () => {
      console.log('3) Server received: ' + body)
      console.log('5) URL = '+ request.url)

      // URL de consulta de piso
      const url = 'http://localhost:4000/consulta_datos';

      send_request(url,'POST',body);
    });

    request.on('close', () => {
      console.log('6) Socket closed');
    });
    
  }
  
});

server.listen(3000, function() {
  console.log('1) Server started');
});

function send_request(url, method, body) {
    return fetch(url, {
      method: method,
      body: body,
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error en la solicitud');
      }
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // Realiza la lógica necesaria con la respuesta del servidor
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      // Envía la respuesta al cliente
      response.end(JSON.stringify(responseData)); // Envía la respuesta al cliente
    });
}
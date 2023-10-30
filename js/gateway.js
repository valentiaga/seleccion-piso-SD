// const http = require('http');

// const gatewayPort = 3000;

// const gatewayServer = http.createServer((req, res) => {
//   if (req.url === '/solicitud_acceso') {
//     // Enrutar la solicitud al Microservicio 1
//     const options = {
//       hostname: 'localhost',
//       port: 4000, // Puerto del Microservicio 1
//     //   path: '/selector_pisos.js', // Ruta específica del Microservicio 1
//       method: req.method,
//     //   headers: req.headers
//     };

//     const proxyRequest = http.request(options, (proxyResponse) => {
//       res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
//       proxyResponse.pipe(res, {
//         end: true
//       });
//     });

//     req.pipe(proxyRequest, {
//       end: true
//     });
//   } else {
//     // Ruta no válida
//     res.statusCode = 404;
//     res.end('Ruta no encontrada');
//   }
// });

// gatewayServer.listen(gatewayPort, () => {
//   console.log(`Gateway escuchando en el puerto ${gatewayPort}`);
// });


// HTTP server
// server.js

const http = require('http');
const path = require('path');
const { send } = require('process');

const server = http.createServer(function (request, response) {

  // Configuración de CORS
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (request.url === '/solicitud_acceso'){

    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      console.log('3) Server received: ' + body);
      console.log('4) Write: Mundo');
      console.log('5) URL = '+ request.url);

      // URL del selector de pisos
      const url = 'http://localhost:4000/solicitud_acceso';
      const path = '/solicitud_acceso';

      send_request(url,'POST',body);

      // fetch(url, {
      //   method: 'POST',
      //   body: body,
      //   path : JSON.stringify(path),
      // })
      //   .then(response => {
      //     if (response.ok) {
      //       return response.json();
      //     } else {
      //       throw new Error('Error en la solicitud');
      //     }
      //   })
      //   .then(data => {
      //     console.log('Respuesta del servidor:', data);
      //     // Realiza la lógica necesaria con la respuesta del servidor
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   });
        
      //Debe mandar los datos correspondientes
      response.end('Gateway1');
      
    });

    request.on('close', () => {
      console.log('6) Socket closed');
    });

  } else if (request.url === '/consulta_piso'){
      let body = '';
      request.on('data', (chunk) => {
      body += chunk;
      });
    
      request.on('end', () => {
      console.log('3) Server received: ' + body)
      console.log('5) URL = '+ request.url)

      // URL de consulta de piso
      const url = 'http://localhost:4000/consulta_piso';
      const path = '/consulta_piso'

      send_request(url,'POST',body);

      // fetch(url, {
      //   method: 'POST',
      //   body: body,
      //   path : JSON.stringify(path),
      // })
      //   .then(response => {
      //     if (response.ok) {
      //       return response.json();
      //     } else {
      //       throw new Error('Error en la solicitud');
      //     }
      //   })
      //   .then(data => {
      //     console.log('Respuesta del servidor:', data);
      //     responseData = data; // Almacena los datos en la variable responseData
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   })
      //   .finally(() => {
      //     // Envía la respuesta al cliente
      //     response.end(JSON.stringify(responseData)); // Envía la respuesta al cliente
      //   });
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
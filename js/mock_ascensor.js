const http = require('http');

const server = http.createServer(function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return response.end();
  }
  // console.log("entra")
    console.log("entra")
    let body = '';

    request.on('data', (chunk) => {
      console.log("chunk"+chunk);
      body += chunk;
    });

    request.on('end', () => {
      console.log("Ascensor recibe " + body);
      let mock = {
          "id": 'B53',
          "nombre" : 'A'
      }
      response.statusCode = 200
      response.end(JSON.stringify(mock))
    });
  });

  server.listen(9001, function () {
    console.log('1) Ascensor Server started');
  });
  
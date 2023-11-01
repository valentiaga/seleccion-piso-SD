const http = require('http');

const server = http.createServer(function (request, response) {
    if (request.url === '/permisos') {
      console.log("entra")
      let body = '';
  
      request.on('data', (chunk) => {
        console.log("chunk"+chunk);
        body += chunk;
      });
  
      request.on('end', () => {
        console.log("permisos recibe " + body);
        let mock = {
            "pisos" : [1,5,7]
        }
        response.statusCode = 200
        response.end(JSON.stringify(mock))
      });
  
    } else {
      response.statusCode = 404;
      response.end('Ruta no encontrada');
    }
  });

  server.listen(9000, function () {
    console.log('1) Permisos Server started');
  });
  
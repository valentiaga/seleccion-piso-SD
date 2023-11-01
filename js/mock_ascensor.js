const http = require('http');

const server = http.createServer(function (request, response) {
    if (request.url === '/solicita_ascensor') {
       console.log("entra")
      let body = '';
  
      request.on('data', (chunk) => {
        console.log("chunk"+chunk);
        body += chunk;
      });
  
      request.on('end', () => {
        console.log("Ascensor recibe " + body);
        let mock = {
            "ascensor" : 2
        }
        response.statusCode = 200
        response.end(JSON.stringify(mock))
      });
  
    } else {
      response.statusCode = 404;
      response.end('Ruta no encontrada');
    }
  });

  server.listen(9001, function () {
    console.log('1) Ascensor Server started');
  });
  
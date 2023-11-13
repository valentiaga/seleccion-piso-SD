const http = require('http');

const server = http.createServer(function (request, response) {
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
  
const http = require('http');

const gatewayPort = 3000;

const gatewayServer = http.createServer((req, res) => {
  if (req.url === '/solicitud_acceso') {
    // Enrutar la solicitud al Microservicio 1
    const options = {
      hostname: 'localhost',
      port: 4000, // Puerto del Microservicio 1
    //   path: '/selector_pisos.js', // Ruta específica del Microservicio 1
      method: req.method,
    //   headers: req.headers
    };

    const proxyRequest = http.request(options, (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
      proxyResponse.pipe(res, {
        end: true
      });
    });

    req.pipe(proxyRequest, {
      end: true
    });
  } else {
    // Ruta no válida
    res.statusCode = 404;
    res.end('Ruta no encontrada');
  }
});

gatewayServer.listen(gatewayPort, () => {
  console.log(`Gateway escuchando en el puerto ${gatewayPort}`);
});

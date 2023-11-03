const { log } = require('console');
const http = require('http');
const path = require('path');
const { send } = require('process');

const server = http.createServer(function (request, response) {

  // Configuración de CORS
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500');
  response.setHeader('Content-Type', 'application/json');
    
  if (request.url === '/solicitud_acceso'){

    let body = '';
    let rtaSelector;
    request.on('data', (chunk) => {
      console.log('recibe' + chunk)
      body += chunk;
    });
    request.on('end', () => {
      console.log('3 Gateway');
      console.log('4) Server received: ' + body);
      console.log('5) URL = '+ request.url);
      // URL del selector de pisos
      const url = 'http://localhost:4000/solicitud_acceso';
      const path = '/solicitud_acceso';
      
      body = JSON.parse(body);
      
      send_request(url,'POST',JSON.stringify(body))
      .then((rtaSelector) => {
        response.end(rtaSelector);
      })
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

function send_request(data, url, method) {
  return new Promise((resolve,reject)=>{
    const request = http.request(url, { method: method },
      function (response) {
        let body = ''
        response.on('data', (chunk) => {
          body += chunk;
        });
  
        response.on('end', () => {
          console.log("El gateway recibe " + body)
          resolve(body)
        });
      });
    console.log("El gateway envia" + data)
    if( method != 'GET'){
      request.write(data);   
    }
    request.end();
  })
}
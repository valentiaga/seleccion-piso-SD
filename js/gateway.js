const { log } = require('console');
const http = require('http');
const path = require('path');
const { send } = require('process');

const server = http.createServer(function (request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return response.end();
  }

  const parsedUrl =  url.slice(1).split('/')
  if (parsedUrl[2] === '/acceso'){

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

      const url = 'http://localhost:4000/solicitud_acceso';
      const path = '/solicitud_acceso'
      
      body = JSON.parse(body)
      
      send_request(JSON.stringify(body),url,'POST')
      .then((rtaSelector) => {
        console.log("Respuesta selector: " +rtaSelector);
        response.end(rtaSelector);
      })
    });

    request.on('close', () => {
      console.log('6) Socket closed');
    });

  } else if (parsedUrl[2] === '/info'){
      let body = '';
      request.on('data', (chunk) => {
      body += chunk;
      });
    
      request.on('end', () => {
      console.log('3) Server received: ' + body)
      console.log('5) URL = '+ request.url)

      // URL de consulta de piso
      const url = 'http://localhost:4000/consulta_datos';

      send_request(JSON.stringify(body),url,'POST').then((rtaSelector) => {
        console.log("Respuesta selector: " +rtaSelector);
        response.end(rtaSelector);
      })
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
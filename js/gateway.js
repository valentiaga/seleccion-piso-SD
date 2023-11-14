const { log } = require('console');
const http = require('http');
const path = require('path');
const { send } = require('process');

const server = http.createServer(function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.end();
  }

  console.log('URL recibido '+req.url)
  const parsedUrl =  req.url.slice(1).split('/')

  if (req.method=='GET' && parsedUrl.at(-1) === 'acceso'){

    // console.log('3 URL = '+ req.url);
    // const id = parsedUrl[1]
    // // const piso = parsedUrl[2] 
    // console.log('4) gateway received: ' + id)
    // const url = 'http://localhost:4000/visitantes/'+ id +'/acceso'

    // const request = http.request(url, { method: req.method },
    //   function (response) {
    //     let body = ''
    //     console.log('entra 2')
    //     response.on('data', (chunk) => {
    //       body += chunk;
    //     });
  
    //     response.on('end', () => {
    //       console.log("El gateway recibe " + body)
    //       request.end()
    //       res.end(body); 
    //     });
        
    //   });

    // if( req.method != 'GET'){
    //   console.log("El gateway envia" + data)
    //   request.write(data);   
    // }

    // request.end()
  

    
    send_request({url:url, method:'GET'})
    .then((rtaSelector) => {
      console.log("Respuesta selector: " +rtaSelector);
      response.end(rtaSelector);
    })

  } else if (req.method=='GET' && parsedUrl.at(-1) === 'info'){
      const id = parsedUrl[1]
      console.log('3) Server received: ' + id)
      console.log('4) URL = '+ req.url)

      const url = 'http://localhost:4000/visitantes/'+ id +'/ascensor'

    const request = http.request(url, { method: req.method },
      function (response) {
        let body = ''
        console.log('entra 2')
        response.on('data', (chunk) => {
          body += chunk;
        });
  
        response.on('end', () => {
          console.log("El gateway recibe " + body)
          request.end()
          res.end(body); 
        });
        
      });

    if( req.method != 'GET'){
      console.log("El gateway envia" + data)
      request.write(data);   
    }

    request.end()
  

      //habria que agregarle un catch por si tiene un error y que devuelva un codigo de error
  }
  
});

server.listen(3000, function() {
  console.log('1) Server started');
});

/*
function send_request({url, method, data}={}) {
  console.log('entra 1')
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
    if( method != 'GET'){
      console.log("El gateway envia" + data)
      request.write(data);   
    }
    console.log('entra 2')
    request.end();
  })
}
*/
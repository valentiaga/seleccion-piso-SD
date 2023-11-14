const { log } = require('console');
const http = require('http');
const path = require('path');
const mqtt = require("mqtt");
const { send } = require('process');
const URL_SELECTOR = 'http://localhost:4000'

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
  client.subscribe("/ssdd2023/visitante/", (err) => {
    console.log(err, 'suscripto!')
  });
});

client.on("message", (topic, message) => {
  console.log(message.toString())
});

const server = http.createServer(function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.end();
  }

  console.log('URL recibido ' + req.url)
  const parsedUrl = req.url.slice(1).split('/')

  if (req.method == 'GET' && parsedUrl.at(-1) === 'acceso') {
    console.log("entra a gatoway");
    request_data = { id: parsedUrl[1] }
    acceder(request_data)
      .then((resp) => {
        let respuesta = resp[0]
        let status = resp[1]

        console.log('manda la data bien ' + respuesta)
        console.log('status ' + status)

        res.statusCode = status
        res.end(JSON.stringify(respuesta))
      })
      .catch((error) => {
        console.log("Error " + error.message)
        res.statusCode = error.status
        // res.statusCode = error.status
        res.end('Error ' + error.status)
      })

  } else if (req.method == 'GET' && parsedUrl.at(-1) === 'info') {
    console.log("entra a gatoway");
    request_data = { id: parsedUrl[1] }
    acceder(request_data)
      .then((resp) => {
        let respuesta = resp[0]
        let status = resp[1]

        console.log('manda la data bien ' + respuesta)
        console.log('status ' + status)

        res.statusCode = status
        res.end(JSON.stringify(respuesta))
      })
      .catch((error) => {
        console.log("Error " + error.message)
        res.statusCode = error.status
        // res.statusCode = error.status
        res.end('Error ' + error.status)
      })
    //     const id = parsedUrl[1]
    //     console.log('3) Server received: ' + id)
    //     console.log('4) URL = '+ req.url)

    //     const url = 'http://localhost:4000/visitantes/'+ id +'/ascensor'

    //   const request = http.request(url, { method: req.method },
    //     function (response) {
    //       let body = ''
    //       console.log('entra 2')
    //       response.on('data', (chunk) => {
    //         body += chunk;
    //       });

    //       response.on('end', () => {
    //         console.log("El gateway recibe " + body)
    //         request.end()
    //         res.end(body); 
    //       });

    //     });

    //   if( req.method != 'GET'){
    //     console.log("El gateway envia" + data)
    //     request.write(data);   
    //   }

    //   request.end()


    //     //habria que agregarle un catch por si tiene un error y que devuelva un codigo de error
    // }

  });

server.listen(3000, function () {
  console.log('1) Server started');
});

async function acceder(request_data) {

  console.log('Entra a Acceder')
  let url = URL_SELECTOR + '/visitantes/' + request_data.id + '/acceso'

  let respInfo = await send_request({ url: url, method: 'GET' })
  let datos = respInfo.body
  console.log("Acceder recibe" + respInfo.statusCode)

  if (respInfo.statusCode != 200) {
    throw new Error_request(respInfo.statusCode)
  }
  let status = respInfo.statusCode
  console.log("Acceder recibe: " + JSON.stringify(datos))

  return [datos, status];
}

function send_request({ data, url, method } = {}) {
  console.log("send")
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method: method },
      function (response) {
        console.log("Send request")
        let body = ''
        response.on('data', (chunk) => {
          body += chunk;
        });

        response.on('end', () => {
          console.log("Send request recibe del mock " + body)
          body = JSON.parse(body);
          //estado = stringify(statusCode)
          // console.log("el selector recibe un codigo de " +response.statusCode)
          resolve({ "body": body, "statusCode": response.statusCode })
        });
      });

    if (method != 'GET') {
      data = JSON.stringify(data);
      console.log("2) " + data)
      request.write(data);
    }
    request.end();
  })
}

// function send_request({url, method, data}={}) {
//   console.log('entra 1')
//   return new Promise((resolve,reject)=>{
//     const request = http.request(url, { method: method },
//       function (response) {
//         let body = ''
//         response.on('data', (chunk) => {
//           body += chunk;
//         });

//         response.on('end', () => {
//           console.log("El gateway recibe " + body)
//           resolve(body)
//         });
//       });
//     if( method != 'GET'){
//       console.log("El gateway envia" + data)
//       request.write(data);   
//     }
//     console.log('entra 2')
//     request.end();
//   })
// }

class Error_request extends Error {
  constructor(status) {
    super(mensaje);
    this.status = status;
  }
}

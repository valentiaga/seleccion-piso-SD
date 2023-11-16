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

// client.on("message", (topic, message) => {

//   console.log(message.toString())

  // acceder(request_data)
  //     .then((resp) => {
  //       let respuesta = resp[0]
  //       let status = resp[1]
  //       res.statusCode = status
  //       res.end(JSON.stringify(respuesta))
  //     })
  //     .catch((error) => {
  //       console.log("Error " + error.message)
  //       res.statusCode = error.status
  //       res.end('Error ' + error.status)
  //     })

// });

const server = http.createServer(function (req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir todas las solicitudes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.end();
  }

  console.log('URL recibido ' + req.url)
  const parsedUrl = req.url.slice(1).split('/')

  if (req.method == 'GET' && parsedUrl.at(-1) === 'info') {
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
      
  } else if (req.method == 'GET' && parsedUrl.at(-1) === 'ascensor') {
    request_data = { id: parsedUrl[1] ,piso: parsedUrl[2] }
    console.log("ID"+request_data.id);
    console.log("Piso "+request_data.piso);
    solicita_ascensor(request_data) 
    .then((resp) => {
      let respuesta = resp[0]
      let status = resp[1]

      console.log('manda la data bien ' + respuesta)
      console.log('status ' + status)

      res.statusCode = status
      res.end(JSON.stringify(respuesta))
    })
    .catch((error) => {
      console.log(typeof error);
      console.log("Error " + error.status)
      res.statusCode = error.status
      res.end('Error ' + error.status)
    })

  }else if (req.method == 'GET' && parsedUrl.at(-1) === 'conectar'){
    console.log("Cliente se conecta con GW")

    client.on("message", (topic, message) => {
      console.log(message.toString())
      const msg = { id: message.toString()}
      res.statusCode = 200
      res.end(JSON.stringify(msg))

      
      // acceder(request_data)
      //     .then((resp) => {
      //       let respuesta = resp[0]
      //       let status = resp[1]
      //       res.statusCode = status
      //       res.end(JSON.stringify(respuesta))
      //     })
      //     .catch((error) => {
      //       console.log("Error " + error.message)
      //       res.statusCode = error.status
      //       res.end('Error ' + error.status)
      //     })
    
    });
  }
  });

server.listen(3000, function () {
  console.log('1) Server started');
});

async function acceder(request_data) {

  console.log('Entra a Acceder')
  let url = URL_SELECTOR + '/visitantes/' + request_data.id + '/info'

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

async function solicita_ascensor(request_data) {
  console.log('Entra a solicita ascensor')
  let url = URL_SELECTOR + '/visitantes/' + request_data.id + '/'+ request_data.piso+'/ascensor'

  let respInfo = await send_request({ url: url, method: 'GET' })
  if (respInfo.statusCode != 200) {
    // console.log(respInfo.statusCode);
    let e = new Error_request(respInfo.statusCode)
    console.log(e.status);
    throw e
  }
  let datos = respInfo.body
  console.log("Acceder recibe" + respInfo.statusCode)
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
class Error_request extends Error {
  constructor(status) {
    super(`Error en la solicitud con código de estado: ${status}`);
    this.status = status;
    console.log('creado error con status'+this.status);
  }
}

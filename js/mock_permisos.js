const http = require('http');

//A modo de prueba agregamos unos JSON con datos de visitantes
const datos = `[
    {
      "id": "A001",
      "nombre": "Juan Pérez",
      "edad": 25,
      "email": "juan.perez@example.com",
      "pisos_permitidos": [1, 3],
      "fecha_checkIn": "2023-09-13T23:09:40.880Z",
      "fecha_checkOut": "2023-09-15T23:09:40.880Z"
    },
    {
      "id": "B002",
      "nombre": "Ana López",
      "edad": 30,
      "email": "ana.lopez@example.com",
      "pisos_permitidos": [2, 4],
      "fecha_checkIn": "2023-09-14T10:30:15.123Z",
      "fecha_checkOut": "2023-09-16T11:45:30.456Z"
    },
    {
      "id": "C003",
      "nombre": "Carlos Rodríguez",
      "edad": 28,
      "email": "carlos.rodriguez@example.com",
      "pisos_permitidos": [1, 2, 3, 4],
      "fecha_checkIn": "2023-09-15T15:20:05.789Z",
      "fecha_checkOut": "2023-09-17T17:10:25.890Z"
    }
  ]`;

const data = JSON.parse(datos);

const server = http.createServer(function (request, response) {
  console.log('URL recibido '+request.url)
  const parsedUrl =  request.url.slice(1).split('/')

  if (request.method=='GET' && parsedUrl.at(-1) === 'permisos') {
     
    console.log("permisos recibe " + parsedUrl[1]);
    let mock = {
        "pisos" : [1,5,7],
        "id": "A001",
        "nombre": "Juan Pérez",
        "edad": 25,
        "email": "juan.perez@example.com",
    }
    response.statusCode = 200
    response.end(JSON.stringify(mock))
}})

server.listen(9000, function () {
  console.log('1) Permisos Server started');
})
  
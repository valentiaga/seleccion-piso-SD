let pisoElegido = -1
let id = -1
const puerto_gateway = 3000

function reseteo() {
  // Colocar un 0 inicial en la pantalla
  document.querySelector('.inputSeleccion').value = ""
}

function init() {
  // 1. Buscar todos los botones numéricos
  let pad_numerico = document.querySelectorAll('.digit')
  // 2. Iterar cada botón
  pad_numerico.forEach(function (pad_numero) {
    // 3. Asignar evento click al botón numérico
    pad_numero.addEventListener('click', function (e) {
      document.querySelector('.inputSeleccion').value += e.target.innerHTML
    })
  })

  let btn_ingresar = document.getElementById('btn_ingresar')
  btn_ingresar.addEventListener('click', solicitud_acceso)

  let btn_borrarPiso = document.getElementById('btn_borrar')
  btn_borrarPiso.addEventListener('click', reseteo)

  let btn_consultarDatos = document.getElementById('btn_consultarDatos')
  btn_consultarDatos.addEventListener('click', consulta_datos)

  escucha_gw()
}

async function escucha_gw() {
  let url = `http://10.2.210.253:${puerto_gateway}/conectar`
  console.log('conectando con gw')
  fetch(url,
    {
      method: 'GET'
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('Error en la solicitud')
      }
    })
    .then(data => {
      document.getElementById('input_id').value = data.id
      muestraDatos(data)
      escucha_gw()
    })
    .catch(error => {
      console.error('Error:', error)
    })
}
function solicitud_acceso() {
  pisoElegido = document.querySelector('.inputSeleccion').value
  id = document.getElementById('input_id').value
  console.log(id);
  document.getElementById('input_id').value = ""

  if (id == "") {
    // document.body.style.overflow = 'hidden' 
    alerta("Ingrese ID")
    return
  }

  if (pisoElegido == "") {
    // document.body.style.overflow = 'hidden' 
    alerta("Seleccione el piso al que desea ir")
    return
  }

  const url = `http://10.2.210.253:${puerto_gateway}/visitantes/` + id + '/' + pisoElegido + '/ascensor'

  console.log('URL:', url)
  fetch(url,
    {
      method: 'GET'
      // headers: {
      //   'Content-Type': 'application/json'
      // }
    })
    .then((response) => {
      console.log(response.ok);
      if (!response.ok) {
        throw new Error(`${response.status}`)
      }
      else {
        return response.json()
      }
    })
    .then(data => {
      if (data !== null) {
        console.log('Respuesta del servidor:', data)
        alerta("Dirijase al ascensor: " + data.nombre)
      }
    })
    .catch((error) => {
      console.log('Error capturado en catch:' + error.message);
      if (error.message == '400') {
        alerta("Acceso denegado")
      } else
        alerta("No es posible ejecutar su solicitud. Reintente mas tarde")
    })
    volverAAutenticacion()
    reseteo()
}

function alerta(text) {
  Toastify({
    text: text,
    backgroundColor: "gray",
    position: "center",
    duration: 3000
  }).showToast()
}

function consulta_datos() {

  id = document.getElementById('input_id').value

  if (id == '') {
    // document.body.style.overflow = 'hidden' 
    alerta("Ingrese ID")
    return
  }

  const url = `http://10.2.210.253:${puerto_gateway}/visitantes/` + id + '/info'
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        // console.log(response.status)
        throw new Error_request(response.status)
      }
    })
    .then(data => {
      muestraDatos(data)
    })
    .catch(error => {
      if (error.status == 400)
        alerta("ID Invalido")
      else
        alerta("No es posible ejecutar su solicitud. Reintente mas tarde")
    })
}

function muestraDatos(data) {
  id = data.id
  var authenticationContainer = document.querySelector('.authentication-container');

  var nuevoContenido = `
        <div id="datos-visitante">
        <h1>Datos Visitante</h1>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pisos Permitidos:</strong> ${data.pisos}</p>
        <button id="btn_volver">Volver</button>
        <input type="id" id="input_id" placeholder="Id" style="display: none;" value = ${document.getElementById('input_id').value} />

        </div>
      `;
  authenticationContainer.innerHTML = nuevoContenido

  document.getElementById("btn_volver").style.display = "block";
  var btnVolver = document.getElementById("btn_volver");
  btnVolver.onclick = volverAAutenticacion;

}

function volverAAutenticacion() {
  var authenticationContainer = document.querySelector('.authentication-container');

  var contenidoOriginal = `
      <form action="#">
          <h1>Autenticación</h1>
          <span>Ingrese id o apoye tarjeta de identificación</span>
          <input type="id" id="input_id" placeholder="Id" value = '${document.getElementById('input_id').value}' />
          <button id="btn_consultarDatos">Datos</button>
          <br>
          <img class="logoRFID" src="./img/rfid.png" alt="">
      </form>
  `;

  authenticationContainer.innerHTML = contenidoOriginal;

  //Arreglar esto
  btn_consultarDatos = document.getElementById('btn_consultarDatos')
  btn_consultarDatos.addEventListener('click', consulta_datos)
}

class Error_request extends Error {
  constructor(status) {
    super(`Error en la solicitud con código de estado: ${status}`);
    this.status = status;
  }
}

init()
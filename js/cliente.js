let pisoElegido = -1 
let id = -1 

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

  let btn_consultarPisos = document.getElementById('btn_consultarPisos') 
  btn_consultarPisos.addEventListener('click', consulta_pisos) 
}

function solicitud_acceso() {  
  pisoElegido = document.querySelector('.inputSeleccion').value 
  id = document.getElementById('input_id').value 

  if (pisoElegido == "") {
    // document.body.style.overflow = 'hidden' 
    alerta("Seleccione el piso al que desea ir") 
    return
  }
  if (id == '') {
    // document.body.style.overflow = 'hidden' 
    alerta("Ingrese ID") 
    return
  }
  const url = 'http://localhost:3000/visitantes/'+id+'/'+pisoElegido+'/acceso'

  console.log('URL:', url) 
  fetch(url,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // console.log('ok '+ response.status) 
        return response.json() 
      } else {
        throw new Error('error en la solicitud') //aca habria que poner un alerta?
      }
    })
    .then(data => {
      console.log('Respuesta del servidor:', data) 
      if (data.code == 200)
        alerta ("Dirijase al ascensor: "+ data.ascensor.nombre)
      else if (data.code == 403)
        alerta("Acceso denegado")
      // Realiza la lógica necesaria con la respuesta del servidor
    })
    .catch(error => {
      alerta("No es posible ejecutar su solicitud. Reintente mas tarde")
    }) 
}

function alerta(text){
  Toastify({
    text: text,
    backgroundColor: "gray", 
    position: "center" ,
    duration: 3000
  }).showToast() 
}

function consulta_datos(){
  id = document.getElementById('input_id').value 

  if (id == '') {
    // document.body.style.overflow = 'hidden' 
    alerta("Ingrese ID") 
    return
  }
 
  const url = 'http://localhost:3000/visitantes/'+id+'/info'
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json() 
      } else {
        throw new Error('Error en la solicitud') 
      }
    })
    .then(data => {
      
      console.log(data) 
      
      //Formateo los datos
      const formattedData = `
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Nombre:</strong> ${data.nombre}</p>
      <p><strong>Edad:</strong> ${data.edad}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Pisos Permitidos:</strong> ${data.pisos}</p>
      ` 

      //Creo pop up que muestre los pisos a los que puede acceder el visitante
      Swal.fire({
            title: 'DATOS VISITANTE',
            icon: 'info',
            html: formattedData,
      })
      
    })
    .catch(error => {
      console.error('Error:', error) 
    }) 
}

function consulta_pisos(){
  id = document.getElementById('input_id').value 

  if (id == '') {
    // document.body.style.overflow = 'hidden' 
    alerta("Ingrese ID") 
    return
  }
 
  const url = 'http://localhost:3000/visitantes/'+id+'/info'
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json() 
      } else {
        throw new Error('Error en la solicitud') 
      }
    })
    .then(data => {
      
      console.log(data) 
      
      //Formateo los datos
      const formattedData = `
      <p><strong>Pisos Permitidos:</strong> ${data.pisos}</p>
      ` 

      //Creo pop up que muestre los pisos a los que puede acceder el visitante
      Swal.fire({
            title: 'PISOS PERMITIDOS',
            icon: 'info',
            html: formattedData,
      })
      
    })
    .catch(error => {
      console.error('Error:', error) 
    }) 
}


init() 

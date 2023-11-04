let pisoElegido = -1;
let id = -1;

function reseteo() {
  // Colocar un 0 inicial en la pantalla
  document.querySelector('.inputSeleccion').value = "";
}

function init() {
  // 1. Buscar todos los botones numéricos
  let pad_numerico = document.querySelectorAll('.digit');
  // 2. Iterar cada botón
  pad_numerico.forEach(function (pad_numero) {
    // 3. Asignar evento click al botón numérico
    pad_numero.addEventListener('click', function (e) {
      document.querySelector('.inputSeleccion').value = e.target.innerHTML;
    });
  });

  let btn_ingresar = document.getElementById('btn_ingresar');
  btn_ingresar.addEventListener('click', solicitud_acceso);

  let btn_borrarPiso = document.getElementById('btn_borrar');
  btn_borrarPiso.addEventListener('click', reseteo);

  let btn_consultarPisos = document.getElementById('btn_consultar');
  btn_consultarPisos.addEventListener('click', consulta_piso);
}

function solicitud_acceso() {  
  const url = 'http://localhost:3000/acceso'; 
  pisoElegido = document.querySelector('.inputSeleccion').value;
  id = document.getElementById('input_id').value;

  if (pisoElegido == "") {
    // document.body.style.overflow = 'hidden';
    alerta("Seleccione el piso al que desea ir");
    return
  }
  if (id == '') {
    // document.body.style.overflow = 'hidden';
    alerta("Ingrese ID");
    return
  }

  let body = {
    id: id,
    piso: pisoElegido
  }

  console.log('DATA:', body);
  pisoElegido = parseInt(pisoElegido,10)
  fetch(url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (response.ok) {
        // console.log('ok '+ response.status);
        return response.json();
      } else {
        throw new Error('error en la solicitud');
      }
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
      if (data.code == 200)
        alerta ("Acceso permitido")
      else if (data.code == 403)
        alerta("Acceso denegado")
      // Realiza la lógica necesaria con la respuesta del servidor
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function alerta(text){
  Toastify({
    text: text,
    backgroundColor: "gray", 
    position: "center" ,
    duration: 3000
  }).showToast();
}

function consulta_piso(){
  id = document.getElementById('input_id').value;

  if (id == '') {
    // document.body.style.overflow = 'hidden';
    alerta("Ingrese ID");
    return
  }

  let body = {
    'id': id,
  }
  const url = 'http://localhost:3000/consulta_datos';

  fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error en la solicitud');
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
      `;

      //Creo pop up que muestre los pisos a los que puede acceder el visitante
      Swal.fire({
            title: 'DATOS VISITANTE',
            icon: 'info',
            html: formattedData,
      })
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function mostrar_datos() {
  // Realiza la lógica para mostrar datos si es necesario
}

init();

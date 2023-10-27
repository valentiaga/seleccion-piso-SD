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
  pisoElegido = document.querySelector('.inputSeleccion').value;
  console.log('piso elegido:', pisoElegido)
  if (pisoElegido !== "") {
    id = document.getElementById('input_id').value;
    console.log('Id ' + id);
    if (id !== '') {

      let body = {
        'id': id,
        'piso': pisoElegido
      }

      console.log('DATA:', body);

      const url = 'http://localhost:3000/solicitud_acceso'; // Reemplaza con tu URL
      // const url = {http : 'http',
      // host : 'localhost',
      // port : 3000,
      // path : '/solicitud_acceso'}
      const path = '/solicitud_acceso'

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        path : JSON.stringify(path),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la solicitud');
          }
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
          // Realiza la lógica necesaria con la respuesta del servidor
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      Toastify({
        text: "Ingrese ID",
        backgroundColor: "gray", // Cambia el color de fondo como desees
        position: "center" ,
        duration: 3000
      }).showToast();
    }
  } else {
    document.body.style.overflow = 'hidden';
    Toastify({
      text: "Seleccione el piso al que desea ir",
      backgroundColor: "gray", // Cambia el color de fondo como desees
      position: "center" ,
      duration: 3000
    }).showToast();
  }
}

function consulta_piso(){
  id = document.getElementById('input_id').value;
  console.log('Id ' + id);
  if (id !== '') {
    let body = {
      'id': id,
    }
    const url = 'http://localhost:3000/consulta_piso';

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
        
        console.log(data) // no lo imprime
        // Data vuelve como JSON y va a tener estos datos
        // const data = {
        // "id": "A001",
        // "nombre": "Nombre Completo",
        // "edad": 25,
        // "email": "email@gmail.com",  
        // "pisos_permitidos": [1, 3],
        // "fecha_checkIn": "2023-09-13T23:09:40.880Z",
        // "fecha_checkOut": "2023-09-15T23:09:40.880Z"
        
        //Formateo los datos
        const formattedData = `
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Edad:</strong> ${data.edad}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Pisos Permitidos:</strong> ${data.pisos_permitidos.join(', ')}</p>
        <p><strong>Fecha Check-In:</strong> ${data.fecha_checkIn}</p>
        <p><strong>Fecha Check-Out:</strong> ${data.fecha_checkOut}</p>
        `;

        //Creo pop up que muestre los pisos a los que puede acceder el visitante
        Swal.fire({
             title: 'DATOS VISITANTE.',
             icon: 'info',
             html: formattedData,
        })
        
      })
      .catch(error => {
        console.error('Error:', error);
      });

  } else {
      Toastify({
        text: "Ingrese ID",
        backgroundColor: "grey", 
        position: "center" ,
        duration: 3000
      }).showToast();
  }
}

function mostrar_datos() {
  // Realiza la lógica para mostrar datos si es necesario
}

init();

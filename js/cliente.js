let seleccion = -1;
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
}

function solicitud_acceso() {
  seleccion = document.querySelector('.inputSeleccion').value;
  if (seleccion !== "") {
    id = document.getElementById('input_id').value;
    console.log('Id ' + id);
    if (id !== '') {

      let body = {
        'id': id,
        'piso': seleccion
      }
      const url = 'http://localhost:3000/solicitud_acceso'; // Reemplaza con tu URL

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
          console.log('Respuesta del servidor:', data);
          // Realiza la lógica necesaria con la respuesta del servidor
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      alert('Ingrese id');
    }
  } else {
    alert("Debes ingresar un piso");
  }
}

function mostrar_datos() {
  // Realiza la lógica para mostrar datos si es necesario
}

init();

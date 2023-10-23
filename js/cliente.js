let seleccion=-1
let id = -1

function reseteo() {
    // colocar un 0 inicial en la pantalla
    document.querySelector('.inputSeleccion').value = "";
}

function init() {

    //1. buscar todos los botones numericos
    let pad_numerico = document.querySelectorAll('.digit');
    //2. iterar cada boton
    pad_numerico.forEach(function (pad_numero) {
        //3. asignar evento click al boton numerico
        pad_numero.addEventListener('click', function (e) {
            document.querySelector('.inputSeleccion').value = e.target.innerHTML;
            seleccion = document.querySelector('.inputSeleccion').value;
            console.log(seleccion);
        });
    });


    
   
    let btn_ingresar = document.getElementById('btn_ingresar');
    btn_ingresar.addEventListener('click', solicitud_acceso)

}

function solicitud_acceso(){
  alert('LLegue')
  if (seleccion != -1){
    id = document.getElementById('input_id').value
    console.log('Id'+id);
    if (id!=''){
      var ip = 'localhost'
      var method = 'solicitud_acceso'
    
      const options = {
          hostname: ip,
          port: 4000, // Puerto del Microservicio 1
          path: '/solicitud_acceso', // Ruta específica del Microservicio 1
          method: method,
        };
    
        const request = http.request(options, (proxyResponse) => {
    
          response.on('data', (chunk) => {
            body += chunk;
          });
        
          response.on('end', () => {
            console.log('2) Received: ' + body);
          });
        
          response.on('close', () => {
            console.log('3) Connection closed');
          });
        });
  
        let body = {
          'id': id,
          'piso':seleccion
        }
    
        request.write(JSON.stringify(body))
        request.end();
  
        seleccion = -1;
        
    }
    else{
      alert('Ingrese id')
    }
  }
  else{
    alert("Debes ingresar un piso");
  }


}

function createRequest(url){
  var ip = 'localhost'
    var method = 'solicitud_acceso'
    const options = {
        hostname: ip,
        port: 4000, // Puerto del Microservicio 1
        path: url, // Ruta específica del Microservicio 1
        method: method,
      };

}

function mostrar_datos(){
    
}

init();
var tablaResponsive;
var textoTabla;
var results = document.getElementById('results');
var id = document.getElementById('id');
var nombre = document.getElementById('nombre');  
var apellido = document.getElementById('apellido');  
var telefono = document.getElementById('telefono');
var cedula = document.getElementById('cedula');
var direccion = document.getElementById('direccion');
  
var crearTabla = "CREATE TABLE IF NOT EXISTS Contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellido TEXT,cedula TEXT, telefono TEXT, direccion TEXT)";
var seleccionarTodosRegistros = "SELECT * FROM Contacts";
var insertarRegistro = "INSERT INTO Contacts (nombre, apellido, telefono, cedula, direccion) VALUES (?, ?, ?, ?, ?)";
var actualizarRegistro = "UPDATE Contacts SET nombre = ?, apellido = ?, telefono = ?, cedula = ? , direccion = ? WHERE id = ?";
var eliminarRegistro = "DELETE FROM Contacts WHERE id=?";
var eliminarTodo = "DROP TABLE Contacts";


var db = openDatabase("Registro", "3.0", "Address Book", 200000);
var dataset;
createTable();

     function onError(tx, error) {
      swal("Error base de datos!", "Ocurrio un error en el proceso!", "error");
     }
    
     function showRecords() {
       tablaResponsive = "<div style='width:80%' class='table table-responsive'><table class='table' border='0'><thead><tr><th>Cédula</th><th>Apellido</th><th>Nombre</th><th>Teléfono</th><th>Dirección</th><th>Modificar / Eliminar</th></tr></thead><tbody id='tbbody'>";    
       db.transaction(function(tx) {
         tx.executeSql(seleccionarTodosRegistros, [], function(tx, result) {
          dataset = result.rows;
            for (var i = 0; i < dataset.length; i++) {            
              item = dataset.item(i);
              tablaResponsive = tablaResponsive.concat("<tr><td>" + item['cedula'] + "</td><td>" + item['apellido'] + "</td><td>" + item['nombre'] + "</td><td>" + item['telefono'] + "</td><td>" + item['direccion'] + "</td><td><a class='btn btn-primary' href='#' onclick='loadRecord("+i+")'>Modificar</a><a class='btn btn-danger' href='#' onclick='deleteRecord("+item['id']+")'>Eliminar</a></td></tr>");            
            }
          tablaResponsive += '</tbody></table></div>';
          console.log(tablaResponsive); 
          results.innerHTML = tablaResponsive;
         });
       });
     }
    
     function createTable() {
       db.transaction(function(tx) {
         tx.executeSql(crearTabla, [], showRecords, onError);
       });
     }
    
     function insertRecord() {
       db.transaction(function(tx) {
         tx.executeSql(insertarRegistro, [nombre.value, apellido.value, telefono.value, cedula.value, direccion.value], loadAndReset, onError);
         swal("Done!", "Datos insertados en la Base!", "success");
        });
     }
    
      function loadRecord(i) {
        var item = dataset.item(i);
        nombre.value = item['nombre'];
        apellido.value = item['apellido'];
        telefono.value = item['telefono'];
        id.value = item['id'];
        direccion.value = item['direccion'];
        cedula.value = item['cedula'];
     }

     function updateRecord() {
       db.transaction(function(tx) {
         tx.executeSql(actualizarRegistro, [nombre.value, apellido.value, telefono.value, cedula.value, direccion.value, id.value], loadAndReset, onError);
         swal("Done!", "Datos actualizados en la Base!", "success");
        });
     }
    
     function deleteRecord(id) {
      swal({
        title: "Are you sure?",
        text: "Se eliminará el registro si selecciona OK!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          db.transaction(function(tx) {
            tx.executeSql(eliminarRegistro, [id], showRecords, onError);
          });
          resetForm();
          swal("Poof! Su registro fué eliminado!", {
            icon: "success",
          });
        } else {
          swal("Su registro no fue eliminado!");
        }
      });
       
     }
      
     function dropTable() {
      swal({
        title: "Are you sure?",
        text: "Se eliminará la tabla si selecciona OK!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          db.transaction(function(tx) {
            tx.executeSql(eliminarTodo, [], showRecords, onError);
          });
          resetForm();
          swal("Poof! Su tabla fué eliminada!", {
            icon: "success",
          });
        } else {
          swal("Su tabla no fue eliminada!");
        }
      });
       
     }

      function loadAndReset(){
        resetForm();
        showRecords();
      }

      function resetForm(){
        nombre.value = '';
        apellido.value = '';
        telefono.value = '';
        id.value = '';
        cedula.value = '';
        direccion.value = '';
      }
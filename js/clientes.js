$(document).ready(function () {
    estadoInicial();    //configura el aspecto inicial de la pagina
    listar();   //ejecuta función para enviar petición al ws
});

//Esta función ejecuta la petición asincrona al servidor de Oracle, envia una
function listar() {
    console.log("se esta ejecutando")
    $.ajax({
        url:"http://129.151.124.94:8080/api/Client/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            console.log(respuesta);
            loadClientes(respuesta);
           
        },
        error: function (xhr, status) {
            $("#mensajes").html("Ocurrio un problema al ejecutar la petición..." + status);
        },
    
    })
}

function loadClientes(respuesta){   
    let myTable="<table>";
    for(i=0;i<respuesta.length;i++){
        //myTable+="<tr>";
        myTable+="<td>"+respuesta[i].idClient+"</td>";
        myTable+="<td>"+respuesta[i].name+"</td>";       
        myTable+="<td>"+respuesta[i].email+"</td>";  
        myTable+="<td>*****</td>";  
        myTable+="<td>"+respuesta[i].age+"</td>";  
        myTable+="<td> <button class='btn btn-success btn-sm btnEditar' onclick=' editarRegistro("+respuesta[i].idClient+")'>Editar</button>";
        myTable+="<td> <button class='btn btn-danger btn-sm' onclick='borrarRegistro("+respuesta[i].idClient+")'>Borrar</button>";
        myTable+="</tr>";
    }
    myTable+="</table>";
    $("#tableDataClientes").html(myTable);
}

function editarRegistro(llaveId) {       
    opcion='editar';
    let datos = {
        id: llaveId
    }
    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Client/all",     
        type:"GET",
        datatype:"JSON",

        // código a ejecutar si la petición es satisfactoria;
        success: function (respuesta) {          
            editarRespuesta(respuesta, datos);    
           
        },

        // código a ejecutar si la petición falla;
        error: function (xhr, status) {
            $("#mensajes").show(1000);
            $("#mensajes").html("Error peticion PUT..." + status);
        }
    });
}

// Esta función se encarga de recorrer el listado de datos 'items' recibido como parametro
function editarRespuesta(respuesta, datos) {
    let dato = datos.id

    for (var i=0; i < respuesta.length; i++) {
        if (respuesta[i].idClient === dato){
            var list = respuesta[i]
        }
    }

    $("#id").val(list.idClient);
    $("#name").val(list.name);    
    $("#email").val(list.email);
    $("#password").val(list.password);  
    $("#age").val(list.age);    
   

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white" );
    $(".modal-title").text("Editar Cliente");		
    $('#modalCRUD').modal('show');		  
}

//Esta función ejecuta la petición asincrona al servidor de Oracle
function actualizar() {
    //crea un objeto javascript
    //alert("Hola");
    let datos = {
        idClient: $("#id").val(),  
        name: $("#name").val(),    
        email: $("#email").val(),
        password: $("#password").val(),        
        age: $("#age").val()
        
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);
    console.log(datosPeticion);
    if (validarEditar()) {
        $.ajax({
            url: "http://129.151.124.94:8080/api/Client/update",
            data: datosPeticion,
            type: 'PUT',
            contentType: "application/JSON",

            // código a ejecutar si la petición es satisfactoria;
            success: function (respuesta) {
                $("#mensajes").show(1000);
                $("#mensajes").html("Registro actualizado...");
                $("#mensajes").hide(1000);
                listar();
                estadoInicial();
            },

            // código a ejecutar si la petición falla;
            error: function (xhr, status) {
                $("#mensajes").show(1000);
                $("#mensajes").html("Error peticion Put..." + status);
            }
        });
    }
}

 //CREAR
 $("#btnCrear").click(function(){
    opcion='crear';            
    id=null;
    $("#formClientes").trigger("reset");
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css( "color", "white" );
    $(".modal-title").text("Crear Cliente");
    $('#modalCRUD').modal('show');

});    

 
$('#formClientes').submit(function(e){                                     
    e.preventDefault();
    let datos={ 
        //id: $("#id").val(),
        name: $("#name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        age: $("#age").val()      
    
    }
    let datosPeticion = JSON.stringify(datos);
                 
    if(opcion=='crear'){  
        if (validar()){
            $.ajax({
                type: 'POST',
                contentType:"application/JSON",
                url: "http://129.151.124.94:8080/api/Client/save",
                data : datosPeticion,
                xhrFields: {
                    withCredentials: false
                },
    
                // código a ejecutar si la petición es satisfactoria;
                success: function (respuesta) {
                    $("#mensajes").show(1000);
                    $("#mensajes").html("Registro ingresado...");
                    $("#mensajes").hide(1000);
                    listar();
                    estadoInicial();
                },
        
                // código a ejecutar si la petición falla;
                error: function (xhr, status) {
                    $("#mensajes").show(1000);
                    $("#mensajes").html("Error peticion POST..." + status );
                }
            });
        }
        
    }

    else if(opcion=='editar'){  
        actualizar();

    }

   
    $('#modalCRUD').modal('hide');											     			
});

//BORRAR
function borrarRegistro(idElemento) {
    //alert(idElemento);
    let myData={
        id:idElemento
    };

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let dataToSend=JSON.stringify(myData);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Client/"+idElemento,
        data : dataToSend,
        type: 'DELETE',
        contentType:"application/JSON",
        datatype:"JSON",


        // código a ejecutar si la petición es satisfactoria;
        success: function (respuesta) {
            $("#mensajes").show(1000);
            $("#mensajes").html("Registro eliminado...");
            $("#mensajes").hide(1000);
            listar();
        },

        // código a ejecutar si la petición falla;
        error: function (xhr, status) {
            $("#mensajes").html("Ocurrio un problema al ejecutar la petición..." + status);
        }
    });

       
}

function estadoInicial(){
    $("#nuevo").hide();
    $("#editar").hide();
    $("#listado").show(500);
    $("#nuevoRegistro").show(500)

    //limpia el contenido de los campos del formulario nuevo
    $("#id").val("")    
    $("#name").val("")
    $("#email").val("")
    $("#password").val("")
    $("#age").val("")
}

// Configura el aspecto de la página para ingresar un nuevo registro
function activaNuevo(){
    $("#nuevo").show(500);
    $("#id").focus();
    $("#editar").hide();
    $("#nuevoRegistro").hide(500)
    $("#listado").hide(500);
}

// Configura el aspecto de la página para actualizar el registro
function activaEditar() {
    $("#idEdit").hide();
    $("#editar").show(500);
    $("#idEdit").focus();
    $("#nuevo").hide();
    $("#nuevoRegistro").hide(500)
    $("#listado").hide(500);
}


//VERIFICAR DATOS
function validaesVacio(dato){
    return !dato.trim().length;
}

// Al actualizar un nuevo registro Ejecuta validaciones campo a campo
function validar(){
    //obtiene valores
    //let id = $("#id").val();
    let name = $("#name").val();
    let email = $("#email").val();   
    let password = $("#password").val();  
    let age = $("#age").val();  
    let errores="";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if( validaesVacio(id)) {
        errores="id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#id").focus();
        return false;
    }else*/
    if( validaesVacio(name)) {
        errores="name vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#name").focus();
        return false;
    }else if( validaesVacio(email)) { 
        errores="email vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#email").focus();
        return false;
    }else if( validaesVacio(password)) { 
        errores="password vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#password").focus();
        return false;
    }else if( validaesVacio(age)) { 
        errores="age vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#age").focus();
        return false;
    }else{
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

// Al actualizar un nuevo registro Ejecuta validaciones campo a campo
function validarEditar(){
    //obtiene valores
    //let id = $("#id").val();
    let name = $("#name").val();
    let email = $("#email").val();   
    let password = $("#password").val();  
    let age = $("#age").val();  

    let errores="";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if( validaesVacio(id)) {
        errores="id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#id").focus();
        return false;
    }else*/
    if( validaesVacio(name)) {
        errores="name vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#name").focus();
        return false;
    }else if( validaesVacio(email)) { 
        errores="email vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#email").focus();
        return false;
    }else if( validaesVacio(password)) { 
        errores="password vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#password").focus();
        return false;
    }else if( validaesVacio(age)) { 
        errores="age vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#age").focus();
        return false;
    }else{
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

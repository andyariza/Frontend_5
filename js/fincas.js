$(document).ready(function () {
    estadoInicial();    //configura el aspecto inicial de la pagina
    listar();   //ejecuta función para enviar petición al ws
    autoInicioCategoria();
});

//Esta función ejecuta la petición asincrona al servidor de Oracle, envia una
function listar() {
    console.log("se esta ejecutando")
    $.ajax({
        url:"http://129.151.124.94:8080/api/Farm/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            console.log(respuesta);
            loadFincas(respuesta);
           
        },
        error: function (xhr, status) {
            $("#mensajes").html("Ocurrio un problema al ejecutar la petición..." + status);
        },
    
    })
}

function autoInicioCategoria(){
    console.log("se esta ejecutando")
    $.ajax({
        url:"http://129.151.124.94:8080/api/Category/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            console.log(respuesta);
            //pintarRespuesta(respuesta);
            let $select = $("#select-category");
            $.each(respuesta, function (id, name) {
                $select.append('<option value='+name.id+'>'+name.name+'</option>');
                //console.log("select "+name.id);
                let category = $("#select-category").val();
                console.log("select "+category);
            }); 
        }
    
    })

}


function loadFincas(respuesta){   
    let myTable="<table>";
    for(i=0;i<respuesta.length;i++){
        //myTable+="<tr>";
        myTable+="<td>"+respuesta[i].id+"</td>";
        myTable+="<td>"+respuesta[i].name+"</td>";
        myTable+="<td>"+respuesta[i].address+"</td>";
        myTable+="<td>"+respuesta[i].extension+"</td>";
        myTable+="<td>"+respuesta[i].description+"</td>";
        myTable+="<td>"+respuesta[i].category.name+"</td>";
        myTable+="<td> <button class='btn btn-success btn-sm btnEditar' onclick=' editarRegistro("+respuesta[i].id+")'>Editar</button>";
        myTable+="<td> <button class='btn btn-danger btn-sm' onclick='borrarRegistro("+respuesta[i].id+")'>Borrar</button>";
        myTable+="</tr>";
    }
    myTable+="</table>";
    $("#tableDataFincas").html(myTable);
}

function editarRegistro(llaveId) {   
    $('#select-farm').html('');
    opcion='editar';
    let datos = {
        id: llaveId
    }
    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Farm/all",     
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
        if (respuesta[i].id === dato){
            var list = respuesta[i]
        }
    }

    $("#id").val(list.id);
    $("#address").val(list.address);
    $("#extension").val(list.extension); 
    $("#description").val(list.description); 
    $("#select-category").val(list.category.id); 
    
    //category: {id:+$("#select-category").val()},

    //$("#select-farm").val(list.category);
    //category: {id:+$("#select-category").val()}
    /*let $select = $("#select-farm");
    $.each(respuesta, function (id, list) {
        $select.append('<option value='+list.category.id+'>'+list.category.name+'</option>');
        //console.log("select "+list.category.name);
    });*/

    $("#name").val(list.name);  

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white" );
    $(".modal-title").text("Editar Finca");		
    $('#modalCRUD').modal('show');		  
}

//Esta función ejecuta la petición asincrona al servidor de Oracle
function actualizar() {
    //crea un objeto javascript
    //alert("Hola");
    let datos = {
        id: $("#id").val(),
        address: $("#address").val(),
        extension: $("#extension").val(),
        description: $("#description").val(),      
        //category: $("#select-category").val(),
        category: {id:+$("#select-category").val()},
        name: $("#name").val()
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    if (validarEditar()) {
        $.ajax({
            url: "http://129.151.124.94:8080/api/Farm/update",
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
                $("#mensajes").html("Error peticion Post..." + status);
            }
        });
    }
}

 //CREAR
 $("#btnCrear").click(function(){
    opcion='crear';            
    id=null;
    $("#formFincas").trigger("reset");
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css( "color", "white" );
    $(".modal-title").text("Crear Finca");
    $('#modalCRUD').modal('show');

});    

 
$('#formFincas').submit(function(e){                                     
    e.preventDefault();
    let datos={ 

        //id: $('#id').val(), 
        address: $("#address").val(),
        extension: $("#extension").val(),
        description: $("#description").val(),   
        //category: $("#select-category").val(),
        category: {id:+$("#select-category").val()},
        name: $("#name").val()
    
    }
    let datosPeticion = JSON.stringify(datos);
                 
    if(opcion=='crear'){  
        if (validar()){
            //console.log(datosPeticion);
            $.ajax({
                type: 'POST',
                contentType:"application/JSON",
                url: "http://129.151.124.94:8080/api/Farm/save",
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

    /*let category = $("#select-category").val();
    console.log(category);*/

});

//BORRAR
function borrarRegistro(idElemento) {

    let myData={
        id:idElemento
    };
   
    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let dataToSend=JSON.stringify(myData);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Farm/"+idElemento,
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
    $("#address").val("")
    $("#extension").val("")
    $("#description").val("")
    $("#category").val("")
    $("#name").val("")
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
    let address = $("#address").val();
    let extension = $("#extension").val();
    let description = $("#description").val();
    let category = $("#select-category").val();
    
    //console.log(category);

    let name = $("#name").val();
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
    if( validaesVacio(address)) {
        errores="address vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#address").focus();
        return false;
    }else if( validaesVacio(extension)) {  
        errores="extension vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#extension").focus();
        return false;
    }else if( validaesVacio(description)) {  
        errores="description vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#description").focus();
        return false;
    }else if( validaesVacio(category)) { 
        errores="category vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#category").focus();
        return false;
    }else if( validaesVacio(name)) { 
        errores="name vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#name").focus();
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
    let address = $("#address").val();
    let extension = $("#extension").val();
    let description = $("#description").val();
    let category = $("#select-category").val();
    let name = $("#name").val();
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
    if( validaesVacio(address)) {
        errores="address vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#address").focus();
        return false;
    }else if( validaesVacio(extension)) {  
        errores="extension vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#extension").focus();
        return false;
    }else if( validaesVacio(description)) {  
        errores="description vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#description").focus();
        return false;
    }else if( validaesVacio(category)) { 
        errores="category vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#category").focus();
        return false;
    }else if( validaesVacio(name)) { 
        errores="name vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#name").focus();
        return false;
    }else{
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

$(document).ready(function () {
    estadoInicial();    //configura el aspecto inicial de la pagina
    listar();   //ejecuta función para enviar petición al ws
    autoInicioCliente();
    autoInicioFinca();
});

//Esta función ejecuta la petición asincrona al servidor de Oracle, envia una
function listar() {
    console.log("se esta ejecutando")
    $.ajax({
        url:"http://129.151.124.94:8080/api/Message/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            console.log(respuesta);
            loadMensajes(respuesta);
           
        },
        error: function (xhr, status) {
            $("#mensajes").html("Ocurrio un problema al ejecutar la petición..." + status);
        },
    
    })
}

function autoInicioCliente(){
    console.log("se esta ejecutando")
    //$('#select-cliente').html('');
    
    $.ajax({
        url:"http://129.151.124.94:8080/api/Client/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta){
            console.log(respuesta);
            //pintarRespuesta(respuesta);
            let $select = $("#select-cliente");
            $.each(respuesta, function (id, name) {
                $select.append('<option value='+name.idClient+'>'+name.name+'</option>');
                //console.log("select "+name.id);
                let cliente = $("#select-cliente").val();
                console.log("select "+cliente);
            }); 
        }
    
    })

}

function autoInicioFinca(){
    console.log("se esta ejecutando")
    //$('#select-finca').html('');
    $.ajax({
        url:"http://129.151.124.94:8080/api/Farm/all",
        type:"GET",
        datatype:"JSON",
        success:function(respuesta2){
            console.log(respuesta2);
            //pintarRespuesta(respuesta);
            let $select2 = $("#select-finca");
            $.each(respuesta2, function (id, name) {
                $select2.append('<option value='+name.id+'>'+name.name+'</option>');
                //console.log("select "+name.id);
                let finca1 = $("#select-finca").val();
                console.log("select "+finca1);
            }); 
        }
    
    })

}


function loadMensajes(respuesta){   
    let myTable="<table>";
    for(i=0;i<respuesta.length;i++){
        //myTable+="<tr>";
        myTable+="<td>"+respuesta[i].idMessage+"</td>";
        myTable+="<td>"+respuesta[i].messageText+"</td>";      
        myTable+="<td>"+respuesta[i].client.name+"</td>";      
        myTable+="<td>"+respuesta[i].farm.name+"</td>";
        myTable+="<td> <button class='btn btn-success btn-sm btnEditar' onclick=' editarRegistro("+respuesta[i].idMessage+")'>Editar</button>";
        myTable+="<td> <button class='btn btn-danger btn-sm' onclick='borrarRegistro("+respuesta[i].idMessage+")'>Borrar</button>";
        myTable+="</tr>";
    }
    myTable+="</table>";
    $("#tableDataMensajes").html(myTable);
}

function editarRegistro(llaveId) {   
    $('#select-cliente1').html('');
    $('#select-finca1').html('');
    opcion='editar';
    let datos = {
        idMessage: llaveId
    }
    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    //console.log(datos);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Message/all",     
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
    let dato = datos.idMessage

    //console.log(dato);
    for (var i=0; i < respuesta.length; i++) {
        if (respuesta[i].idMessage === dato){
            var list = respuesta[i]
            console.log(list);
        }
    }

    $("#idMessage").val(list.idMessage);
    $("#messageText").val(list.messageText);
    $("#select-cliente").val(list.client.idClient);
    $("#select-finca").val(list.farm.id);
    let $idc = list.client.idClient;
    let $idf = list.id;
   
    console.log("idc: "+$idc);
    /*let $select = $("#select-cliente");
    $.each(respuesta, function (id, list) {
        $select.append('<option value='+list.client.idClient+'>'+list.client.name+'</option>');
        console.log("select "+list.client.name);
    });*/

    
    /*let $select4 = $("#select-finca1");
    $.each(respuesta, function (id, list) {
        $select4.append('<option value='+list.farm.id+'>'+list.farm.name+'</option>');
        console.log("select "+list.farm.name);
    });*/

    

    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white" );
    $(".modal-title").text("Editar Mensaje");		
    $('#modalCRUD').modal('show');		  
}

//Esta función ejecuta la petición asincrona al servidor de Oracle
function actualizar() {
    //crea un objeto javascript
    //alert("Hola");
    let datos = {
        idMessage: $("#idMessage").val(),
        messageText: $("#messageText").val(),
        client: {idClient:+$("#select-cliente").val()},
        farm: {id:+$("#select-finca").val()}
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    if (validarEditar()) {
        $.ajax({
            url: "http://129.151.124.94:8080/api/Message/update",
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
                autoInicioCliente();
                autoInicioFinca();
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
    $("#formMensajes").trigger("reset");
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css( "color", "white" );
    $(".modal-title").text("Crear Mensaje");
    $('#modalCRUD').modal('show');

});    

 
$('#formMensajes').submit(function(e){                                     
    e.preventDefault();
  
    let datos={ 

        //idMessage: $("#idMessage").val(),
        messageText: $("#messageText").val(),
        client: {idClient:+$("#select-cliente").val()},
        farm: {id:+$("#select-finca").val()}
    
    }
    let datosPeticion = JSON.stringify(datos);
    console.log(datosPeticion);
    //validar();             
    if(opcion=='crear'){  
        //$('#select-cliente').html('');
        //$('#select-finca').html('');
        if (validar()){
            //console.log(datosPeticion);
            $.ajax({
                type: 'POST',
                contentType:"application/JSON",
                url: "http://129.151.124.94:8080/api/Message/save",
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
                    autoInicioCliente();
                    autoInicioFinca();
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
        url: "http://129.151.124.94:8080/api/Message/"+idElemento,
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
            //autoInicioCliente();
            //autoInicioFinca();
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
    $("#idMessage").val("")
    $("#messageText").val("")   
    $('#select-cliente').html('');
    $('#select-finca').html('');
}

// Configura el aspecto de la página para ingresar un nuevo registro
function activaNuevo(){
    $("#nuevo").show(500);
    $("#idMessage").focus();
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
    //let idMessage = $("#idMessage").val();
    let messageText = $("#messageText").val();   
    let client = $("#select-cliente").val();
    let farm = $("#select-finca").val();   
    
    console.log(idMessage+"-"+messageText+"-"+client+"-"+farm);

    let errores="";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if( validaesVacio(idMessage)) {
        errores="id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#idMessage").focus();
        return false;
    }else*/
    if( validaesVacio(messageText)) {
        errores="mensaje vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#messageText").focus();
        return false;
    }else if( validaesVacio(client)) {  
        errores="cliente vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#client").focus();
        return false;
    }else if( validaesVacio(farm)) { 
        errores="finca vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#farm").focus();
        return false;
    }
    else{
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

// Al actualizar un nuevo registro Ejecuta validaciones campo a campo
function validarEditar(){
    //obtiene valores
    //let idMessage = $("#idMessage").val();
    let messageText = $("#messageText").val();   
    let client = $("#select-cliente").val();
    let farm = $("#select-finca").val();

    let errores="";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if( validaesVacio(idMessage)) {
        errores="id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#idMessage").focus();
        return false;
    }else*/
    if( validaesVacio(messageText)) {
        errores="mensaje vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#messageText").focus();
        return false;
    }else if( validaesVacio(client)) {  
        errores="cliente vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#client").focus();
        return false;
    }else if( validaesVacio(farm)) { 
        errores="finca vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#farm").focus();
        return false;
    }
    else{
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

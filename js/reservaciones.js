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
        url: "http://129.151.124.94:8080/api/Reservation/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            loadReservaciones(respuesta);

        },
        error: function (xhr, status) {
            $("#mensajes").html("Ocurrio un problema al ejecutar la petición..." + status);
        },

    })
}

function autoInicioCliente() {
    console.log("se esta ejecutando")
    //$('#select-cliente').html('');

    $.ajax({
        url: "http://129.151.124.94:8080/api/Client/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
            //pintarRespuesta(respuesta);
            let $select = $("#select-cliente");
            $.each(respuesta, function (id, name) {
                $select.append('<option value=' + name.idClient + '>' + name.name + '</option>');
                //console.log("select "+name.id);
                let cliente = $("#select-cliente").val();
                console.log("select " + cliente);
            });
        }

    })

}

function autoInicioFinca() {
    console.log("se esta ejecutando")
    //$('#select-finca').html('');
    $.ajax({
        url: "http://129.151.124.94:8080/api/Farm/all",
        type: "GET",
        datatype: "JSON",
        success: function (respuesta2) {
            console.log(respuesta2);
            //pintarRespuesta(respuesta);
            let $select2 = $("#select-finca");
            $.each(respuesta2, function (id, name) {
                $select2.append('<option value=' + name.id + '>' + name.name + '</option>');
                //console.log("select "+name.id);
                let finca1 = $("#select-finca").val();
                console.log("select " + finca1);
            });
        }

    })

}


function loadReservaciones(respuesta) {
    let myTable = "<table>";
    for (i = 0; i < respuesta.length; i++) {
        //myTable+="<tr>";
        myTable += "<td>" + respuesta[i].idReservation + "</td>";
        //const d = new Date(respuesta[i].startDate).format("%Y-%m-%d");

        //var today = respuesta[i].startDate.format("%Y-%m-%d");

        //let date = respuesta[i].startDate;

        // the hour in your current time zone
        //alert(date.getFullYear());

        // the hour in UTC+0 time zone (London time without daylight savings)
        //alert(date.getMonth());

        /*var start = new Date(respuesta[i].startDate);

        var year = start.getFullYear();
        var month = start.getMonth();
        var day = start.getDay();

        const inicioDate = day+"-"+month+"-"+year;*/

        var date1 = respuesta[i].startDate;      
        
        var Y = parseInt(date1.split(' ')[0].split('-')[0]);       // 2017
        var M = parseInt(date1.split(' ')[0].split('-')[1]);   // 7
        var D = parseInt(date1.split(' ')[0].split('-')[2]);       // 13
        var date2 = D+"/"+M+"/"+Y;

        /*var start1 = new Date(respuesta[i].devolutionDate);

        var year1 = start1.getFullYear();
        var month1 = start1.getMonth();
        var day1 = start1.getDay();

        //const finalDate = day1+"-"+month1+"-"+year1;

        const finalDate = day1;*/

        //fi1= d.toLocaleFormat('%d-%b-%Y');

        var date3 = respuesta[i].devolutionDate;      
        
        var Y = parseInt(date3.split(' ')[0].split('-')[0]);       // 2017
        var M = parseInt(date3.split(' ')[0].split('-')[1]);   // 7
        var D = parseInt(date3.split(' ')[0].split('-')[2]);       // 13
        var date4 = D+"/"+M+"/"+Y;

        myTable += "<td>" + date2 + "</td>";
        myTable += "<td>" + date4 + "</td>";
        myTable += "<td>" + respuesta[i].status + "</td>";
        myTable += "<td>" + respuesta[i].client.name + "</td>";
        myTable += "<td>" + respuesta[i].farm.name + "</td>";
        myTable += "<td> <button class='btn btn-success btn-sm btnEditar' onclick=' editarRegistro(" + respuesta[i].idReservation + ")'>Editar</button>";
        myTable += "<td> <button class='btn btn-danger btn-sm' onclick='borrarRegistro(" + respuesta[i].idReservation + ")'>Borrar</button>";
        myTable += "</tr>";
    }
    myTable += "</table>";
    $("#tableDataReservaciones").html(myTable);
}

function editarRegistro(llaveId) {
    $('#select-cliente1').html('');
    $('#select-finca1').html('');
    opcion = 'editar';
    let datos = {
        idReservation: llaveId
    }
    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    //console.log(datos);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Reservation/all",
        type: "GET",
        datatype: "JSON",

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
    let dato = datos.idReservation

    //console.log(dato);
    for (var i = 0; i < respuesta.length; i++) {
        if (respuesta[i].idReservation === dato) {
            var list = respuesta[i]
            console.log(list);
        }
    }

    /*var date1 = list.startDate;            
    var Y = parseInt(date1.split(' ')[0].split('-')[0]);       // 2017
    var M = parseInt(date1.split(' ')[0].split('-')[1]);   // 7
    var D = parseInt(date1.split(' ')[0].split('-')[2]);       // 13
    var date2 = "0"+D+"/"+M+"/"+Y;
   
    var date3 = list.devolutionDate;     
    var Y = parseInt(date3.split(' ')[0].split('-')[0]);       // 2017
    var M = parseInt(date3.split(' ')[0].split('-')[1]);   // 7
    var D = parseInt(date3.split(' ')[0].split('-')[2]);       // 13
    var date4 = D+"-"+M+"-"+Y;*/

    $("#idReservation").val(list.idReservation);
    //var data = "2019-05-06 00:00:00";
    document.getElementById("startDate").valueAsDate = new Date(list.startDate);
    document.getElementById("devolutionDate").valueAsDate = new Date(list.devolutionDate);
    //$("#startDate").val(04/01/2021);
    //$("#devolutionDate").val(date4);
    $("#status").val(list.status);
    $("#select-cliente").val(list.client.idClient);
    $("#select-finca").val(list.farm.id);
    let $idc = list.client.idClient;
    let $idf = list.startDate;

    //console.log("start date: " + date2);
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
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Editar Reservaciones");
    $('#modalCRUD').modal('show');
}

//Esta función ejecuta la petición asincrona al servidor de Oracle
function actualizar() {
    //crea un objeto javascript
    //alert("Hola");
    let datos = {
        idReservation: $("#idReservation").val(),
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        status: $("#status").val(),
        client: { idClient: +$("#select-cliente").val() },
        farm: { id: +$("#select-finca").val() }
    }

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let datosPeticion = JSON.stringify(datos);

    if (validarEditar()) {
        $.ajax({
            url: "http://129.151.124.94:8080/api/Reservation/update",
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
$("#btnCrear").click(function () {
    opcion = 'crear';
    id = null;
    $("#formReservaciones").trigger("reset");
    $(".modal-header").css("background-color", "#7303c0");
    $(".modal-header").css("color", "white");
    $(".modal-title").text("Crear Reservaciones");
    $('#modalCRUD').modal('show');

});


$('#formReservaciones').submit(function (e) {
    e.preventDefault();

    let datos = {

        //idReservation: $("#idReservation").val(),
        startDate: $("#startDate").val(),
        devolutionDate: $("#devolutionDate").val(),
        status: $("#status").val(),
        client: { idClient: +$("#select-cliente").val() },
        farm: { id: +$("#select-finca").val() }

    }
    let datosPeticion = JSON.stringify(datos);
    console.log(datosPeticion);
    //validar();             
    if (opcion == 'crear') {
        //$('#select-cliente').html('');
        //$('#select-finca').html('');
        if (validar()) {
            //console.log(datosPeticion);
            $.ajax({
                type: 'POST',
                contentType: "application/JSON",
                url: "http://129.151.124.94:8080/api/Reservation/save",
                data: datosPeticion,
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
                    $("#mensajes").html("Error peticion POST..." + status);
                }
            });
        }

    }

    else if (opcion == 'editar') {
        actualizar();

    }


    $('#modalCRUD').modal('hide');

    /*let category = $("#select-category").val();
    console.log(category);*/

});

//BORRAR
function borrarRegistro(idElemento) {

    let myData = {
        id: idElemento
    };

    //convierte el objeto javascript a json antes de agregarlo a los datos de la petición
    let dataToSend = JSON.stringify(myData);

    $.ajax({
        url: "http://129.151.124.94:8080/api/Reservation/" + idElemento,
        data: dataToSend,
        type: 'DELETE',
        contentType: "application/JSON",
        datatype: "JSON",


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

function estadoInicial() {
    $("#nuevo").hide();
    $("#editar").hide();
    $("#listado").show(500);
    $("#nuevoRegistro").show(500)

    //limpia el contenido de los campos del formulario nuevo
    $("#idReservation").val("");
    $("#startDate").val("");
    $("#devolutionDate").val();
    $("#status").val();
    $('#select-cliente').html('');
    $('#select-finca').html('');
}

// Configura el aspecto de la página para ingresar un nuevo registro
function activaNuevo() {
    $("#nuevo").show(500);
    $("#idReservation").focus();
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
function validaesVacio(dato) {
    return !dato.trim().length;
}

// Al actualizar un nuevo registro Ejecuta validaciones campo a campo
function validar() {
    //obtiene valores
    //let idReservation = $("#idReservation").val();
    let startDate = $("#startDate").val();
    let devolutionDate = $("#devolutionDate").val();
    let status = $("#status").val();
    let client = $("#select-cliente").val();
    let farm = $("#select-finca").val();

    console.log(idReservation + "-" + startDate + "-" + devolutionDate + "-" + status + "-" + client + "-" + farm);

    let errores = "";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if (validaesVacio(idReservation)) {
        errores = "id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#idReservation").focus();
        return false;
    } else*/
    if (validaesVacio(startDate)) {
        errores = "F. Inicio vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#startDate").focus();
        return false;
    } else if (validaesVacio(devolutionDate)) {
        errores = "F. Devolución vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#devolutionDate").focus();
        return false;
    } else if (validaesVacio(status)) {
        errores = "status vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#status").focus();
        return false;
    } else if (validaesVacio(client)) {
        errores = "cliente vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#client").focus();
        return false;
    } else if (validaesVacio(farm)) {
        errores = "finca vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#farm").focus();
        return false;
    }
    else {
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

// Al actualizar un nuevo registro Ejecuta validaciones campo a campo
function validarEditar() {
    //obtiene valores
    //let idReservation = $("#idReservation").val();
    let startDate = $("#startDate").val();
    let devolutionDate = $("#devolutionDate").val();
    let status = $("#status").val();
    let client = $("#select-cliente").val();
    let farm = $("#select-finca").val();

    let errores = "";
    $("#mensajes").html("");

    //valida que los campos no sean vacios
    /*if (validaesVacio(idReservation)) {
        errores = "id vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#idReservation").focus();
        return false;
    } else*/
    if (validaesVacio(startDate)) {
        errores = "F. Inicio vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#startDate").focus();
        return false;
    } else if (validaesVacio(devolutionDate)) {
        errores = "F. Devolución vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#devolutionDate").focus();
        return false;
    } else if (validaesVacio(status)) {
        errores = "status vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#status").focus();
        return false;
    } else if (validaesVacio(client)) {
        errores = "cliente vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#client").focus();
        return false;
    } else if (validaesVacio(farm)) {
        errores = "finca vacio<br>";
        $("#mensajes").html(errores);
        $("#mensajes").show(500);
        $("#farm").focus();
        return false;
    }
    else {
        $("#mensajes").html("");
        $("#mensajes").hide(500);
        return true;
    }
    return true;
}

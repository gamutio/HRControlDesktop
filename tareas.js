let tareasUsuario = new Array();
let posicion = 0 //me va a indicar la posición por la que voy
let pos_imagen = 0
let controlInsertar = false //para insertar elementos

function tareasUserDesktop(tarea, userId) {
    let tareas = tarea;
    let principal = document.getElementById("contenedorPrin");
    let formTareas = `
        <div class="padded-more" style="margin-top: 5%; margin-left: 40%;">
            <img class="img media-object pull-left" id="imagen" src="./css/images/HRCntrolLogo_vectorized.png" width="32" height="32">
            <div class="form-group">
                <label>Título tarea</label>
                <input type="text" class="form-control" id="titulo">
            </div>
            <div class="form-group">
                <label>Descripción</label>
                <textarea class="form-control" rows="3" id="description"></textarea>
            </div>
            <div class="form-group">
                <label>Fecha Inicio</label>
                <input type="date" class="form-control" id="fechaInicio">
            </div>
            <div class="form-group">
                <label>Fecha Fin</label>
                <input type="date" class="form-control" id="fechaFin">
            </div>
            <div class="form-group">
                <input type="hidden" class="form-control" id="_id">
            </div>
            <div class="form-group">
                <button id="btnPrimero" class="active btn btn-primary btn-default">
                    <span class="icon icon-to-start icon-text"></span>
                    Inicio
                </button>
                <button id="btnAnterior" class="active btn btn-primary btn-default">
                    <span class="icon icon-left-dir icon-text"></span>
                    Anterior
                </button>
                <button id="btnSiguiente" class="active btn btn-primary btn-default">
                    <span class="icon icon-right-dir icon-text"></span>
                    Siguiente
                </button>
                <button id="btnUltimo" class="active btn btn-primary btn-default">
                    <span class="icon icon-to-end icon-text"></span>
                    Fin
                </button>
            </div>
            <div class="form-group" style="margin-left: 25%;">
                
                <button id="btnInsertar" class="active btn btn-primary btn-default" >
                    <span class="icon icon-folder icon-text"></span>
                    Insertar
                </button>
                
                <button id="btnBorrar" class="active btn btn-primary btn-default">
                    <span class="icon icon-cancel icon-text"></span>
                    Borrar
                </button>
            </div>
        </div>
    `
    principal.innerHTML = formTareas;
    let btnPrimero = document.getElementById('btnPrimero')
    let btnAtras = document.getElementById('btnAnterior')
    let btnAdelante = document.getElementById('btnSiguiente')
    let btnUltimo = document.getElementById('btnUltimo')
    let btnBorrar = document.getElementById('btnBorrar')
    let btnInsertar = document.getElementById('btnInsertar')
    let _id = document.getElementById("_id")
    let posicion = 0 //me va a indicar la posición por la que voy
    let pos_imagen = 0
    let controlInsertar = false //para insertar elementos

    //guardo las tareas en el equipo del usuario en un fichero json

    for (i = 0; i < tareas.length; i++) {
        if (tareas[i].idUser == userId) {
            tareasUsuario[i] = tareas[i];
        }
    }
    //fs.writeFileSync('./json/tareas.json', JSON.stringify(tareasUsuario));

    //FUNCIONES 

    let mostrarTarea = () => {
        document.getElementById('titulo').value = tareasUsuario[posicion].titulo
        document.getElementById("description").value = tareasUsuario[posicion].description
        document.getElementById("fechaInicio").value = tareasUsuario[posicion].fechaInicio
        document.getElementById("fechaFin").value = tareasUsuario[posicion].fechaFin
        document.getElementById("_id").value = tareasUsuario[posicion]._id
        document.getElementById('titulo').readOnly = true;
        document.getElementById("description").readOnly = true;
        document.getElementById("fechaInicio").readOnly = true;
        document.getElementById("fechaFin").readOnly = true;
    }


    let mostrarPrimero = () => {
        posicion = 0
        mostrarTarea()
    }
    let mostrarVacios = () => {
        document.getElementById("titulo").value = ""
        document.getElementById("description").value = ""
        document.getElementById("fechaInicio").value = ""
        document.getElementById("fechaFin").value = ""
        document.getElementById('titulo').readOnly = false;
        document.getElementById("description").readOnly = false;
        document.getElementById("fechaInicio").readOnly = false;
        document.getElementById("fechaFin").readOnly = false;
    }
    let actualizaFichero = () => {
        //fs.writeFileSync('./json/tareas.json', JSON.stringify(tareasUsuario));
    }

    //EVENTOS DE LOS BOTONES:

    btnInsertar.addEventListener('click', () => {
        let tnueva = {}
        if (!controlInsertar) {
            mostrarVacios()
            controlInsertar = true
            //cambio la clase del botón
            btnInsertar.classList.remove("btn-primary")
            btnInsertar.classList.add("btn-negative")
        } else {
            if(document.getElementById("titulo").value == '' || document.getElementById("fechaFin").value == '' || document.getElementById("description").value == '' || document.getElementById("fechaInicio").value ==''){
                alert('todos los campos son obligatorios');
                return false;
            }
            tnueva = {
                titulo: document.getElementById("titulo").value,
                fechaFin: document.getElementById("fechaFin").value,
                description: document.getElementById("description").value,
                fechaInicio: document.getElementById("fechaInicio").value,
                idUser: userId
            }
            
            tareasUsuario.push(tnueva)
            try {
                body = JSON.stringify(tnueva);
            } catch (error) {
                console.log(error);
            }
            (async function getNames() {
                try {
                    let config = {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                    let url_tareas = URL_API + "/tareas";
                    await axios.post(url_tareas, body, config)
                        .then(function (response) {
                            console.log(response);
                            //data = response;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                        });
                } catch (error) {
                    console.log(error);
                }

            })();
            posicion = tareasUsuario.length - 1
            mostrarTarea()
            actualizaFichero()
            controlInsertar = false
            btnInsertar.classList.remove("btn-negative")
            btnInsertar.classList.add("btn-primary")

        }
    })

    btnPrimero.addEventListener('click', () => {
        mostrarPrimero()
    })

    btnUltimo.addEventListener('click', () => {
        posicion = tareasUsuario.length - 1
        mostrarTarea()
    })

    btnAdelante.addEventListener('click', () => {
        posicion++
        if (posicion < tareasUsuario.length) {
            mostrarTarea()
        } else {
            dialog.showErrorBox("Ultim", "Esta es última tarea")
            posicion--
        }

    })

    btnAtras.addEventListener('click', () => {
        posicion--
        if (posicion >= 0) {
            mostrarTarea()
        } else {
            dialog.showErrorBox("Primer", "Es la primera tarea")
            posicion++
        }
    })

    btnBorrar.addEventListener('click', () => {
        let todasOK = false;
        if(document.getElementById("titulo").value != '' && document.getElementById("description").value != '' && document.getElementById("fechaInicio").value != ''){
            todasOK = true;
        }
        if (todasOK) {
            let tnueva = {}
            tnueva = {
                titulo: document.getElementById("titulo").value,
                fechaInicio: document.getElementById("fechaInicio").value,
                idUser: userId
            }
            tareasUsuario.push(tnueva)
            try {
                body = JSON.stringify(tnueva);
            } catch (error) {
                console.log(error);
            }
            (async function deleteTarea() {
                try {
                    let config = {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    }
                    let url_tareas = URL_API + "/tareas";
                    await axios.delete(url_tareas, {
                        headers: {
                            "Content-Type": "application/json",
                        }, data: {
                            titulo: document.getElementById("titulo").value,
                            description: document.getElementById("description").value,
                            fechaInicio: document.getElementById("fechaInicio").value,
                            idUser: userId
                        }
                    })
                        .then(function (response) {
                            console.log(response);
                            //data = response;
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                        .then(function () {
                        });
                } catch (error) {
                    console.log(error);
                }

            })();
            tareasUsuario.splice(posicion, 1)
            if (posicion >= tareasUsuario.length) {
                posicion--
            }
            if (tareasUsuario.length == 0) {
                mostrarVacios()
            } else {
                mostrarTarea()
            }
            actualizaFichero()
        }
    })


}
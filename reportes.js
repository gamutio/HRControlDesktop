AREAS = new Array();
let hoy='';
function printRUsuarios() {
    let cabeceraReporte = `
        <div style="text-align: left;">
            <table>
            <tr>
                <td colspan="1"><img class="logo" src="./css/images/HRCntrolLogo_vectorized.png" width="70px"></td>
                <td colspan="7" style="text-align: left;"><strong>Reporte de usuarios</strong>
                <p>HRControl Desktop</p></td>
            </tr>
            </table>
        </div>
    `
    var contenido = document.getElementById("tablaReporte").innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = cabeceraReporte + "Reporte generado: " + hoy + contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
}
function printRFichaje() {
    let cabeceraReporte = `
        <div style="text-align: left;">
            <table>
            <tr>
                <td colspan="1"><img class="logo" src="./css/images/HRCntrolLogo_vectorized.png" width="70px"></td>
                <td colspan="7" style="text-align: left;"><strong>Reporte Fichajes</strong> 
                <p>HRControl Desktop</p></td>
            </tr>
            </table>
        </div>
    `
    var contenido = document.getElementById("tablaReporte").innerHTML;
    var contenidoOriginal= document.body.innerHTML;
    document.body.innerHTML = cabeceraReporte + "Reporte generado: " + hoy + contenido;
    window.print();
    document.body.innerHTML = contenidoOriginal;
}

function getAreasR() {
    let URL_API_AREAS = URL_API + "/areas";
    axios.get(URL_API_AREAS).then(function (response) {
        let area = response;
        AREAS = area.data;
        console.log(AREAS);
        getUsuariosR();
    });
    
}

/*Cargar listado de usuarios*/
function getUsuariosR() {
    axios.get(URL_API_employee).then(function (response) {
        let perfiles = response; 
        let usuarios = new Array();
        usuarios = perfiles.data;
        let principal = document.getElementById("reporteGenerado");

        let tableUsers = `
        <div id="tablaReporte">    
            <table class="table-striped">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nombre</th>
                        <th>Mail</th>
                        <th>Tlf Fijo</th>
                        <th>Tlf Móvil</th>
                        <th>Fecha de Alta</th>
                        <th>Área</th>
                        <th>Roles</th>
                    </tr>
                </thead>
                <tbody id="cTabla">

                </tbody>
            </table>
            </div>
            <div class="toolbar-actions">
                <button class="btn btn-default" id="printReport">IMPRIMIR</button>
            </div>
        `
        principal.innerHTML = tableUsers;
        let ctabla = document.getElementById("cTabla");
        let printReport = document.getElementById("printReport");
        let filas = "";

        // recorro los datos creando las filas
        for (let i = 0; i < usuarios.length; i++) {
            if(usuarios[i].area == AREAS[0]._id){
                usuarios[i].area = "Sistemas";
            } else {
                usuarios[i].area = "Administración";
            }
            let rols = '';
            let rolsUser = new Array();
            rolsUser = usuarios[i].roles;
            if(rolsUser != undefined && rolsUser != ""){
                for (let j=0; j<rolsUser.length; j++){
                    if(rolsUser[j] == '6272deabead2c9b95b5be231'){
                        rols = rols + "user, ";
                    } else if(rolsUser[j] == '6272deabead2c9b95b5be230'){
                        rols = rols + "Administrador, ";
                    } else if(rolsUser[j] == '6272deabead2c9b95b5be232'){
                        rols = rols + "Reportes";
                    }
                }
            }
            if(rols=='') rols="user";
            usuarios[i].roles = rols;
            filas += `
                <tr id="tr${i}">
                    <td>${i+1}</td>
                    <td>${usuarios[i].name}</td>
                    <td>${usuarios[i].email}</td>
                    <td>${usuarios[i].tlfFijo}</td>
                    <td>${usuarios[i].tlfMovil}</td>
                    <td>${usuarios[i].fechaAlta}</td>
                    <td>${usuarios[i].area}</td>
                    <td>${usuarios[i].roles}</td>
                </tr> `;
        }
        ctabla.innerHTML = filas;
        printReport.addEventListener('click', () => {
            printRUsuarios();
        });
    });
}


function FichajeReport(fecha){
    let URL_API_FICHA = URL_API + "/ficha";
    axios.get(URL_API_FICHA).then(function (response) {
        let perfiles = response; 
        let usuarios = new Array();
        usuarios = perfiles.data;
        let principal = document.getElementById("reporteGenerado");

        let tableUsers = `
        <div id="tablaReporte">    
            <table class="table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                    </tr>
                </thead>
                <tbody id="cTabla">

                </tbody>
            </table>
            </div>
            <div class="toolbar-actions">
                <button class="btn btn-default" id="printReport">IMPRIMIR</button>
            </div>
            
        `
        principal.innerHTML = tableUsers;
        let ctabla = document.getElementById("cTabla");
        let printReport = document.getElementById("printReport");
        printReport.addEventListener('click', () => {
            printRFichaje();
        });
        //recorro el array para quedarme con los fichajes del día actual.
        let hoyD = new Date(fecha);
        let mes = (hoyD.getMonth()+1);
        if(mes.toString().length<2){
            mes = "0"+mes;
        }
        hoy = hoyD.getDate() + "/" + mes  + "/" + hoyD.getFullYear();
        
        let fichasHoy = new Array();
        for(let i=0; i<usuarios.length; i++){
            if(usuarios[i].idUser == userId){
                let fechas = usuarios[i].fecha;
                let fecha = fechas.split("T")[0];
                let fechaSplit = fecha.split("-")[2] + "/" + fecha.split("-")[1] + "/" + fecha.split("-")[0];
                if(hoy == fechaSplit){
                    fichasHoy.push(usuarios[i]);
                }
            }
        }
        filas = '';
        for (let i = 0; i < fichasHoy.length; i++) {
            let horafin;
            if(fichasHoy[i].horaFin == undefined){
                horafin = "horafin"
            } else {
                horafin = fichasHoy[i].horaFin;
            }
            filas += `
                    <tr id="tr${i}">
                        <td>${i}</td>
                        <td>${fichasHoy[i].horaInicio}</td>
                        <td>${horafin}</td>
                    </tr>
                     `;
        }
        
        ctabla.innerHTML = filas;
        
    });
}
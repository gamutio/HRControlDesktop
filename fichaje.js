AREAS = new Array();
let filas = "";
function getFicha() {
        getUsuariosRa();   
}

/*Cargar listado de usuarios*/
function getUsuariosRa() {
    let URL_API_FICHA = URL_API + "/ficha";
    axios.get(URL_API_FICHA).then(function (response) {
        let perfiles = response; 
        let usuarios = new Array();
        usuarios = perfiles.data;
        let principal = document.getElementById("Tabla");

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
            
        `
        principal.innerHTML = tableUsers;
        let ctabla = document.getElementById("cTabla");
        let printReport = document.getElementById("printReport");
        
        //recorro el array para quedarme con los fichajes del día actual.
        let hoyD = new Date();
        let mes = (hoyD.getMonth()+1);
        if(mes.toString().length<2){
            mes = "0"+mes;
        }
        let hoy = hoyD.getDate() + "/" + mes  + "/" + hoyD.getFullYear();
        
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

function fichar(){
    let URL_API_FICHA = URL_API + "/ficha";
    axios.get(URL_API_FICHA).then(function (response) {
        let perfiles = response; 
        let usuarios = new Array();
        usuarios = perfiles.data;
        //recorro el array para quedarme con los fichajes del día actual.
        let hoyD = new Date();
        mes = (hoyD.getMonth()+1);
        if(mes.toString().length<2){
            mes = "0"+mes;
        }
        let hoy = hoyD.getDate() + "/" + mes  + "/" + hoyD.getFullYear();
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
        //compruebo si el ultimo fichaje corresponde a una entrada
        ctabla = document.getElementById("cTabla");
        let j = fichasHoy.length-1;
        let k = fichasHoy.length;
        if(fichasHoy[j] != undefined && fichasHoy[j].horaFin == undefined){
            let horaFin = new Date();
            let hora = horaFin.getHours();
            if(hora.toString().length<2){
                hora = "0"+hora;
            }
            let mins = horaFin.getMinutes();
            if(mins.toString().length<2){
                mins = "0"+mins;
            }
            let segs = horaFin.getSeconds();
            if(segs.toString().length<2){
                segs = "0"+segs;
            }
            horafin= hora+":"+mins+":"+segs;
            filas = '';
            for (let i = 0; i < fichasHoy.length; i++) {
                if(i < fichasHoy.length-1){
                filas += `
                        <tr id="tr${i}">
                            <td>${i}</td>
                            <td>${fichasHoy[i].horaInicio}</td>
                            <td>${fichasHoy[i].horaFin}</td>
                        </tr> 
                        `;
                } else {
                    filas += `
                        <tr id="tr${i}">
                            <td>${i}</td>
                            <td>${fichasHoy[i].horaInicio}</td>
                            <td>${horafin}</td>
                        </tr> 
                    `;
                }
            }
            ctabla.innerHTML = filas;
            updateFich(fichasHoy[j]._id, horafin);
        } else {
            let horaIni =new Date();
            horafin = "horafin";
            let hora = horaIni.getHours();
            if(hora.toString().length<2){
                hora = "0"+hora;
            }
            let mins = horaIni.getMinutes();
            if(mins.toString().length<2){
                mins = "0"+mins;
            }
            let segs = horaIni.getSeconds();
            if(segs.toString().length<2){
                segs = "0"+segs;
            }
            horaIni= hora+":"+mins+":"+segs;
            filas += `
                    <tr id="tr${k}">
                        <td>${k}</td>
                        <td>${horaIni}</td>
                        <td>${horafin}</td>
                    </tr>
                     `;
            ctabla.innerHTML = filas;
            newFich(hoy, horaIni)
        }
    });
}

function updateFich(id, horafin){
    URL_API_FICHA = URL_API + "/ficha/" + id.toString() + "-" + horafin;
    let updateData ={}
    updateData={
        horaFin: horafin
    }
    try {
        body = JSON.stringify(updateData);
    } catch (error) {
        console.log(error);
    }
    
        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            axios.patch(URL_API_FICHA, body, config)
            .then(function (response) {
               console.log(response);
               alert('fichaje actualizado en bbdd');
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
            });
        }catch (error) {
            console.log(error);
        }

}

function newFich(hoy, horaIni){
    let fichNuevo = {}
    hoy = new Date().getTime() + 7200000;
    fichNuevo= {
        fecha: hoy,
        horaInicio: horaIni.toString(),
        idUser: userId
    }
    try {
        body = JSON.stringify(fichNuevo);
    } catch (error) {
        console.log(error);
    }
    (async function getNewFich() {
        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            URL_API_FICHA = URL_API + "/ficha"
            await axios.post(URL_API_FICHA, body, config)
                .then(function (response) {
                    console.log(response);
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
}
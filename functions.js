const fs = require('fs');
const { app, dialog } = require('electron').remote; //remote pues está definido en main.js
const electron = require('electron');
const axios = require('axios');
const net = electron.remote.net;
const URL_API = "http://ec2-35-175-173-253.compute-1.amazonaws.com:3000/api";
const URL_API_employee = "http://ec2-35-175-173-253.compute-1.amazonaws.com:3000/api/employee";
const URL_API_signin = "http://ec2-35-175-173-253.compute-1.amazonaws.com:3000/api/login/signin";
let perfil = null;
let tokenUser = null;
let datas = null;
let userId = null;
let ultimaLlamada = null;

//EVENTOS
let btnLogin = document.getElementById("btnLogin");
btnLogin.addEventListener('click', () => {
    let user = document.getElementById("userMail").value;
    let pwdUser = document.getElementById("pwdUser").value;

    if ((user == '' || pwdUser == '') || (user == undefined || pwdUser == undefined)) {
        alert('Debe introducir todos los campos del Login');
        return false;
    }

    let body = { "email": user, "pwd": pwdUser };

    try {
        body = JSON.stringify(body);
    } catch (error) {
        console.log(error);
    }
    let users = [];
    (async function getNames() {
        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                }
            }
            await axios.post(URL_API_signin, body, config)
                .then(function (response) {
                    console.log(response);
                    datas = response;
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                });
            userId = datas.data.userId;
            tokenUser = datas.data.token;
            botonera();
        } catch (error) {
            console.log(error);
        }

    })();
});

//Funciones

/*Cargar Perfil del usuario*/
function getPerfil(userId) {
    axios.get(URL_API_employee + "/" + userId).then(function (response) {
        perfil = response; 
        let principal = document.getElementById("contenedorPrin");
        let perData = `
        <div style="margin-top: 5%; margin-left: 40%;">
        <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="form-control" id="username" disabled>
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" placeholder="Email" id="userMail" disabled>
        </div>
        <div class="form-group">
            <label>Tlf Fijo</label>
            <input type="text" class="form-control" id="userTlf" disabled>
        </div>
        <div class="form-group">
            <label>Tlf Móvil</label>
            <input type="text" class="form-control" id="userTlfM" disabled>
        </div>
        <div class="form-group">
            <label>Fecha de Alta</label>
            <input type="text" class="form-control" id="fecAlta" disabled>
        </div>
        <div class="form-group">
            <strong><label>Roles del usuario</label></strong>
        </div>
        <div class="checkbox" id="editRoles">
            
        </div>
    `
        principal.innerHTML = perData;
        document.getElementById("username").value = perfil.data.name;
        document.getElementById("userMail").value = perfil.data.email;
        document.getElementById("userTlf").value = perfil.data.tlfFijo;
        document.getElementById("userTlfM").value = perfil.data.tlfMovil;
        document.getElementById("fecAlta").value = perfil.data.fechaAlta;
        let rolsUser = new Array();
        rolsUser = perfil.data.roles;
        let rols='';
        if(rolsUser != undefined && rolsUser != ""){
            for (let j=0; j<rolsUser.length; j++){
                if(rolsUser[j] == '6272deabead2c9b95b5be231'){
                    rols +="user";
                } else if(rolsUser[j] == '6272deabead2c9b95b5be230'){
                    rols+="Administrador";
                } else if(rolsUser[j] == '6272deabead2c9b95b5be232'){
                    rols+="Reportes";
                }
            }
        }
        principal = document.getElementById("editRoles");
        let buttons = `
        <label>
        <input type="checkbox" id="chkuser" checked disabled> Usuario
        </label>
        <label>  </label>
        <label>
            <input type="checkbox" id="chkadmin" disabled> Administración
        </label>
        <label>  </label>
        <label>
            <input type="checkbox" id="chkReportes" disabled> Reportes
        </label>
        `
        if(rols.includes("user") && rols.includes("Administrador") && rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin" checked disabled> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes" checked disabled> Reportes
            </label>
            `
        } else if(rols.includes("user") && rols.includes("Administrador") && !rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin" checked disabled> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes" disabled> Reportes
            </label>
            `
        } else if(rols.includes("user") && !rols.includes("Administrador") && rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin" disabled> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes" checked disabled> Reportes
            </label>
            `
        }
        
        principal.innerHTML = buttons;
    });

} 

function getTareas(userId) {
    axios.get(URL_API + "/tareas").then(function (response) {
        perfil = response; 
        let tareas = perfil.data;
        tareasUserDesktop(tareas, userId);
    });

}

function getReportes(){
    let principal = document.getElementById("contenedorPrin");
    let perData = `
        <div class="pane-group">
            <div class="pane-sm sidebar">
                <span class="icon icon-print" style="margin-top: 5%; margin-left: 10%;"><strong>  REPORTES </strong></span>
                <button class="btn btn-large btn-positive" id="btnRUsers" style="margin-top: 5%; margin-left: 5%;">Reporte de usuarios </button>
                <button class="btn btn-large btn-positive" id="btnRFich" style="margin-top: 5%; margin-left: 5%;">Reporte de fichaje </button>
                <div class="form-group">
                <label>Fecha para el reporte</label>
                <input type="date" class="form-control" id="fechaFichajeR">
                </div>
            </div>
            <div class="pane" id="reporteGenerado">
            </div>    
        </div>
    `
    principal.innerHTML = perData;
    let reportUsersBtn = document.getElementById("btnRUsers");
    let fechaFichajeR = document.getElementById("fechaFichajeR");
    let btnRFich = document.getElementById("btnRFich");
    reportUsersBtn.addEventListener('click', () => {
        getAreasR();
    });
    btnRFich.addEventListener('click', () => {
        if(fechaFichajeR.value != ''){
            FichajeReport(fechaFichajeR.value);
        } else {
            alert('seleccione una fecha para el reporte');
        }
    });
}

function getUsersTable(){
    getAreas();
}

function getFichaje(){
    let principal = document.getElementById("contenedorPrin");
    let formFichaje = `
    <div class="pane-group">
        <div class="pane-sm sidebar">
            <h3>FICHAJE DIARIO</h3>
                <div class="form-group">
                    <label>Fecha Actual </label>
                    <input type="date" class="form-control" placeholder="Fecha actual" id="fechaFichaje" readonly>
                </div>
                <div class="form-group" style="margin-left: 20%;">
                    <Button class="btn btn-success" id="addFichajesUsuario">
                        <span class="icon icon-hourglass icon-text"></span>
                        Fichar
                    </Button>
                    
                </div>
        </div>
        <div class="pane" id="Tabla">
        </div>
    </div>
    `
    principal.innerHTML = formFichaje;
    var fecha = new Date();
    var month = fecha.getMonth();
    var year = fecha.getFullYear();
    var day = fecha.getDate();
    month++;
    if(month<10){
        month= '0' + month;
    }
    document.getElementById('fechaFichaje').value = year + '-' + month + '-' + day;
    let addFichajesUsuario = document.getElementById("addFichajesUsuario");
    addFichajesUsuario.addEventListener('click', () => {
        fichar();
    });
    getFicha();
}



/*Botonera superior*/
function botonera() {
    let botonera = document.getElementById("botonera");
    let botones = `
    <button class="btn btn-default" id="perfilBtn">
                        Perfil
                    </button>
                    <button class="btn btn-default" id="FicharBtn">
                        Fichar
                    </button>
                    <button class="btn btn-default" id="tareasBtn">
                        Tareas
                    </button>
                    <button class="btn btn-default" id="administracionBtn">
                        Listado de usuarios
                    </button>
                    <button class="btn btn-default" id="NewUserBtn">
                        Nuevo de usuario
                    </button>
                    <button class="btn btn-default" id="reportesBtn">
                        Reportes
                    </button>
                    <button class="btn btn-negative pull-right" id="exitBtn">
                        <span class="icon icon-logout icon-text"></span>
                        Salir
                    </button>
    `
    botonera.innerHTML = botones;
    let principal = document.getElementById("contenedorPrin");
    let perfilBtn = document.getElementById("perfilBtn");
    let tareasBtn = document.getElementById("tareasBtn");
    let fichajeBtn = document.getElementById("FicharBtn");
    let adminBtn = document.getElementById("administracionBtn");
    let NewUserBtn = document.getElementById("NewUserBtn");
    let reportesBtn = document.getElementById("reportesBtn");
    let exitBtn = document.getElementById("exitBtn");
    exitBtn.addEventListener('click', () => {
        app.exit();
    });
    reportesBtn.addEventListener('click', () => {
        getReportes(userId);
    });
    adminBtn.addEventListener('click', () => {
        getUsersTable();
    });
    NewUserBtn.addEventListener('click', () => {
        getNewUser();
    });
    perfilBtn.addEventListener('click', () => {
        getPerfil(userId);
    });
    tareasBtn.addEventListener('click', () =>{
        getTareas(userId);
    });
    fichajeBtn.addEventListener('click', () =>{
        getFichaje(userId);
    });
    principal.innerHTML = '';
    getPerfil(userId);
}

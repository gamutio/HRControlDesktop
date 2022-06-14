let AREAS = new Array();
let usuarios = new Array();
let user = new Array();
function getAreas() {
    let URL_API_AREAS = URL_API + "/areas";
    axios.get(URL_API_AREAS).then(function (response) {
        let area = response;
        AREAS = area.data;
        console.log(AREAS);
        getUsuarios();
    });
    
}

/*EditarUsuario*/
function editUser(id){

    axios.get(URL_API_employee + "/" + id).then(function (response) {
        user = response; 
        let principal = document.getElementById("contenedorPrin");
        let perData = `
        <div style="margin-top: 5%; margin-left: 35%;">
        <div class="form-group">
            <label>Nombre</label>
            <input type="text" class="form-control" id="username">
            <input type="hidden" class="form-control" id="_id">
        </div>
        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" placeholder="Email" id="userMail">
        </div>
        <div class="form-group">
            <label>Password (si no desea cambiar el password del usuario deje el campo en blanco)</label>
            <input type="password" class="form-control" placeholder="pwd" id="pwd">
        </div>
        <div class="form-group">
            <label>Tlf Fijo</label>
            <input type="text" class="form-control" id="userTlf">
        </div>
        <div class="form-group">
            <label>Tlf Móvil</label>
            <input type="text" class="form-control" id="userTlfM">
        </div>
        <div class="form-group">
            <label>Fecha de Alta</label>
            <input type="text" class="form-control" id="fecAlta" disabled>
        </div>
        <div class="form-group">
            <label>Área</label>
            <select class="form-control" id="areaSelect">
                <option>Administración</option>
                <option>Sistemas</option>
            </select>
        </div>
        <div class="form-group">
            <strong><label>Roles del usuario</label></strong>
        </div>
        <div class="checkbox" id="editRoles">
            
        </div>
        <button id="saveUser"><span class="icon icon-floppy icon-text"></span></button>
    `
        principal.innerHTML = perData;
        document.getElementById("username").value = user.data.name;
        document.getElementById("_id").value = user.data._id;
        document.getElementById("userMail").value = user.data.email;
        document.getElementById("userTlf").value = user.data.tlfFijo;
        document.getElementById("userTlfM").value = user.data.tlfMovil;
        document.getElementById("fecAlta").value = user.data.fechaAlta;
        let area = user.data.area;
        if(area[0] == '6272e1a150d590e492d50aa0'){
            document.getElementById("areaSelect").value = 'Sistemas';
        } else {
            document.getElementById("areaSelect").value  = 'Administración';
        }


        let rolsUser = new Array();
        rolsUser = user.data.roles;
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
            <input type="checkbox" id="chkadmin"> Administración
        </label>
        <label>  </label>
        <label>
            <input type="checkbox" id="chkReportes"> Reportes
        </label>
        `
        if(rols.includes("user") && rols.includes("Administrador") && rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin" checked> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes" checked> Reportes
            </label>
            `
        } else if(rols.includes("user") && rols.includes("Administrador") && !rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin" checked> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes"> Reportes
            </label>
            `
        } else if(rols.includes("user") && !rols.includes("Administrador") && rols.includes("Reportes")){
            buttons = `
            <label>
            <input type="checkbox" id="chkuser" checked disabled> Usuario
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkadmin"> Administración
            </label>
            <label>  </label>
            <label>
                <input type="checkbox" id="chkReportes" checked> Reportes
            </label>
            `
        }
        
        principal.innerHTML = buttons;
        document.getElementById("username").focus();
        let saveUser = document.getElementById("saveUser");
        saveUser.addEventListener('click', () => {
            updateUser();
        });
    });

}


/*Editar usuario*/
function updateUser(){
    let name = document.getElementById("username").value;
    let idUs = document.getElementById("_id").value;
    let mailU = document.getElementById("userMail").value;
    let fijo = document.getElementById("userTlf").value;
    let mov = document.getElementById("userTlfM").value;
    let pwd = document.getElementById("pwd").value;
    let chkuser= document.getElementById("chkuser").checked;
    let chkadmin= document.getElementById("chkadmin").checked;
    let chkReportes= document.getElementById("chkReportes").checked;
    let area = document.getElementById('areaSelect').value;
    if(area == 'Sistemas'){
        area = '6272e1a150d590e492d50aa0';
    } else {
        area = '6272e1a150d590e492d50a9f';
    }
    let rolesAct = new Array();
    if(chkuser && chkadmin && chkReportes){
        rolesAct.push('6272deabead2c9b95b5be230');
        rolesAct.push('6272deabead2c9b95b5be231');
        rolesAct.push('6272deabead2c9b95b5be232');
    } else if(chkuser && chkadmin){
        rolesAct.push('6272deabead2c9b95b5be230');
        rolesAct.push('6272deabead2c9b95b5be231');
    } else if(chkuser && chkReportes){
        rolesAct.push('6272deabead2c9b95b5be231');
        rolesAct.push('6272deabead2c9b95b5be232');
    } else {
        rolesAct.push('6272deabead2c9b95b5be231');
    }
    let body;
    console.log(rolesAct);
    if(pwd != ''){
        body = { "name": name, "pwd": pwd , "tlfFijo": fijo, "email": mailU, "tlfMovil": mov, roles: rolesAct, area: area};
    } else {
        body = { "name": name, "tlfFijo": fijo, "email": mailU, "tlfMovil": mov, roles: rolesAct, area: area};
    }

    try {
        body = JSON.stringify(body);
    } catch (error) {
        console.log(error);
    }

    (async function updateU() {
        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token" : tokenUser
                }
            }
            let datas;
            let url_editUser = URL_API_employee + "/" + idUs;
            await axios.put(url_editUser, body, config)
                .then(function (response) {
                    console.log(response);
                    datas = response;
                    alert('usuario actualizado');
                })
                .catch(function (error) {
                    alert("responde: " + error.response.data.message);
                    console.log(error);
                })
                .then(function () {
                });
            
        } catch (error) {
            console.log(error);
        }

    })();

}

function newUser(){
    let name = document.getElementById("username").value;
    let mailU = document.getElementById("userMail").value;
    let fijo = document.getElementById("userTlf").value;
    let mov = document.getElementById("userTlfM").value;
    let pwd = document.getElementById("pwd").value;
    let chkuser= document.getElementById("chkuser").checked;
    let chkadmin= document.getElementById("chkadmin").checked;
    let chkReportes= document.getElementById("chkReportes").checked;
    let area = document.getElementById('areaSelect').value;

    if(isNaN(fijo) || isNaN(mov)){
        alert('Los teléfonos son campos numéricos');
        return false;
    } else if(name == '' || mailU == '' || fijo == '' || mov == '' || pwd == '' || area == ''){
        alert('Los campos marcados con * son requeridos');
        return false;
    }
    if(area == 'Sistemas'){
        area = '6272e1a150d590e492d50aa0';
    } else {
        area = '6272e1a150d590e492d50a9f';
    }
    let rolesAct = new Array();
    if(chkuser && chkadmin && chkReportes){
        rolesAct.push('6272deabead2c9b95b5be230');
        rolesAct.push('6272deabead2c9b95b5be231');
        rolesAct.push('6272deabead2c9b95b5be232');
    } else if(chkuser && chkadmin){
        rolesAct.push('6272deabead2c9b95b5be230');
        rolesAct.push('6272deabead2c9b95b5be231');
    } else if(chkuser && chkReportes){
        rolesAct.push('6272deabead2c9b95b5be231');
        rolesAct.push('6272deabead2c9b95b5be232');
    } else {
        rolesAct.push('6272deabead2c9b95b5be231');
    }
    let body;
    console.log(rolesAct);
    if(pwd != ''){
        body = { "name": name, "pwd": pwd , "tlfFijo": parseInt(fijo), "email": mailU, "tlfMovil": parseInt(mov), roles: rolesAct, area: area};
    } else {
        body = { "name": name, "tlfFijo":  parseInt(fijo), "email": mailU, "tlfMovil":  parseInt(mov), roles: rolesAct, area: area};
    }

    try {
        body = JSON.stringify(body);
    } catch (error) {
        console.log(error);
    }

    (async function newU() {
        try {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token" : tokenUser
                }
            }
            let datas;
            let url_New_User = "http://ec2-35-175-173-253.compute-1.amazonaws.com:3000/api/login/signup";
            await axios.post(url_New_User, body, config)
                .then(function (response) {
                    console.log(response);
                    datas = response;
                    alert('usuario creado');
                })
                .catch(function (error) {
                    alert("responde: " + error.response.data.message);
                    console.log(error);
                })
                .then(function () {
                });
            
        } catch (error) {
            console.log(error);
        }

    })();

}


/*Cargar listado de usuarios*/
function getUsuarios() {
    axios.get(URL_API_employee).then(function (response) {
        let perfiles = response; 
        
        usuarios = perfiles.data;
        let principal = document.getElementById("contenedorPrin");
        let tableUsers = `
            <!-- tabla de usuarios-->
            <table class="table-striped">
                <thead>
                    <tr>
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
        `
        principal.innerHTML = tableUsers;
        let ctabla = document.getElementById("cTabla");
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
                    <td id='name_${i}'>${usuarios[i].name}</td>
                    <td id='email_${i}'>${usuarios[i].email}</td>
                    <td id='tlfFijo_${i}'>${usuarios[i].tlfFijo}</td>
                    <td id='tlfMovil_${i}'>${usuarios[i].tlfMovil}</td>
                    <td>${usuarios[i].fechaAlta}</td>
                    <td>${usuarios[i].area}</td>
                    <td>${usuarios[i].roles}</td>
                    <td><button id="${usuarios[i]._id}"><span class="icon icon-pencil"></span></button></td>
                </tr> `;
        }
        ctabla.innerHTML = filas;
        //asgino el evento del botón de editar
        for(let i=0; i < usuarios.length; i++){
            asignarListener(i);
        }
    });
}


function asignarListener(i){
    const btnEditUser = document.getElementById(`${usuarios[i]._id}`);
    btnEditUser.addEventListener('click', () => {
        editUser(`${usuarios[i]._id}`);
    });
}

function getNewUser(){

    let principal = document.getElementById("contenedorPrin");
    let perData = `
    <div style="margin-top: 5%; margin-left: 35%;">
    <div class="form-group">
        <label>Nombre *</label>
        <input type="text" class="form-control" id="username">
        <input type="hidden" class="form-control" id="_id">
    </div>
    <div class="form-group">
        <label>Email *</label>
        <input type="email" class="form-control" placeholder="Email" id="userMail">
    </div>
    <div class="form-group">
        <label>Password  *</label>
        <input type="password" class="form-control" placeholder="pwd" id="pwd">
    </div>
    <div class="form-group">
        <label>Tlf Fijo *</label>
        <input type="text" class="form-control" id="userTlf">
    </div>
    <div class="form-group">
        <label>Tlf Móvil *</label>
        <input type="text" class="form-control" id="userTlfM">
    </div>
    <div class="form-group">
        <label>Área *</label>
        <select class="form-control" id="areaSelect">
            <option>Administración</option>
            <option>Sistemas</option>
        </select>
    </div>
    <div class="form-group">
        <strong><label>Roles del usuario</label></strong>
    </div>
    <div class="checkbox" id="editRoles">
    <label>
    <input type="checkbox" id="chkuser" checked disabled> Usuario
    </label>
    <label>  </label>
    <label>
        <input type="checkbox" id="chkadmin"> Administración
    </label>
    <label>  </label>
    <label>
        <input type="checkbox" id="chkReportes"> Reportes
    </label>
    </div>
    <button id="saveUser"><span class="icon icon-floppy icon-text">Nuevo Usuario</span></button>
`
    principal.innerHTML = perData;
    document.getElementById("username").focus();
    let saveUser = document.getElementById("saveUser");
    let pass = document.getElementById('pwd');
    pass.addEventListener('change', () => {
        if(!isNaN(pass.value)){
            alert('La contraseña no puede ser un número');
            return false;
        } else if(!(pass.value.includes('1') || pass.value.includes('2') || pass.value.includes('3') || pass.value.includes('4') || pass.value.includes('5')
                    || pass.value.includes('6') || pass.value.includes('7') || pass.value.includes('8') || pass.value.includes('9') || pass.value.includes('0'))){
                        alert('La contraseña debe contener números y letras');
                        return false;
                    }
    });
    saveUser.addEventListener('click', () => {
        newUser();
    });
}

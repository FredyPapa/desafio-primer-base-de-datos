const socket = io();
// Formulario de registro de productos
let frmProducto = document.getElementById("frmProducto");
frmProducto.addEventListener("submit", e=>{
    e.preventDefault();
    const dataProducto = {
        title: e.target[0].value,
        price: e.target[1].value,
        thumbnail: e.target[2].value,
    }
    socket.emit("addProducto", dataProducto);
    limpiarControles();
});

function limpiarControles(){
    title.value="";
    price.value="";
    thumbnail.value="";
}

// Chat
let usuario = null;
let form_data_user = document.getElementById("frmUser");
form_data_user.addEventListener("submit", e=>{
    e.preventDefault();
    usuario = {
        correo: e.target[0].value
    }
    if(usuario.correo == ""){
        window.location.reload();
    }
    socket.emit("addUser", usuario);
    iniciarChat.style.display="none";
    divMensaje.style.display="";
});

let button = document.getElementById("btnEnviarMensaje");
button.addEventListener("click", e =>{
    const hoy = new Date();
    const fecha = hoy.getDate() + '-' + ( hoy.getMonth() + 1 ) + '-' + hoy.getFullYear();
    const hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
    const fechaYHora = fecha + ' ' + hora;
    let sendMessagge = {
        ...usuario,
        fechaYHora,
        mensaje: mensaje.value
    }
    socket.emit("mensaje", sendMessagge);
    mensaje.value = "";
})

//Al conectarse
socket.on("connect", (data)=>{
    console.log("Conectado");
    lblOffline.style.display = "none";
    lblOnline.style.display = "";
});

//Al desconectarse
socket.on("disconnect", ()=>{
    console.log("Desconectado del servidor");
    //
    lblOffline.style.display = "";
    lblOnline.style.display = "none";
});

//Cuando el servidor envía la data actualizada de la tabla de productos
socket.on("data-tabla",(payload)=>{
    let contenido="";
    if(payload.length){
        for (const producto of payload) {
            contenido+=`
            <tr>
                <td align="center">${producto.id}</td>
                <td>${producto.title}</td>
                <td align="right">${producto.price}</td>
                <td align="center"><img src="${producto.thumbnail}" width="50px" height="50px"/></td>
            </tr>
            `;
        }
    }else{
        contenido=`
            <tr>
                <td align="center" colspan="4"><h2>No se encontraro productos</h2></td>
            </tr>
        `;
    }
    let tbProductos = document.querySelector("#tbProductos");
    tbProductos.innerHTML = contenido;
});

//Cuando se envía un mensaje por el chat
socket.on("listenserver", data =>{
    //console.log("Recibiendo..", data);
    let inner = ``;
    data.forEach(element => {
        inner += `<b style="color:#00f;">${element.correo}</b> <span style="color:brown;">[${element.fechaYHora}]</span>: <i style="color:#090;">${element.mensaje}</i></br>`;
    });
    divChat.innerHTML = inner;
});
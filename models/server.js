//Importaciones de terceros
let express = require("express");
let hbs = require("express-handlebars");
let cors = require("cors");

//Clase servidor
class server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require("http").createServer(this.app);
        this.io = require("socket.io")(this.server);
        this.productosPath = "/productos";
        //Middlewares
        this.middlewares();
        //Rutas de mi aplicación
        this.routes();
        //Handlebars
        this.app.engine("handlebars",hbs.engine());
        this.app.set("views","views/hbs");
        this.app.set("view engine", "handlebars");
        //
        this.app.get("/",(req,res,next)=>{
            res.render("../index", {});
        });
        //Sockets
        this.sockets();
        //
        this.usuarios = [];
        this.mensajes = [];
    }

    middlewares(){
        //CORS
        this.app.use(cors("*"));
        //Lectura y parseo del body
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}));
        //Directorio público
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.productosPath,require("../routes/productos"));
    }

    sockets(){
        let Contenedor = require("../controllers/contenedor");
        let contenedor = new Contenedor("productos");
        let contenedorChat = new Contenedor("mensajes");
        //Al conectarse
        this.io.on("connection",async(socket) => {
            //Al conectarse
            console.log("Cliente conectado");
            //Enviamos la información de los productos
            const data = await contenedor.getAll();
            socket.emit("data-tabla",data);
            //Enviamos la información de los mensajes de chat
            this.io.sockets.emit('listenserver', this.mensajes);
            //Cuando se registra un producto
            socket.on("addProducto", async dataProducto =>{
                await contenedor.save(dataProducto);
                const data = await contenedor.getAll();
                this.io.sockets.emit("data-tabla",data);
                //socket.emit("data-tabla",data);
            });
            //Cuando un usuario inicia el chat
            socket.on("addUser", data =>{
                if(this.usuarios.length > 0){
                    let verifivation_user = false;
                    this.usuarios = this.usuarios.map(usuario =>{
                        if(usuario.email == data.email){
                            verifivation_user = true;
                            return {
                                id: socket.id,
                                ...data,
                                active: true
                            };
                        }else{
                            return usuario;
                        }
                    });
                    if(!verifivation_user){
                        this.usuarios.push({
                            id : socket.id,
                            ...data,
                            active:true
                        });
                    }

                }else{
                    this.usuarios.push({
                        id : socket.id,
                        ...data,
                        active:true
                    });
                }                    
                //this.io.sockets.emit('loadUsers', this.usuarios);
            });
            //Cuando un usuario envía un mensaje por el chat
            socket.on("mensaje", async data =>{
                this.mensajes.push(data);
                await contenedorChat.saveMensaje(data);
                this.io.sockets.emit('listenserver', this.mensajes);
            });
        });
    }

    listen(){
        this.server.listen(this.port,()=>{
            console.log(`Servidor corriendo en http://localhost:${this.port}`);
        });
    }
}

//Exportamos la clase
module.exports = server;
//const fs = require("fs");
const db_knex_mysql = require("../config/db-mysql");
const db_knex_sqlite3 = require("../config/db-sqlite3");
const db_mysql = db_knex_mysql.client;
const db_sqlite3 = db_knex_sqlite3.client;

class Contenedor{
    constructor(tabla){
        this.tabla = tabla;
    }
    //Cargar elementos al arreglo de Productos
    async loadArray(){
        //Obtenemos la información del archivo
        if(fs.existsSync(this.url)){
            const contenido = await fs.promises.readFile(this.url,'utf-8');
            //Lo almacenamos en el arreglo de Productos
            this.arregloProductos=(JSON.parse(contenido));
        }
    }
    //Crear/Agregar contenido al archivo
    async save(data){
        try {
            //Validamos si existe la tabla
            let existe = await db_mysql.schema.hasTable(this.tabla);
            //Si no existe Creamos la tabla
            if(!existe){
                await db_mysql.schema.createTable(this.tabla,table=>{
                    table.increments("id").primary(),
                    table.string("title"),
                    table.string("price"),
                    table.string("thumbnail")
                });
            }
            //Insertamos el registro
            return await db_mysql.from(this.tabla).insert(data);
        } catch (error) {
            console.log(error);
        }
    }

    //Leer el archivo y devolver todos los objetos
    async getAll(){
        try {
            //Validamos si existe la tabla
            let existe = await db_mysql.schema.hasTable(this.tabla);
            //Si no existe Creamos la tabla
            if(!existe){
                await db_mysql.schema.createTable(this.tabla,table=>{
                    table.increments("id").primary(),
                    table.string("title"),
                    table.string("price"),
                    table.string("thumbnail")
                });
            }
            //Listamos todos los registros
            return await db_mysql.from(this.tabla);
        } catch (error) {
            console.log(error);
        }
    }

    //Crear/Agregar mensaje de chat
    async saveMensaje(data){
        try {
            //Validamos si existe la tabla
            let existe = await db_sqlite3.schema.hasTable(this.tabla);
            //Si no existe Creamos la tabla
            if(!existe){
                await db_sqlite3.schema.createTable(this.tabla,table=>{
                    table.string("correo"),
                    table.string("fechaYHora"),
                    table.string("mensaje")
                });
            }
            //Insertamos el registro
            return await db_sqlite3.from(this.tabla).insert(data);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = Contenedor;

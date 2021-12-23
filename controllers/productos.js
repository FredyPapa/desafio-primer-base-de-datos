const {response, request} = require("express");
//
let Contenedor = require("./contenedor");
let contenedor = new Contenedor("productos");


const productosGet = async(req=request,res=response,next)=>{
    //res.send(await contenedor.getAll());
    res.render("../listado", {data:await contenedor.getAll()});
}

const productosPost = async(req=request,res=response,next)=>{
    const producto = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail
    };
    //res.json(await contenedor.save(producto));
    res.render("../index", await contenedor.save(producto));
}

module.exports = {
    productosGet,
    productosPost
}
const {Router} = require("express");

const {productosGet, productosPost} = require("../controllers/productos");

const router = Router();

//Rutas
router.get("/",productosGet);
router.post("/",productosPost);

module.exports = router;
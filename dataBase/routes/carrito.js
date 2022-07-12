const routes = require("express").Router();
const moduleCarrito = require("../helpers/carritoHelpers");
//const moduleContenedor = require("../helpers/contenedor");
const carritoConstructor = new moduleCarrito.contenedorCarrito("carrito.txt");

let cartId;

//Me permite listar todos los productos guardados en el carrito
routes.get("/:id/productos", async (req, res) => {
	let carrito = carritoConstructor
		.getAllProducts(req.params.id)
		.then(async (data) => {
			let products = await data;
			res.send(products);
		});
});

//Crea un carrito y devuelve su id
routes.post("/", async (req, res) => {
	let newCart = await carritoConstructor.createCart();
	cartId = new res.send(newCart);
});

//Para incorporar productos al carrito por su id de producto
routes.post("/:id/productos", (req, res) => {
	const cartId = req.params.id;
	const productID = req.body.id;

	let carrito = carritoConstructor.addToCart(cartId, productID);

	res.send(carrito);
});

//Vacía un carrito y lo elimina.
routes.delete("/:id", async (req, res) => {
	let cartDeleted = await carritoConstructor.deleteCart(req.params.id);
});

//Eliminar un producto del carrito por su id de carrito y de producto

routes.delete("/:id/productos/:id_prod", async (req, res) => {
	const carritoID = req.params.id;
	const productoID = req.params.id_prod;

	let newProductList = await carritoConstructor.deleteProduct(
		carritoID,
		productoID
	);

	console.log(newProductList);
	res.send(newProductList);
});

module.exports = routes;

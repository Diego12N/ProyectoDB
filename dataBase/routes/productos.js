const routes = require("express").Router();
const {options} = require("../data/configDB");
const moduleContenedor = require("../helpers/contenedor");
const contenedor = new moduleContenedor.contenedor(
	options.mariaDB,
	"productos"
);
const {
	getProducts,
	saveProducts,
	modifyProduct,
} = require("../helpers/routesHelpers");

const userAdmin = true;

function authorizedAdmin(req, res, next) {
	if (!userAdmin) {
		return res.json({
			error: -1,
			description: `route ${req.originalUrl} metodo ${req.method} no autorizado`,
		});
	}

	next();
}

routes.get("/:id?", async (req, res) => {
	// ? indica que el parametro es condicional, por lo que puede venir o no.
	const id = parseInt(req.params.id);
	const products = await getProducts(id);
	res.send(products);
});

routes.post("/", authorizedAdmin, (req, res) => {
	let newProduct = saveProducts(req);

	res.send(newProduct);
});

routes.put("/:id", authorizedAdmin, (req, res) => {
	modifyProduct(req, res);
});

routes.delete("/:id", authorizedAdmin, async (req, res) => {
	const id = parseInt(req.params.id);

	const data = await contenedor.deleteById(id);

	res.send(data);
});

routes.delete("/", authorizedAdmin, async (req, res) => {
	const data = await contenedor.deleteAll();

	res.send(data);
});

module.exports = routes;

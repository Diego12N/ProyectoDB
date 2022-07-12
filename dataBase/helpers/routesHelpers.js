const moduleContenedor = require("./contenedor");
const {options} = require("../data/configDB");
const contenedor = new moduleContenedor.contenedor(
	options.mariaDB,
	"productos"
);
const {v4: uuidv4} = require("uuid");
const {version: uuidVersion} = require("uuid");
const {validate: uuidValidate} = require("uuid");

function uuidValidateV4(uuid) {
	return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

async function getProducts(id) {
	if (!uuidValidateV4(id)) {
		const data = await contenedor.getAll();
		return data;
	} else {
		const data = await contenedor.getById(id);
		return data;
	}
}

async function getCartProducts(id) {
	if (!uuidValidateV4(id)) {
		return {};
	} else {
		const data = await contenedor.getById(id);
		return data;
	}
}

async function saveProducts(req) {
	const id = uuidv4();
	const {nombre, descripcion, codigo, foto, precio, stock} = req.body;

	const date = new Date();
	const timestamp = date.toLocaleString();

	if (nombre && descripcion && codigo && foto && precio && stock) {
		const newProduct = {
			nombre,
			descripcion,
			codigo,
			foto,
			precio,
			stock,
			timestamp,
			id,
		};

		await contenedor.save(newProduct);

		console.log(newProduct);
		return newProduct;
	} else {
		console.log("Existe al menos un campo vacio");
	}
}

async function modifyProduct(req, res) {
	const {nombre, descripcion, codigo, foto, precio, stock} = req.body;
	const id = req.params.id;

	const newProduct = {
		nombre,
		descripcion,
		codigo,
		foto,
		precio,
		stock,
	};

	await contenedor.modify(newProduct, id);

	return res.send(newProduct);
}

module.exports = {
	getProducts,
	getCartProducts,
	saveProducts,
	modifyProduct,
};

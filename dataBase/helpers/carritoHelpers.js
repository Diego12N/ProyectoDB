const fs = require("fs/promises");
const {getProducts, getCartProducts} = require("./routesHelpers");
const {v4: uuidv4} = require("uuid");

class Carrito {
	constructor(file) {
		this.file = file;
	}

	createCart() {
		return fs
			.readFile(`./data/${this.file}`, "utf-8")
			.then((res) => {
				const listaCarritos = JSON.parse(res);
				let d = new Date();
				let date = `${d.getDate()}/${1 + d.getMonth()}/${d.getFullYear()}`;
				let idCarrito = uuidv4();
				let carrito = {
					id: idCarrito,
					timestamp: date,
					productos: [],
				};

				listaCarritos.push(carrito);

				fs.writeFile(`./data/${this.file}`, JSON.stringify(listaCarritos));
				return idCarrito;
			})
			.catch(() => "No se pudo acceder");
	}

	addToCart(cartID, productID) {
		return fs
			.readFile(`./data/${this.file}`, "utf-8")
			.then(async (res) => {
				const listaCarritos = JSON.parse(res);

				const carrito = listaCarritos.find((elem) => {
					return elem.id == cartID;
				});

				carrito.productos.push(productID);

				let listUpdated = listaCarritos.map((cart) => {
					if (cart.id === carrito.id) {
						return {
							...cart,
							...carrito,
						};
					}

					return cart;
				});

				fs.writeFile(`./data/${this.file}`, JSON.stringify(listUpdated));

				return carrito;
			})
			.catch(() => []);
	}

	getAllProducts(id) {
		return fs
			.readFile(`./data/${this.file}`, "utf-8")
			.then(async (res) => {
				const listaCarritos = JSON.parse(res);

				const carrito = listaCarritos.find((elem) => {
					return elem.id == id;
				});

				const productos = await Promise.all(
					carrito.productos.map(async (id) => {
						return await getProducts(id);
					})
				);

				return productos;
				/* return productos ?? []; */ //El elemento a la izquierda es null o undefined retorno el valor a la derecha.
			})
			.catch(() => []);
	}

	deleteCart(id) {
		fs.readFile(`./data/${this.file}`, "utf-8").then((res) => {
			const listaCarritos = JSON.parse(res);
			if (listaCarritos.length > 0) {
				const newlist = listaCarritos.filter((elem) => {
					return elem.id != id;
				});

				fs.writeFile(`./data/${this.file}`, JSON.stringify(newlist));
			} else {
				return "No hay productos en tu carrito";
			}
		});
	}

	async deleteProduct(cartID, productID) {
		return fs.readFile(`./data/${this.file}`, "utf-8").then(async (res) => {
			let listaCarritos = JSON.parse(res);

			const carrito = listaCarritos.find((elem) => {
				return elem.id == cartID;
			});

			if (!carrito) {
				return {error: "No existe el carrito"};
			}

			const producto = carrito.productos.find((id) => {
				return id == productID;
			});

			if (!producto) {
				return {error: "No existe el producto"};
			}

			const nuevaListaProductosID = carrito.productos.filter((id) => {
				return id != productID;
			});

			carrito.productos = nuevaListaProductosID;

			let listUpdated = await listaCarritos.map((cart) => {
				if (cart.id === carrito.id) {
					return {
						...cart,
						...carrito,
					};
				}

				return cart;
			});

			console.log("listUpdated", listUpdated);
			console.log("carrito2.0", carrito);

			await fs.writeFile(`./data/${this.file}`, JSON.stringify(listUpdated));

			const listaProductosActualizada = await Promise.all(
				carrito.productos.map(async (id) => {
					console.log("ID", id);
					return await getCartProducts(id);
				})
			);

			return listaProductosActualizada.filter((elem) => elem.id);
		});
	}
}

module.exports.contenedorCarrito = Carrito;

/* import knex from "knex"; */
const knex = require("knex");
const fs = require("fs/promises");
const {v4: uuidv4} = require("uuid");

class Contenedor {
	constructor(options, table) {
		this.knex = knex(options);
		this.table = table;
	}

	async getAll() {
		try {
			const allProducts = await this.knex.from(this.table).select("*");
			return allProducts;
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	async getById(id) {
		try {
			const product = await this.knex
				.from(this.table)
				.select("*")
				.where("id", id);
			return product;
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	async save(obj) {
		try {
			const newproduct = await this.knex(this.table).insert(obj);
			return newproduct;
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	async modify(product, id) {
		const {nombre, descripcion, codigo, foto, precio, stock} = product;

		try {
			await this.knex
				.from("productos")
				.where("id", id)
				.update({nombre, descripcion, codigo, foto, precio, stock});
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	async deleteById(id) {
		try {
			const product = await this.knex
				.from(this.table)
				.where("id", id)
				.select("*");

			const productDeleted = await this.knex
				.from(this.table)
				.where("id", id)
				.del();

			return product;
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}

	async deleteAll() {
		try {
			const products = await this.knex.from(this.table).select("*");
			await this.knex.from(this.table).del();
			return products;
		} catch (error) {
			throw new Error(`Error: ${error}`);
		}
	}
}

module.exports.contenedor = Contenedor;

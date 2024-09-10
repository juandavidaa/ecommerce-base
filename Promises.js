import db from "./db/db-promises.js";

export async function handlePromiseRequest(limite) {
	let response;
	try {
		const [usuarios] = await db.query(`SELECT * FROM users LIMIT ?`, [
			parseInt(limite),
		]);

		response = `
			<html>
				<head><title>Usuarios (Promesas)</title></head>
				<body>
					<h1>Cargando Usuarios</h1>
					<table border="1">
						<tr>
							<th>ID</th>
							<th>Nombre</th>
							<th>Email</th>
							<th>Edad</th>
						</tr>`;

		let i = 1;
		for (const usuario of usuarios) {
			response += `
				<tr>
					<td>${i++}</td>
					<td>${usuario.name}</td>
					<td>${usuario.email}</td>
					<td>${usuario.age}</td>
				</tr>`;

			if (i >= 100) {
				break;
			}
		}

		response += "</table></body></html>";
		return response;
	} catch (error) {
		console.error("Error en la consulta de usuarios con Promesas:", error);
		response = "<p>Error al cargar los usuarios.</p>";
		return response;
	}
}

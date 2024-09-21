
import db from "../db/db-promises.js";
import logger from '../utils/logger.js';
import { Response } from "../utils/response.js";

export async function handlePromiseRequest(limit) {
	let users = [];
	try {
		const [usersData] = await db.query(`SELECT * FROM users LIMIT ?`, [
			parseInt(limit),
		]);

	
		let i = 1;
		for (const user of usersData) {
            i++;
			users.push(user);

			if (i > 100) {
				break;
			}
		}

		
		Response.json({users, length: usersData.length})
	} catch (error) {
		logger.error("Error promise query users:", error.message);
        Response.error(`Error: ${error.message}`);
	}
}

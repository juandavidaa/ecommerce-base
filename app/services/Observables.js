import { Observable } from "rxjs";
import db from "../db/db-streams.js";

//Utils
import logger from '../utils/logger.js';
import { Response } from "../utils/response.js";
import { redisClient } from "../utils/redisClient.js";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

/**
 * handleUsers
 * @param {*} limit 
 * @returns 
 */
export async function handleUsers(limit) {
    if(process.env.REDIS_ENABLE === "true")
    {
        const cacheKey = `observables:users:${limit}`;

        const cachedResponse = await redisClient.get(cacheKey);
    
        if (cachedResponse) {
            logger.info(`Response get from caché: ${limit}`);
            Response.json({users: cachedResponse, length: cachedResponse.length});
            return;
        }else {
            logger.info(`No se encontró caché para el límite: ${limit}`);
        }
    }    
    

    let users = [];

    const streamUsers = (limit) => {
        return new Observable((subscriber) => {
            const query = db.query(`SELECT * FROM users LIMIT ?`, [
                parseInt(limit),
            ]);
            const stream = query.stream();

            stream.on("data", (row) => {
                subscriber.next(row);
            });

            stream.on("end", () => {
                subscriber.complete();
            });

            stream.on("error", (err) => {
                subscriber.error(err);
            });

            return () => {
                stream.destroy(); 
            };
        });
    };

    const observable = streamUsers(limit);
    let count = 0;

    const subscription = observable.subscribe({
        next: async(user) => {
            count++;
            users.push(user)

            if (count >= 100) {
               
                if(process.env.REDIS_ENABLE === "true") await redisClient.set(cacheKey, JSON.stringify(users));

                Response.json({users, length: count});
                subscription.unsubscribe();
            }
        },
        complete: async () => {
            await redisClient.set(cacheKey);
            Response.json({users, length: count});
        },
        error: (err) => {
            Response.error(`Error: ${err.message}`);
        },
    });

    
}

const handleProducts = async (limit) => {
    if(process.env.REDIS_ENABLE === "true")
        {
            const cacheKey = `observables:products:${limit}`;
    
            const cachedResponse = await redisClient.get(cacheKey);
        
            if (cachedResponse) {
                logger.info(`Response get from caché: ${limit}`);
                Response.json({users: cachedResponse, length: cachedResponse.length});
                return;
            }else {
                logger.info(`No se encontró caché para el límite: ${limit}`);
            }
        }    
        
    const streamProducts = (limit) => {
        return new Observable((subscriber) => {
            const query = db.query(`SELECT * FROM products LIMIT ?`, [
                parseInt(limit),
            ]);
            const stream = query.stream();

            stream.on("data", (row) => {
                subscriber.next(row);
            });

            stream.on("end", () => {
                subscriber.complete();
            });

            stream.on("error", (err) => {
                subscriber.error(err);
            });

            return () => {
                stream.destroy(); 
            };
        });
    };

    const observableProducts = streamProducts(limit);
    let countProducts = 0;

    observableProducts.subscribe({
        next: async(product) => {
            countProducts++;
            users.push(product)

            if (countProducts >= 100) {
                Response.json({products: users, length: countProducts});
                subscription.unsubscribe();
            }
        },
        complete: async () => {
            Response.json({products: users, length: countProducts});
        },
        error: (err) => {
            Response.error(`Error: ${err.message}`);
        },
    });
}

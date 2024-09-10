import { Observable } from "rxjs";
import db from "./db/db-streams.js";

export function handleObservableRequest(limite) {
    const streamUsuarios = (limite) => {
        return new Observable((subscriber) => {
            let response;
            const query = db.query(`SELECT * FROM users LIMIT ?`, [
                parseInt(limite),
            ]);
            const stream = query.stream();

            stream.on("data", (row) => {
                subscriber.next(row); // Emitir cada fila como un evento
            });

            stream.on("end", () => {
                subscriber.complete(); // Finalizamos cuando no hay más datos
            });

            stream.on("error", (err) => {
                subscriber.error(err); // Emitir un error si ocurre
            });

            return () => {
                stream.destroy(); // Cerrar el stream de la consulta MySQL
            };
        });
    };

    response = `
        <html>
            <head><title>Usuarios (Observables)</title></head>
            <body><h1>Cargando Usuarios</h1>
            <table border="1">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Edad</th>
                </tr>`;

    const observable = streamUsuarios(limite);
    let i = 1;

    observable.subscribe({
        next: (usuario) => {
            i++;
            resposne += `
                <tr>
                    <td>${i++}</td>
                    <td>${usuario.name}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.age}</td>
                </tr>`;
            if (i >= 100) {
                response += "</table></body></html>";
                return response;
            }
        },
        complete: () => {
            response += "</table></body></html>";
            return response;
        },
        error: (err) => {
            response = `<p>Error: ${err.message}</p>`;
            return response;
        },
    });
}

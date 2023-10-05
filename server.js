const express = require ('express');
const usersRouter = require('./routes/users');

class Server {
    constructor(){
        this.app = express(); // Se instancia express
        this.port = 3000; //Se define el puerto

        // Paths http://localhost:3000/api/v1
        this.basePath='/api/v1'; //ruta base

        this.usersPath = `${this.basePath}/users`; //Path para la tabla users

        this.middlewares(); //Invocacion de los middlewares

        this.routes(); //Invocacion de las rutas
    }

    middlewares(){
        this.app.use(express.json()); //para poder interpretar texto en formato
    }

    routes(){
        this.app.use(this.usersPath, usersRouter); //endpoint de Users
    }

    listen(){
        this.app.listen(this.port, ()=> {
            console.log("Server listening on port" + this.port)
        });
    }

}

module.exports = Server;
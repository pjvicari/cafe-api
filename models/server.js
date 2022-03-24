const express = require('express');
const cors = require('cors');
const { dbConnetion } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
        // conectar a base de datos
        this.conectarDB();
        //middlewares
        this.middlewares();
        //Rutas
        this.routes();
    }

    async conectarDB() {
        await dbConnetion();
    }

    middlewares(){
        //Directorio public
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
const path = require('path');
const {v4: uuidV4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['jpg','jpeg','gif','png','map'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        //validar la extensión
        if(!extensionesValidas.includes(extension)) {
            return reject(`la extensión no es permitida, extensiones validas: ${extensionesValidas}`)
        }
        const nombreTemp = `${uuidV4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err){
                return reject(err)
            }
            return resolve(nombreTemp);
        });
    })
}

module.exports = {
    subirArchivo
}
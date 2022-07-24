import app from './server.js';

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
  if (!process.env.PERS) {
    console.warn(
      "PERS no encontrado, favor de definir como variable de entorno con 'firebase' o 'mongodb'"
    );
  }
});
server.on('error', (error) => console.log(`Error en servidor ${error}`));

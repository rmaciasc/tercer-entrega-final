import ContenedorMongoDb from '../../contenedores/ContenedorMongoDb.js';

class CarritosDaoMongoDb extends ContenedorMongoDb {
  constructor(collectionCarritos, schemaCarritos) {
    super(collectionCarritos, schemaCarritos);
  }
}

export default CarritosDaoMongoDb;

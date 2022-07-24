import ContenedorMongoDb from '../../contenedores/ContenedorMongoDb.js';

class ProductosDaoMongoDb extends ContenedorMongoDb {
  constructor(schemaProductos) {
    super('productos', schemaProductos);
  }
}

export default ProductosDaoMongoDb;

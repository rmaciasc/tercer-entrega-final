import mongoose from 'mongoose';

let productosDao;
let carritosDao;

switch (process.env.PERS) {
  case 'firebase':
    console.log('Usando firebase');
    const { default: ProductosDaoFirebase } = await import(
      './productos/ProductosDaoFirebase.js'
    );
    const { default: CarritosDaoFirebase } = await import(
      './carritos/CarritosDaoFirebase.js'
    );
    productosDao = new ProductosDaoFirebase();
    carritosDao = new CarritosDaoFirebase();
    break;

  case 'mongodb':
    console.log('Using mongodb');
    const { default: ProductosDaoMongoDB } = await import(
      './productos/ProductosDaoMongoDB.js'
    );
    const { default: CarritosDaoMongoDB } = await import(
      './carritos/CarritosDaoMongoDB.js'
    );
    const schemaProductos = new mongoose.Schema({
      title: { type: String, required: true, max: 50 },
      price: { type: Number, required: true },
      thumbnail: { type: String, required: true },
      date: {
        type: Date,
        required: true,
      },
    });

    const schemaProductosEnCarritos = new mongoose.Schema({
      id: { type: String, required: true },
    });

    const schemaCarritos = new mongoose.Schema({
      productos: [schemaProductosEnCarritos],
      date: { type: Date, required: true },
    });
    productosDao = new ProductosDaoMongoDB(schemaProductos);
    carritosDao = new CarritosDaoMongoDB('carritos', schemaCarritos);
    break;

  case 'json':
    const { default: ProductosDaoArchivo } = await import(
      './productos/ProductosDaoArchivo.js'
    );
    const { default: CarritosDaoArchivo } = await import(
      './carritos/CarritosDaoArchivo.js'
    );
    productosDao = new ProductosDaoArchivo();
    carritosDao = new CarritosDaoArchivo();
    break;

  default:
    break;
}

export { productosDao, carritosDao };

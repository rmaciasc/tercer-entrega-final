import mongoose from 'mongoose';

class ContenedorMongoDb {
  constructor(collection, schema) {
    this.collection = collection;
    this.schema = schema;
    this.config = {
      mongodb: {
        url: 'mongodb://localhost:27017/ecommerce',
      },
    };
    mongoose.connect(this.config.mongodb.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.model = mongoose.model(this.collection, this.schema);
  }

  async listar(id) {
    const result = await this.model.findOne({ _id: id });
    if (!result) {
      return { error: 'id no encontrado' };
    } else {
      return result;
    }
  }

  async listarAll() {
    try {
      let results = await this.model.find();
      if (results.length > 0) {
        return results;
      } else {
        console.log(`La colección ${this.collection} está vacía.`);
        return false;
      }
    } catch (error) {
      console.log(`${this.collection} no fue encontrada. Error: ${error}`);
    }
  }

  async guardar(elem) {
    try {
      elem.date = new Date().toLocaleString();
      const elemSaveModel = new this.model(elem);
      const elemSaved = await elemSaveModel.save();
      return elemSaved;
    } catch (error) {
      console.log(error);
    }
  }

  async actualizar(elem, id) {
    return await this.model.updateOne({ _id: id }, elem);
  }

  async borrar(id) {
    return await this.model.deleteOne({ _id: id });
  }

  async borrarAll() {
    return await this.model.deleteMany();
  }

  async desconectar() {
    await mongoose.connection.close();
  }
}

export default ContenedorMongoDb;

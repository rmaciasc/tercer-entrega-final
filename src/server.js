import express from 'express';
const { Router } = express;

import {
  productosDao as productosApi,
  carritosDao as cartApi,
} from './daos/index.js';

//--------------------------------------------
// instancio servidor y persistencia

const app = express();

//--------------------------------------------
// permisos de administrador MIDDLEWARES

const esAdmin = true;

function crearErrorNoEsAdmin(ruta, metodo) {
  const error = {
    error: -1,
  };
  if (ruta && metodo) {
    error.description = `Ruta '${ruta}' método '${metodo}' no autorizada.`;
  } else {
    error.description = 'No';
  }
  return error;
}

function soloAdmins(req, res, next) {
  if (esAdmin === false) {
    res.json(crearErrorNoEsAdmin);
  } else {
    next();
  }
}
//--------------------------------------------
// configuro router de productos
const productosRouter = new Router();
productosRouter.get('/:id?', async (req, res) => {
  if (req.params.id) {
    const product = await productosApi.listar(req.params.id);
    res.json(product);
  } else {
    const productos = await productosApi.listarAll();
    res.json(productos);
  }
});

productosRouter.put('/:id', soloAdmins, async (req, res) => {
  const producto = await productosApi.actualizar(req.body, req.params.id);
  res.json(producto);
});

productosRouter.post('/', soloAdmins, async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const id = await productosApi.guardar(req.body);
  res.json({ id });
});

productosRouter.delete('/:id', soloAdmins, async (req, res) => {
  const result = await productosApi.borrar(req.params.id);
  res.json({ result });
});

//--------------------------------------------
// configuro router de carritos

const carritosRouter = new Router();
//
carritosRouter.get('/', async (req, res) => {
  const cart = await cartApi.listarAll();
  if (cart == null) {
    res.json('No existen carritos');
  } else {
    res.json(cart);
  }
});
// Gets products in a cart.
carritosRouter.get('/:id/productos', async (req, res) => {
  const cart = await cartApi.listar(req.params.id);
  res.json(cart.productos);
});
// Creates a cart
carritosRouter.post('/', async (req, res) => {
  const newCartId = await cartApi.guardar({ productos: [] });
  res.json({ newCartId });
});

// Saves a product into a cart.
carritosRouter.post('/:id/productos', async (req, res) => {
  const cart = await cartApi.listar(req.params.id);
  if (cart) {
    const prod = req.body;
    cart.productos.push(prod);
    await cartApi.actualizar(cart, req.params.id);
    res.json(cart);
  } else {
    res.json(`Cart with id ${req.params.id} not found`);
  }
});
// Deletes a prod in a cart
carritosRouter.delete('/:id/productos/:id_prod', async (req, res) => {
  const idProd = parseInt(req.params.id_prod);
  const cart = await cartApi.listar(req.params.id);
  const prodToDelIndex = cart.productos.findIndex((i) => i.id === idProd);
  cart.productos.splice(prodToDelIndex, 1);
  await cartApi.actualizar(cart, req.params.id);
  res.json(cart);
});

// Deletes a cart
carritosRouter.delete('/:id?', async (req, res) => {
  const result = await cartApi.borrar(req.params.id);
  res.json({ result });
});

//--------------------------------------------
// configuro el servidor

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  next();
});

app.use('/api/productos', productosRouter);
app.use('/api/carritos', carritosRouter);

export default app;

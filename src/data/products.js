// Catálogo de productos de demostración
// En un futuro, reemplaza por una consulta API o base de datos.

const products = [
  {
    id: 1,
    name: 'Buró',
    description: 'Mueble de noche 2 cajones',
    category: 'Muebles',
    price: 1540,
    image: '/assets/Mich.jpeg',
  },
  {
    id: 2,
    name: 'Estante',
    description: 'Mueble con repisas',
    category: 'Muebles',
    price: 2320,
    image: '/assets/Aline.jpeg',
  },
  {
    id: 3,
    name: 'Cómoda',
    description: 'Mueble 3 cajones',
    category: 'Muebles',
    price: 3060,
    image: '/assets/Iris.jpeg',
  },
  {
    id: 4,
    name: 'Gabinete',
    description: 'Gabinete de baño',
    category: 'Baños',
    price: 2785,
    image: '/assets/Mich.jpeg',
  },
  {
    id: 5,
    name: 'Isla de Cocina',
    description: 'Isla central con madera',
    category: 'Cocina',
    price: 4800,
    image: require('../images/descarga.jpeg'),
  },
];

export default products;

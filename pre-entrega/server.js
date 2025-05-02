// pre-entrega
const express = require('express');
const app = express();
const PORT = 3008;

// archivo json
// falta "agarrar" la ruta del .env
// agregar algun manejo de errores aca?
const TRAILERFLIX = JSON.parse(ruta);

app.get('/', (req, res) => {
    res.send('Hola mundo');
});

// ruta /catalogo
// listar todo el contenido de trailerﬂix JSON
app.get('/catalogo', (req, res) => {
    // agregar limite?
    res.json(TRAILERFLIX);
});

// ruta /titulo/:title
// busqueda parcial de titulo de pelicula
app.get('/titulo/:title', (req, res) => {
    const titulo = req.params.title.toLowerCase();
    const peliculas = TRAILERFLIX.filter(pelicula => pelicula.titulo === titulo);

    const resultados = [];
    for (let pelicula of peliculas) {
        if (pelicula.titulo.toLowerCase().includes(titulo)) {
          resultados.push(pelicula);
        }
    }

    if (resultados.length === 0) {
        return res.status(404).send("No se encontraron peliculas con ese nombre");
    }
    
    res.json(resultados);
});
  
// ruta /categoria/:cat
// listar todas las peliculas que coinciden con la categoria "cat"
app.get('/categoria/:cat', (req, res) => {
    const categoria = req.params.cat.toLowerCase();
    const peliculas = TRAILERFLIX.filter(pelicula => pelicula.categoria === categoria);

    const resultados = [];
    for (let pelicula of peliculas) {
        if (pelicula.categoria.toLowerCase().includes(categoria)) {
          resultados.push(pelicula);
        }
    }

    if (resultados.length === 0) {
        return res.status(404).send('No se encontraron peliculas con ese nombre');
    }
    
    res.json(resultados);
});


// ruta /reparto/:act
// busqueda parcial, lista las peliculas de actor/actriz 
app.get('/reparto/:act', (req, res) => {
    // lo mismo que /titulo/:title pero aplicar un map para devolver solo "reparto" y "titulo"

});

// ruta /trailer/:id
// retorna la URL del trailer de la película o serie.
// Manejar error por si no esta el trailer
app.get('/trailer/:id', (req, res) => {
    // buscar trailer por id
    // mostrar mensaje de error si no existe

});


// manejo de error por ruta invalida
app.use((req, res) => {
  res.status(404).send({
    error: "404",
    description: "No se encuentra la ruta o recurso solicitado."
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// pre-entrega
const fs = require('fs');
const removeAccents = require('remove-accents');
const express = require('express');
const app = express();
//const PORT = 3008;

const dotenv = require('dotenv');
    dotenv.config();

const PORT = process.env.PORT || 3008

// archivo json
// falta "agarrar" la ruta del .env
// agregar algun manejo de errores aca?
const TRAILERFLIX = JSON.parse(fs.readFileSync('./database/trailerflix.json', 'utf-8'));


function normParam(parametro){
    let para = removeAccents(parametro.trim().toLowerCase());
    return para;
}

app.get('/', (req, res) => {
    res.send('Bienvenidos a Trailerflix');
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
    const parametros= normParam(req.params.title);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.titulo).includes(parametros)});

    if (resultados.length === 0) {
        return res.status(404).send("No se encontraron peliculas con ese nombre");
    }
    
    res.json(resultados);
});
  
// ruta /categoria/:cat
// listar todas las peliculas que coinciden con la categoria "cat"
app.get('/categoria/:cat', (req, res) => {
    //const categoria = req.params.cat.toLowerCase();
    //const peliculas = TRAILERFLIX.filter(pelicula => pelicula.categoria === categoria);

    const parametros= normParam(req.params.cat);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.categoria).includes(parametros)});

    if (resultados.length === 0) {
        return res.status(404).send('No se encontraron peliculas con ese nombre');
    }
    
    res.json(resultados);
});


// ruta /reparto/:act
// busqueda parcial, lista las peliculas de actor/actriz 
app.get('/reparto/:act', (req, res) => {
    // lo mismo que /titulo/:title pero aplicar un map para devolver solo "reparto" y "titulo"
    // const parametros= normParam(req.params.act);
    // const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.titulo).includes(parametros)});

    // const resultadosReducidos = resultados.map();

    const parametros = normParam(req.params.act);
    const resultados = TRAILERFLIX.filter( pelicula =>{return normParam(pelicula.reparto).includes(parametros)});
    const repartoSeleccionado = resultados.map(pelicula => { return { reparto: pelicula.reparto, titulo:pelicula.titulo }})

    if (resultados.length === 0) {
      return res.status(404).send("No se encontraron peliculas para este actor o actriz");
  }
  
    res.json(repartoSeleccionado);
});

// ruta /trailer/:id
// retorna la URL del trailer de la película o serie.
// Manejar error por si no esta el trailer
app.get('/trailer/:id', (req, res) => {
    // buscar trailer por id
    // mostrar mensaje de error si no existe
    const id = parseInt(req.params.id);
    
    // typeof: para saber si es un numero
    if (typeof id !== 'number') {
      return res.status(400).send("ID inválido");
    }
    // manejar chequeo de errores por el id

    resultado = TRAILERFLIX.find(pelicula => {return pelicula.id === id });

    const peliculaElegida = {
      id: resultado.id, 
      titulo: resultado.titulo, 
      trailer: resultado?.trailer || '',
    };

    res.json(peliculaElegida)
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

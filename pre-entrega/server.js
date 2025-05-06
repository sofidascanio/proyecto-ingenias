const fs = require('fs');
const removeAccents = require('remove-accents');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
   dotenv.config();
const PORT = process.env.PORT || 3008
const FILE_PATH = process.env.FILE_PATH

const TRAILERFLIX = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));

function normParam(parametro){
    let para = removeAccents(parametro.trim().toLowerCase());
    return para;
}

app.get('/', (req, res) => {
    res.send('Bienvenidos a Trailerflix');
});

// ruta /catalogo
app.get('/catalogo', (req, res) => {
    res.json(TRAILERFLIX);
});

// ruta /titulo/:title
app.get('/titulo/:title', (req, res) => {
    const parametros= normParam(req.params.title);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.titulo).includes(parametros)});

    if (resultados.length === 0) {
        return res.status(404).send("No se encontraron peliculas con ese nombre");
    }
    
    res.json(resultados);
});
  
// ruta /categoria/:cat
app.get('/categoria/:cat', (req, res) => {
    const parametros= normParam(req.params.cat);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.categoria).includes(parametros)});

    if (resultados.length === 0) {
        return res.status(404).send('No se encontraron peliculas con ese nombre');
    }
    
    res.json(resultados);
});


// ruta /reparto/:act
app.get('/reparto/:act', (req, res) => {
    const parametros = normParam(req.params.act);
    const resultados = TRAILERFLIX.filter( pelicula =>{return normParam(pelicula.reparto).includes(parametros)});
    const repartoSeleccionado = resultados.map(pelicula => { return { reparto: pelicula.reparto, titulo:pelicula.titulo }})

    if (resultados.length === 0) {
      return res.status(404).send("No se encontraron peliculas para este actor o actriz");
  }
  
    res.json(repartoSeleccionado);
});

// ruta /trailer/:id
app.get('/trailer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
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

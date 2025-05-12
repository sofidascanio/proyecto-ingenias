const fs = require('fs');
const removeAccents = require('remove-accents');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
   dotenv.config();
const PORT = process.env.PORT || 3000;
const FILE_PATH = process.env.FILE_PATH;

fs.readFile(FILE_PATH, 'utf-8', (error, data) => {
  if (error) {
      console.error("No se pudo leer el archivo",error);
      return;
  }

  TRAILERFLIX = JSON.parse(data);
});

function normParam(parametro){
    let para = removeAccents(parametro.trim().toLowerCase());
    return para;
}

app.get('/', (req, res) => {
    res.send('Bienvenidos a Trailerflix');
});

// /catalogo
app.get('/catalogo', (req, res) => {
    res.json(TRAILERFLIX);
});

// /titulo/:title
app.get('/titulo/:title', (req, res) => {
    const parametros= normParam(req.params.title);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.titulo).includes(parametros)});

    if (resultados.length === 0) {
        return res.json({mensaje: "No se encontraron peliculas con ese nombre"});
    }
    
    res.json(resultados);
});
  
// /categoria/:cat
app.get('/categoria/:cat', (req, res) => {
    const parametros= normParam(req.params.cat);
    const resultados = TRAILERFLIX.filter(pelicula =>{return normParam(pelicula.categoria).includes(parametros)});

    if (parametros != "serie" || "pelicula") {
      return res.json({mensaje: "No se encontraron categorias con ese nombre"});
    }
 
    if (resultados.length === 0) {
      return res.json({mensaje: `No se encontraron resultados para la categoria: ${parametros} `});
    }
    
    res.json(resultados);
});

// /reparto/:act
app.get('/reparto/:act', (req, res) => {
    const parametros = normParam(req.params.act);
    const resultados = TRAILERFLIX.filter( pelicula =>{return normParam(pelicula.reparto).includes(parametros)});
    const repartoSeleccionado = resultados.map(pelicula => { return { reparto: pelicula.reparto, titulo:pelicula.titulo }})

    if (resultados.length === 0) {
      return res.json({mensaje: "No se encontraron peliculas para este actor o actriz"});
    }
    
    res.json(repartoSeleccionado);
});

// /trailer/:id
app.get('/trailer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({mensaje:"ID inválido"});
    }

    resultado = TRAILERFLIX.find(pelicula => {return pelicula.id === id });

    if (resultado.trailer === undefined) {
      data = {
        mensaje: "No existe trailer para esta serie/pelicula"
      }
    } else {
      data = {
        id: resultado.id, 
        titulo: resultado.titulo, 
        trailer: resultado?.trailer || '',
      };
    };

    res.json(data);

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

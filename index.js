//TERCERA VERSION - UTILIZANDO EXPRESS
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.json())  //Activar el middleware json-parser para acceder a los datos facilmente.

//Al final del cuerpo de la función, se llama a la función next que se pasó como parámetro.
//  La función next cede el control al siguiente middleware.
//My middleware, a ejecutar por los controladores de eventos de ruta
const requestLogger = (request, response, next) => {   
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

  //define un controlador de eventos, 
  //que se utiliza para manejar las solicitudes HTTP GET realizadas a la raíz / de la aplicación
  //Dado que el parámetro es un string, 
  //Express establece automáticamente el valor de la cabecera Content-Type en text/html.
  //Solo puede haber una declaración response.send() en una ruta de la aplicación Express.
  // Una vez que envías una respuesta al cliente usando response.send(),
  // el ciclo de solicitud-respuesta está completo y no se pueden enviar más respuestas.
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//que maneja las solicitudes HTTP GET realizadas a la ruta notes de la aplicación
//Express establece automáticamente la cabecera Content-Type con el valor apropiado de application/json.
//Express transforma automáticamente los datos en formato json a string
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  //La condición if aprovecha el hecho de que todos los objetos JavaScript son truthy,
  //lo que significa que se evalúan como verdaderos en una operación de comparación. 
  //Sin embargo, undefined es falsy, lo que significa que se evaluará como falso.
  if (note) {
    response.json(note)
  } else { //si no se encuentra el id del recurso, no se puede devolver un status 200
    response.status(404).end()
  }
})

//No hay consenso sobre qué código de estado debe devolverse a una solicitud DELETE si el recurso no existe.
//Realmente, las únicas dos opciones son 204 y 404. En aras de la simplicidad, 
//nuestra aplicación responderá con 204 en ambos casos.
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
//envia la información de la nueva nota en el body de la solicitud en formato JSON
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)
  
  response.json(note)
})

//Middleware que se usa para capturar solicitudes realizadas a rutas inexistentes.
//Se ejcuta si ningún controlador de ruta se encarga de la solicitud HTTP
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//const PORT = 3001
const PORT = process.env.PORT || 3001  //De cara a Internet para el servicio Render
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//const http = require('http')

/* //PRIMERA VERSION
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
*/

/* //SEGUNDA VERSION - DEVOLVIENDO UN JSON
let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
  const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
*/
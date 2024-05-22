const express = require('express')
var morgan = require('morgan')
const app = express()
app.use(express.json())

const cors = require('cors')

app.use(cors())

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

let contacts = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
];

const currentDate = new Date();


  app.get('/api/contacts', (request, response) => {
    response.json(contacts)
  })

  app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${contacts.length} people</h1> <br/> ${currentDate}`)
  })


    app.get('/api/contacts/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    const contact = contacts.find(note => note.id === Number(id))
    console.log(contact)
 if (contact) {
    response.json(contact)
  } else {
    response.status(404).end()
  }
  })

  app.delete("/api/contacts/:id", (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
    response.status(204).end()
  })


  app.put('/api/contacts/:id', (request, response) => {
    const id = Number(request.params.id);
    const updatedContact = request.body;
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    if (contactIndex !== -1) {
      contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };
      response.json(contacts[contactIndex]);
    } else {
      response.status(404).json({ error: 'Contact not found' });
    }
  });

    app.post('/api/contacts', (request, response) => {
        const newContact = request.body;

        // Check if a contact with the same name or number already exists
        const existingName = contacts.find(contact => contact.name === newContact.name);
        const existingNumber = contacts.find(contact => contact.number === newContact.number);
    
        if (existingName) {
            return response.status(400).json({ error: 'Name already exists' });
        }
    
        if (existingNumber) {
            return response.status(400).json({ error: 'Number already exists' });
        }
    
        const maxId = contacts.length > 0 ? Math.max(...contacts.map(n => n.id)) : 0;
        newContact.id = maxId + 1;
    
        contacts = [...contacts, newContact];
        response.json(newContact);
        console.log("added",newContact)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
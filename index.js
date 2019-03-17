require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT

const routes = require('./routes')

app.use('/', routes)

app.listen(port, () => console.log(`App listening on port ${port}!`))

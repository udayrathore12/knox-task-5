const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./modules/db.js');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
try {
app.get('/orders', db.getOrders)
app.get('/products', db.getProducts)
app.get('/order/:id', db.getOrderById)
app.post('/order', db.createOrder)
app.put('/order/:id', db.updateOrder)
app.delete('/order/:id', db.deleteOrder)
}
catch (err) {
    //catching unexpected error
    console.log(err);
}
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
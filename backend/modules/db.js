const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test1',
  password: 'Uday2022',
  port: 5432,
})

const getOrders = (request, response) => {
  pool.query('SELECT "ORDERS".id, "ORDERS"."orderDescription", "ORDERS"."createdAt", COUNT("ORDERS"."id") FROM "ORDERS" INNER JOIN "OrderProductMap" ON "ORDERS".id = "OrderProductMap"."orderId" GROUP BY "ORDERS"."id" ORDER BY "ORDERS"."id";', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProducts = (request, response) => {
  pool.query('SELECT * FROM "PRODUCTS";', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOrderById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT "ORDERS".id, "ORDERS"."orderDescription", "ORDERS"."createdAt", COUNT("ORDERS"."id") FROM "ORDERS" INNER JOIN "OrderProductMap" ON "ORDERS".id = "OrderProductMap"."orderId" WHERE "ORDERS".id = $1 GROUP BY "ORDERS"."id" ORDER BY "ORDERS"."id";', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createOrder = (request, response) => {
  const { orderdescription, productid } = request.body;
  let err = 0;
  pool.query('INSERT INTO public."ORDERS"("orderDescription") VALUES ($1) RETURNING id;', [orderdescription], (error, results) => {
    if (error) {
      console.log('Unable To Create Order')
    }
    else
    {
      console.log(productid);
      for(var i = 0; i < productid.length; i++)
      {
        pool.query('INSERT INTO public."OrderProductMap"( "orderId", "productId") VALUES ($1, $2);', [results.rows[0].id, productid[i]], (error, innerResults) => {
          if (error) {
            err = 1;
            console.log('Unable To Complete Order Creation')
          }
        })
      }
    }
    if(err == 0)
      {
        response.status(201).send('Order added with ID: ' + results.rows[0].id );      
      }
      else
      {
        //remove order with inaccurate data
        pool.query('DELETE FROM "OrderProductMap" WHERE "orderId" = $1', [results.rows[0].id])
        pool.query('DELETE FROM "ORDERS" WHERE "id" = $1', [results.rows[0].id])
        console.log('Error in order creation');
      }

  })
}

const updateOrder = (request, response) => {
  let err = 0;
  const id = parseInt(request.params.id)
  const { orderdescription, productid } = request.body;

  pool.query('UPDATE public."ORDERS" SET "orderDescription"= $1 WHERE id = $2',
    [orderdescription, id],
    (error, results) => {
      if (error) {
        console.log('Unable To Update')
      }
      else
      {
        //remove original order
        pool.query('DELETE FROM "OrderProductMap" WHERE "orderId" = $1', [id])
        for(var i = 0; i < productid.length; i++)
        {
          pool.query('INSERT INTO public."OrderProductMap"( "orderId", "productId") VALUES ($1, $2);', [id, productid[i]], (error, innerResults) => {
            if (error) {
              err = 1;
            }
          })
        }

        if(err == 0)
        {
          response.status(200).send('Order modified with ID: ' + id)    
        }
        else
        {
          response.status(200).send('Order Modification Failed')    
        }
            
      }

    }
  )
}

const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM "ORDERS" WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log('Unable To Delete')
    }
  })
  pool.query('DELETE FROM public."OrderProductMap" WHERE "orderId" = $1', [id], (error, results) => {
    if (error) {
      response.status(200).send('Unable To Delete')
    }
    else
    {
      response.status(200).send('Deleted')      
    }

  })
}

module.exports = {
  getOrders,
  getProducts,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
}
require("dotenv").config()

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY),
  headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
  }

exports.handler = async (event, context) => {
  if (!event.body || event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "invalid http method"
      })
    }
  }

  const data = JSON.parse(event.body)
  console.log(data)

  if (!data.stripeToken || !data.stripeAmt || !data.stripeIdempotency) {
    console.error("Required information is missing.")

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: "Missing Information"
      })
    }
  }

   const stripe.tokens.create({
   card: {
   number: data.Card,
   exp_month: data.exp_month,
   exp_year: data.exp_year,
   cvc: data.cvc
  } 
     function(err, token) {
  // asynchronously called
});

  // stripe payment processing begins here
  try {
    await stripe.customers
      .create({
        email: data.stripeEmail,
        source: data.stripeToken
      })
      .then(customer => {
        console.log(
          `starting the charges, amt: ${data.stripeAmt}, email: ${
            data.stripeEmail
          }`
        )
      
        return stripe.charges
          .create(
            {
              currency: "usd",
              amount: data.stripeAmt,
              receipt_email: data.stripeEmail,
              customer: customer.id,
              source: stripe.tokens.retrieve('stripeToken'),
              description: "Allgo Premuim"
            },
            {
              idempotency_key: data.stripeIdempotency
            }
          )
          .then(result => {
            console.log(`Charge created: ${result}`)
          })
      })

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: "It Works! Cha Ching!"
      })
    }
  } catch (err) {
    console.log(err)

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: err
      })
    }
  }
}

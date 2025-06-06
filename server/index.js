import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from KitchnShare backend!");
});

// Exemple : créer un paiement Stripe
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

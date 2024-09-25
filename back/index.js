const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const router = require('./routes/router');
const connection = require('./connection/db');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_KEY);
console.log(process.env.STRIPE_KEY)

const app = express();
const PORT = 3001;

// image size
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}));

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
app.use(cors());
// Routes
app.use('/api', router);


// Stripe
const YOUR_DOMAIN = 'http://localhost:3000';
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1PxWjmGnk9tIbJLBtBzJYgCL', 
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${YOUR_DOMAIN}/index`,
      cancel_url: `${YOUR_DOMAIN}/index`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
  }
});

//serveur
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

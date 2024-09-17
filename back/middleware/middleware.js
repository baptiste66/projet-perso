app.use(express.json());
app.use(cors());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'learnhome',
});

connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion :" + err.stack);
    return;
  }
  console.log("Connexion réussie");
});

// Routes
const router = require('./routes/router');  
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
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la session de paiement' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
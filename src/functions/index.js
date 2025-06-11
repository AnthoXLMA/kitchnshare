// // functions/index.js
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");

// admin.initializeApp();

// exports.createReservation = functions.https.onCall(async (data, context) => {
//   const { listingId, startDate, endDate } = data;

//   if (!context.auth) {
//     throw new functions.https.HttpsError("unauthenticated", "Non authentifié.");
//   }

//   const userId = context.auth.uid; // ✅ ne PAS le passer depuis le client

//   if (!listingId || !startDate || !endDate) {
//     throw new functions.https.HttpsError("invalid-argument", "Données incomplètes.");
//   }

//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   if (start >= end) {
//     throw new functions.https.HttpsError("invalid-argument", "Dates invalides.");
//   }

//   // Vérification des chevauchements
//   const snapshot = await admin.firestore()
//     .collection("reservations")
//     .where("listingId", "==", listingId)
//     .where("status", "==", "confirmed")
//     .get();

//   const overlap = snapshot.docs.some((doc) => {
//     const res = doc.data();
//     const resStart = res.startDate.toDate();
//     const resEnd = res.endDate.toDate();
//     return start <= resEnd && end >= resStart;
//   });

//   if (overlap) {
//     throw new functions.https.HttpsError("already-exists", "Chevauchement de réservation.");
//   }

//   // Création de la réservation
//   await admin.firestore().collection("reservations").add({
//     listingId,
//     userId,
//     startDate: admin.firestore.Timestamp.fromDate(start),
//     endDate: admin.firestore.Timestamp.fromDate(end),
//     status: "confirmed",
//     createdAt: admin.firestore.FieldValue.serverTimestamp(),
//   });

//   return { success: true };
// });

//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const cors = require("cors")({ origin: true });

// exports.createStripeCheckout = require("firebase-functions").https.onRequest(async (req, res) => {
//   // Autoriser l'origine locale (développement)
//   res.set("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
//   res.set("Access-Control-Allow-Headers", "Content-Type");

//   // Gérer les requêtes preflight OPTIONS (envoyées par le navigateur)
//   if (req.method === "OPTIONS") {
//     return res.status(204).send("");
//   }

//   try {
//     const { title, totalPrice } = req.body;

//     if (!title || !totalPrice) {
//       return res.status(400).json({ error: "Données manquantes." });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "eur",
//             product_data: {
//               name: title,
//             },
//             unit_amount: Math.round(totalPrice * 100), // converti en centimes
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/cancel",
//     });

//     return res.status(200).json({ id: session.id });
//   } catch (error) {
//     console.error("Erreur Stripe :", error);
//     return res.status(500).json({ error: "Erreur lors de la création de la session Stripe." });
//   }
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
admin.initializeApp();

exports.createStripeCheckout = functions.https.onRequest(async (req, res) => {
  // Ajout des headers CORS manuellement
  res.set('Access-Control-Allow-Origin', '*'); // ou 'http://localhost:5173'
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Réponse à la requête preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    const { title, totalPrice } = req.body;

    if (!title || !totalPrice) {
      return res.status(400).json({ error: 'Données manquantes.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: title },
            unit_amount: Math.round(totalPrice * 100), // en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Erreur Stripe:", err);
    return res.status(500).json({ error: "Erreur interne Stripe." });
  }
});

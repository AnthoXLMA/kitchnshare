const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendBookingConfirmation = functions.firestore
  .document("reservations/{reservationId}")
  .onCreate(async (snap, context) => {
    const reservation = snap.data();

    // Récupérer info utilisateur et listing si besoin
    const userRef = admin.firestore().collection("users").doc(reservation.userId);
    const userDoc = await userRef.get();
    const userEmail = userDoc.exists ? userDoc.data().email : null;

    if (!userEmail) {
      console.log("Utilisateur sans email");
      return null;
    }

    // Préparer l'email
    const msg = {
      to: userEmail,
      from: "no-reply@kitchnshare.com", // ton email validé SendGrid
      subject: `Confirmation de réservation ${reservation.listingId}`,
      text: `Votre réservation du ${reservation.startDate.toDate()} au ${reservation.endDate.toDate()} a bien été prise en compte.`,
      html: `<p>Votre réservation du <strong>${reservation.startDate.toDate().toLocaleDateString()}</strong> au <strong>${reservation.endDate.toDate().toLocaleDateString()}</strong> a bien été prise en compte.</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("Email de confirmation envoyé à", userEmail);
    } catch (error) {
      console.error("Erreur envoi email", error);
    }

    return null;
  });

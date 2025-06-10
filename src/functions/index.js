// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();

exports.createReservation = functions.https.onCall(async (data, context) => {
  const { listingId, startDate, endDate } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Non authentifié.");
  }

  const userId = context.auth.uid; // ✅ ne PAS le passer depuis le client

  if (!listingId || !startDate || !endDate) {
    throw new functions.https.HttpsError("invalid-argument", "Données incomplètes.");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new functions.https.HttpsError("invalid-argument", "Dates invalides.");
  }

  // Vérification des chevauchements
  const snapshot = await admin.firestore()
    .collection("reservations")
    .where("listingId", "==", listingId)
    .where("status", "==", "confirmed")
    .get();

  const overlap = snapshot.docs.some((doc) => {
    const res = doc.data();
    const resStart = res.startDate.toDate();
    const resEnd = res.endDate.toDate();
    return start <= resEnd && end >= resStart;
  });

  if (overlap) {
    throw new functions.https.HttpsError("already-exists", "Chevauchement de réservation.");
  }

  // Création de la réservation
  await admin.firestore().collection("reservations").add({
    listingId,
    userId,
    startDate: admin.firestore.Timestamp.fromDate(start),
    endDate: admin.firestore.Timestamp.fromDate(end),
    status: "confirmed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

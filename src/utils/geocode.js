export async function geocodeAdresse(adresse) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresse)}`);
  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Adresse non trouvée");
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}

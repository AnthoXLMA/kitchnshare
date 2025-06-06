import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function HomePage() {
  const [location, setLocation] = useState("");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Kitch'N'Share</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une cuisine ou une salle de bain..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardContent className="p-4">
              <img
                src={`https://source.unsplash.com/400x300/?kitchen,${item}`}
                alt="Cuisine"
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">Cuisine moderne #{item}</h2>
              <p className="text-sm text-gray-600">Paris, France</p>
              <Button className="mt-2">Réserver</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";

// US ZIP code to approximate coordinates lookup
// This is a fallback for common zip codes
const ZIP_CODE_CACHE = {
  "10001": { lat: 40.7484, lng: -73.9967, city: "New York", state: "NY" },
  "90210": { lat: 34.0901, lng: -118.4065, city: "Beverly Hills", state: "CA" },
  "60601": { lat: 41.8819, lng: -87.6278, city: "Chicago", state: "IL" },
  "77001": { lat: 29.7604, lng: -95.3698, city: "Houston", state: "TX" },
  "85001": { lat: 33.4484, lng: -112.0740, city: "Phoenix", state: "AZ" },
  "19101": { lat: 39.9526, lng: -75.1652, city: "Philadelphia", state: "PA" },
  "78201": { lat: 29.4241, lng: -98.4936, city: "San Antonio", state: "TX" },
  "92101": { lat: 32.7157, lng: -117.1611, city: "San Diego", state: "CA" },
  "75201": { lat: 32.7767, lng: -96.7970, city: "Dallas", state: "TX" },
  "95101": { lat: 37.3382, lng: -121.8863, city: "San Jose", state: "CA" },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zipCode = searchParams.get("zip");

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    return NextResponse.json(
      { error: "Invalid zip code. Please provide a 5-digit US zip code." },
      { status: 400 }
    );
  }

  // Check cache first
  if (ZIP_CODE_CACHE[zipCode]) {
    const cached = ZIP_CODE_CACHE[zipCode];
    return NextResponse.json({
      success: true,
      data: {
        zipCode,
        lat: cached.lat,
        lng: cached.lng,
        displayName: `${cached.city}, ${cached.state} ${zipCode}, USA`,
      },
    });
  }

  try {
    // Try Nominatim API (OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=USA&format=json&limit=1`,
      {
        headers: {
          "User-Agent": "Naibrly/1.0 (https://naibrly.com)",
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          zipCode,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        },
      });
    }

    // If Nominatim fails, try Zippopotam.us (free, no API key required)
    const zippoResponse = await fetch(
      `https://api.zippopotam.us/us/${zipCode}`
    );

    if (zippoResponse.ok) {
      const zippoData = await zippoResponse.json();
      if (zippoData.places && zippoData.places.length > 0) {
        const place = zippoData.places[0];
        return NextResponse.json({
          success: true,
          data: {
            zipCode,
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude),
            displayName: `${place["place name"]}, ${place["state abbreviation"]} ${zipCode}, USA`,
          },
        });
      }
    }

    // Fallback: return approximate center of US if zip code not found
    return NextResponse.json({
      success: false,
      error: "Zip code not found",
      data: null,
    });
  } catch (error) {
    console.error("Geocoding error:", error);

    // Try backup API
    try {
      const zippoResponse = await fetch(
        `https://api.zippopotam.us/us/${zipCode}`
      );

      if (zippoResponse.ok) {
        const zippoData = await zippoResponse.json();
        if (zippoData.places && zippoData.places.length > 0) {
          const place = zippoData.places[0];
          return NextResponse.json({
            success: true,
            data: {
              zipCode,
              lat: parseFloat(place.latitude),
              lng: parseFloat(place.longitude),
              displayName: `${place["place name"]}, ${place["state abbreviation"]} ${zipCode}, USA`,
            },
          });
        }
      }
    } catch (backupError) {
      console.error("Backup geocoding error:", backupError);
    }

    return NextResponse.json(
      { error: "Failed to geocode zip code", success: false },
      { status: 500 }
    );
  }
}

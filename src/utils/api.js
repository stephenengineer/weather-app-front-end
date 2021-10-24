const API_BASE_URL =
  "https://api.openweathermap.org/data/2.5/onecall?lat=37.7690687&lon=-122.1997807&appid=b5e983b6e9f74c43129be6cdf0472734";
const headers = new Headers();
headers.append("Content-Type", "text/plain");

async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) return null;

    const payload = await response.json();

    if (payload.error) return Promise.reject({ message: payload.error });
    return payload;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function readWeatherData() {
  const url = API_BASE_URL;
  const abortSignal = new AbortController().abort();
  const options = {
    method: "GET",
    headers,
    abortSignal,
  };
  return await fetchJson(url, options, []);
}

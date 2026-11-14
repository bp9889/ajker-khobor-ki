// "Today in Dhaka": weather, air quality and the dollar rate, from free services that need no key.
// Each part is optional. If a service is down, that part is simply left out.
const DHAKA = 'latitude=23.8103&longitude=90.4125';

async function get(url) {
  const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(7000) });
  if (!res.ok) throw new Error('status ' + res.status);
  return res.json();
}

// WMO weather codes, in plain words.
const SKY = [[0, 'Clear'], [2, 'Partly cloudy'], [3, 'Cloudy'], [48, 'Foggy'], [57, 'Drizzle'], [67, 'Rain'], [77, 'Snow'], [82, 'Heavy showers'], [86, 'Showers'], [99, 'Thunderstorm']];
const sky = (c) => { for (const [max, name] of SKY) if (c <= max) return name; return 'Weather'; };

// US air quality bands.
export function aqiBand(n) {
  if (n <= 50) return { name: 'Good', color: '#00924A' };
  if (n <= 100) return { name: 'Moderate', color: '#C79A00' };
  if (n <= 150) return { name: 'Unhealthy for some', color: '#F28C00' };
  if (n <= 200) return { name: 'Unhealthy', color: '#D21F14' };
  if (n <= 300) return { name: 'Very unhealthy', color: '#8A2BE2' };
  return { name: 'Hazardous', color: '#7E0023' };
}

export async function getToday() {
  // For working offline: AKK_TODAY='{"temp":31,...}' serves fixed values.
  if (process.env.AKK_TODAY) return JSON.parse(process.env.AKK_TODAY);
  const [w, a, r] = await Promise.allSettled([
    get('https://api.open-meteo.com/v1/forecast?' + DHAKA + '&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=Asia%2FDhaka'),
    get('https://air-quality-api.open-meteo.com/v1/air-quality?' + DHAKA + '&current=us_aqi&timezone=Asia%2FDhaka'),
    get('https://open.er-api.com/v6/latest/USD'),
  ]);
  const out = {};
  try { if (w.status === 'fulfilled' && w.value.current) { const c = w.value.current; out.temp = Math.round(c.temperature_2m); out.feels = Math.round(c.apparent_temperature); out.sky = sky(c.weather_code); out.day = !!c.is_day; } } catch (e) {}
  try { if (a.status === 'fulfilled' && a.value.current && Number.isFinite(a.value.current.us_aqi)) { const n = Math.round(a.value.current.us_aqi); out.aqi = n; Object.assign(out, { aqiName: aqiBand(n).name, aqiColor: aqiBand(n).color }); } } catch (e) {}
  try { if (r.status === 'fulfilled' && r.value.rates && r.value.rates.BDT) out.usd = Math.round(r.value.rates.BDT * 10) / 10; } catch (e) {}
  return Object.keys(out).length ? out : null;
}

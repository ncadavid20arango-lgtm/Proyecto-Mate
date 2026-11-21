// Persistencia y operaciones CRUD de electrodomésticos.
const STORAGE_KEY = "ecohogar-appliances-v1";
const DEFAULT_APPLIANCES = [
  { id: "demo-ac", name: "Aire acondicionado", power: 1000, hours: 4, days: 30 },
  { id: "demo-tv", name: "Televisor", power: 150, hours: 5, days: 30 },
  { id: "demo-fridge", name: "Nevera", power: 350, hours: 8, days: 30 }
];

export function loadAppliances() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === null ? DEFAULT_APPLIANCES : JSON.parse(stored);
  } catch (error) {
    console.warn("No fue posible leer los datos guardados.", error);
    return DEFAULT_APPLIANCES;
  }
}

export function saveAppliances(appliances) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appliances));
}

export function loadTariff() {
  const value = Number(localStorage.getItem("ecohogar-tariff-v1"));
  return Number.isFinite(value) && value > 0 ? value : 900;
}

export function saveTariff(tariff) {
  localStorage.setItem("ecohogar-tariff-v1", String(tariff));
}

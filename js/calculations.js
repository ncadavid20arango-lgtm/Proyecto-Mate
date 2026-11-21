// Funciones matemáticas centrales de EcoHogar.
export function calculateMonthlyEnergy(powerWatts, hoursPerDay, daysPerMonth) {
  return (powerWatts * hoursPerDay * daysPerMonth) / 1000;
}

export function calculateCost(energyKwh, tariff) {
  return energyKwh * tariff;
}

export function calculateTotals(appliances, tariff) {
  const totalKwh = appliances.reduce(
    (sum, item) => sum + calculateMonthlyEnergy(item.power, item.hours, item.days), 0
  );
  return { totalKwh, totalCost: calculateCost(totalKwh, tariff) };
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value, decimals = 1) {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals
  }).format(value);
}

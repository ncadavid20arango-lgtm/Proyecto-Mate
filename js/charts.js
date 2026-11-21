import { calculateMonthlyEnergy, formatNumber } from "./calculations.js";

export function renderConsumptionChart(appliances, container) {
  if (!appliances.length) {
    container.innerHTML = '<div class="chart-empty">Agrega equipos para visualizar la distribución.</div>';
    return;
  }
  const values = appliances.map(item => ({
    name: item.name,
    energy: calculateMonthlyEnergy(item.power, item.hours, item.days)
  })).sort((a, b) => b.energy - a.energy);
  const max = Math.max(...values.map(item => item.energy), 1);
  container.innerHTML = values.map(item => `
    <div class="chart-row">
      <span class="chart-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(item.energy / max) * 100}%"></div></div>
      <span class="chart-number">${formatNumber(item.energy)} kWh</span>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

import {
  calculateMonthlyEnergy, calculateCost, calculateTotals,
  formatCurrency, formatNumber
} from "./calculations.js";
import {
  loadAppliances, saveAppliances, loadTariff, saveTariff
} from "./appliances.js";
import { renderConsumptionChart } from "./charts.js";

let appliances = loadAppliances();
let tariff = loadTariff();

const $ = selector => document.querySelector(selector);
const form = $("#appliance-form");
const tableBody = $("#appliance-table-body");
const emptyState = $("#empty-state");
const reductionSlider = $("#reduction-slider");

function render() {
  const totals = calculateTotals(appliances, tariff);
  $("#total-kwh").innerHTML = `${formatNumber(totals.totalKwh)} <small>kWh</small>`;
  $("#total-cost").textContent = formatCurrency(totals.totalCost);
  $("#appliance-count").textContent = appliances.length;
  $("#potential-saving").textContent = formatCurrency(totals.totalCost * 0.10);

  tableBody.innerHTML = appliances.map(item => {
    const energy = calculateMonthlyEnergy(item.power, item.hours, item.days);
    const cost = calculateCost(energy, tariff);
    return `<tr>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatNumber(item.power, 0)} W</td>
      <td>${formatNumber(item.hours)} h</td>
      <td>${formatNumber(energy)} kWh</td>
      <td>${formatCurrency(cost)}</td>
      <td><div class="row-actions">
        <button class="table-action" data-action="edit" data-id="${item.id}" aria-label="Editar ${escapeHtml(item.name)}">Editar</button>
        <button class="table-action" data-action="delete" data-id="${item.id}" aria-label="Eliminar ${escapeHtml(item.name)}">Eliminar</button>
      </div></td>
    </tr>`;
  }).join("");

  emptyState.classList.toggle("hidden", appliances.length !== 0);
  tableBody.closest("table").classList.toggle("hidden", appliances.length === 0);
  renderConsumptionChart(appliances, $("#consumption-chart"));
  updateSimulation();
}

function updateSimulation() {
  const reduction = Number(reductionSlider.value) / 100;
  const totals = calculateTotals(appliances, tariff);
  const newKwh = totals.totalKwh * (1 - reduction);
  const newCost = newKwh * tariff;
  $("#reduction-label").textContent = `${Math.round(reduction * 100)}%`;
  $("#simulated-cost").textContent = formatCurrency(newCost);
  $("#simulated-saving").textContent = formatCurrency(totals.totalCost - newCost);
  $("#simulated-kwh").textContent = `${formatNumber(newKwh)} kWh`;
}

function showForm(item = null) {
  form.classList.remove("hidden");
  $("#form-heading").textContent = item ? "Editar electrodoméstico" : "Nuevo electrodoméstico";
  $("#appliance-id").value = item?.id ?? "";
  $("#appliance-name").value = item?.name ?? "";
  $("#appliance-power").value = item?.power ?? "";
  $("#appliance-hours").value = item?.hours ?? "";
  $("#appliance-days").value = item?.days ?? 30;
  $("#form-error").textContent = "";
  $("#appliance-name").focus();
}

function hideForm() {
  form.classList.add("hidden");
  form.reset();
  $("#appliance-id").value = "";
  $("#appliance-days").value = 30;
  $("#form-error").textContent = "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

$("#open-form-button").addEventListener("click", () => showForm());
$("#close-form-button").addEventListener("click", hideForm);
$("#cancel-form-button").addEventListener("click", hideForm);
reductionSlider.addEventListener("input", updateSimulation);

form.addEventListener("submit", event => {
  event.preventDefault();
  const id = $("#appliance-id").value;
  const name = $("#appliance-name").value.trim();
  const power = Number($("#appliance-power").value);
  const hours = Number($("#appliance-hours").value);
  const days = Number($("#appliance-days").value);

  if (!name || !Number.isFinite(power) || power <= 0 ||
      !Number.isFinite(hours) || hours < 0 || hours > 24 ||
      !Number.isInteger(days) || days < 1 || days > 31) {
    $("#form-error").textContent = "Verifica los datos: potencia mayor que 0, horas entre 0 y 24 y días entre 1 y 31.";
    return;
  }

  const item = { id: id || crypto.randomUUID(), name, power, hours, days };
  if (id) appliances = appliances.map(existing => existing.id === id ? item : existing);
  else appliances.push(item);

  saveAppliances(appliances);
  hideForm();
  render();
});

tableBody.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = appliances.find(entry => entry.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "edit") showForm(item);
  if (button.dataset.action === "delete") {
    if (confirm(`¿Deseas eliminar "${item.name}"?`)) {
      appliances = appliances.filter(entry => entry.id !== item.id);
      saveAppliances(appliances);
      render();
    }
  }
});

$("#save-tariff-button").addEventListener("click", () => {
  const newTariff = Number($("#tariff-input").value);
  if (!Number.isFinite(newTariff) || newTariff <= 0) {
    $("#tariff-feedback").textContent = "Ingresa una tarifa válida mayor que cero.";
    return;
  }
  tariff = newTariff;
  saveTariff(tariff);
  $("#tariff-feedback").textContent = `Tarifa actualizada: ${formatCurrency(tariff)} por kWh.`;
  render();
});

$("#tariff-input").value = tariff;
render();

# EcoHogar

Primera versión funcional del proyecto académico de Matemáticas 3.

## Estructura
- `index.html`: estructura y contenido de la aplicación.
- `css/styles.css`: diseño visual responsive.
- `js/main.js`: interacción de la interfaz.
- `js/calculations.js`: fórmulas de consumo y costo.
- `js/appliances.js`: almacenamiento local de equipos y tarifa.
- `js/charts.js`: gráfica de consumo por equipo.

## Ejecutar en Visual Studio Code
Como el proyecto utiliza módulos JavaScript (`type="module"`), ejecútalo desde un servidor local:

1. Abre la carpeta `EcoHogar` en Visual Studio Code.
2. Si tienes la extensión **Live Server**, haz clic derecho sobre `index.html` y selecciona **Open with Live Server**.
3. Alternativamente, abre la terminal integrada en VS Code, ubícate en la carpeta del proyecto y ejecuta:
   ```bash
   python -m http.server 5500
   ```
4. Abre `http://localhost:5500` en tu navegador.

## Funcionalidades incluidas
- Panel con consumo mensual, costo estimado, cantidad de equipos y ahorro potencial.
- Datos iniciales de ejemplo que puedes editar o eliminar.
- Agregar, editar y eliminar electrodomésticos.
- Cálculo de kWh y costo mensual por equipo.
- Tarifa configurable en COP/kWh.
- Gráfica comparativa de consumo.
- Simulador de reducción porcentual de horas de uso.
- Persistencia de datos con `localStorage`.

## Modelo matemático
Para cada equipo:

`E = (P × h × d) / 1000`

`C = E × T`

Donde P es potencia en vatios, h son horas de uso al día, d son días de uso al mes y T es la tarifa en COP/kWh.

La tarifa inicial de $900 COP/kWh es ilustrativa. Reemplázala por el valor de tu factura. El costo calculado es una estimación y no reproduce todos los conceptos de una factura de energía.

## Nota
Los datos se guardan en el almacenamiento local del navegador. No se envían a un servidor.

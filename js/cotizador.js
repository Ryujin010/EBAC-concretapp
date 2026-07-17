// =====================================================
// cotizador.js - Logica de cotizador.html

// Funcionalidad DOM #6: pintar en pantalla los datos guardados
//   por index.html y productos.html (localStorage -> DOM).

// Funcionalidad DOM #7: calcular y actualizar el total estimado
//   cada vez que cambia el volumen confirmado.

// Funcionalidad DOM #8: enviar/confirmar la cotizacion.

// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const clienteResumen = document.getElementById('cliente-resumen');
  if (!clienteResumen) return;

  const cliente = JSON.parse(localStorage.getItem('grupo_jesnor_cliente') || 'null');
  const productos = JSON.parse(localStorage.getItem('grupo_jesnor_productos') || 'null');

  const clienteEmpty = document.getElementById('cliente-empty');
  const bombeoEmpty = document.getElementById('bombeo-empty');
  const aditivosEmpty = document.getElementById('aditivos-empty');
  const bombeoResumen = document.getElementById('bombeo-resumen');
  const aditivosResumen = document.getElementById('aditivos-resumen');
  const volumenInput = document.getElementById('volumen-confirmado');
  const totalEstimado = document.getElementById('total-estimado');
  const totalDesglose = document.getElementById('total-desglose');
  const enviarBtn = document.getElementById('enviar-cotizacion-btn');

  const nombresObra = {
    losa: 'Losa', cimentacion: 'Cimentacion / zapata', muro: 'Muro',
    columna: 'Columna', firme: 'Firme / piso', banqueta: 'Banqueta / guarnicion', otro: 'Otro',
  };

  // --- Funcionalidad DOM #6: pintar datos del cliente ---

  if (!cliente) {
    clienteEmpty.hidden = false;
  } else {
    clienteResumen.querySelector('[data-field="clienteNombre"]').textContent = cliente.clienteNombre || '-';
    clienteResumen.querySelector('[data-field="tipoObra"]').textContent = nombresObra[cliente.tipoObra] || cliente.tipoObra || '-';
    clienteResumen.querySelector('[data-field="direccionObra"]').textContent = cliente.direccionObra || '-';
    clienteResumen.querySelector('[data-field="telefono"]').textContent = cliente.telefono || '-';
    clienteResumen.querySelector('[data-field="correo"]').textContent = cliente.correo || '-';
    if (cliente.volumen) volumenInput.value = cliente.volumen;
  }

  // --- Pintar concreto + servicios seleccionados ---

  const concretoValueEl = document.querySelector('[data-field="productoConcreto"]');

  if (!productos || !productos.concreto) {
    concretoValueEl.textContent = 'Sin seleccionar — ve a Productos';
  } else {
    concretoValueEl.textContent = productos.concreto.label;
  }

  if (!volumenInput.value) volumenInput.value = 1;

  function pintarTags(lista, contenedor, emptyEl) {
    contenedor.innerHTML = '';
    if (!lista || lista.length === 0) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    lista.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'summary-tags__item';
      li.textContent = item.label;
      contenedor.appendChild(li);
    });
  }

  pintarTags(productos ? productos.bombeo : [], bombeoResumen, bombeoEmpty);
  pintarTags(productos ? productos.aditivos : [], aditivosResumen, aditivosEmpty);

  // --- Funcionalidad DOM #7: calcular y actualizar el total ---

  function calcularTotal() {
    const volumen = Number(volumenInput.value) || 0;
    let total = 0;
    totalDesglose.innerHTML = '';

    function agregarConcepto(nombre, monto) {
      const li = document.createElement('li');
      li.textContent = `${nombre}: $ ${monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} + IVA`;
      totalDesglose.appendChild(li);
      total += monto;
    }

    if (productos && productos.concreto) {
      agregarConcepto(productos.concreto.label, productos.concreto.precio * volumen);   // precio por m³ * volumen
    }
    (productos ? productos.bombeo : []).forEach((item) => {
      agregarConcepto(item.label, item.precio);
    });
    (productos ? productos.aditivos : []).forEach((item) => {
      agregarConcepto(item.label, item.precio * volumen);       //
    });

    totalEstimado.textContent = `$ ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} + IVA`;
  }

  volumenInput.addEventListener('input', calcularTotal);
  calcularTotal();

  // --- Funcionalidad DOM #8: confirmar envio de la cotizacion ---
  
  enviarBtn.addEventListener('click', () => {
    if (!cliente || !productos || !productos.concreto) {
      alert('Completa el formulario de Cotizar y selecciona tus productos antes de enviar.');
      return;
    }
    alert(`Gracias ${cliente.clienteNombre}, tu cotizacion fue registrada. Nos pondremos en contacto al ${cliente.telefono}.`);
  });
});
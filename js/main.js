// =====================================================
// main.js — Lógica de index.html

// Funcionalidad DOM #1: mostrar/ocultar bloques condicionales
//   (bombeo y aditivo) según las respuestas Si/No.

// Funcionalidad DOM #2: habilitar solo el campo que aplica
//   (metros de tuberia vs. altura de pluma) segun el tipo de bombeo.

// Funcionalidad DOM #3 (compartida con las otras paginas):
//   persistir datos en localStorage para pasarlos entre paginas.

// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quote-form');
  if (!form) return; // este script tambien se carga en otras paginas

  const bombeoDetalle = document.getElementById('bombeo-detalle');
  const aditivoDetalle = document.getElementById('aditivo-detalle');

  const radiosBombeo = form.querySelectorAll('input[name="necesitaBombeo"]');
  const radiosAditivo = form.querySelectorAll('input[name="necesitaAditivo"]');

  const tipoBombeoSelect = document.getElementById('tipo-bombeo');
  const metrosTuberiaInput = document.getElementById('metros-tuberia');
  const alturaPlumaSelect = document.getElementById('altura-pluma');

  // --- Estado inicial: todo oculto hasta que el cliente responda "Si" ---
  
  bombeoDetalle.classList.add('is-hidden');
  aditivoDetalle.classList.add('is-hidden');
  metrosTuberiaInput.disabled = true;
  alturaPlumaSelect.disabled = true;

  // --- Funcionalidad DOM #1: togglear bloque de bombeo ---
 
  radiosBombeo.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const mostrar = e.target.value === 'si';
      bombeoDetalle.classList.toggle('is-hidden', !mostrar);
      tipoBombeoSelect.required = mostrar;
      if (!mostrar) {
        tipoBombeoSelect.value = '';
        metrosTuberiaInput.value = '';
        alturaPlumaSelect.value = '';
        metrosTuberiaInput.disabled = true;
        alturaPlumaSelect.disabled = true;
      }
    });
  });

  // --- Funcionalidad DOM #1 (variante): togglear bloque de aditivo ---
 
  radiosAditivo.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      const mostrar = e.target.value === 'si';
      aditivoDetalle.classList.toggle('is-hidden', !mostrar);
      const tipoAditivoSelect = document.getElementById('tipo-aditivo');
      tipoAditivoSelect.required = mostrar;
      if (!mostrar) tipoAditivoSelect.value = '';
    });
  });

  // --- Funcionalidad DOM #2: habilitar solo el campo al que se le aplica ---
 
  tipoBombeoSelect.addEventListener('change', (e) => {
    const esEstacionario = e.target.value === 'estacionario';
    const esTelescopico = e.target.value === 'telescopico';

    metrosTuberiaInput.disabled = !esEstacionario;
    alturaPlumaSelect.disabled = !esTelescopico;

    if (!esEstacionario) metrosTuberiaInput.value = '';
    if (!esTelescopico) alturaPlumaSelect.value = '';
  });

  // --- Envio del formulario: validar y guardar en localStorage ---
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('grupo_jesnor_cliente', JSON.stringify(data));

    window.location.href = 'productos.html';
  });
});
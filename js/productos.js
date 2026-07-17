// =====================================================
// productos.js — Logica de productos.html

// Funcionalidad DOM #4: contador en vivo de productos
//   seleccionados (radios + checkboxes).

// Funcionalidad DOM #5: guardar la seleccion en localStorage
//   y validar que exista concreto antes de continuar.

// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  const productsForm = document.getElementById('products-form');
  if (!productsForm) return;

  const counterEl = document.getElementById('selection-count');
  const irCotizadorBtn = document.getElementById('ir-cotizador-btn');

  const allInputs = productsForm.querySelectorAll(
    'input[name="producto-concreto"], input[name="producto-bombeo"], input[name="producto-aditivo"]'
  );

  // --- Funcionalidad DOM #4: contador en vivo o tiempo real ---

  function actualizarContador() {
    const seleccionados = productsForm.querySelectorAll(
      'input[name="producto-concreto"]:checked, input[name="producto-bombeo"]:checked, input[name="producto-aditivo"]:checked'
    );
    counterEl.textContent = seleccionados.length;
  }

  allInputs.forEach((input) => {
    input.addEventListener('change', actualizarContador);
  });

  // Restaurar seleccion previa si el cliente ya habia elegido productos
  
  const guardado = JSON.parse(localStorage.getItem('grupo_jesnor_productos') || 'null');
  if (guardado) {
    if (guardado.concreto) {
      const el = productsForm.querySelector(
        `input[name="producto-concreto"][value="${guardado.concreto.value}"]`
      );
      if (el) el.checked = true;
    }
    (guardado.bombeo || []).forEach((item) => {
      const el = productsForm.querySelector(
        `input[name="producto-bombeo"][value="${item.value}"]`
      );
      if (el) el.checked = true;
    });
    (guardado.aditivos || []).forEach((item) => {
      const el = productsForm.querySelector(
        `input[name="producto-aditivo"][value="${item.value}"]`
      );
      if (el) el.checked = true;
    });
  }
  actualizarContador();

  // --- Funcionalidad DOM #5: guardar seleccion + validar + navegar ---
  
  irCotizadorBtn.addEventListener('click', () => {
    const concretoInput = productsForm.querySelector('input[name="producto-concreto"]:checked');

    if (!concretoInput) {
      alert('Selecciona al menos un tipo de concreto antes de continuar.');
      return;
    }

    const bombeoInputs = productsForm.querySelectorAll('input[name="producto-bombeo"]:checked');
    const aditivoInputs = productsForm.querySelectorAll('input[name="producto-aditivo"]:checked');

    const seleccion = {
      concreto: {
        value: concretoInput.value,
        label: concretoInput.dataset.label,
        precio: Number(concretoInput.dataset.precio),
      },
      bombeo: Array.from(bombeoInputs).map((el) => ({
        value: el.value,
        label: el.dataset.label,
        precio: Number(el.dataset.precio),
      })),
      aditivos: Array.from(aditivoInputs).map((el) => ({
        value: el.value,
        label: el.dataset.label,
        precio: Number(el.dataset.precio),
      })),
    };

    localStorage.setItem('grupo_jesnor_productos', JSON.stringify(seleccion));
    window.location.href = 'cotizador.html';
  });
});
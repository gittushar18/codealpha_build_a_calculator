(function () {
  const { Parser } = window.exprEval;
  const parser = new Parser();

  const exprEl = document.getElementById('expression');
  const previewEl = document.getElementById('previewResult');
  const keys = document.querySelectorAll('button.key');

  let expr = ''; // current typed expression

  function updateScreen() {
    exprEl.textContent = expr === '' ? '0' : expr;
    updatePreview();
  }

  function updatePreview() {
    if (!expr || expr.trim() === '') {
      previewEl.textContent = '—';
      previewEl.style.color = '';
      return;
    }
    try {
      const value = parser.evaluate(expr);
      if (Number.isFinite(value)) {
        previewEl.textContent = value;
        previewEl.style.color = 'var(--green)';
      } else {
        previewEl.textContent = 'NaN';
        previewEl.style.color = 'var(--red)';
      }
    } catch (e) {
      previewEl.textContent = '—';
      previewEl.style.color = '';
    }
  }

  function pushValue(v) {
    if (expr === '0' && /^\d$/.test(v)) expr = v;
    else expr += v;
    updateScreen();
  }

  function backspace() {
    expr = expr.slice(0, -1);
    updateScreen();
  }

  function clearAll() {
    expr = '';
    updateScreen();
  }

  function evaluateNow() {
    if (!expr) return;
    try {
      const result = parser.evaluate(expr);
      expr = String(result);
      updateScreen();
    } catch (e) {
      previewEl.textContent = 'Error';
      previewEl.style.color = 'var(--red)';
    }
  }

  // Button clicks
  keys.forEach(k => {
    k.addEventListener('click', (ev) => {
      const v = k.dataset.value;
      const a = k.dataset.action;
      if (a === 'clear') { clearAll(); return; }
      if (a === 'back') { backspace(); return; }
      if (a === 'equals') { evaluateNow(); return; }
      if (v !== undefined) { pushValue(v); }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    const key = ev.key;

    if ((/^[0-9]$/).test(key)) { pushValue(key); ev.preventDefault(); return; }
    if (key === '.' || key === '(' || key === ')') { pushValue(key); ev.preventDefault(); return; }
    if (key === '/' || key === '*' || key === '-' || key === '+') { pushValue(key); ev.preventDefault(); return; }
    if (key === 'Enter') { evaluateNow(); ev.preventDefault(); return; }
    if (key === 'Backspace') { backspace(); ev.preventDefault(); return; }
    if (key === 'Escape') { clearAll(); ev.preventDefault(); return; }
    if (key.toLowerCase() === 'x') { pushValue('*'); ev.preventDefault(); return; }
  });

  // Initialize UI
  clearAll();
})();

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile (hamburguer)
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Auto-fecha as mensagens flash (toasts) apos alguns segundos
  document.querySelectorAll('.toast').forEach((toast) => {
    setTimeout(() => {
      toast.classList.add('toast--hide');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  });
});

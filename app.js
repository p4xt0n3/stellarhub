const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelector('#autButton').addEventListener('click', () => {
  showToast('AUT 服务正在为你准备中 ✦');
});

document.querySelector('#gameButton').addEventListener('click', () => {
  window.location.href = 'hy.html';
});

const toast = document.querySelector('#toast');
const gameConfirm = document.querySelector('#gameConfirm');
const gameConfirmYes = document.querySelector('#gameConfirmYes');
const gameConfirmNo = document.querySelector('#gameConfirmNo');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.current-year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

document.querySelector('#autButton').addEventListener('click', () => {
  window.location.href = 'aut.html';
});

document.querySelector('#gameButton').addEventListener('click', () => {
  gameConfirm.hidden = false;
  gameConfirmYes.focus();
});

function closeGameConfirm() {
  gameConfirm.hidden = true;
  document.querySelector('#gameButton').focus();
}

gameConfirmYes.addEventListener('click', () => {
  window.location.href = 'hy.html';
});

gameConfirmNo.addEventListener('click', closeGameConfirm);

gameConfirm.addEventListener('click', (event) => {
  if (event.target === gameConfirm) closeGameConfirm();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !gameConfirm.hidden) closeGameConfirm();
});

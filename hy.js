const playerOneButton = document.querySelector('#playerOneButton');
const modal = document.querySelector('#playerModal');
const modalClose = document.querySelector('#modalClose');
const galleryImages = document.querySelectorAll('.gallery-image');
const playerOneCheck = document.querySelector('#playerOneCheck');
const billButton = document.querySelector('#billButton');
const selectedCount = document.querySelector('#selectedCount');
const receiptModal = document.querySelector('#receiptModal');
const receiptClose = document.querySelector('#receiptClose');
const receiptItems = document.querySelector('#receiptItems');
const receiptTotal = document.querySelector('#receiptTotal');
const downloadReceipt = document.querySelector('#downloadReceipt');
const studioDownload = document.querySelector('#studioDownload');

document.querySelectorAll('.current-year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

studioDownload.addEventListener('click', () => {
  // Roblox's landing endpoint creates the current installer link on each request.
  // The timestamp prevents a cached response from reusing an older download URL.
  const setupUrl = studioDownload.dataset.downloadUrl;
  studioDownload.href = `${setupUrl}?source=stellar-hub&request=${Date.now()}`;
});

function openModal() {
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  playerOneButton.focus();
}

playerOneButton.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

function getSelectedItems() {
  return playerOneCheck.checked
    ? [{ name: playerOneCheck.dataset.name, price: Number(playerOneCheck.dataset.price) }]
    : [];
}

function updateBillButton() {
  selectedCount.textContent = getSelectedItems().length;
  billButton.classList.toggle('has-items', playerOneCheck.checked);
}

function renderReceipt() {
  const items = getSelectedItems();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  receiptItems.innerHTML = items.length
    ? items.map((item, index) => `
        <div class="receipt-line">
          <span>${String(index + 1).padStart(2, '0')} &nbsp; ${item.name}</span>
          <strong>${item.price}￥</strong>
        </div>
      `).join('')
    : '<p class="receipt-empty">暂未选择项目</p>';
  receiptTotal.textContent = `${total}￥`;
}

function openReceipt() {
  if (!modal.hidden) closeModal();
  renderReceipt();
  receiptModal.hidden = false;
  document.body.classList.add('modal-open');
  receiptClose.focus();
}

function closeReceipt() {
  receiptModal.hidden = true;
  document.body.classList.remove('modal-open');
  billButton.focus();
}

playerOneCheck.addEventListener('change', updateBillButton);
billButton.addEventListener('click', openReceipt);
receiptClose.addEventListener('click', closeReceipt);

receiptModal.addEventListener('click', (event) => {
  if (event.target === receiptModal) closeReceipt();
});

downloadReceipt.addEventListener('click', async () => {
  if (typeof window.html2canvas !== 'function') return;

  downloadReceipt.disabled = true;
  downloadReceipt.textContent = '生成中…';

  try {
    const canvas = await window.html2canvas(document.querySelector('#receiptSheet'), {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });
    const link = document.createElement('a');
    link.download = 'stellar-hub-receipt.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    downloadReceipt.disabled = false;
    downloadReceipt.textContent = '下载 PNG';
  }
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) closeModal();
  if (event.key === 'Escape' && !receiptModal.hidden) closeReceipt();
});

galleryImages.forEach((imageButton) => {
  imageButton.addEventListener('click', () => {
    imageButton.classList.remove('is-blurred');
    imageButton.setAttribute('aria-label', '已显示图片');
  });
});

updateBillButton();

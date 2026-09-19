const autModal = document.querySelector('#autModal');
const autModalClose = document.querySelector('#autModalClose');
const autModalTitle = document.querySelector('#autModalTitle');
const autItemList = document.querySelector('#autItemList');
const autEmpty = document.querySelector('#autEmpty');
const autSectionButtons = document.querySelectorAll('[data-aut-modal]');
const autItemInputs = document.querySelectorAll('.aut-item-row input');
const autBillButton = document.querySelector('#autBillButton');
const autSelectedCount = document.querySelector('#autSelectedCount');
const autReceiptModal = document.querySelector('#autReceiptModal');
const autReceiptClose = document.querySelector('#autReceiptClose');
const autReceiptItems = document.querySelector('#autReceiptItems');
const autReceiptTotal = document.querySelector('#autReceiptTotal');
const autDownloadReceipt = document.querySelector('#autDownloadReceipt');
let lastSectionButton = null;

document.querySelectorAll('.current-year').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

function openAutModal(button) {
  lastSectionButton = button;
  const modalType = button.dataset.autModal;
  const title = button.dataset.autTitle;
  autModalTitle.textContent = title;
  autItemList.hidden = modalType !== 'items';
  autEmpty.hidden = modalType === 'items';
  autEmpty.textContent = `${title}暂无项目`;
  autModal.hidden = false;
  document.body.classList.add('modal-open');
  autModalClose.focus();
}

function closeAutModal() {
  autModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastSectionButton) lastSectionButton.focus();
}

autSectionButtons.forEach((button) => {
  button.addEventListener('click', () => openAutModal(button));
});

autModalClose.addEventListener('click', closeAutModal);

autModal.addEventListener('click', (event) => {
  if (event.target === autModal) closeAutModal();
});

function getSelectedItems() {
  return [...autItemInputs]
    .filter((input) => input.checked)
    .map((input) => ({
      name: input.dataset.name,
      price: Number(input.dataset.price)
    }));
}

function formatPrice(price) {
  return Number.isInteger(price) ? String(price) : price.toFixed(1);
}

function updateBillButton() {
  const count = getSelectedItems().length;
  autSelectedCount.textContent = count;
  autBillButton.classList.toggle('has-items', count > 0);
}

function renderReceipt() {
  const items = getSelectedItems();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  autReceiptItems.innerHTML = items.length
    ? items.map((item, index) => `
        <div class="receipt-line">
          <span>${String(index + 1).padStart(2, '0')} &nbsp; ${item.name}</span>
          <strong>${formatPrice(item.price)}￥</strong>
        </div>
      `).join('')
    : '<p class="receipt-empty">暂未选择项目</p>';
  autReceiptTotal.textContent = `${formatPrice(total)}￥`;
}

function openReceipt() {
  if (!autModal.hidden) closeAutModal();
  renderReceipt();
  autReceiptModal.hidden = false;
  document.body.classList.add('modal-open');
  autReceiptClose.focus();
}

function closeReceipt() {
  autReceiptModal.hidden = true;
  document.body.classList.remove('modal-open');
  autBillButton.focus();
}

autItemInputs.forEach((input) => input.addEventListener('change', updateBillButton));
autBillButton.addEventListener('click', openReceipt);
autReceiptClose.addEventListener('click', closeReceipt);

autReceiptModal.addEventListener('click', (event) => {
  if (event.target === autReceiptModal) closeReceipt();
});

autDownloadReceipt.addEventListener('click', async () => {
  if (typeof window.html2canvas !== 'function') return;

  autDownloadReceipt.disabled = true;
  autDownloadReceipt.textContent = '生成中…';

  try {
    const canvas = await window.html2canvas(document.querySelector('#autReceiptSheet'), {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    });
    const link = document.createElement('a');
    link.download = 'stellar-hub-aut-receipt.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    autDownloadReceipt.disabled = false;
    autDownloadReceipt.textContent = '下载 PNG';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!autModal.hidden) closeAutModal();
  if (!autReceiptModal.hidden) closeReceipt();
});

updateBillButton();

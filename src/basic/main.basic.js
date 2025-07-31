import { handleAddToCart, handleCartDispClick, initializeHandlers } from './utils/handlers.js';
import { PRODUCTS, productList } from './utils/stores.js';
import { initialRender, stockInfo, sum } from './utils/ui/initialRenders.js';
let stockInfo;
let itemCnt;
let totalAmt = 0;
let sum;

const cartDisp = document.createElement('div');
const productSelect = document.createElement('select');
const addBtn = document.createElement('button');

function main() {
  initialRender(productSelect, addBtn, cartDisp);

  // 나머지 로직
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  initializeHandlers(cartDisp, handleCalculateCartStuff, onUpdateSelectOptions);
  addBtn.addEventListener('click', handleAddToCart);
  cartDisp.addEventListener('click', handleCartDispClick);
}

// 8. 옵션 선택 창 업데이트
function onUpdateSelectOptions() {
  productSelect.innerHTML = '';
  const totalStock = getTotalStock();
  const optionElements = productList.map(createProductOption);
  appendOptionsToSelect(optionElements);
  updateSelectBorderColor(totalStock);
}
// 9. 총 재고 수량 계산
function getTotalStock() {
  return productList.reduce((sum, item) => sum + item.quantity, 0);
}
// 10. 상품 옵션 생성
function createProductOption(item) {
  const opt = document.createElement('option');
  opt.value = item.id;

  const discountText = (item.onSale ? ' ⚡SALE' : '') + (item.suggestSale ? ' 💝추천' : '');

  if (item.quantity === 0) {
    opt.textContent = `${item.name} - ${item.discountedPrice}원 (품절)` + discountText;
    opt.disabled = true;
    opt.className = 'text-gray-400';
  } else if (item.onSale && item.suggestSale) {
    opt.textContent = `⚡💝${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (25% SUPER SALE!)`;
    opt.className = 'text-purple-600 font-bold';
  } else if (item.onSale) {
    opt.textContent = `⚡${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (20% SALE!)`;
    opt.className = 'text-red-500 font-bold';
  } else if (item.suggestSale) {
    opt.textContent = `💝${item.name} - ${item.originalPrice}원 → ${item.discountedPrice}원 (5% 추천할인!)`;
    opt.className = 'text-blue-500 font-bold';
  } else {
    opt.textContent = `${item.name} - ${item.discountedPrice}원` + discountText;
  }

  return opt;
}

// 11. 옵션 요소를 셀렉트 박스에 추가
function appendOptionsToSelect(optionElements) {
  optionElements.forEach((opt) => productSelect.appendChild(opt));
}
// 12. 셀렉트 박스의 테두리 색상 업데이트
function updateSelectBorderColor(totalStock) {
  productSelect.style.borderColor = totalStock < 50 ? 'orange' : '';
}

// 얜 뭘깡?
// 계산기여?
function handleCalculateCartStuff() {
  totalAmt = 0;
  itemCnt = 0;

  const cartItems = Array.from(cartDisp.children);
  let subTot = 0;
  const itemDiscounts = [];

  // 1. 수량/금액 합산 및 개별 할인 계산
  const results = cartItems.map((node) => {
    const curItem = productList.find((p) => p.id === node.id);
    const qtyElem = node.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountedPrice * q;

    node.querySelectorAll('.text-lg').forEach((el) => {
      el.style.fontWeight = q >= 10 ? 'bold' : 'normal';
    });

    itemCnt += q;
    subTot += itemTot;

    // 개별 할인은 30개 미만일 때만 적용
    let disc = 0;
    if (itemCnt < 30 && q >= 10) {
      const discMap = {
        [PRODUCTS.KEYBOARD]: 0.1,
        [PRODUCTS.MOUSE]: 0.15,
        [PRODUCTS.MONITOR_ARM]: 0.2,
        [PRODUCTS.LAPTOP_POUCH]: 0.05,
        [PRODUCTS.SPEAKER]: 0.25,
      };
      disc = discMap[curItem.id] || 0;
      if (disc > 0) {
        itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
      }
      totalAmt += itemTot * (1 - disc);
    } else {
      totalAmt += itemTot;
    }

    return { node, curItem, q, itemTot };
  });

  const originalTotal = subTot;
  let discRate = 0;

  // 2. 30개 이상이면 전체 25% 할인만 적용 (개별 할인 무시)
  if (itemCnt >= 30) {
    totalAmt = subTot * 0.75;
    discRate = 0.25;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 3. 화요일이면 10% 추가 할인
  const isTuesday = new Date().getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && totalAmt > 0) {
    totalAmt = totalAmt * 0.9;
    discRate = 1 - totalAmt / originalTotal;
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // 4. UI 업데이트
  updateCartSummaryUI({
    itemCnt,
    subTot,
    results,
    itemDiscounts,
    isTuesday,
    totalAmt,
    discRate,
    originalTotal,
  });

  // 5. 재고 및 포인트 등 추가 UI 업데이트
  updateStockAndPoints();
}

// UI 업데이트 함수 분리
function updateCartSummaryUI({
  itemCnt,
  subTot,
  results,
  itemDiscounts,
  isTuesday,
  totalAmt,
  discRate,
  originalTotal,
}) {
  const itemCountElement = document.getElementById('item-count');
  const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
  itemCountElement.textContent = '🛍️ ' + itemCnt + ' items in cart';
  if (previousCount !== itemCnt) {
    itemCountElement.setAttribute('data-changed', 'true');
  }

  const summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subTot > 0) {
    results.forEach(({ curItem, q, itemTot }) => {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTot.toLocaleString()}</span>
        </div>
      `;
    });

    summaryDetails.innerHTML += `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subTot.toLocaleString()}</span>
      </div>
    `;

    if (itemCnt >= 30) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else {
      itemDiscounts.forEach(({ name, discount }) => {
        summaryDetails.innerHTML += `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${name} (10개↑)</span>
            <span class="text-xs">-${discount}%</span>
          </div>
        `;
      });
    }

    if (isTuesday && totalAmt > 0) {
      summaryDetails.innerHTML += `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    summaryDetails.innerHTML += `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }

  const totalDiv = sum.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmt).toLocaleString();
  }

  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    const points = Math.floor(totalAmt / 1000);
    loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
    loyaltyPointsDiv.style.display = 'block';
  }

  const discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discRate > 0 && totalAmt > 0) {
    const savedAmount = originalTotal - totalAmt;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
}

// 재고 및 포인트 UI 업데이트 함수 분리
function updateStockAndPoints() {
  const stockMsg = productList
    .filter((item) => item.quantity < 5)
    .map((item) =>
      item.quantity > 0
        ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
        : `${item.name}: 품절`,
    )
    .join('\n');
  stockInfo.textContent = stockMsg;
  doRenderBonusPoints();
}

// 보너스 줄까 말까
function isTuesday() {
  return new Date().getDay() === 2;
}

function doRenderBonusPoints() {
  const ptsTag = document.getElementById('loyalty-points');
  const cartItems = Array.from(cartDisp.children);

  if (cartItems.length === 0) {
    ptsTag.style.display = 'none';
    return;
  }

  // 기본 포인트: 구매액의 0.1%
  const basePoints = Math.floor(totalAmt / 1000);
  let finalPoints = basePoints > 0 ? basePoints : 0;
  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  // 화요일 2배 포인트
  if (isTuesday() && basePoints > 0) {
    finalPoints *= 2;
    pointsDetail.push('화요일 2배');
  }

  // 장바구니 내 상품 ID 리스트
  const cartIds = cartItems.map((node) => node.id);
  const cartProducts = cartIds.map((id) => productList.find((p) => p.id === id)).filter(Boolean);

  const hasKeyboard = cartProducts.some((p) => p.id === PRODUCTS.KEYBOARD);
  const hasMouse = cartProducts.some((p) => p.id === PRODUCTS.MOUSE);
  const hasMonitorArm = cartProducts.some((p) => p.id === PRODUCTS.MONITOR_ARM);

  // 키보드+마우스 세트
  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  // 풀세트(키보드+마우스+모니터암)
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  let bulkBonus = null;
  if (itemCnt >= 30) {
    bulkBonus = { pts: 100, label: '대량구매(30개+) +100p' };
  } else if (itemCnt >= 20) {
    bulkBonus = { pts: 50, label: '대량구매(20개+) +50p' };
  } else if (itemCnt >= 10) {
    bulkBonus = { pts: 20, label: '대량구매(10개+) +20p' };
  }

  if (bulkBonus) {
    finalPoints += bulkBonus.pts;
    pointsDetail.push(bulkBonus.label);
  }

  // 포인트 표시 업데이트
  if (ptsTag) {
    ptsTag.style.display = 'block';
    if (finalPoints > 0) {
      ptsTag.innerHTML = `
        <div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>
      `;
    } else {
      ptsTag.textContent = '적립 포인트: 0p';
    }
  }
}

main();

// 핸들러함수

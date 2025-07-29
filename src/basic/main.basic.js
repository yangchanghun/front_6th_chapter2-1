let stockInfo;
let itemCnt;
let lastSel;
let totalAmt = 0;
let sum;
const PRODUCTS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  SPEAKER: 'p5',
};
const productList = [
  {
    id: PRODUCTS.KEYBOARD,
    name: '버그 없애는 키보드',
    discountedPrice: 10000,
    originalPrice: 10000,
    quantity: 50,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.MOUSE,
    name: '생산성 폭발 마우스',
    discountedPrice: 20000,
    originalPrice: 20000,
    quantity: 30,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    discountedPrice: 30000,
    originalPrice: 30000,
    quantity: 20,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    discountedPrice: 15000,
    originalPrice: 15000,
    quantity: 0,
    onSale: false,
    suggestSale: false,
  },
  {
    id: PRODUCTS.SPEAKER,
    name: `코딩할 때 듣는 Lo-Fi 스피커`,
    discountedPrice: 25000,
    originalPrice: 25000,
    quantity: 10,
    onSale: false,
    suggestSale: false,
  },
];

const cartDisp = document.createElement('div');
const productSelect = document.createElement('select');
const addBtn = document.createElement('button');

function main() {
  totalAmt = 0;
  itemCnt = 0;
  lastSel = null;

  const root = document.getElementById('app');
  const header = document.createElement('div'); // 상단 헤더 영역 (쇼핑몰 제목, 카트 텍스트)
  const gridContainer = document.createElement('div'); // 전체 레이아웃 컨테이너 (좌측 상품 / 우측 요약)
  const leftColumn = document.createElement('div'); // 좌측 상품 선택 영역
  const selectorContainer = document.createElement('div'); // 상품 선택 셀렉터와 버튼 컨테이너
  const manualToggle = document.createElement('button'); // 오른쪽 상단 이용안내 버튼
  const rightColumn = document.createElement('div'); // 우측 주문 요약 영역
  const manualOverlay = document.createElement('div'); // 이용안내 오버레이 (백그라운드 어둡게)
  const manualColumn = document.createElement('div'); // 이용안내 슬라이드 열리는 박스
  stockInfo = document.createElement('div'); // 재고 상태 텍스트 표시 영역

  // 헤더에 제목/서브타이틀/카트 아이템 수 표시
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  // 상품 선택 셀렉트 박스와 버튼 스타일 및 설정
  productSelect.id = 'product-select';
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  productSelect.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addBtn.id = 'add-to-cart';

  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 셀렉터 컨테이너 구성
  selectorContainer.appendChild(productSelect);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartDisp); // 장바구니 항목 표시 영역
  cartDisp.id = 'cart-items';

  // 주문 요약 영역 설정
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  //총 금액 요소 참조 (전역 sum 변수에 저장)
  sum = rightColumn.querySelector('#cart-total'); //사용되나 ? 전역에 let으로 선언하고 사용해

  // 이용안내 버튼 구성 및 이벤트 핸들링
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  // 이용안내 내용
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br>
            • 마우스 10개↑: 15%<br>
            • 모니터암 10개↑: 20%<br>
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br>
            • ⚡번개세일: 20%<br>
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  // 전체 구조 조립
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  onUpdateSelectOptions();
  handleCalculateCartStuff();
  // 뜬금 세일
  // const lightningDelay = Math.random() * 10000;
  // setTimeout(() => {
  //   setInterval(function () {
  //     const luckyIdx = Math.floor(Math.random() * productList.length);
  //     const luckyItem = productList[luckyIdx];
  //     if (luckyItem.quantity > 0 && !luckyItem.onSale) {
  //       luckyItem.discountedPrice = Math.round((luckyItem.originalPrice * 80) / 100);
  //       luckyItem.onSale = true;
  //       alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
  //       onUpdateSelectOptions();
  //       doUpdatePricesInCart();
  //     }
  //   }, 30000);
  // }, lightningDelay);
  // setTimeout(function () {
  //   setInterval(function () {
  //     if (cartDisp.children.length === 0) {
  //     }
  //     if (lastSel) {
  //       let suggest = null;
  //       for (let k = 0; k < productList.length; k++) {
  //         if (productList[k].id !== lastSel) {
  //           if (productList[k].quantity > 0) {
  //             if (!productList[k].suggestSale) {
  //               suggest = productList[k];
  //               break;
  //             }
  //           }
  //         }
  //       }
  //       if (suggest) {
  //         alert('💝 ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  //         suggest.discountedPrice = Math.round((suggest.discountedPrice * (100 - 5)) / 100);
  //         suggest.suggestSale = true;
  //         onUpdateSelectOptions();
  //         doUpdatePricesInCart();
  //       }
  //     }
  //   }, 60000);
  // }, Math.random() * 20000);
}

// onUpdateSelectOptions 옵션 선택 창 ?
function onUpdateSelectOptions() {
  productSelect.innerHTML = ''; // 기존 옵션 초기화

  const totalStock = productList.reduce((sum, item) => sum + item.quantity, 0); // 재고 총합

  const optionElements = productList.map((item) => {
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
  });

  optionElements.forEach((opt) => productSelect.appendChild(opt));

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

  const getCurItem = (node) => productList.find((p) => p.id === node.id);

  const results = cartItems.map((node) => {
    const curItem = getCurItem(node);
    const qtyElem = node.querySelector('.quantity-number');
    const q = parseInt(qtyElem.textContent);
    const itemTot = curItem.discountedPrice * q;
    let disc = 0;

    // 강조 처리
    node.querySelectorAll('.text-lg').forEach((el) => {
      el.style.fontWeight = q >= 10 ? 'bold' : 'normal';
    });

    if (q >= 10) {
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
    }

    itemCnt += q;
    subTot += itemTot;
    totalAmt += itemTot * (1 - disc);

    return { node, curItem, q, itemTot };
  });

  const originalTotal = subTot;
  let discRate = 0;

  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 0.25;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  const isTuesday = new Date().getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday && totalAmt > 0) {
    totalAmt = totalAmt * 0.9;
    discRate = 1 - totalAmt / originalTotal;
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

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

  // 재고 메시지 리팩토링
  const stockMsg = productList
    .filter((item) => item.quantity < 5)
    .map((item) =>
      item.quantity > 0
        ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
        : `${item.name}: 품절`,
    )
    .join('\n');

  stockInfo.textContent = stockMsg;
  handleStockInfoUpdate();
  doRenderBonusPoints();
}

// 보너스 줄까 말까
function doRenderBonusPoints() {
  const ptsTag = document.getElementById('loyalty-points');
  const cartItems = Array.from(cartDisp.children);

  if (cartItems.length === 0) {
    ptsTag.style.display = 'none';
    return;
  }

  const basePoints = Math.floor(totalAmt / 1000);
  let finalPoints = basePoints > 0 ? basePoints : 0;
  const pointsDetail = basePoints > 0 ? [`기본: ${basePoints}p`] : [];

  // 화요일 2배 포인트
  const isTuesday = new Date().getDay() === 2;
  if (isTuesday && basePoints > 0) {
    finalPoints = basePoints * 2;
    pointsDetail.push('화요일 2배');
  }

  // 장바구니 내 상품 ID 리스트
  const cartIds = cartItems.map((node) => node.id);
  const cartProducts = cartIds.map((id) => productList.find((p) => p.id === id)).filter(Boolean); // null 제거

  const hasKeyboard = cartProducts.some((p) => p.id === PRODUCTS.KEYBOARD);
  const hasMouse = cartProducts.some((p) => p.id === PRODUCTS.MOUSE);
  const hasMonitorArm = cartProducts.some((p) => p.id === PRODUCTS.MONITOR_ARM);

  if (hasKeyboard && hasMouse) {
    finalPoints += 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints += 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량 구매 보너스
  const bulkBonus =
    itemCnt >= 30
      ? { pts: 100, label: '대량구매(30개+) +100p' }
      : itemCnt >= 20
        ? { pts: 50, label: '대량구매(20개+) +50p' }
        : itemCnt >= 10
          ? { pts: 20, label: '대량구매(10개+) +20p' }
          : null;

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

//상품 수량추가하면 나오는 메시지 인가 ?
function handleStockInfoUpdate() {
  let infoMsg; // 재고 상태 안내 메시지
  infoMsg = '';

  // 총 재고 수(totalStock)를 활용한 조건이 주석 처리되어 있음.
  // 예: 전체 재고가 30개 미만일 때 경고 띄우기 등의 로직으로 사용 가능
  // if (totalStock < 30) {
  //   ...
  // }

  // 각 상품의 재고 상태 확인
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        // 재고는 있지만 5개 미만인 경우 → '재고 부족'
        infoMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        // 재고가 0개인 경우 → '품절'
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  // 재고 상태 메시지를 화면에 표시
  stockInfo.textContent = infoMsg;
}

// 현재 장바구니에 담겨있는 상황에 따라 이름과 할인 여부의 UI를 수정한다
function doUpdatePricesInCart() {
  // 수량 총합 계산 (reduce 사용)

  // map을 활용해 side-effect (DOM 조작) 수행
  Array.from(cartDisp.children).map((cartItem) => {
    const itemId = cartItem.id;

    const product = productList.find((p) => p.id === itemId);
    if (!product) return null;

    const priceDiv = cartItem.querySelector('.text-lg');
    const nameDiv = cartItem.querySelector('h3');

    const formattedOriginal = `₩${product.originalPrice.toLocaleString()}`;
    const formattedDiscount = `₩${product.discountedPrice.toLocaleString()}`;

    const getPriceHTML = (color) => `
      <span class="line-through text-gray-400">${formattedOriginal}</span>
      <span class="${color}">${formattedDiscount}</span>
    `;

    if (product.onSale && product.suggestSale) {
      priceDiv.innerHTML = getPriceHTML('text-purple-600');
      nameDiv.textContent = '⚡💝' + product.name;
    } else if (product.onSale) {
      priceDiv.innerHTML = getPriceHTML('text-red-500');
      nameDiv.textContent = '⚡' + product.name;
    } else if (product.suggestSale) {
      priceDiv.innerHTML = getPriceHTML('text-blue-500');
      nameDiv.textContent = '💝' + product.name;
    } else {
      priceDiv.textContent = formattedDiscount;
      nameDiv.textContent = product.name;
    }

    return null;
  });

  // 계산 다시 반영
  handleCalculateCartStuff();
}

main();

// ADD TO CART
addBtn.addEventListener('click', function () {
  const selItem = productSelect.value;

  // 선택된 ID가 실제 존재하는 상품인지 확인
  const itemToAdd = productList.find((item) => item.id === selItem);

  // 선택 항목이 없거나 유효하지 않으면 종료
  if (!selItem || !itemToAdd) return;

  // 재고가 있어야 추가 가능
  if (itemToAdd.quantity <= 0) return;

  const item = document.getElementById(itemToAdd.id);

  if (item) {
    // 장바구니에 이미 있으면 수량만 증가
    const qtyElem = item.querySelector('.quantity-number');
    const newQty = parseInt(qtyElem.textContent) + 1;

    if (newQty <= itemToAdd.quantity + parseInt(qtyElem.textContent)) {
      qtyElem.textContent = newQty;
      itemToAdd.quantity--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    // 장바구니에 없는 경우 새 DOM 추가
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className =
      'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

    const saleIcon =
      itemToAdd.onSale && itemToAdd.suggestSale
        ? '⚡💝'
        : itemToAdd.onSale
          ? '⚡'
          : itemToAdd.suggestSale
            ? '💝'
            : '';

    const getPriceHTML = () => {
      if (itemToAdd.onSale || itemToAdd.suggestSale) {
        const original = `₩${itemToAdd.originalPrice.toLocaleString()}`;
        const discounted = `₩${itemToAdd.discountedPrice.toLocaleString()}`;
        const color =
          itemToAdd.onSale && itemToAdd.suggestSale
            ? 'text-purple-600'
            : itemToAdd.onSale
              ? 'text-red-500'
              : 'text-blue-500';
        return `<span class="line-through text-gray-400">${original}</span> <span class="${color}">${discounted}</span>`;
      }
      return `₩${itemToAdd.discountedPrice.toLocaleString()}`;
    };

    newItem.innerHTML = `
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${itemToAdd.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${getPriceHTML()}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${getPriceHTML()}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
      </div>
    `;

    cartDisp.appendChild(newItem);
    itemToAdd.quantity--;
  }

  handleCalculateCartStuff();
  lastSel = selItem;
});

// 상품추가하고 - +
cartDisp.addEventListener('click', function (event) {
  const tgt = event.target;

  // 수량조절 또는 삭제 버튼이 아닌 경우 무시
  if (!tgt.classList.contains('quantity-change') && !tgt.classList.contains('remove-item')) return;

  const prodId = tgt.dataset.productId;
  const itemElem = document.getElementById(prodId);
  const prod = productList.find((p) => p.id === prodId);
  if (!prod || !itemElem) return;

  // 수량 변경
  if (tgt.classList.contains('quantity-change')) {
    const qtyChange = parseInt(tgt.dataset.change);
    const qtyElem = itemElem.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + qtyChange;

    if (newQty > 0 && newQty <= prod.quantity + currentQty) {
      qtyElem.textContent = newQty;
      prod.quantity -= qtyChange;
    } else if (newQty <= 0) {
      prod.quantity += currentQty;
      itemElem.remove();
    } else {
      alert('재고가 부족합니다.');
    }

    // 상품 제거
  } else if (tgt.classList.contains('remove-item')) {
    const qtyElem = itemElem.querySelector('.quantity-number');
    const remQty = parseInt(qtyElem.textContent);
    prod.quantity += remQty;
    itemElem.remove();
  }

  handleCalculateCartStuff();
  onUpdateSelectOptions();
});

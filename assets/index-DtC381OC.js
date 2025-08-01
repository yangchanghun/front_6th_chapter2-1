(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function l(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=l(n);fetch(n.href,s)}})();const p={KEYBOARD:"p1",MOUSE:"p2",MONITOR_ARM:"p3",LAPTOP_POUCH:"p4",SPEAKER:"p5"},b=[{id:p.KEYBOARD,name:"버그 없애는 키보드",discountedPrice:1e4,originalPrice:1e4,quantity:50,onSale:!1,suggestSale:!1},{id:p.MOUSE,name:"생산성 폭발 마우스",discountedPrice:2e4,originalPrice:2e4,quantity:30,onSale:!1,suggestSale:!1},{id:p.MONITOR_ARM,name:"거북목 탈출 모니터암",discountedPrice:3e4,originalPrice:3e4,quantity:20,onSale:!1,suggestSale:!1},{id:p.LAPTOP_POUCH,name:"에러 방지 노트북 파우치",discountedPrice:15e3,originalPrice:15e3,quantity:0,onSale:!1,suggestSale:!1},{id:p.SPEAKER,name:"코딩할 때 듣는 Lo-Fi 스피커",discountedPrice:25e3,originalPrice:25e3,quantity:10,onSale:!1,suggestSale:!1}];function w(){return new Date().getDay()===2}function E(){u.itemCnt=0,u.totalAmt=0;let e=0;const t=[],a=Array.from(h.children).map(d=>{const r=b.find(x=>x.id===d.id),g=d.querySelector(".quantity-number"),i=parseInt(g.textContent),c=r.discountedPrice*i;d.querySelectorAll(".text-lg").forEach(x=>{x.style.fontWeight=i>=10?"bold":"normal"}),u.itemCnt+=i,e+=c;let m=0;return u.itemCnt<30&&i>=10?(m={[p.KEYBOARD]:.1,[p.MOUSE]:.15,[p.MONITOR_ARM]:.2,[p.LAPTOP_POUCH]:.05,[p.SPEAKER]:.25}[r.id]||0,m>0&&t.push({name:r.name,discount:m*100}),u.totalAmt+=c*(1-m)):u.totalAmt+=c,{node:d,curItem:r,q:i,itemTot:c}}),n=e;let s=0;u.itemCnt>=30?(u.totalAmt=e*.75,s=.25):s=(e-u.totalAmt)/e;const o=document.getElementById("tuesday-special");w()&&u.totalAmt>0?(u.totalAmt=u.totalAmt*.9,s=1-u.totalAmt/n,o.classList.remove("hidden")):o.classList.add("hidden"),U({itemCnt:u.itemCnt,subTot:e,results:a,itemDiscounts:t,isTuesday:w,totalAmt:u.totalAmt,discRate:s,originalTotal:n}),_()}let P=null,C=null,M=null;const T=(e,t,l)=>{P=e,C=t,M=l},A=()=>{const e=document.getElementById("product-select").value,t=b.find(a=>a.id===e);if(!e||!t||t.quantity<=0)return;const l=document.getElementById(t.id);if(l){const a=l.querySelector(".quantity-number"),n=parseInt(a.textContent)+1;n<=t.quantity+parseInt(a.textContent)?(a.textContent=n,t.quantity--):alert("재고가 부족합니다.")}else{const a=document.createElement("div");a.id=t.id,a.className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0";const n=t.onSale&&t.suggestSale?"⚡💝":t.onSale?"⚡":t.suggestSale?"💝":"",s=()=>{if(t.onSale||t.suggestSale){const o=`₩${t.originalPrice.toLocaleString()}`,d=`₩${t.discountedPrice.toLocaleString()}`,r=t.onSale&&t.suggestSale?"text-purple-600":t.onSale?"text-red-500":"text-blue-500";return`<span class="line-through text-gray-400">${o}</span> <span class="${r}">${d}</span>`}return`₩${t.discountedPrice.toLocaleString()}`};a.innerHTML=`
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${n}${t.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${s()}</p>
        <div class="flex items-center gap-4">
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${t.id}" data-change="-1">−</button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
          <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${t.id}" data-change="1">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${s()}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${t.id}">Remove</a>
      </div>
    `,P.appendChild(a),t.quantity--}C()},I=e=>{const t=e.target;if(!t.classList.contains("quantity-change")&&!t.classList.contains("remove-item"))return;const l=t.dataset.productId,a=document.getElementById(l),n=b.find(s=>s.id===l);if(!(!n||!a)){if(t.classList.contains("quantity-change")){const s=parseInt(t.dataset.change),o=a.querySelector(".quantity-number"),d=parseInt(o.textContent),r=d+s;r>0&&r<=n.quantity+d?(o.textContent=r,n.quantity-=s):r<=0?(n.quantity+=d,a.remove()):alert("재고가 부족합니다.")}else if(t.classList.contains("remove-item")){const s=a.querySelector(".quantity-number"),o=parseInt(s.textContent);n.quantity+=o,a.remove()}C(),M()}};function O(){const e=document.getElementById("loyalty-points"),t=Array.from(h.children);if(t.length===0){e.style.display="none";return}const l=Math.floor(u.totalAmt/1e3);let a=l>0?l:0;const n=l>0?[`기본: ${l}p`]:[];w()&&l>0&&(a*=2,n.push("화요일 2배"));const o=t.map(c=>c.id).map(c=>b.find(m=>m.id===c)).filter(Boolean),d=o.some(c=>c.id===p.KEYBOARD),r=o.some(c=>c.id===p.MOUSE),g=o.some(c=>c.id===p.MONITOR_ARM);d&&r&&(a+=50,n.push("키보드+마우스 세트 +50p")),d&&r&&g&&(a+=100,n.push("풀세트 구매 +100p"));let i=null;u.itemCnt>=30?i={pts:100,label:"대량구매(30개+) +100p"}:u.itemCnt>=20?i={pts:50,label:"대량구매(20개+) +50p"}:u.itemCnt>=10&&(i={pts:20,label:"대량구매(10개+) +20p"}),i&&(a+=i.pts,n.push(i.label)),e&&(e.style.display="block",a>0?e.innerHTML=`
        <div>적립 포인트: <span class="font-bold">${a}p</span></div>
        <div class="text-2xs opacity-70 mt-1">${n.join(", ")}</div>
      `:e.textContent="적립 포인트: 0p")}let y=null,$=null;function H(e,t,l){const a=document.getElementById("app"),n=document.createElement("div"),s=document.createElement("div"),o=document.createElement("div"),d=document.createElement("div"),r=document.createElement("button"),g=document.createElement("div"),i=document.createElement("div"),c=document.createElement("div");y=document.createElement("div"),s.className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden",n.className="mb-8",n.innerHTML=`
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `,e.id="product-select",o.className="bg-white border border-gray-200 p-8 overflow-y-auto",d.className="mb-6 pb-6 border-b border-gray-200",e.className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3",t.id="add-to-cart",y.id="stock-status",y.className="text-xs text-red-500 mt-3 whitespace-pre-line",t.innerHTML="Add to Cart",t.className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all",d.appendChild(e),d.appendChild(t),d.appendChild(y),o.appendChild(d),o.appendChild(l),l.id="cart-items",g.className="bg-black text-white p-8 flex flex-col",g.innerHTML=`
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
  `,r.onclick=function(){i.classList.toggle("hidden"),c.classList.toggle("translate-x-full")},r.className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50",r.innerHTML=`
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `,i.className="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300",i.onclick=function(m){m.target===i&&(i.classList.add("hidden"),c.classList.add("translate-x-full"))},c.className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300",c.innerHTML=`
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
  `,s.appendChild(o),s.appendChild(g),i.appendChild(c),a.appendChild(n),a.appendChild(s),a.appendChild(r),a.appendChild(i),$=g.querySelector("#cart-total")}function N(){return b.reduce((e,t)=>e+t.quantity,0)}function L(){v.innerHTML="";const e=N(),t=b.map(R);B(t),D(e)}function R(e){const t=document.createElement("option");t.value=e.id;const l=(e.onSale?" ⚡SALE":"")+(e.suggestSale?" 💝추천":"");return e.quantity===0?(t.textContent=`${e.name} - ${e.discountedPrice}원 (품절)`+l,t.disabled=!0,t.className="text-gray-400"):e.onSale&&e.suggestSale?(t.textContent=`⚡💝${e.name} - ${e.originalPrice}원 → ${e.discountedPrice}원 (25% SUPER SALE!)`,t.className="text-purple-600 font-bold"):e.onSale?(t.textContent=`⚡${e.name} - ${e.originalPrice}원 → ${e.discountedPrice}원 (20% SALE!)`,t.className="text-red-500 font-bold"):e.suggestSale?(t.textContent=`💝${e.name} - ${e.originalPrice}원 → ${e.discountedPrice}원 (5% 추천할인!)`,t.className="text-blue-500 font-bold"):t.textContent=`${e.name} - ${e.discountedPrice}원`+l,t}function B(e){e.forEach(t=>v.appendChild(t))}function D(e){v.style.borderColor=e<50?"orange":""}const u={itemCnt:0,totalAmt:0},h=document.createElement("div"),v=document.createElement("select"),k=document.createElement("button");function j(){H(v,k,h),L(),E(),T(h,E,L),k.addEventListener("click",A),h.addEventListener("click",I)}function U({itemCnt:e,subTot:t,results:l,itemDiscounts:a,isTuesday:n,totalAmt:s,discRate:o,originalTotal:d}){const r=document.getElementById("item-count"),g=parseInt(r.textContent.match(/\d+/)||0);r.textContent="🛍️ "+e+" items in cart",g!==e&&r.setAttribute("data-changed","true");const i=document.getElementById("summary-details");i.innerHTML="",t>0&&(l.forEach(({curItem:f,q:S,itemTot:q})=>{i.innerHTML+=`
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${f.name} x ${S}</span>
          <span>₩${q.toLocaleString()}</span>
        </div>
      `}),i.innerHTML+=`
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${t.toLocaleString()}</span>
      </div>
    `,e>=30?i.innerHTML+=`
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `:a.forEach(({name:f,discount:S})=>{i.innerHTML+=`
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${f} (10개↑)</span>
            <span class="text-xs">-${S}%</span>
          </div>
        `}),n&&s>0&&(i.innerHTML+=`
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `),i.innerHTML+=`
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `);const c=$.querySelector(".text-2xl");c&&(c.textContent="₩"+Math.round(s).toLocaleString());const m=document.getElementById("loyalty-points");if(m){const f=Math.floor(s/1e3);m.textContent="적립 포인트: "+f+"p",m.style.display="block"}const x=document.getElementById("discount-info");if(x.innerHTML="",o>0&&s>0){const f=d-s;x.innerHTML=`
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(o*100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(f).toLocaleString()} 할인되었습니다</div>
      </div>
    `}}function _(){const e=b.filter(t=>t.quantity<5).map(t=>t.quantity>0?`${t.name}: 재고 부족 (${t.quantity}개 남음)`:`${t.name}: 품절`).join(`
`);y.textContent=e,O()}j();

// =============================================
// 商品データ
// 商品名・色を変更する場合はここを編集
// =============================================
const PRODUCTS = [
  {
    value: 'eye',
    name: 'eye',
    // eyeの色選択肢
    colors: ['白']
  },
  {
    value: 'himawari',
    name: 'ひまわり',
    // ひまわりの色選択肢
    colors: ['白', 'ピンク', '水色']
  },
  {
    value: 'justone',
    name: 'JUST ONE',
    // JUST ONEの色選択肢
    colors: ['白', 'ピンク', '水色']
  },
  {
    value: 'grooveon',
    name: 'GROOVE ON',
    // GROOVE ONの色選択肢
    colors: ['白']
  }
];

// =============================================
// サイズ選択肢
// サイズを変更する場合はここを編集
// =============================================
const SIZES = ['140', '150', 'S', 'M', 'L', 'XL'];

// =============================================
// 温度感選択肢
// 変更する場合はここを編集
// =============================================
const MOODS = ['絶対買いたい', '気になる'];

// =============================================
// ステップ管理
// =============================================
let currentStep = 1;

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const submitBtn = document.getElementById('submitBtn');
const completeView = document.getElementById('completeView');
const wishForm = document.getElementById('wishForm');

// 次へボタン
nextBtn.addEventListener('click', () => {
  if (currentStep === 1) {
    const selected = getSelectedProducts();
    if (selected.length === 0) {
      alert('商品を1つ以上選択してください');
      return;
    }
    buildStep2(selected);
    showStep(2);
  } else if (currentStep === 2) {
    if (!validateStep2()) return;
    showStep(3);
  }
});

// 戻るボタン
backBtn.addEventListener('click', () => {
  if (currentStep === 2) showStep(1);
  if (currentStep === 3) showStep(2);
});

// 送信
wishForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    alert('電話番号を入力してください');
    return;
  }
  submitForm();
});

// =============================================
// 選択商品を取得
// =============================================
function getSelectedProducts() {
  const checkboxes = document.querySelectorAll('input[name="product"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// =============================================
// STEP2を動的に生成
// =============================================
function buildStep2(selectedValues) {
  const container = document.getElementById('productDetails');
  container.innerHTML = '';

  selectedValues.forEach(value => {
    const product = PRODUCTS.find(p => p.value === value);
    if (!product) return;

    const div = document.createElement('div');
    div.className = 'product-detail';
    div.dataset.product = value;

    div.innerHTML = `
      <p class="product-detail__name">${product.name}</p>

      <!-- 色選択 -->
      <div class="detail-section">
        <p class="detail-label">Color</p>
        <div class="option-group">
          ${product.colors.map((color, i) => `
            <input type="radio" class="option-btn" name="color_${value}" id="color_${value}_${i}" value="${color}">
            <label for="color_${value}_${i}">${color}</label>
          `).join('')}
        </div>
      </div>

      <!-- サイズ選択 -->
      <div class="detail-section">
        <p class="detail-label">Size</p>
        <div class="option-group">
          ${SIZES.map((size, i) => `
            <input type="radio" class="option-btn" name="size_${value}" id="size_${value}_${i}" value="${size}">
            <label for="size_${value}_${i}">${size}</label>
          `).join('')}
        </div>
      </div>

      <!-- 温度感選択 -->
      <div class="detail-section">
        <p class="detail-label">温度感</p>
        <div class="option-group">
          ${MOODS.map((mood, i) => `
            <input type="radio" class="option-btn mood" name="mood_${value}" id="mood_${value}_${i}" value="${mood}">
            <label for="mood_${value}_${i}">${mood}</label>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}

// =============================================
// STEP2のバリデーション
// =============================================
function validateStep2() {
  const details = document.querySelectorAll('.product-detail');
  for (const detail of details) {
    const value = detail.dataset.product;
    const product = PRODUCTS.find(p => p.value === value);

    const color = document.querySelector(`input[name="color_${value}"]:checked`);
    const size = document.querySelector(`input[name="size_${value}"]:checked`);
    const mood = document.querySelector(`input[name="mood_${value}"]:checked`);

    if (!color) {
      alert(`「${product.name}」の色を選択してください`);
      return false;
    }
    if (!size) {
      alert(`「${product.name}」のサイズを選択してください`);
      return false;
    }
    if (!mood) {
      alert(`「${product.name}」の温度感を選択してください`);
      return false;
    }
  }
  return true;
}

// =============================================
// ステップ表示切り替え
// =============================================
function showStep(step) {
  currentStep = step;

  step1.style.display = step === 1 ? 'block' : 'none';
  step2.style.display = step === 2 ? 'block' : 'none';
  step3.style.display = step === 3 ? 'block' : 'none';

  backBtn.style.display = step > 1 ? 'block' : 'none';
  nextBtn.style.display = step < 3 ? 'block' : 'none';
  submitBtn.style.display = step === 3 ? 'block' : 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// Google Apps Script URL
// デプロイURLが変わった場合はここを更新
// =============================================
const GAS_URL = 'https://script.google.com/macros/s/AKfycby0qEjqIEwMFYsN3gv0MtUuW9C3FzSoWJfUV3HbwiFemOvo5m7c0_HwMjLX4MpyEQFd/exec';

// =============================================
// フォーム送信処理
// =============================================
async function submitForm() {
  const selectedValues = getSelectedProducts();
  const phone = document.getElementById('phone').value.trim();

  // 送信データを組み立て
  const data = {
    phone,
    items: selectedValues.map(value => {
      const product = PRODUCTS.find(p => p.value === value);
      return {
        name: product.name,
        color: document.querySelector(`input[name="color_${value}"]:checked`)?.value,
        size: document.querySelector(`input[name="size_${value}"]:checked`)?.value,
        mood: document.querySelector(`input[name="mood_${value}"]:checked`)?.value,
      };
    })
  };

  // 送信ボタンを無効化
  submitBtn.disabled = true;
  submitBtn.textContent = '送信中...';

  try {
    // Google Apps Scriptに送信
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // 完了画面を表示
    wishForm.style.display = 'none';
    completeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    alert('送信に失敗しました。もう一度お試しください。');
    submitBtn.disabled = false;
    submitBtn.textContent = '登録する';
  }
}

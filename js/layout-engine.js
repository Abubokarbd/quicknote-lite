let currentLayout = 'standard'; // ডিফল্ট লেআউট ('standard', '3col', '4grid')

function changeLayout(mode, buttonElement) {
  currentLayout = mode;
  
  // বাটনের একটিভ ক্লাসের স্টাইল আপডেট
  document.querySelectorAll('.layout-selector .layout-btn').forEach(btn => btn.classList.remove('active'));
  
  if (buttonElement) {
    buttonElement.classList.add('active');
  }

  repaginate();
}

// লেআউট অনুযায়ী পেজ স্ট্রাকচার তৈরির মূল ইঞ্জিন
function repaginate() {
  const container = document.getElementById('documentPages');
  
  // পূর্বের সকল এডিটর থেকে সমস্ত লেখা সংগ্রহ করা
  const allEditors = document.querySelectorAll('.editor-page, .grid-editor');
  let combinedText = Array.from(allEditors).map(ed => ed.innerText).join('\n').trim();

  // ১. স্ট্যান্ডার্ড A4 মোড
  if (currentLayout === 'standard') {
    container.innerHTML = `
      <div class="a4-page" id="page-1">
        <div class="editor-page" contenteditable="true" oninput="handleInput(this)" onpaste="handlePaste(event, this)">${escapeHtml(combinedText)}</div>
        <div class="page-footer">পৃষ্ঠা ১</div>
      </div>
    `;
  }
  
  // ২. ৩-কলাম ল্যান্ডস্কেপ মোড (3 Columns)
  else if (currentLayout === '3col') {
    container.innerHTML = `
      <div class="a4-page layout-3col" id="page-1">
        <div class="editor-wrapper">
          <div class="editor-page col-editor" contenteditable="true" oninput="handleColumnInput(this)"></div>
          <div class="editor-page col-editor" contenteditable="true" oninput="handleColumnInput(this)"></div>
          <div class="editor-page col-editor" contenteditable="true" oninput="handleColumnInput(this)"></div>
        </div>
        <div class="page-footer">পৃষ্ঠা ১ (৩ কলাম নোট)</div>
      </div>
    `;
    distributeTextIntoElements(combinedText, document.querySelectorAll('.col-editor'));
  }

  // ৩. ৪-স্লাইড গ্রিড মোড (4 Grid Slides)
  else if (currentLayout === '4grid') {
    container.innerHTML = `
      <div class="a4-page layout-4grid" id="page-1">
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleGridInput(this)"></div>
          <div class="grid-footer">স্লাইড ১</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleGridInput(this)"></div>
          <div class="grid-footer">স্লাইড ২</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleGridInput(this)"></div>
          <div class="grid-footer">স্লাইড ৩</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleGridInput(this)"></div>
          <div class="grid-footer">স্লাইড ৪</div>
        </div>
      </div>
    `;
    distributeTextIntoElements(combinedText, document.querySelectorAll('.slide-editor'));
  }
}

// লেখাগুলো ক্রমানুসারে একটির পর একটি বক্সে পুরো জায়গা জুড়ে সাজানো (ডুপ্লিকেট ছাড়াই)
function distributeTextIntoElements(text, elements) {
  if (!text) return;
  
  // বক্সের আকার অনুযায়ী অক্ষরের লিমিট সেট করা হলো যাতে খালি জায়গা কম থাকে
  const charLimit = currentLayout === '3col' ? 950 : 650; 
  
  elements.forEach((el, index) => {
    const start = index * charLimit;
    const end = start + charLimit;
    el.innerText = text.substring(start, end);
  });
}

// ৩ কলামে টাইপ করার সময় ওভারফ্লো হলে পরের কলামে কার্সর নিয়ে যাওয়া
function handleColumnInput(element) {
  const editors = Array.from(document.querySelectorAll('.col-editor'));
  const currentIndex = editors.indexOf(element);
  
  if (element.scrollHeight > element.clientHeight) {
    const nextEditor = editors[currentIndex + 1];
    if (nextEditor) {
      nextEditor.focus();
    }
  }
}

// ৪ স্লাইডে টাইপ করার সময় ওভারফ্লো হলে পরের স্লাইডে কার্সর নিয়ে যাওয়া
function handleGridInput(element) {
  const editors = Array.from(document.querySelectorAll('.slide-editor'));
  const currentIndex = editors.indexOf(element);
  
  if (element.scrollHeight > element.clientHeight) {
    const nextEditor = editors[currentIndex + 1];
    if (nextEditor) {
      nextEditor.focus(); // স্বয়ংক্রিয়ভাবে পরবর্তী স্লাইডে কার্সর চলে যাবে
    }
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

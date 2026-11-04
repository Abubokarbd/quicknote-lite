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

// লেআউট অনুযায়ী পেজ স্ট্রাকচার এবং মাল্টি-পেজ তৈরির মূল ইঞ্জিন
function repaginate() {
  const container = document.getElementById('documentPages');
  
  // পূর্বের সকল এডিটর থেকে সমস্ত লেখা সংগ্রহ করা
  const allEditors = document.querySelectorAll('.editor-page, .grid-editor');
  let combinedText = Array.from(allEditors).map(ed => ed.innerText).join('\n').trim();

  if (!combinedText) combinedText = '';

  container.innerHTML = ''; // কন্টেইনার খালি করে নতুন পেজ জেনারেট করা

  // ১. স্ট্যান্ডার্ড A4 মোড
  if (currentLayout === 'standard') {
    const charLimitPerPage = 1800;
    const totalPages = Math.max(1, Math.ceil(combinedText.length / charLimitPerPage));
    
    for (let i = 0; i < totalPages; i++) {
      const pageText = combinedText.substring(i * charLimitPerPage, (i + 1) * charLimitPerPage);
      const pageDiv = document.createElement('div');
      pageDiv.className = 'a4-page';
      pageDiv.id = `page-${i + 1}`;
      pageDiv.innerHTML = `
        <div class="editor-page" contenteditable="true" oninput="handleDynamicInput()" onpaste="handlePlainPaste(event)">${escapeHtml(pageText)}</div>
        <div class="page-footer">পৃষ্ঠা ${i + 1}</div>
      `;
      container.appendChild(pageDiv);
    }
  }
  
  // ২. ৩-কলাম ল্যান্ডস্কেপ মোড
  else if (currentLayout === '3col') {
    const charLimitPerCol = 900;
    const charsPerPage = charLimitPerCol * 3;
    const totalPages = Math.max(1, Math.ceil(combinedText.length / charsPerPage));

    for (let i = 0; i < totalPages; i++) {
      const pageText = combinedText.substring(i * charsPerPage, (i + 1) * charsPerPage);
      
      // শব্দ না ভেঙে সুবিন্যস্তভাবে টেক্সট ভাগ করার ফাংশন কল
      const col1 = getSafeSubstring(pageText, 0, charLimitPerCol);
      const col2 = getSafeSubstring(pageText, charLimitPerCol, charLimitPerCol * 2);
      const col3 = getSafeSubstring(pageText, charLimitPerCol * 2, charLimitPerCol * 3);

      const pageDiv = document.createElement('div');
      pageDiv.className = 'a4-page layout-3col';
      pageDiv.id = `page-${i + 1}`;
      pageDiv.innerHTML = `
        <div class="editor-wrapper">
          <div class="editor-page col-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.col-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(col1)}</div>
          <div class="editor-page col-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.col-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(col2)}</div>
          <div class="editor-page col-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.col-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(col3)}</div>
        </div>
        <div class="page-footer">পৃষ্ঠা ${i + 1} (৩ কলাম নোট)</div>
      `;
      container.appendChild(pageDiv);
    }
  }

  // ৩. ৪-স্লাইড গ্রিড মোড
  else if (currentLayout === '4grid') {
    const charLimitPerSlide = 650;
    const charsPerPage = charLimitPerSlide * 4;
    const totalPages = Math.max(1, Math.ceil(combinedText.length / charsPerPage));

    for (let i = 0; i < totalPages; i++) {
      const pageText = combinedText.substring(i * charsPerPage, (i + 1) * charsPerPage);
      
      const s1 = getSafeSubstring(pageText, 0, charLimitPerSlide);
      const s2 = getSafeSubstring(pageText, charLimitPerSlide, charLimitPerSlide * 2);
      const s3 = getSafeSubstring(pageText, charLimitPerSlide * 2, charLimitPerSlide * 3);
      const s4 = getSafeSubstring(pageText, charLimitPerSlide * 3, charLimitPerSlide * 4);

      const pageDiv = document.createElement('div');
      pageDiv.className = 'a4-page layout-4grid';
      pageDiv.id = `page-${i + 1}`;
      pageDiv.innerHTML = `
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.slide-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(s1)}</div>
          <div class="grid-footer">স্লাইড ১ (পেজ ${i + 1})</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.slide-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(s2)}</div>
          <div class="grid-footer">স্লাইড ২ (পেজ ${i + 1})</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.slide-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(s3)}</div>
          <div class="grid-footer">স্লাইড ৩ (পেজ ${i + 1})</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor slide-editor" contenteditable="true" oninput="handleDynamicInput()" onkeydown="handleBoxKeyDown(event, this, '.slide-editor')" onpaste="handlePlainPaste(event)">${escapeHtml(s4)}</div>
          <div class="grid-footer">স্লাইড ৪ (পেজ ${i + 1})</div>
        </div>
      `;
      container.appendChild(pageDiv);
    }
  }
}

// শব্দ মাঝখান থেকে না ভেঙে নিরাপদভাবে সাবস্ট্রিং করার ফাংশন
function getSafeSubstring(text, start, end) {
  if (!text || start >= text.length) return '';
  let sub = text.substring(start, end);
  if (end < text.length && !text[end].match(/\s/)) {
    let lastSpace = sub.lastIndexOf(' ');
    if (lastSpace > 0) {
      return text.substring(start, start + lastSpace);
    }
  }
  return sub;
}

// পেস্ট করার সময় ফন্ট সাইজ ও স্টাইল দূর করে শুধু প্লেন টেক্সট রাখার ফাংশন
function handlePlainPaste(event) {
  event.preventDefault();
  const text = event.clipboardData.getData('text/plain');
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  selection.deleteFromDocument();
  selection.getRangeAt(0).insertNode(document.createTextNode(text));
}

// ব্যাকস্পেস বা নেভিগেশন হ্যান্ডেল করার জন্য (বক্স ফাঁকা থাকলে আগের বক্সে যাওয়া)
function handleBoxKeyDown(event, element, selector) {
  const editors = Array.from(document.querySelectorAll(selector));
  const currentIndex = editors.indexOf(element);

  if (event.key === 'Backspace' && element.innerText.trim() === '' && currentIndex > 0) {
    event.preventDefault();
    editors[currentIndex - 1].focus();
  } else if (event.key === 'Enter') {
    // এন্টার চাপলে ওভারফ্লো হলে পরের বক্সে ফোকাস শিফট
    if (element.scrollHeight > element.clientHeight && currentIndex < editors.length - 1) {
      editors[currentIndex + 1].focus();
    }
  }
}

// টাইপ করার সময় স্বয়ংক্রিয়ভাবে পেজ আপডেট করার হ্যান্ডেলার
let typingTimer;
function handleDynamicInput() {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    repaginate();
  }, 1000); 
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

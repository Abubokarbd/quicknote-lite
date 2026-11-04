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

  if (!combinedText) combinedText = '';

  container.innerHTML = ''; // কন্টেইনার খালি করে পেজ রেন্ডার করা

  // ১. স্ট্যান্ডার্ড A4 মোড
  if (currentLayout === 'standard') {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page';
    pageDiv.id = 'page-1';
    pageDiv.innerHTML = `
      <div class="editor-page" contenteditable="true" onpaste="handlePlainPaste(event)">${escapeHtml(combinedText)}</div>
      <div class="page-footer">পৃষ্ঠা ১</div>
    `;
    container.appendChild(pageDiv);
  }
  
  // ২. ৩-কলাম ল্যান্ডস্কেপ মোড
  else if (currentLayout === '3col') {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page layout-3col';
    pageDiv.id = 'page-1';
    pageDiv.innerHTML = `
      <div class="editor-wrapper">
        <div class="editor-page col-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.col-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="editor-page col-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.col-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="editor-page col-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.col-editor')" onpaste="handlePlainPaste(event)"></div>
      </div>
      <div class="page-footer">পৃষ্ঠা ১ (৩ কলাম নোট)</div>
    `;
    container.appendChild(pageDiv);
    
    // প্রথম কলামে পুরো লেখাটি বসিয়ে দেওয়া যাতে সিএসএস বা কীবোর্ড হ্যান্ডেলিং কাজ করে
    if (combinedText) {
      document.querySelector('.col-editor').innerText = combinedText;
    }
  }

  // ৩. ৪-স্লাইড গ্রিড মোড
  else if (currentLayout === '4grid') {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page layout-4grid';
    pageDiv.id = 'page-1';
    pageDiv.innerHTML = `
      <div class="grid-cell">
        <div class="grid-editor slide-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.slide-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="grid-footer">স্লাইড ১</div>
      </div>
      <div class="grid-cell">
        <div class="grid-editor slide-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.slide-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="grid-footer">স্লাইড ২</div>
      </div>
      <div class="grid-cell">
        <div class="grid-editor slide-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.slide-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="grid-footer">স্লাইড ৩</div>
      </div>
      <div class="grid-cell">
        <div class="grid-editor slide-editor" contenteditable="true" onkeydown="handleBoxKeyDown(event, '.slide-editor')" onpaste="handlePlainPaste(event)"></div>
        <div class="grid-footer">স্লাইড ৪</div>
      </div>
    `;
    container.appendChild(pageDiv);

    // প্রথম স্লাইডে পুরো লেখাটি বসিয়ে দেওয়া
    if (combinedText) {
      document.querySelector('.slide-editor').innerText = combinedText;
    }
  }
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

// কীবোর্ড নেভিগেশন ও এন্টার চাপলে পরের বক্সে ফোকাস পাঠানোর হ্যান্ডেলার
function handleBoxKeyDown(event, selector) {
  const editors = Array.from(document.querySelectorAll(selector));
  const currentElement = event.target;
  const currentIndex = editors.indexOf(currentElement);

  // বক্স ফাঁকা থাকা অবস্থায় ব্যাকস্পেস চাপলে আগের স্লাইডে কার্সর যাবে
  if (event.key === 'Backspace' && currentElement.innerText.trim() === '' && currentIndex > 0) {
    event.preventDefault();
    editors[currentIndex - 1].focus();
  } 
  // এন্টার চাপলে বা বক্সের নিচের অংশে গেলে পরের স্লাইডে কার্সর চলে যাবে
  else if (event.key === 'Enter') {
    if (currentElement.scrollHeight > currentElement.clientHeight && currentIndex < editors.length - 1) {
      event.preventDefault();
      editors[currentIndex + 1].focus();
    }
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let currentLayout = 'standard'; // ডিফল্ট লেআউট ('standard', '3col', '4grid')

function changeLayout(mode, buttonElement) {
  currentLayout = mode;
  
  // লেআউট বাটনের একটিভ (active) ক্লাসের স্টাইল আপডেট
  document.querySelectorAll('.layout-selector .layout-btn').forEach(btn => btn.classList.remove('active'));
  
  // যে বাটনটিতে ক্লিক করা হয়েছে সেটিতে active ক্লাস যোগ করা
  if (buttonElement) {
    buttonElement.classList.add('active');
  }

  // পেজ রি-জেনারেট বা রি-পাগিনেট করা
  repaginate();
}

// লেআউট অনুযায়ী পেজ স্ট্রাকচার তৈরির মূল ইঞ্জিন
function repaginate() {
  const container = document.getElementById('documentPages');
  const allEditors = document.querySelectorAll('.editor-page, .grid-editor');
  
  let combinedText = Array.from(allEditors).map(ed => ed.innerText).join('\n');
  if (!combinedText.trim()) combinedText = '';

  // ১. স্ট্যান্ডার্ড A4 মোড
  if (currentLayout === 'standard') {
    container.innerHTML = `
      <div class="a4-page" id="page-1">
        <div class="editor-page" contenteditable="true" style="font-size:${typeof currentFontSize !== 'undefined' ? currentFontSize : 18}px;" oninput="handleInput(this)" onpaste="handlePaste(event, this)">${escapeHtml(combinedText)}</div>
        <div class="page-footer">পৃষ্ঠা ১</div>
      </div>
    `;
    // স্ট্যান্ডার্ড পেজিনেশন লজিক চালাবেন
    if (typeof runStandardPagination === 'function') runStandardPagination(combinedText);
  }
  
  // ২. ৩-কলাম ল্যান্ডস্কেপ মোড (3 Columns)
  else if (currentLayout === '3col') {
    container.innerHTML = `
      <div class="a4-page layout-3col" id="page-1">
        <div class="editor-wrapper">
          <div class="editor-page" contenteditable="true" oninput="handleInput(this)">${escapeHtml(combinedText)}</div>
          <div class="editor-page" contenteditable="true" oninput="handleInput(this)"></div>
          <div class="editor-page" contenteditable="true" oninput="handleInput(this)"></div>
        </div>
        <div class="page-footer">পৃষ্ঠা ১ (৩ কলাম নোট)</div>
      </div>
    `;
  }

  // ৩. ৪-স্লাইড গ্রিড মোড (4 Grid Slides)
  else if (currentLayout === '4grid') {
    container.innerHTML = `
      <div class="a4-page layout-4grid" id="page-1">
        <div class="grid-cell">
          <div class="grid-editor" contenteditable="true" oninput="handleInput(this)">${escapeHtml(combinedText)}</div>
          <div class="grid-footer">স্লাইড ১</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor" contenteditable="true" oninput="handleInput(this)"></div>
          <div class="grid-footer">স্লাইড ২</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor" contenteditable="true" oninput="handleInput(this)"></div>
          <div class="grid-footer">স্লাইড ৩</div>
        </div>
        <div class="grid-cell">
          <div class="grid-editor" contenteditable="true" oninput="handleInput(this)"></div>
          <div class="grid-footer">স্লাইড ৪</div>
        </div>
      </div>
    `;
  }
}

// সাধারণ টেক্সট সিকিউরিটি বা ক্লিনিং হেল্পার
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

let currentFontSize = 18;

// 1. Text Alignment Controls
function setTextAlign(align) {
  document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false, null);
  if(align === 'justify') {
    document.execCommand('justifyFull', false, null);
  }
}

// 2. Text Formatting (Bold, Italic, Underline)
function formatText(command) {
  document.execCommand(command, false, null);
}

// 3. Smooth Font Size Slider Handler
function changeFontSize(size) {
  currentFontSize = parseInt(size);
  if (isNaN(currentFontSize)) return;
  
  // টুলবারের পাশে লাইভ সংখ্যা আপডেট করবে
  const sizeDisplay = document.getElementById('fontSizeValue');
  if (sizeDisplay) {
    sizeDisplay.innerText = currentFontSize;
  }
  
  // সমস্ত এডিটর পেজের ফন্ট সাইজ আপডেট করবে
  const editors = document.querySelectorAll('.editor-page');
  editors.forEach(ed => {
    ed.style.fontSize = currentFontSize + 'px';
  });
  
  // পেজ লেআউট এবং স্প্লিটিং রিফ্রেশ করবে
  repaginate();
}

// 4. Language & Font Detector
function applyFontClass(editor) {
  const text = editor.innerText;
  const banglaPattern = /[\u0980-\u09FF]/;
  if (banglaPattern.test(text)) {
    editor.classList.add('lang-bn');
    editor.classList.remove('lang-en-ar');
  } else {
    editor.classList.add('lang-en-ar');
    editor.classList.remove('lang-bn');
  }
}

// 5. Typing Input Event
function handleInput(element) {
  applyFontClass(element);
  if (element.scrollHeight > element.clientHeight) {
    repaginate();
  }
  updatePageNumbers();
}

// 6. Smart Multi-Page Paste Handler
function handlePaste(event, element) {
  event.preventDefault();
  const pasteText = (event.clipboardData || window.clipboardData).getData('text/plain');
  
  document.execCommand('insertText', false, pasteText);

  requestAnimationFrame(() => {
    repaginate();
  });
}

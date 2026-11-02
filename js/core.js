let currentFontSize = 18;

// 1. Text Alignment Controls
function setTextAlign(align) {
  document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false, null);
  if(align === 'justify') {
    document.execCommand('justifyFull', false, null);
  }
}

// 2. Change Font Size
function changeFontSize(size) {
  currentFontSize = size;
  const editors = document.querySelectorAll('.editor-page');
  editors.forEach(ed => ed.style.fontSize = size + 'px');
  repaginate();
}

// 3. Language & Font Detector
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

// 4. Typing Input Event
function handleInput(element) {
  applyFontClass(element);
  if (element.scrollHeight > element.clientHeight) {
    repaginate();
  }
  updatePageNumbers();
}

// 5. Smart Multi-Page Paste Handler
function handlePaste(event, element) {
  event.preventDefault();
  const pasteText = (event.clipboardData || window.clipboardData).getData('text/plain');
  
  document.execCommand('insertText', false, pasteText);

  requestAnimationFrame(() => {
    repaginate();
  });
}

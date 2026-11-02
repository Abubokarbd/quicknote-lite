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

// 3. Change Font Size (Selected text or Global fallback)
function changeFontSize(size) {
  currentFontSize = size;
  const selection = window.getSelection();
  
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    // যদি লেখা সিলেক্ট করা থাকে, তবে শুধু সিলেক্ট করা অংশের ফন্ট সাইজ পরিবর্তন হবে
    const span = document.createElement('span');
    span.style.fontSize = size + 'px';
    const range = selection.getRangeAt(0);
    span.appendChild(range.extractContents());
    range.insertNode(span);
    
    // পেজিনেশন আপডেট করার জন্য
    const activeEditor = selection.anchorNode.parentElement.closest('.editor-page');
    if (activeEditor) handleInput(activeEditor);
  } else {
    // লেখা সিলেক্ট করা না থাকলে পুরো পেজগুলোর বেস ফন্ট সাইজ আপডেট হবে
    const editors = document.querySelectorAll('.editor-page');
    editors.forEach(ed => ed.style.fontSize = size + 'px');
    repaginate();
  }
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

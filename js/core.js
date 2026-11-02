let currentFontSize = 18;
let savedRange = null;

// ১. টেক্সট অ্যালাইনমেন্ট কন্ট্রোল
function setTextAlign(align) {
  document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false, null);
  if(align === 'justify') {
    document.execCommand('justifyFull', false, null);
  }
}

// ২. টেক্সট ফরম্যাটিং (বোল্ড, ইটালিক, আন্ডারলাইন)
function formatText(command) {
  document.execCommand(command, false, null);
}

// ৩. সিলেকশন সেভ করে রাখা (ফোকাস হারানোর হাত থেকে বাঁচাতে)
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // শুধু এডিটর পেজের ভেতরের সিলেকশনগুলো সেভ করবে
    if (range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
        ? range.commonAncestorContainer.parentElement.closest('.editor-page')
        : range.commonAncestorContainer.closest('.editor-page')) {
      savedRange = range.cloneRange();
    }
  }
});

// ৪. নিখুঁত ফন্ট সাইজ চেঞ্জার (সিলেক্টেড টেক্সট অথবা গ্লোবাল)
function changeFontSize(size) {
  currentFontSize = parseInt(size);
  if (isNaN(currentFontSize)) return;
  
  // টুলবারের পাশে লাইভ সংখ্যা আপডেট করা
  const sizeDisplay = document.getElementById('fontSizeValue');
  if (sizeDisplay) {
    sizeDisplay.innerText = currentFontSize;
  }
  
  const selection = window.getSelection();
  
  // যদি কোনো লেখা সিলেক্ট করা থাকে
  if (savedRange && !savedRange.collapsed) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
    
    try {
      const span = document.createElement('span');
      span.style.fontSize = currentFontSize + 'px';
      span.appendChild(savedRange.extractContents());
      savedRange.insertNode(span);
      
      // সিলেকশন ক্লিয়ার করে পেজিনেশন রিফ্রেশ করা
      selection.removeAllRanges();
      const activeEditor = span.closest('.editor-page');
      if (activeEditor) handleInput(activeEditor);
      return;
    } catch (e) {
      console.log('Selection span error, applying globally:', e);
    }
  }
  
  // লেখা সিলেক্ট করা না থাকলে পুরো পেজের ফন্ট সাইজ পরিবর্তন হবে
  const editors = document.querySelectorAll('.editor-page');
  editors.forEach(ed => {
    ed.style.fontSize = currentFontSize + 'px';
  });
  
  repaginate();
}

// ৫. ভাষা ও ফন্ট ডিটেক্টর
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

// ৬. টাইপিং ইনপুট ইভেন্ট
function handleInput(element) {
  applyFontClass(element);
  if (element.scrollHeight > element.clientHeight) {
    repaginate();
  }
  updatePageNumbers();
}

// ৭. মাল্টি-পেজ পেস্ট হ্যান্ডলার
function handlePaste(event, element) {
  event.preventDefault();
  const pasteText = (event.clipboardData || window.clipboardData).getData('text/plain');
  
  document.execCommand('insertText', false, pasteText);

  requestAnimationFrame(() => {
    repaginate();
  });
}

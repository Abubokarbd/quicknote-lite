// 6. Multi-Page Splitter Engine
function repaginate() {
  const container = document.getElementById('documentPages');
  const allEditors = Array.from(document.querySelectorAll('.editor-page'));
  
  let combinedText = allEditors.map(ed => ed.innerText).join('\n');
  if (!combinedText.trim()) return;

  container.innerHTML = `
    <div class="a4-page" id="page-1">
      <div class="editor-page" contenteditable="true" style="font-size:${currentFontSize}px;" oninput="handleInput(this)" onpaste="handlePaste(event, this)"></div>
      <div class="page-footer">পৃষ্ঠা ১</div>
    </div>
  `;

  let currentEditor = container.querySelector('.editor-page');
  const words = combinedText.split(' ');
  let currentChunk = '';

  for (let i = 0; i < words.length; i++) {
    let testChunk = currentChunk + (currentChunk ? ' ' : '') + words[i];
    currentEditor.innerText = testChunk;
    applyFontClass(currentEditor);

    if (currentEditor.scrollHeight > currentEditor.clientHeight) {
      currentEditor.innerText = currentChunk;
      applyFontClass(currentEditor);

      const newPageIndex = container.children.length + 1;
      const newPage = document.createElement('div');
      newPage.className = 'a4-page';
      newPage.id = `page-${newPageIndex}`;
      newPage.innerHTML = `
        <div class="editor-page" contenteditable="true" style="font-size:${currentFontSize}px;" oninput="handleInput(this)" onpaste="handlePaste(event, this)"></div>
        <div class="page-footer">পৃষ্ঠা ${newPageIndex}</div>
      `;
      container.appendChild(newPage);
      currentEditor = newPage.querySelector('.editor-page');
      
      currentChunk = words[i];
      currentEditor.innerText = currentChunk;
      applyFontClass(currentEditor);
    } else {
      currentChunk = testChunk;
    }
  }

  updatePageNumbers();
}

// 7. Dynamic Page Numbering & Blog Footer Link on Last Page
function updatePageNumbers() {
  const pages = document.querySelectorAll('.a4-page');
  const totalPages = pages.length;

  pages.forEach((page, index) => {
    const footer = page.querySelector('.page-footer');
    if (!footer) return;

    const isLastPage = (index === totalPages - 1);

    if (totalPages === 1) {
      footer.style.display = 'block';
      footer.innerHTML = `
        <div style="font-size: 11px; color: #94a3b8; font-weight: 500; letter-spacing: 0.5px;">www.abubokar.blogspot.com</div>
      `;
    } else {
      footer.style.display = 'block';
      footer.innerHTML = `
        <div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">পৃষ্ঠা ${index + 1} / ${totalPages}</div>
        ${isLastPage ? '<div style="font-size: 11px; color: #94a3b8; font-weight: 500; letter-spacing: 0.5px;">www.abubokar.blogspot.com</div>' : ''}
      `;
    }
  });
}

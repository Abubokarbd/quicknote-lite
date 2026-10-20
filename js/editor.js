(function () {
  "use strict";

  function getEditors() {
    return Array.from(document.querySelectorAll(".editor-page"));
  }

  function detectLanguage(text) {
    if (/[\u0600-\u06FF]/.test(text)) {
      return "arabic";
    }

    if (/[\u0980-\u09FF]/.test(text)) {
      return "bengali";
    }

    return "english";
  }

  function applyLanguageStyle(element) {
    const text = element.innerText || "";
    const language = detectLanguage(text);

    if (language === "arabic") {
      element.style.fontFamily = '"Times New Roman", serif';
      element.style.direction = "rtl";
      element.style.textAlign = "right";
    } else if (language === "bengali") {
      element.style.fontFamily = '"SolaimanLipi", serif';
      element.style.direction = "ltr";
    } else {
      element.style.fontFamily = '"Times New Roman", serif';
      element.style.direction = "ltr";
    }
  }

  function selectAllEditors() {
    const editors = getEditors();

    if (editors.length === 0) return;

    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(editors[0]);

    for (let i = 1; i < editors.length; i++) {
      range.setEndAfter(editors[i]);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function handlePaste(event) {
    const editor = event.currentTarget;
    const clipboard = event.clipboardData;

    if (!clipboard) return;

    event.preventDefault();

    const text = clipboard.getData("text/plain");

    document.execCommand("insertText", false, text);
    applyLanguageStyle(editor);

    if (window.QuickNotePagination) {
      window.QuickNotePagination.updatePageNumbers();
    }
  }

  function bindEditor(editor) {
    if (editor.dataset.editorBound === "true") return;

    editor.dataset.editorBound = "true";

    editor.addEventListener("input", function () {
      applyLanguageStyle(editor);
    });

    editor.addEventListener("paste", handlePaste);

    editor.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "a") {
        event.preventDefault();
        selectAllEditors();
      }
    });
  }

  function init() {
    getEditors().forEach(bindEditor);

    const observer = new MutationObserver(function () {
      getEditors().forEach(bindEditor);
    });

    observer.observe(
      document.getElementById("document-container"),
      { childList: true, subtree: true }
    );
  }

  window.QuickNoteEditor = {
    init,
    bindEditor,
    getEditors,
    detectLanguage,
    applyLanguageStyle,
    selectAllEditors
  };
})();

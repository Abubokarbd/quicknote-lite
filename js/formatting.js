(function () {
  "use strict";

  function getSelectionEditor() {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return null;

    let node = selection.anchorNode;

    if (node && node.nodeType === Node.TEXT_NODE) {
      node = node.parentElement;
    }

    return node ? node.closest(".editor-page") : null;
  }

  function runCommand(command, value = null) {
    const editor = getSelectionEditor();

    if (!editor) {
      alert("প্রথমে এডিটরের মধ্যে কার্সর রাখুন বা লেখা নির্বাচন করুন।");
      return;
    }

    editor.focus();
    document.execCommand(command, false, value);
  }

  function setAlignment(alignment) {
    const editor = getSelectionEditor();

    if (!editor) {
      alert("প্রথমে এডিটরের মধ্যে কার্সর রাখুন।");
      return;
    }

    editor.focus();

    const commandMap = {
      left: "justifyLeft",
      center: "justifyCenter",
      right: "justifyRight",
      justify: "justifyFull"
    };

    const command = commandMap[alignment];

    if (command) {
      document.execCommand(command, false, null);
    }
  }

  function setFontSize(size) {
    const editor = getSelectionEditor();

    if (!editor) {
      alert("প্রথমে লেখা নির্বাচন করুন।");
      return;
    }

    const numericSize = Number(size);

    if (!Number.isFinite(numericSize) ||
        numericSize < 6 ||
        numericSize > 96) {
      return;
    }

    editor.focus();

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    if (selection.isCollapsed) {
      editor.style.setProperty("font-size", `${numericSize}pt`);
      return;
    }

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");

    span.style.fontSize = `${numericSize}pt`;

    try {
      range.surroundContents(span);
    } catch (error) {
      document.execCommand("fontSize", false, "7");

      editor.querySelectorAll('font[size="7"]').forEach(function (font) {
        font.removeAttribute("size");
        font.style.fontSize = `${numericSize}pt`;
      });
    }
  }

  function setTextColor(color) {
    runCommand("foreColor", color);
  }

  window.QuickNoteFormatting = {
    runCommand,
    setAlignment,
    setFontSize,
    setTextColor
  };
})();

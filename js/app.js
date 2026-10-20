(function () {
  "use strict";

  function bindToolbar() {
    document.querySelectorAll("[data-command]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.QuickNoteFormatting.runCommand(
          button.dataset.command
        );
      });
    });

    document.querySelectorAll("[data-align]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.QuickNoteFormatting.setAlignment(
          button.dataset.align
        );
      });
    });

    const fontSize = document.getElementById("font-size");

    fontSize.addEventListener("change", function () {
      window.QuickNoteFormatting.setFontSize(fontSize.value);
    });

    document.getElementById("text-color")
      .addEventListener("input", function (event) {
        window.QuickNoteFormatting.setTextColor(event.target.value);
      });

    document.getElementById("add-page")
      .addEventListener("click", function () {
        const editor = window.QuickNotePagination.addPage();

        if (editor) editor.focus();
      });

    document.getElementById("download-pdf")
      .addEventListener("click", async function () {
        const button = this;
        button.disabled = true;

        try {
          await window.QuickNoteExportPDF.exportPDF();
        } catch (error) {
          console.error("PDF export failed:", error);
          alert("PDF তৈরি করা যায়নি। ব্রাউজারের Console পরীক্ষা করুন।");
        } finally {
          button.disabled = false;
        }
      });

    document.getElementById("download-png")
      .addEventListener("click", async function () {
        const button = this;
        button.disabled = true;

        try {
          await window.QuickNoteExportPNG.exportPNG();
        } catch (error) {
          console.error("PNG export failed:", error);
          alert("PNG তৈরি করা যায়নি। ব্রাউজারের Console পরীক্ষা করুন।");
        } finally {
          button.disabled = false;
        }
      });
  }

  function init() {
    window.QuickNoteEditor.init();
    bindToolbar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

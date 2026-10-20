(function () {
  "use strict";

  const Pagination = {
    getContainer() {
      return document.getElementById("document-container");
    },

    getPages() {
      return Array.from(
        this.getContainer().querySelectorAll(".a4-page")
      );
    },

    createPage() {
      const container = this.getContainer();
      const pageNumber = this.getPages().length + 1;

      const page = document.createElement("section");
      page.className = "a4-page";

      const editor = document.createElement("div");
      editor.className = "editor-page";
      editor.contentEditable = "true";
      editor.spellcheck = true;
      editor.setAttribute("role", "textbox");
      editor.setAttribute("aria-label", `Document page ${pageNumber}`);
      editor.dataset.page = String(pageNumber);

      const footer = document.createElement("footer");
      footer.className = "page-footer";

      const number = document.createElement("span");
      number.className = "page-number";
      number.textContent = String(pageNumber);

      footer.appendChild(number);
      page.append(editor, footer);
      container.appendChild(page);

      this.updatePageNumbers();

      return editor;
    },

    updatePageNumbers() {
      this.getPages().forEach((page, index) => {
        const number = page.querySelector(".page-number");
        const editor = page.querySelector(".editor-page");

        if (number) {
          number.textContent = String(index + 1);
        }

        if (editor) {
          editor.dataset.page = String(index + 1);
          editor.setAttribute(
            "aria-label",
            `Document page ${index + 1}`
          );
        }
      });
    },

    addPage() {
      return this.createPage();
    }
  };

  window.QuickNotePagination = Pagination;
})();

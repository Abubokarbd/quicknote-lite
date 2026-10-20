(function () {
  "use strict";

  async function exportPNG() {
    if (!window.html2canvas) {
      alert("PNG লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
      return;
    }

    const pages = Array.from(
      document.querySelectorAll(".a4-page")
    );

    for (let i = 0; i < pages.length; i++) {
      const canvas = await window.html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      });

      const link = document.createElement("a");
      link.download = `quicknote-page-${i + 1}.png`;
      link.href = canvas.toDataURL("image/png");

      document.body.appendChild(link);
      link.click();
      link.remove();

      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  window.QuickNoteExportPNG = { exportPNG };
})();

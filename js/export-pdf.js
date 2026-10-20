(function () {
  "use strict";

  async function exportPDF() {
    if (!window.html2canvas || !window.jspdf) {
      alert("PDF লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন।");
      return;
    }

    const pages = Array.from(
      document.querySelectorAll(".a4-page")
    );

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await window.html2canvas(pages[i], {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      });

      const image = canvas.toDataURL("image/png");

      if (i > 0) {
        pdf.addPage("a4", "portrait");
      }

      pdf.addImage(image, "PNG", 0, 0, 210, 297);
    }

    pdf.save("quicknote-lite.pdf");
  }

  window.QuickNoteExportPDF = { exportPDF };
})();

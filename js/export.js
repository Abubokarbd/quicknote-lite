// 8. Flawless Page-by-Page Canvas PDF Generator
async function exportToPDF() {
  const pdfBtn = document.getElementById('pdfBtn');
  pdfBtn.innerText = 'PDF প্রসেস হচ্ছে...';
  pdfBtn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = document.querySelectorAll('.a4-page');

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    }

    pdf.save('QuickNote_' + new Date().toISOString().slice(0,10) + '.pdf');
  } catch (error) {
    alert('PDF তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
    console.error(error);
  } finally {
    pdfBtn.innerText = 'PDF ডাউনলোড';
    pdfBtn.disabled = false;
  }
}

// 9. Individual Page PNG Export
async function exportToPNG() {
  const pngBtn = document.getElementById('pngBtn');
  pngBtn.innerText = 'PNG প্রসেস হচ্ছে...';
  pngBtn.disabled = true;

  try {
    const pages = document.querySelectorAll('.a4-page');
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const canvas = await html2canvas(page, { scale: 2, useCORS: true, logging: false });
      
      const link = document.createElement('a');
      link.download = `QuickNote_Page_${i + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  } catch (error) {
    alert('PNG ডাউনলোড করতে সমস্যা হয়েছে।');
  } finally {
    pngBtn.innerText = 'PNG ডাউনলোড';
    pngBtn.disabled = false;
  }
}

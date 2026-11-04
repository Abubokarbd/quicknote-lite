let currentLayout = 'standard'; // ডিফল্ট লেআউট ('standard', '3col', '4grid')

function changeLayout(mode, buttonElement) {
  currentLayout = mode;
  
  // লেআউট বাটনের একটিভ (active) ক্লাসের স্টাইল আপডেট
  document.querySelectorAll('.layout-selector .layout-btn').forEach(btn => btn.classList.remove('active'));
  
  // যে বাটনটিতে ক্লিক করা হয়েছে সেটিতে active ক্লাস যোগ করা
  if (buttonElement) {
    buttonElement.classList.add('active');
  }

  // পেজ রি-জেনারেট বা রি-পাগিনেট করা
  repaginate();
}

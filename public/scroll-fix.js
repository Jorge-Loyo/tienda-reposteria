// Force scroll to top on page load
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });
  
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
  });
  
  // Immediate scroll to top
  window.scrollTo(0, 0);
}
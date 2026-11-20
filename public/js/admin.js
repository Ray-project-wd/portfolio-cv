(function () {
  'use strict';
  // Konfirmasi sebelum menghapus
  document.querySelectorAll('form[data-confirm]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      if (!window.confirm(f.getAttribute('data-confirm'))) e.preventDefault();
    });
  });
  // Pratinjau gambar sebelum diunggah
  document.querySelectorAll('input[type=file][data-preview]').forEach(function (input) {
    input.addEventListener('change', function () {
      var img = input.parentElement.querySelector('.preview-new');
      var file = input.files && input.files[0];
      if (!img) return;
      if (!file) { img.hidden = true; return; }
      if (file.size > 5 * 1024 * 1024) { alert('Ukuran gambar maksimal 5 MB.'); input.value = ''; img.hidden = true; return; }
      img.src = URL.createObjectURL(file);
      img.hidden = false;
    });
  });
})();

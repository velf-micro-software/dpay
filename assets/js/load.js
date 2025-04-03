function importModal(_url) {
  fetch(_url)
    .then(response => response.text())
    .then(data => {
      $('.layout-container').append(data);
    })
    .catch(error => console.error('Error al importar el archivo HTML:', error));
}

function loadScripts() {
  const scripts = [
      "./assets/vendor/libs/jquery/jquery.js",
      "./assets/vendor/libs/bootstrap/bootstrap.js",
      "./assets/vendor/libs/momentjs/moment.min.js",
      "./assets/vendor/libs/chartJs/chart.min.js",
      "./assets/vendor/libs/select2/select2.min.js",
      "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js",
      "./assets/vendor/libs/menujs/helpers.js",
      "./assets/vendor/libs/fbs/app.js",
      "./assets/vendor/libs/fbs/stg.js",
      "./assets/vendor/libs/menujs/menu.js",
      "./assets/vendor/libs/misc/util.js",
      "./assets/vendor/libs/misc/mod.js",
      "./assets/vendor/libs/misc/cfg.js",
      "./assets/vendor/libs/misc/main.js",
  ];

  scripts.forEach(function(src) {
      var script = `<script src="${src}"></script>`;
      document.write(script);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  loadScripts();
  importModal('app/spinner.html');
  importModal('app/account.html');
  importModal('app/client.html');
  importModal('app/cost.html');
  importModal('app/history.html');
  importModal('app/historic.html');
  importModal('app/info.html');
  importModal('app/pay.html');
  importModal('app/resumen.html');
});

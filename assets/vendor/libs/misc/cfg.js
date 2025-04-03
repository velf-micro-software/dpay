const firebaseConfig = {
  apiKey: "AIzaSyBii7iojan9viZ3kdXWjqDKwW79V2zqBAQ",
  authDomain: "dbpay-e776a.firebaseapp.com",
  projectId: "dbpay-e776a",
  storageBucket: "dbpay-e776a.appspot.com",
  messagingSenderId: "978767902452",
  appId: "1:978767902452:web:902b2255da2d02497a90a1"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref('dtdpay.json');

function importJSON() {

  storageRef.getDownloadURL()
    .then(url => {

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, JSON.stringify(data[key]));
          });
          $('#spinnerModal').modal('hide');
          reloadTableAccount();
        })
        .catch(error => {
          console.error('Error fetching JSON:', error);
        });
    }).catch(error => {
      console.error('Error downloading file:', error);
    });
}

function exportJSON() {
  var combinedData = {};

  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var dataToExport = JSON.parse(localStorage.getItem(key));
    combinedData[key] = dataToExport;
  }
  var storageRef = firebase.storage().ref();
  var jsonFileRef = storageRef.child('dtdpay.json');

  var jsonString = JSON.stringify(combinedData);

  var blob = new Blob([jsonString], { type: "application/json" });

  jsonFileRef.put(blob).then(function (snapshot) {
    $('#spinnerModal').modal('hide');
  }).catch(function (error) {
    console.error('Error al subir el JSON a Firebase Storage: ', error);
    $('#spinnerModal').modal('hide');
  });
}
var url = window.location.pathname.substring(window.location.pathname.lastIndexOf('/')+1);
$('.menu-inner li').removeClass('active');
$('.menu-inner .menu-item a[href="'+url+'"]').parent('.menu-item').addClass('active');

function mostrarFechaHora() {
  let dzone = moment().format('DD/MM/YYYY');
  let tzone = moment().format('hh:mm a');
  $('#nav-date').html(dzone + " | " + tzone);
}

$(document).ready(function () {

  mostrarFechaHora();

  setInterval(function(){
    mostrarFechaHora();
  }, 40000);

  /*VALIDACIONES DE CAMPOS INDIVIDUALES*/
  $('.val-only-letters').on('keypress',function(event){//#SOLO LETRAS
    return /[a-z ]/i.test(event.key);
  });
  
  $('.val-only-acc').on('keypress',function(event){//#SOLO LETRAS
    //return /[a-z ]/i.test(event.key);
    var charCode
    charCode = event.keyCode 
    if (charCode >= 192 && charCode <= 255) {
      console.log('');
    }else return /[a-z ]/i.test(event.key);
  });

  $('.val-only-numbers').on('keypress',function(event){ //#SOLO NUMEROS
    return /[0-9]/i.test(event.key);
  });

  $('.val-only-edad').on('keypress',function(event){ //#VALIDAR EDAD
    if($(this).val().length >= 3){
      if($(this).val() > 110)$(this).val("");
      event.preventDefault();
    }
  });

  $('.val-only-edad').blur(function(){ //#VALIDAR EDAD
    if($(this).val().length >= 3 && $(this).val() > 110)$(this).val("");
  });

  $('.val-only-phoneNumber').on('keypress',function(event){
    return /^(([0-9]{4})-([0-9]{7}))( ([0-9]{4})-([0-9]{7}))?$/.test(event.key);
  });

  $('.val-only-alpha').on('keypress',function(event){//#SOLO LETRAS
    return /^[0-9a-zA-Z]+$/.test(event.key);
  });

  $('.val-all').on('keypress',function(event){
    return /^[a-zA-Z0-9.,#-]+$/i.test(event.key);
  });

  $('.val-mount').on('keypress',function(event){
    return /^[0-9,]+$/i.test(event.key);
  });

  $('.val-nospc').on('keypress',function(event){
    return /^\S*$/i.test(event.key);
  });

}); 

function response($url,$data){
  jqxhr = $.ajax({
    type: "POST",
    url: $url,
    data: $data,
    async: false
  });
  return jqxhr.responseText;
}

function float2int (value) {
  return value | 0;
}

function empty(e) {

  switch (e) {
    case "":
    case 0:
    case "0":
    case null:
    case undefined:
    case false:
    case typeof(e) === undefined:
    case typeof(e) == "undefined":
      return true;
    default:
      return false;
  }
}

function getToday(){
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

function stopMax($ipt,$lg){
  if($($ipt).val().length == $lg)
    event.preventDefault();
}

function base64Encode(str) {
  utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  });
  return btoa(utf8Bytes);
}

function base64Decode(str) {
  utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode('0x' + p1);
  });
  return atob(utf8Bytes);
}

function comparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index), valB = getCellValue(b, index);
    return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB);
  }
}


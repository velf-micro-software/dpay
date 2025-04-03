let myPieChart;
let fhoy = moment().format('YYYY-MM-DD');

function getCuotasPagos(client) {
  pagos = JSON.parse(localStorage.getItem('pagos'));
  var ptoday = 0;
  var totalPagado = 0;
  if (pagos != null || empty(pagos) == false) {
    Object.keys(pagos).forEach(key => {
      if (pagos[key]['doc'] == client['doc'] && pagos[key]['cod'] == client['cod']) {
        totalPagado += Number(pagos[key]['pago-cuota']);
        ptoday += (pagos[key]['fpago'] == fhoy) ? Number(pagos[key]['pago-cuota']) : 0;
      }
    });
  }
  let cuotasPagadas = (totalPagado / client['monto-cuota']);
  // Redondear hacia abajo si se alcanza una cuota completa
  if (cuotasPagadas % 1 === 0) {
    cuotasPagadas = Math.floor(cuotasPagadas); // Redondear hacia abajo
  } else {
    cuotasPagadas = cuotasPagadas.toFixed(1);
  }

  response = {
    'ptoday': ptoday,
    'totalPagado': totalPagado,
    'cuotasPagadas': cuotasPagadas
  };
  return response;
}

function getClientReput(client) {
  let cuotasAtrasadas = 0;
  // Calcular el estado o reputacion del cliente
  let saldoPendiente = client['pago-monto'] - getCuotasPagos(client).totalPagado;
  let cuotasRestantes = saldoPendiente / client['monto-cuota'];

  let buenCliente = (cuotasAtrasadas === 0 && cuotasRestantes === 0);
  let malCliente = (cuotasAtrasadas > 0 || cuotasRestantes > 0);

  let pagador = '<i class="bi bi-dash text-dark"></i>';
  if (buenCliente) {
    pagador = '<i class="bi bi-hand-thumbs-up-fill text-success"></i>';
  } else if (malCliente) {
    '<i class="bi bi-hand-thumbs-down-fill text-danger"></i>';
  } else {
    pagador = '-';
  }
  return pagador;
}

function reloadTableAccount() {
  data = JSON.parse(localStorage.getItem('data'));
  if (data != null && data.length > 0) {

    $('#tbl-acc tbody,#mdl-newAcc #opt-cli').html("");
    $('#mdl-newAcc #opt-cli').append('<option selected disabled value="">Elegir uno</option>');
    let terminados = 0;
    for (let i = 0; i < data.length; i++) {
      var client = data[i];
      var cref = (client['ref'].length > 0) ? `<br><small class="">Ref: ` + client['ref'] + `</small>` : '';
      var alias = (client['alias'].length > 0) ? `<br><small class="">( ` + client['alias'] + `)</small>` : '';
      let $opt = `<option value="` + client['doc'] + `">` + client['nom'] + ` ` + client['ape'] + `</option>`;

      let cuotasPagadas = getCuotasPagos(client).cuotasPagadas;
      let totalPagado = getCuotasPagos(client).totalPagado;
      let totalHoy = getCuotasPagos(client).ptoday;
      if (Number(client['ncuota']) > Number(cuotasPagadas)) {

        let pagador = getClientReput(client);

        let $tr = `
          <tr cod="${client['cod']}" >
          <td width="5%">${pagador}</td>
          <td width="90%" class="">${client['nom']} ${client['ape']} ${alias}  ${cref}</td>
          <td width="5%" class="">P:${client['pago-monto']}<br>C:${client['monto-cuota']}<br>H:${totalHoy}</td>
          <td width="5%" class="fw-bold">${client['ncuota']}/${cuotasPagadas}</td>
          <td width="10%">
            <div class="dropdown">
              <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="bx bx-dots-vertical-rounded bx-md text-light"></i>
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" onclick="clientPay(this)" np="false" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-pago" href="javascript:void(0);">
                  <i class="bx bx-plus me-1"></i> Pago Manual
                </a>
                <a class="dropdown-item" onclick="clientPay(this)" np="true" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-pago" href="javascript:void(0);">
                  <i class="bi bi-x-octagon me-1"></i> No Pago
                </a>
                <a class="dropdown-item" onclick="viewClientPay(this)" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-hist" href="javascript:void(0);">
                  <i class="bx bx-history me-1"></i> Historial de Pago
                </a>
                <a class="dropdown-item" cl="${client['doc']}" cod="${client['cod']}" target="_blank" href="https://wa.me/` + client['tel'] + `">
                  <i class="bi bi-whatsapp me-1"></i> Enviar Mensaje
                </a>
                <a class="dropdown-item" onclick="viewClient(this)" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-info" href="javascript:void(0);">
                  <i class="bi bi-info-circle me-1"></i> Info. Cliente
                </a>
                <a class="dropdown-item" onclick="viewClientPres(this)" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-histp" href="javascript:void(0);">
                  <i class="bx bx-book me-1"></i> Historial de Prestamos
                </a>
                <a class="dropdown-item text-danger" onclick="deleteAccount(this,'A')" cl="${client['doc']}" cod="${client['cod']}" href="javascript:void(0);">
                  <i class="bi bi-trash me-1"></i> Eliminar Cuenta
                </a>
              </div>
            </div>
          </td>
        </tr>
      `;

        $('#mdl-newAcc #opt-cli').append($opt);
        $('#tbl-acc tbody').append($tr);
      } else {
        data[i]['estatus'] = 'terminado';
        terminados++;
      }
      document.getElementById('tcuenta').innerHTML = `(${((i + 1) - terminados)})<br><i class="bi bi-card-list bx-md fw-bold"></i>`;
    }
    localStorage.setItem('data', JSON.stringify(data));
  }
}

function syncData() {

  if($('.avatar').hasClass('avatar-busy')){
    alert('ERROR AL SINCRONIZAR \n Por favor verifique su Conexion');
    return
  }

  $('#spinnerModal').modal('show');
  if (localStorage.getItem('data') || localStorage.getItem('pagos')) {
    exportJSON();
  } else {
    importJSON();
  }
  
  $('#mdl-pago #fpago').val(moment().format('YYYY-MM-DD'));
  $('#mdl-pago #fpago').attr('max', moment().format('YYYY-MM-DD'));

  $('#mdl-gasto #fgasto').val(moment().format('YYYY-MM-DD'));
  $('#mdl-gasto #fgasto').attr('max', moment().format('YYYY-MM-DD'));

  reloadTableAccount();

  if (myPieChart) {
    myPieChart.destroy();
  }

  $('#tbl-pagos tbody').html("");
  $('#frm-pago')[0].reset();
  $('#frm-gasto')[0].reset();

}

function saveAccount(event, $frm) {
  event.preventDefault();
  if (!$frm.checkValidity()) {
    return;
  } else {
    data = JSON.parse(localStorage.getItem('data'));
    if (empty(data) == true) {
      data = [];
    }
    init = data.length;
    tmpData = $($frm).serializeArray();
    dt = {};
    for (let i = 0; i < tmpData.length; i++) {
      dt[tmpData[i]['name']] = tmpData[i]['value'];
    }

    let lastCode = data.length > 0 ? data[data.length - 1].cod : 0;
    dt.cod = lastCode + 1;

    data.push(dt);

    localStorage.setItem('data', JSON.stringify(data));
    if (init < data.length) {
      person = confirm("¿Esta Seguro de Agregar esta nueva cuenta?");
      if (person) {
        alert('Cuenta Agregada Correctamente!');
        $($frm)[0].reset();
        $('#optclient').val('V').trigger('change');
      } else {
        data.pop();
        localStorage.setItem('data', JSON.stringify(data));
      }
      $('#mdl-newAcc').modal('hide');
      reloadTableAccount();
    }
  }
}

function deleteAccount(client,type) {
  let questionx = confirm("¿Esta Seguro que desea Eliminar esta cuenta?");
  if (questionx) {
    data = JSON.parse(localStorage.getItem('data'));
    doc = $(client).attr('cl');
    cod = $(client).attr('cod');
    if(type == 'C'){
      data.forEach(function (e, index) {
        if (doc == e.doc) {
          data.splice(index, 1);
        }
      });
    }else if(type == 'A'){
      data.forEach(function (e, index) {
        if (cod == e.cod && doc == e.doc) {
          data.splice(index, 1);
        }
      });
    }

    localStorage.setItem('data', JSON.stringify(data));
    $(`#tbl-acc tr[cod="${cod}"]`).remove();
    
    if(type == 'C'){
      $(`#tbl-client tbody tr[cod="${cod}"`).remove();  
    }

    cuentas = $('#tbl-acc tr').length;
    $('#tcuenta').html(`(${cuentas - 1})<br><i class="bi bi-card-list bx-md fw-bold"></i>`);
    alert('Cuenta Eliminada Correctamente');
  } else {
    return;
  }
}

function extractClients(array) {
  
  if(empty(array)){
    return;
  }
  
  let uniqueClientes = {};
  let options = '';

  for (let cliente of array) {
    if (!uniqueClientes[cliente.doc]) {
      uniqueClientes[cliente.doc] = {
        nom: cliente.nom,
        ape: cliente.ape
      };
    }
  }
  options = `<option selected value="">Seleccionar Uno</option>`;
  for (let doc in uniqueClientes) {
    options += `<option value="${doc}">${uniqueClientes[doc].nom} ${uniqueClientes[doc].ape}</option>`;
  }

  return options;
}

function importExistClient(opt) {
  var data = JSON.parse(localStorage.getItem('data'));
  idDoc = $(opt).val();
  $.each(data, function (i, value) {
    if (data[i]['doc'] == idDoc) {
      $('#doc').val(idDoc);
      $('#doc2').val(data[i]['doc2']);
      $('#nom').val(data[i]['nom']);
      $('#ape').val(data[i]['ape']);
      $('#alias').val(data[i]['alias']);
      $('#dir').val(data[i]['dir']);
      $('#tel').val(data[i]['tel']);
      $('#ref').val(data[i]['ref']);
    }
  });

}

function loadTableClients() {
  var data = JSON.parse(localStorage.getItem('data'));
  if(empty(data)){
    return;
  }

  var uniqueCodes = {};
  var uniqueData = data.filter(function (item) {
    return uniqueCodes.hasOwnProperty(item.doc) ? false : (uniqueCodes[item.doc] = true);
  });

  var table = $('#tbl-client tbody');
  table.empty();

  var clientRows = uniqueData.map(function (client, index) {
    let pagador = getClientReput(client);
    client['alias'] = (empty(client['alias']) == false) ? `( ${client['alias']} )` : '';
    return `
      <tr id="${client['doc']}">
        <td>${index + 1}</td>
        <td>
          <div class="row">${client['nom']} ${client['ape']} ${client['alias']}</div>
          <div class="row">${client['dir']} - ${client['tel']}</div>
        </td>
        <td>
          <button type="button" onclick="viewClientPres(this)" cl="${client['doc']}" cod="${client['cod']}" data-bs-toggle="modal" data-bs-target="#mdl-histp" class="btn btn-sm">
            <i class="bx bx-book text-dark"></i>
          </button>
          <button type="button" onclick="deleteAccount(this,'C')" cl="${client['doc']}" class="btn btn-sm text-danger">
            <i class="bi bi-trash fw-bold"></i>
          </button>
        </td>
        <td>${pagador}</td>
      </tr>
    `;
  });

  table.append(clientRows.join(''));
}

function filterAccount(search, tableId) {
  var table = document.getElementById(tableId).tBodies[0];
  var texto = search.value.trim().toLowerCase();
  
  var rows = table.rows;
  var totalRows = rows.length;
  
  for (var i = 0; i < totalRows; i++) {
    var cell = rows[i].cells[1]; // Segunda celda de la fila
    
    var cellText = cell.textContent.trim().toLowerCase();
    
    if (cellText.indexOf(texto) !== -1) {
        rows[i].style.display = "";
    } else {
        rows[i].style.display = "none";
    }
  }
}

function loadAccountClients() {
  data = JSON.parse(localStorage.getItem('data'));
  $('#fprestamo').attr('max', fhoy);
  let clientsOptions = extractClients(data);
  $('#opt-cli').html(clientsOptions);
}

function showOnlyAccounts(type) {
  var pagos = JSON.parse(localStorage.getItem('pagos'));
  $('#tbl-acc tbody tr').show();
  if (type == 'T') {
     $(`#tbl-acc tbody tr`).show();
  } else if (type == 'P') {
    $.each(pagos, function (i, client) {
      if (client['fpago'] == fhoy) {
        $(`#tbl-acc tbody tr[cod="${client['cod']}"]`).hide();
      }
    });
  } else if (type == 'V') {
    $('#tbl-acc tbody tr').hide();
    $.each(pagos, function (i, client) {
      if (client['fpago'] == fhoy) {
        $(`#tbl-acc tbody tr[cod="${client['cod']}"]`).show();
      }
    });
  }
}

function newClient(select) {
  if (select.value == 'V') {
    $('#opt-cli').prop('hidden',false);
    $('#opt-cli').prop('required',true);
    loadAccountClients();
    $('#frm-cli #dir').prop('required', false);
    $('#frm-cli').prop('hidden',true);
  } else {
    $('#opt-cli').prop('hidden',true);
    $('#opt-cli').prop('required',false);
    $('#frm-cli input, #frm-cli textarea').val("");
    $('#frm-cli').prop('hidden',false);
  }
}

function viewClient(client) {
  data = JSON.parse(localStorage.getItem('data'));
  id = $(client).attr('cl');
  client = data.find(c => c.doc == id);
  document.getElementById('inom').value = client['nom'] + " " + client['ape'];
  document.getElementById('idir').value = client['dir'];
  document.getElementById('itel').value = client['tel'];
  $('#btn-editclient').on('click', function () {
    $('#frm-info-cli').prop('hidden', false);
    $('#frm-info-saved').prop('hidden', true);

    $.each(data, function (i, client) {
      if (client['doc'] == id) {
        $('#frm-info-cli #doc').val(id);
        $('#frm-info-cli #doc2').val(client['doc2']);
        $('#frm-info-cli #nom').val(client['nom']);
        $('#frm-info-cli #ape').val(client['ape']);
        $('#frm-info-cli #alias').val(client['alias']);
        $('#frm-info-cli #dir').val(client['dir']);
        $('#frm-info-cli #tel').val(client['tel']);
        $('#frm-info-cli #ref').val(client['ref']);
      }
    });

    $('#btn-edit-confirm').off('click').on('click', function (e) {
      e.preventDefault();
      editClient(data,id);
    });

    $('#btn-edit-cancel').off('click').on('click', function (e) {
      e.preventDefault();
      cancelEditClient();
    });
  });
}

function editClient(data,client){
  var confirmEdit = confirm("¿Esta seguro de editar la informacion de este cliente?");
  if (confirmEdit) {
    $.each(data, function (i, dataClient) {
      if (dataClient['doc'] == id) {
        dataClient['doc'] = $('#frm-info-cli #doc').val();
        dataClient['doc2'] = $('#frm-info-cli #doc2').val();
        dataClient['nom'] = $('#frm-info-cli #nom').val();
        dataClient['ape'] = $('#frm-info-cli #ape').val();
        dataClient['alias'] = $('#frm-info-cli #alias').val();
        dataClient['dir'] = $('#frm-info-cli #dir').val();
        dataClient['tel'] = $('#frm-info-cli #tel').val();
        dataClient['ref'] = $('#frm-info-cli #ref').val();
        client = data[i];
      }
    });
    
    $('#frm-info-cli .form-control').val("");
    $('#frm-info-cli').prop('hidden', true);
    $('#frm-info-saved').prop('hidden', false);
    $('#frm-info-saved #inom').val(client['nom'] + " " + client['ape']);
    $('#frm-info-saved #idir').val(client['dir']);
    $('#frm-info-saved #itel').val(client['tel']);

    localStorage.removeItem('data');
    localStorage.setItem('data', JSON.stringify(data));
    $(`#tbl-acc tr[cod="${client['cod']}"] td:eq(1)`).html(`${client['nom']} ${client['ape']} ${client['alias']}  ${client['ref']}`);
    alert('informacion de Cliente Actualizada Correctamente');
    return;
  }
}

function cancelEditClient(){
  $('#frm-info-cli .form-control').val("");
  $('#frm-info-saved').prop('hidden', false);
  $('#frm-info-cli').prop('hidden', true);
}

function noPago(select) {
  $('#frm-pago #fpago').attr('max', fhoy);
  if (select.value > 0) {
    document.getElementById('dv-monto').removeAttribute('hidden');
    document.getElementById('pago-cuota').setAttribute('required', true);
  } else {
    document.getElementById('dv-monto').setAttribute('hidden', true);
    document.getElementById('pago-cuota').removeAttribute('required');
  }
}

function clientPay(clientx) {
  data = JSON.parse(localStorage.getItem('data'));
  id = $(clientx).attr('cod').trim();
  client = data.find(c => c.cod == id);
  if ($(clientx).attr('np') === 'false') {
    $('#mdl-pago #tp').prop('disabled', false);
    $('#mdl-pago #tp').val(1).trigger('change');
    $('#mdl-pago .modal-title').html('<i class="bi bi-plus me-1"></i>Registrar Pago Manual <br>(' + client.nom + ' ' + client.ape + ')');
  } else {
    $('#mdl-pago .modal-title').html('<i class="bi bi-x-octagon me-1"></i>No Pago <br>(' + client.nom + ' ' + client.ape + ')');
    $('#mdl-pago #tp').val(0).trigger('change');
    $('#mdl-pago #nopago').val(1).trigger('change');
    $('#mdl-pago #tp').prop('disabled', true);
  }

  $('#frm-pago input[name="doc"]').val(client.doc);
  $('#frm-pago input[name="cod"]').val(client.cod);
}

function getClientSaldo(client) {
  let saldo = client['pago-monto'];
  Object.keys(pagos).forEach(key => {
    pago = pagos[key];
    if (pago.doc == client.doc && pago.cod == client.cod) {
      saldo = Number(saldo - pago['pago-cuota']);
    }
  });
  return saldo;
}

function regPay(event, $frm) {
  event.preventDefault();
  if (!$frm.checkValidity()) {
    return;
  } else {
    pagos = JSON.parse(localStorage.getItem('pagos'));
    if (empty(pagos) == true) {
      pagos = [];
    }
    init = pagos.length;
    tmpData = $($frm).serializeArray();
    dt = {};
    for (let i = 0; i < tmpData.length; i++) {
      dt[tmpData[i]['name']] = tmpData[i]['value'];
    }

    let lastCode = pagos.length > 0 ? pagos[pagos.length - 1].codPago : 0;
    dt.codPago = lastCode + 1;

    data = JSON.parse(localStorage.getItem('data'));
    let client = data.find(c => c.cod == dt.cod);
    saldo = getClientSaldo(client);

    let question = confirmation = '';
    if ($('#nopago').val() == 1) {
      question = 'Esta Seguro(a) de Confirmar esta omision de pago de cuota?';
      confirmation = 'Omision de Pago Registrada Correctamente!';
    } else if (Number(dt['pago-cuota']) >= saldo) {
      question = '¿Esta Seguro(a) de Confirmar este pago de cuota?\n Este pago completara la cuenta del Cliente';
      confirmation = 'Pago Registrado Correctamente y Cuenta Culminada';
    } else {
      question = 'Esta Seguro(a) de Confirmar este pago de cuota?';
      confirmation = 'Pago Registrado Correctamente!';
    }

    if (confirm(question)) {
      pagos.push(dt);
      localStorage.setItem('pagos', JSON.stringify(pagos));
      if (init < pagos.length) {
        $('#frm-pago')[0].reset();
        $('#mdl-pago').modal('hide');
        reloadTableAccount();
        alert(confirmation);
      }
    }
  }
}

function deletePay(idPay){
  let questionx = confirm("¿Esta Seguro que desea Eliminar esta Pago?");
  if (questionx) {
    pagos = JSON.parse(localStorage.getItem('pagos'));
    pagos.forEach(function (e, index) {
      let tr = $(`#tbl-acc tr[cod="${e.cod}"]`);
      if (idPay == e.codPago) {
        pagos.splice(index, 1);
        localStorage.setItem('pagos', JSON.stringify(pagos));
        if(fhoy == e.fpago){
          pagoHoy = tr.find('td:eq(2)').text().split('H:');
          tr.find('td:eq(2)').text(`${pagoHoy[0]} H:${(pagoHoy[1] - e['pago-cuota'])}`);
        }
        data = JSON.parse(localStorage.getItem('data'));
        client = data.find(c => c.cod == e.cod);
        pagado = getCuotasPagos(client).cuotasPagadas;
        cuota = tr.find('td:eq(3)').text().split("/");
        tr.find('td:eq(3)').text(`${cuota[0]}/${pagado}`);
        
        $(`#tbl-pagos tr[cod="${idPay}"]`).remove();
        alert('Pago Eliminado Correctamente');
      }
    });
  } else {
    return;
  }
}

function getLastPay(client) {
  pagos = JSON.parse(localStorage.getItem('pagos'));
  const filteredPayments = pagos.filter(pago => pago.doc == client.doc && pago.cod == client.cod);
  if (filteredPayments.length > 0) {
    filteredPayments.sort((a, b) => {
      return new Date(b.fpago) - new Date(a.fpago);
    });
    const lastPayment = filteredPayments[0];
    return lastPayment;
  } else {
    return "0";
  }
}

function viewClientPay(client) {
  data = JSON.parse(localStorage.getItem('data'));
  id = $(client).attr('cod');
  client = data.find(c => c.cod == id);
  $('#mdl-hist .modal-title').html(`<i class="bx bx-history"></i> Historial de Pagos<br>( ${client.nom} ${client.ape})`);
  $('#tbl-pagos tbody').html("");
  pagos = JSON.parse(localStorage.getItem('pagos'));
  if (pagos != null) {
    let saldo = client['pago-monto'];
    Object.keys(pagos).forEach(key => {
      if (pagos[key]['cod'] == id) {
        saldo = (saldo - pagos[key]['pago-cuota']);
        let $tr = `
          <tr cod="${pagos[key]['codPago']}">
            <td>`+ moment(pagos[key]['fpago']).format('DD/MM/YYYY') + `</td>
            <td>$`+ pagos[key]['pago-cuota'] + `</td>
            <td>$`+ saldo.toFixed(2) + `</td>
            <td>
              <button type="button" onclick="deletePay(${pagos[key]['codPago']})" class="btn btn-sm">
                <i class="bi bi-trash text-danger"></i>
              </button>
            </td>
          </tr>
        `;
        $('#tbl-pagos tbody').append($tr);
      }
    });
  }
}

function viewClientPres(client) {
  data = JSON.parse(localStorage.getItem('data'));
  pagos = JSON.parse(localStorage.getItem('pagos'));
  id = $(client).attr('cl');
  $('#listPrestamos').empty();
  let cantPrestamos = 0;

  let cantNoPagos = 0;
  $.each(pagos, function (i, pago) {
    if (client['doc'] == id && client['estatus'] == 'terminado') {
      if (pago['nopago'] == 1) {
        cantNoPagos++;
      }
    }
  });

  $.each(data, function (i, client) {
    if (client['doc'] == id && client['estatus'] == 'terminado') {
      let upago = (getLastPay(client) != "0") ? moment(getLastPay(client)['fpago']).format("DD/MM/YYYY") : "";
      let item = `<div id="prestamo${i}">
      <span class="fw-bold">Fecha: ${moment(client['fprestamo']).format('DD/MM/YYYY')}</span><span></span><br>
      <span class="fw-bold">Monto: $${client['pago-monto']}</span><span></span><br>
      <span class="fw-bold">Cuotas: ${client['ncuota']}</span><span></span><br>
      <span class="fw-bold">Culminado el: ${upago} </span><span></span><br>
      <span class="fw-bold">Atrasos: ${cantNoPagos}</span><span></span><br>
      </div><hr>`;
      $('#listPrestamos').append(item);
      clientNombre = client.nom + ' ' + client.ape;
      $('#mdl-histp .modal-title').html(`<i class="bx bx-book"></i> Historial de Prestamos<br> (${clientNombre})`);
      cantPrestamos++;
    }
  });

  if (cantPrestamos < 1) {
    $('#listPrestamos').append(`<span>Este cliente no tiene prestamos terminados al presente</span>`);
  }else{
    $('#tprestamos').text('Prestamos: ' + cantPrestamos);
  }
}

function loadResumen() {

  $('#mdl-resumen').on('hidden.bs.modal', function () {
    if (myPieChart) {
      myPieChart.destroy();
    }
  });

  $('.layout-overlay').click();

  $('#titleResumen').html(`<i class="bi bi-file-text me-2"></i>Resumen de hoy (${moment(fhoy).format('DD/MM/YYYY')})`);

  data = JSON.parse(localStorage.getItem('data'));
  if (data != null && data.length > 0) {
    var cobrar = cobrado = gastado = sinpago = 0;
    Object.keys(data).forEach(key => {
      upago = getLastPay(data[key])['fpago'];
      if (data[key]['estatus'] != 'terminado') {
        cobrar += Number(data[key]['monto-cuota']);
        if(upago != fhoy){
          sinpago ++;
        }
      }else{
        if(upago == fhoy){
          cobrar += Number(data[key]['monto-cuota']);
        }
      }
    });

    $('#mdl-resumen #tcobrar').text('$' + cobrar);

    pagos = JSON.parse(localStorage.getItem('pagos'));
    if (pagos != null) {
      Object.keys(pagos).forEach(key => {
        cobrado += (pagos[key]['fpago'] == fhoy) ? Number(pagos[key]['pago-cuota']) : 0;
      });
    }

    $('#mdl-resumen #tcobrado').text('$' + cobrado);
    $('#mdl-resumen #spagos').text(sinpago);
    /*
    gastos = JSON.parse(localStorage.getItem('gastos'));
    if (gastos != null) {
      Object.keys(gastos).forEach(key => {
        gastado += (gastos[key]['fgasto'] == fhoy) ? Number(gastos[key]['monto-gasto']) : 0;
      });
    }
    
    $('#mdl-resumen #gastos').text('$' + gastado);
    pcobrado = ((cobrado / cobrar) * 100).toFixed(2);
    if(!isNaN(pcobrado)){
      if(cobrar !== 0){
        $('#mdl-resumen #estadocxc').text('%' + pcobrado);
      }
    }
    */

    $('.chart-pie').show();
    var ctx = document.getElementById("myPieChart");
    myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Cuentas", "Cobrado"],
        datasets: [{
          data: [cobrar, cobrado],
          backgroundColor: ['#1BC88A', '#2637bd'],
          hoverBackgroundColor: ['#5a5c69', '#5a5c69'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });

  } else {
    $('.chart-pie').hide();
  }

}

function selectGasto(select) {
  if (select.value == 'O') {
    document.getElementById('cgasto').removeAttribute('hidden');
    document.getElementById('cgasto').setAttribute('required', true);
  } else {
    document.getElementById('cgasto').setAttribute('hidden', true);
    document.getElementById('cgasto').removeAttribute('required');
  }
}

function setGasto(event, $frm) {
  event.preventDefault();
  if (!$frm.checkValidity()) {
    return;
  } else {
    gastos = JSON.parse(localStorage.getItem('gastos'));
    if (empty(gastos) == true) {
      gastos = [];
    }
    init = gastos.length;
    tmpData = $($frm).serializeArray();
    dt = {};
    for (let i = 0; i < tmpData.length; i++) {
      dt[tmpData[i]['name']] = tmpData[i]['value'];
    }
    gastos.push(dt);

    localStorage.setItem('gastos', JSON.stringify(gastos));
    if (init < data.length) {
      alert('Gasto Registrado Correctamente!');
      $('#frm-gasto')[0].reset();
      $('#mdl-gasto').modal('hide');
    }
  }
}
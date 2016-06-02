var SERVER_URL = "http://192.168.10.128:8080/";
// var SERVER_URL = "/";

//Make sure jQuery has been loaded before main.js
if (typeof jQuery === "undefined") {
  throw new Error("Onyx Web Requires jQuery");
}

$(function() {
  "use strict";

  jQuery.fn.exists = function() {
    return this.length > 0;
  }

  //Job List
  if ($('#jobList').exists()) {
    $.ajax({
      url: SERVER_URL + 'onyx/jobs',
      type: 'GET',
      headers: {
        "Accept": "application/json",
        "Authorization": "Basic YWRtaW46YWRtaW4=",
        "Content-Type": "application/json"
      },
      success: function(data, status, xhr) {
        if (data != null) {
          var ArrArr = $.each(data, function(index, value) {
            var slNo = index + 1;
            $('#jobList>tbody').append('<tr onclick="jobDetails(this, event);">' +
              '<td class="slNo">' + slNo + '</td>' +
              '<td class="gName">' + value.group + '</td>' +
              '<td class="jName">' + value.name + '</td>' +
              '<td class="deleteRow">' +
                '<a href="#" onclick="deleteJob(this, event);" class="text-red text-center">' +
                  '<i class="fa fa-trash-o"></i>' +
                '</a>' +
              '</td>' +
            '</tr>');
          });
          // DataTable
          $('#jobList').DataTable({
            "lengthChange": false,
            "columnDefs": [{
              "orderable": false,
              "targets": [-1, -4]
            }]
          });
        }
      },
      error: function(xhr, status, err) {

      }
    });
  }

  //jQueryCron
  var cronVal;
  if ($('.generateCron').exists()) {
    $('#generateCron').cron({
      initial: "*/2 * * * *",
      customValues: {
        "2 Minutes": "*/2 * * * *",
      },
      onChange: function() {
        cronVal = $(this).cron("value");
      }
    });
    $('#generateCron select').addClass('form-control').css({
      'width': 'auto',
      'display': 'inline',
      'margin': '0 5px'
    });
  }

  //DateTime picker
  if ($('#when').exists()) {
    $('#when').datetimepicker({
      sideBySide: true
    }).on("changeDate", function(e) {
      var TimeZoned = new Date(e.date.setTime(e.date.getTime() + (e.date.getTimezoneOffset() * 60000)));
    });
  }

  //Add Job
  if ($('#addJob').exists()) {
    $('select#type').on('change', function() {
      if (this.value != '') {
        $('#url').css('display', 'block');
        $('#url input').val($('select#type :selected').text() + '://');
      } else {
        $('#url').css('display', 'none');
        $('#url input').val('');
      }
    });
    $('select#method').on('change', function() {
      if (this.value != '') {
        $('#url, #headers').css('display', 'block');
      } else {
        $('#url, #headers').css('display', 'none');
      }
      if (this.value == 2) {
        $('#body').css('display', 'block');
      } else {
        $('#body').css('display', 'none');
      }
    });
    $('select#triggers').on('change', function() {
      if (this.value == 2) {
        $('#cronExp').css('display', 'block');
        $('#future').css('display', 'none');
      } else if (this.value == 3) {
        $('#cronExp').css('display', 'none');
        $('#future').css('display', 'block');
      } else {
        $('#cronExp, #future').css('display', 'none');
      }
    });
    $('input#auditUrl').on('change', function() {
      if($(this).hasClass('valid') && $(this).val() != '') {
        $('#auditHeaders').css('display', 'block');
      } else {
        $('#auditHeaders').css('display', 'none');
      }
    });
    jQuery.validator.addMethod("defaultInvalid", function(value, element) {
      return value != element.defaultValue;
    }, "");
    $("#addJob").validate({
      rules: {
        groupName: "required",
        jobName: "required",
        type: "required",
        method: "required",
        url: "required",
        triggers: "required",
        when: "required",
        auditUrl: { pattern : /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/}
      },
      messages: {
        auditUrl: "Please enter a valid URL."
      },
      submitHandler: function(e) {
        var data = {
          "group": $('input#groupName').val(),
          "name": $('input#jobName').val(),
          "type": $('select#type :selected').text(),
          "method": $('select#method :selected').text(),
          "url": $('#url input').val(),
        };
        if($('#headersTable>tbody>tr').find('.headerKey').val() != '' && $('#headersTable>tbody>tr').find('.headerValue').val() != '') {
          var dataHeader = {},
              headerKey,
              headerValue;
          $('#headersTable>tbody>tr').each(function() {
            headerKey = $(this).find('.headerKey').val();
            headerValue = $(this).find('.headerValue').val();
            dataHeader[headerKey] = headerValue;
            data['headers'] = dataHeader;
          });
        }
        if ($('#body textarea').val() != '') {
          data['body'] = $('#body textarea').val()
        }
        if ($('select#triggers').val() == 2) {
          data['triggers'] = [{
            "cron": cronVal + ' ?'
          }];
        } else if ($('select#triggers').val() == 3) {
          var dateTime = $('#when').val(),
              isoDate = new Date(dateTime).toISOString();
          data['triggers'] = [{
            "when": isoDate
          }];
        } else {
          data['triggers'] = [{
            "immediate": true
          }];
        }
        if($('input#auditUrl').val() != '') {
          data['auditUrl'] = $('input#auditUrl').val();
        }
        if($('#auditTable>tbody>tr').find('.headerKey').val() != '' && $('#auditTable>tbody>tr').find('.headerValue').val() != '') {
          var auditHeader = {},
          auditKey,
          auditValue;
          $('#auditTable>tbody>tr').each(function() {
            auditKey = $(this).find('input.headerKey').val();
            auditValue = $(this).find('input.headerValue').val();
            auditHeader[auditKey] = auditValue;
            data['auditHeaders'] = auditHeader;
          });
        }
        if($('input#maxTrail').val() != '') {
          data['maxTrial'] = $('input#maxTrail').val();
        }
        if($('input#njID').val() != '') {
          data['nextJobId'] = $('input#njID').val();
        }
        console.log(JSON.stringify(data));
        $.ajax({
          url: SERVER_URL + 'onyx/groups/' + $('input#groupName').val() + '/jobs',
          type: 'POST',
          data: JSON.stringify(data),
          dataType: 'json',
          headers: {
            "Accept": "application/json",
            "Authorization": "Basic YWRtaW46YWRtaW4=",
            "Content-Type": "application/json"
          },
          success: function(data, status, xhr) {
            location.reload();
          },
          error: function(xhr, status, err) {

          }
        });
      }
    });
  }

  if ($('#auditTable, #headersTable').exists()) {
    autoComplete();
  }
});

function jobDetails(param, event) {
  event.stopPropagation();
  $('#jobDetails').append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
  $('#jobDetails').find('.box').remove();
  var gName = $(param).find('.gName').html(),
      jName = $(param).find('.jName').html();
  $.ajax({
    url: SERVER_URL + 'onyx/groups/' + gName + '/jobs/' + jName,
    type: 'GET',
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic YWRtaW46YWRtaW4=",
      "Content-Type": "application/json"
    },
    success: function(data, status, xhr) {
      setTimeout(function() {
        $('#jobDetails').find('.overlay').remove();
        var auditUrl,
            auditHeaders,
            maxTrial,
            nextJobId,
            headers,
            body,
            trigger;
        if ($.isEmptyObject(data.headers)) {
          headers = '';
        } else {
          headers = '<div class="form-group">' +
            '<label>Headers:</label>';
            $.each(data.headers, function(key, value) {
              headers += '<p>' + key + ' : ' + value + '</p>';
            });
          headers += '</div>';
        }
        if (data.body) {
          body = '<div class="form-group">' +
            '<label>Body:</label>' +
            '<span>' + JSON.stringify(data.body) + '</span>' +
            '</div>';
        } else {
          body = '';
        }
        if (data.triggers[0].when) {
          trigger = new Date(data.triggers[0]['when']);
        } else if (data.triggers[0].cron) {
          trigger = data.triggers[0]['cron'];
        }
        if (data.auditUrl) {
          auditUrl = '<div class="form-group">' +
            '<label>Audit Log URL:</label>' +
            '<span>' + data.auditUrl + '</span>' +
          '</div>';
        } else {
          auditUrl = '';
        }
        if ($.isEmptyObject(data.auditHeaders)) {
          auditHeaders = '';
        } else {
          auditHeaders = '<div class="form-group">' +
            '<label>Audit Log Headers:</label>';
            $.each(data.auditHeaders, function(key, value) {
              auditHeaders += '<p>' + key + ' : ' + value + '</p>';
            });
          auditHeaders += '</div>';
        }
        if (data.maxTrial) {
          maxTrial = '<div class="form-group">' +
            '<label>Max Trail:</label>' +
            '<span>' + data.maxTrial + '</span>' +
          '</div>';
        } else {
          maxTrial = '';
        }
        if (data.nextJobId) {
          nextJobId = '<div class="form-group">' +
            '<label>Next Job ID:</label>' +
            '<span>' + data.nextJobId + '</span>' +
          '</div>';
        } else {
          nextJobId = '';
        }
        $('#jobDetails').append(
          '<div class="box">' +
            '<div class="box-header with-border">' +
              '<h3 class="box-title">Job Details</h3>' +
            '</div>' +
            '<div class="box-body">' +
              '<div class="form-group">' +
                '<label>Group Name:</label>' +
                '<span>' + data.group + '</span>' +
              '</div>' +
              '<div class="form-group">' +
                '<label>Job Name:</label>' +
                '<span>' + data.name + '</span>' +
              '</div>' +
              '<div class="form-group">' +
                '<label>Type:</label>' +
                '<span>' + data.type + '</span>' +
              '</div>' +
              '<div class="form-group">' +
                '<label>Method:</label>' +
                '<span>' + data.method + '</span>' +
              '</div>' +
              '<div class="form-group">' +
                '<label>URL:</label>' +
                '<span>' + data.url + '</span>' +
              '</div>' +
              headers +
              body +
              '<div class="form-group">' +
                '<label>Triggers:</label>' +
                '<span>' + trigger + '</span>' +
              '</div>' +
              auditUrl +
              auditHeaders +
              maxTrial +
              nextJobId +
            '</div>' +
          '</div>'
        );
      }, 1000);
    },
    error: function(xhr, status, err) {

    }
  });
}
function deleteJob(param, event) {
  event.stopPropagation();
  var gName = $(param).closest('tr').find('.gName').html(),
      jName = $(param).closest('tr').find('.jName').html();
  $.ajax({
    url: SERVER_URL + 'onyx/groups/' + gName + '/jobs/' + jName,
    type: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Authorization": "Basic YWRtaW46YWRtaW4=",
      "Content-Type": "application/json"
    },
    success: function(data, status, xhr) {
      location.reload();
    },
    error: function(xhr, status, err) {

    }
  });
}
function addAuditHeaders(param) {
  if ($('#auditTable>tbody>tr:first-child').find('.headerKey').val() == '' || $('#auditTable>tbody>tr:first-child').find('.headerValue').val() == '') {
    $('#addHeaderError').fadeIn();
    setTimeout(function() {
      $('#addHeaderError').fadeOut();
    }, 3000);
  } else {
    var newRow = $('<tr>' +
      '<td><input type="text" class="form-control headerKey"></td>' +
      '<td class="lastChild text-center">:</td>' +
      '<td><input type="text" class="form-control headerValue"></td>' +
      '<td class="lastChild">' +
        '<a class="text-center" onclick="removeAuditHeaders(this);"><i class="fa fa-close"></i></a>' +
      '</td>' +
    '</tr>');
    $('#auditTable>tbody').append(newRow);
    autoComplete();
  }
}
function addHeaders(param) {
  if ($('#headersTable>tbody>tr:first-child').find('.headerKey').val() == '' || $('#headersTable>tbody>tr:first-child').find('.headerValue').val() == '') {
    $('#addHeaderError').fadeIn();
    setTimeout(function() {
      $('#addHeaderError').fadeOut();
    }, 3000);
  } else {
    var newRow = $('<tr>' +
      '<td><input type="text" class="form-control headerKey"></td>' +
      '<td class="lastChild text-center">:</td>' +
      '<td><input type="text" class="form-control headerValue"></td>' +
      '<td class="lastChild">' +
        '<a class="text-center" onclick="removeHeaders(this);"><i class="fa fa-close"></i></a>' +
      '</td>' +
    '</tr>');
    $('#headersTable>tbody').append(newRow);
    autoComplete();
  }
}
function removeAuditHeaders(param) {
  if ($('#auditTable>tbody>tr').length == 1) {
    $('#removeHeaderError').fadeIn();
    setTimeout(function() {
      $('#removeHeaderError').fadeOut();
    }, 3000);
  } else {
    $(param).closest('tr').remove();
  }
}
function removeHeaders(param) {
  if ($('#headersTable>tbody>tr').length == 1) {
    $('#removeHeaderError').fadeIn();
    setTimeout(function() {
      $('#removeHeaderError').fadeOut();
    }, 3000);
  } else {
    $(param).closest('tr').remove();
  }
}
function autoComplete() {
  var headerKey = [
    "Accept",
    "Content-Type"
  ];
  $('#auditTable>tbody>tr, #headersTable>tbody>tr').find('.headerKey').autocomplete({
    source: headerKey
  });
  var headerValue = [
    "application/json"
  ];
  $('#auditTable>tbody>tr, #headersTable>tbody>tr').find('.headerValue').autocomplete({
    source: headerValue
  });
}

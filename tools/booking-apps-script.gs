/**
 * Business Therapy START: 1-to-1 booking backend.
 * Paste into Extensions > Apps Script in the booking Google Sheet,
 * then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
 * Put the web app URL into SCRIPT_URL in programs/business-therapy/book/index.html.
 */
var SHEET_NAME = 'Bookings';
var HEADERS = ['Booked at', 'Date', 'Time', 'Slot', 'Name', 'WhatsApp', 'Called', 'Notes'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function norm_(v) { return String(v).replace(/[^\d]/g, ''); }

function doGet(e) {
  var rows = sheet_().getDataRange().getDisplayValues().slice(1);
  return json_({ taken: rows.map(function (r) { return r[1] + '|' + r[2]; }) });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var d = JSON.parse(e.postData.contents);
    if (!d.date || !d.time || !d.name || !d.phone) return json_({ ok: false, error: 'invalid' });
    var sh = sheet_();
    var rows = sh.getDataRange().getDisplayValues().slice(1);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][1] === d.date && rows[i][2] === d.time) return json_({ ok: false, error: 'taken' });
      if (norm_(rows[i][5]) === norm_(d.phone)) return json_({ ok: false, error: 'duplicate' });
    }
    sh.appendRow([new Date(), d.date, d.time, d.label, d.name, "'" + d.phone, '', '']);
    return json_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

(function () {
  /* ---- Settings: edit these ---- */
  var FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScuQOdetLODjw0tSsgE8FB5s2wNffubyaNxA4xmifijJ36fjg/formResponse';
  var TAKEN_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRAzfeqpVNMhKNb5v307QbAU9YwApVThxIu09Gin7etWmFO10x_ISjHcqQqJnHUDss62B4FSMa7P4Qm/pub?gid=2003648474&single=true&output=csv';
  var ENTRY = { name: 'entry.1643909571', phone: 'entry.1715296179', slot: 'entry.1087138180' };
  var DAYS = [
    ['2026-11-30', 'Mon', '30 Nov'], ['2026-12-01', 'Tue', '1 Dec'], ['2026-12-02', 'Wed', '2 Dec'],
    ['2026-12-03', 'Thu', '3 Dec'], ['2026-12-04', 'Fri', '4 Dec']
  ];
  var TIMES = [['18:30', '6:30'], ['19:00', '7:00'], ['19:30', '7:30'], ['20:00', '8:00'], ['20:30', '8:30'], ['21:00', '9:00']];
  /* ------------------------------- */

  function $(id) { return document.getElementById(id); }
  if (!$('bk-days')) return;
  var dayIdx = 0, picked = null, taken = {};
  var MSG = {
    name: 'Enter your name · ඔයාගේ නම ඇතුළත් කරන්න',
    phone: 'Enter a valid WhatsApp number · නිවැරදි WhatsApp අංකයක් ඇතුළත් කරන්න',
    fail: "Couldn't save your booking. Try again. · වෙන් කිරීම සුරකින්න බැරි වුණා. නැවත උත්සාහ කරන්න."
  };

  function renderDays() {
    $('bk-days').innerHTML = DAYS.map(function (d, i) {
      return '<button type="button" class="bk-day" data-i="' + i + '" aria-pressed="' + (i === dayIdx) + '">' + d[1] + '<small>' + d[2] + '</small></button>';
    }).join('');
  }
  function renderTimes() {
    var d = DAYS[dayIdx];
    $('bk-times').innerHTML = TIMES.map(function (t) {
      var off = taken[d[0] + '|' + t[0]];
      return '<button type="button" class="bk-time" data-t="' + t[0] + '"' + (off ? ' disabled' : '') + '>' + t[1] + ' <small>pm</small></button>';
    }).join('');
  }
  function render() { renderDays(); renderTimes(); }

  $('bk-days').addEventListener('click', function (e) {
    var b = e.target.closest('.bk-day'); if (!b) return;
    dayIdx = +b.dataset.i; render();
  });
  $('bk-times').addEventListener('click', function (e) {
    var b = e.target.closest('.bk-time'); if (!b || b.disabled) return;
    var d = DAYS[dayIdx], t = TIMES.filter(function (x) { return x[0] === b.dataset.t; })[0];
    picked = { date: d[0], time: t[0], label: d[1] + ' ' + d[2] + ', ' + t[1] + ' pm' };
    $('bk-when').textContent = picked.label;
    $('bk-form').hidden = false; $('bk-done').hidden = true; $('bk-err').textContent = '';
    $('bk-dlg').showModal(); $('bk-nm').focus();
  });
  $('bk-x').addEventListener('click', function () { $('bk-dlg').close(); });
  $('bk-close').addEventListener('click', function () { $('bk-dlg').close(); });
  $('bk-dlg').addEventListener('click', function (e) { if (e.target === $('bk-dlg')) $('bk-dlg').close(); });
  $('bk-nm').addEventListener('input', function () { $('bk-err').textContent = ''; });
  $('bk-ph').addEventListener('input', function () { $('bk-err').textContent = ''; });

  function cleanPhone(p) {
    p = p.replace(/[^\d+]/g, '');
    if (/^0\d{9}$/.test(p)) p = '+94' + p.slice(1);
    else if (/^94\d{9}$/.test(p)) p = '+' + p;
    return p;
  }

  $('bk-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('bk-nm').value.trim(), phone = cleanPhone($('bk-ph').value);
    if (!name) { $('bk-err').textContent = MSG.name; $('bk-nm').focus(); return; }
    if (phone.replace(/\D/g, '').length < 9) { $('bk-err').textContent = MSG.phone; $('bk-ph').focus(); return; }
    var go = $('bk-go');
    go.setAttribute('aria-busy', 'true'); go.disabled = true;
    var body = new URLSearchParams();
    body.set(ENTRY.name, name);
    body.set(ENTRY.phone, phone);
    body.set(ENTRY.slot, picked.date + ' ' + picked.time + ' (' + picked.label + ')');
    fetch(FORM_URL, { method: 'POST', mode: 'no-cors', body: body }).then(function () {
      go.removeAttribute('aria-busy'); go.disabled = false;
      taken[picked.date + '|' + picked.time] = 1;
      $('bk-form').hidden = true; $('bk-done').hidden = false;
      $('bk-done-when').textContent = picked.label;
      $('bk-nm').value = ''; $('bk-ph').value = '';
      renderTimes();
    }).catch(function () {
      go.removeAttribute('aria-busy'); go.disabled = false;
      $('bk-err').textContent = MSG.fail;
    });
  });

  function loadTaken() {
    fetch(TAKEN_URL + '&t=' + Date.now()).then(function (r) { return r.text(); }).then(function (txt) {
      txt.split(/\r?\n/).forEach(function (line) {
        var m = line.replace(/"/g, '').trim().match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})$/);
        if (m) taken[m[1] + '|' + m[2]] = 1;
      });
      renderTimes();
    }).catch(function () {});
  }

  render();
  loadTaken();
})();

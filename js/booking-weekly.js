(function () {
  /* ---- Settings ---- */
  var API = 'https://script.google.com/macros/s/AKfycbwfVMskOrr4GVi6YRZKX0UY70-51_n6GX4PZuMfdU-OKMFAs3xX3yCZUdDoEuaNnjCFcg/exec';
  var WA = 'https://wa.me/94715507060';
  var SUN_TIMES = [[600, 750], [840, 930], [1020, 1290]];   /* start minutes, every 30 */
  var WEEK_TIMES = [[1080, 1290]];
  /* ---------------- */

  function $(id) { return document.getElementById(id); }
  if (!$('bk-days')) return;
  var DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var state = { open: null, week: null, now: '', taken: {}, days: [], dayIdx: 0, picked: null };

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function hm(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function ampm(m) {
    var h = Math.floor(m / 60), mi = m % 60, s = h >= 12 ? 'pm' : 'am', h12 = h % 12 || 12;
    return h12 + ':' + pad(mi) + ' ' + s;
  }
  function slotsFor(i) {
    var runs = i === 0 ? SUN_TIMES : WEEK_TIMES, out = [];
    runs.forEach(function (r) { for (var m = r[0]; m <= r[1]; m += 30) out.push(m); });
    return out;
  }
  function buildDays(week) {
    var p = week.split('-'), days = [];
    for (var i = 0; i < 6; i++) {
      var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + i));
      var id = d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
      days.push({ id: id, name: DN[i], short: d.getUTCDate() + ' ' + MN[d.getUTCMonth()], i: i });
    }
    return days;
  }
  function firstOpenDay() {
    for (var i = 0; i < state.days.length; i++) {
      var any = slotsFor(i).some(function (m) { return state.days[i].id + ' ' + hm(m) > state.now; });
      if (any) return i;
    }
    return 0;
  }

  function show(which) {
    $('bk-loading').hidden = which !== 'loading';
    $('bk-closed').hidden = which !== 'closed';
    $('bk-fail').hidden = which !== 'fail';
    $('bk-picker').hidden = which !== 'picker';
  }

  function renderDays() {
    $('bk-days').innerHTML = state.days.map(function (d, i) {
      return '<button type="button" class="bk-day" data-i="' + i + '" aria-pressed="' + (i === state.dayIdx) + '">' + d.name + '<small>' + d.short + '</small></button>';
    }).join('');
  }
  function renderTimes() {
    var d = state.days[state.dayIdx], html = '', group = '', multi = state.dayIdx === 0;
    slotsFor(state.dayIdx).forEach(function (m) {
      var id = d.id + ' ' + hm(m);
      var g = m < 720 ? 'Morning · උදේ' : m < 1020 ? 'Afternoon · දහවල්' : 'Evening · රෑ';
      if (multi && g !== group) { group = g; html += '<p class="bk-group">' + g + '</p>'; }
      var off = state.taken[id] || id <= state.now;
      html += '<button type="button" class="bk-time" data-t="' + m + '"' + (off ? ' disabled' : '') + '>' + ampm(m) + '</button>';
    });
    $('bk-times').innerHTML = html;
  }
  function render() { renderDays(); renderTimes(); }

  function load(initial) {
    return fetch(API + '?t=' + Date.now()).then(function (r) { return r.json(); }).then(function (j) {
      state.open = !!j.open; state.now = j.now || '';
      if (!j.open) { show('closed'); return; }
      var firstTime = state.week !== j.week;
      state.week = j.week; state.days = buildDays(j.week);
      state.taken = {}; (j.taken || []).forEach(function (s) { state.taken[s] = 1; });
      if (firstTime) state.dayIdx = firstOpenDay();
      render(); if (initial || !$('bk-picker').hidden) show('picker');
    }).catch(function () { if (initial) show('fail'); });
  }

  $('bk-days').addEventListener('click', function (e) {
    var b = e.target.closest('.bk-day'); if (!b) return;
    state.dayIdx = +b.dataset.i; render();
  });
  $('bk-times').addEventListener('click', function (e) {
    var b = e.target.closest('.bk-time'); if (!b || b.disabled) return;
    var d = state.days[state.dayIdx], m = +b.dataset.t;
    state.picked = { id: d.id + ' ' + hm(m), label: d.name + ' ' + d.short + ', ' + ampm(m) };
    $('bk-when').textContent = state.picked.label;
    $('bk-form').hidden = false; $('bk-done').hidden = true; setErr('');
    $('bk-dlg').showModal(); $('bk-nm').focus();
  });
  function closeDlg() { $('bk-dlg').close(); }
  $('bk-x').addEventListener('click', closeDlg);
  $('bk-close').addEventListener('click', closeDlg);
  $('bk-dlg').addEventListener('click', function (e) { if (e.target === $('bk-dlg')) closeDlg(); });
  $('bk-nm').addEventListener('input', function () { setErr(''); });
  $('bk-ph').addEventListener('input', function () { setErr(''); });

  function setErr(html) { $('bk-err').innerHTML = html; }
  var MSG = {
    name: 'Enter your name · ඔයාගේ නම ඇතුළත් කරන්න',
    phone: 'Enter a valid WhatsApp number · නිවැරදි WhatsApp අංකයක් ඇතුළත් කරන්න',
    fail: "Couldn't save your booking. Try again. · වෙන් කිරීම සුරකින්න බැරි වුණා. නැවත උත්සාහ කරන්න.",
    not_approved: 'This number isn\'t registered for the class. <a href="' + WA + '">Message us on WhatsApp</a>.<br><span class="si" lang="si">මේ අංකය පන්තියට ලියාපදිංචි වෙලා නෑ. <a href="' + WA + '">WhatsApp එකෙන් පණිවුඩයක්</a> එවන්න.</span>',
    taken: 'Someone just took that slot. Pick another one. · ඒ වෙලාව දැන් වෙන් වුණා. වෙන එකක් තෝරන්න.',
    closed: 'Booking is closed right now. It opens Saturday 11 pm (Sri Lanka time). · වෙන් කිරීම දැන් වසා ඇත. සෙනසුරාදා රාත්‍රී 11ට (ශ්‍රී ලංකා වේලාව) විවෘත වේ.',
    past: 'That time has already passed. Pick another one. · ඒ වෙලාව ඉවරයි. වෙන එකක් තෝරන්න.'
  };

  $('bk-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('bk-nm').value.trim(), phone = $('bk-ph').value.trim();
    if (name.length < 2) { setErr(MSG.name); $('bk-nm').focus(); return; }
    if (phone.replace(/\D/g, '').length < 9) { setErr(MSG.phone); $('bk-ph').focus(); return; }
    var go = $('bk-go');
    go.setAttribute('aria-busy', 'true'); go.disabled = true;
    var q = new URLSearchParams({ action: 'book', name: name, phone: phone, slot: state.picked.id, label: state.picked.label });
    fetch(API + '?' + q.toString()).then(function (r) { return r.json(); }).then(function (j) {
      go.removeAttribute('aria-busy'); go.disabled = false;
      if (j.ok) {
        state.taken[state.picked.id] = 1;
        $('bk-form').hidden = true; $('bk-done').hidden = false;
        $('bk-done-when').textContent = state.picked.label;
        $('bk-nm').value = ''; $('bk-ph').value = ''; renderTimes();
      } else if (j.code === 'already_booked') {
        setErr('This number already has a booking this week. To change it, <a href="' + WA + '">message us on WhatsApp</a>.<br><span class="si" lang="si">මේ අංකයට මේ සතියට දැනටමත් වෙන් කිරීමක් තියෙනවා. වෙනස් කරන්න <a href="' + WA + '">WhatsApp එකෙන්</a> කියන්න.</span>');
      } else {
        setErr(MSG[j.code] || MSG.fail);
        if (j.code === 'taken' || j.code === 'past' || j.code === 'closed') load(false);
      }
    }).catch(function () {
      go.removeAttribute('aria-busy'); go.disabled = false;
      setErr(MSG.fail);
    });
  });

  show('loading');
  load(true);
  setInterval(function () { if (!document.hidden && !$('bk-dlg').open) load(false); }, 45000);
})();

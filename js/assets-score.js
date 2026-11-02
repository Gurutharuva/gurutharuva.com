// 24 Assets self-score: renders the asset cards, keeps scores in this browser, and shows the results.
const ASSET_GROUPS = [
  { id: 'ip', en: 'Intellectual Property', si: 'ඔයාගේ ඔලුව ඇතුළේ තියෙන දේ business එකේ asset එකක් කරන්න', assets: [
    { n: 1, en: 'Content', enText: 'Turn what you know into videos, articles, guides, checklists and case studies.', si: 'ඔලුවේ තියෙන knowledge එක video, article, guide, checklist, case study බවට turn කළාම දැනුම asset එකක් වෙනවා.' },
    { n: 2, en: 'Methodology', enText: 'Write down how you solve a problem: steps, decision rules, templates, examples.', si: 'ඔයා problem එකක් solve කරන විදිහ Step 1, 2, 3, decision rules, templates, checklists විදිහට document කරන්න.' },
    { n: 3, en: 'Registered IP', enText: 'Trademarks, patents, copyright and registered names that protect what makes you unique.', si: 'Trademark, patent, copyright, registered names. ඔයාගේ uniqueness එක formalize කරන්න.' },
  ] },
  { id: 'brand', en: 'Brand', si: 'Logo එක Brand එක නෙවෙයි', assets: [
    { n: 4, en: 'Philosophy', enText: 'What your company stands for, believes in and stands against.', si: 'ඔයාගේ company එක stand කරන්නේ මොනවටද? Believe කරන්නේ මොනවද? Oppose කරන්නේ මොනවද?' },
    { n: 5, en: 'Identity', enText: 'Colours, fonts, packaging, tone of voice and photography, used consistently.', si: 'Colours, fonts, packaging, tone of voice, photography. Clever වෙනවට වඩා consistent වෙන එක powerful.' },
    { n: 6, en: 'Ambassadors', enText: 'Customers, employees, creators and partners who speak for your brand.', si: 'ඔයාගේ brand එක ගැන ඔයා විතරක් කතා කරනවද? Customers, employees, partners brand එක represent කරනවද?' },
  ] },
  { id: 'market', en: 'Market', si: 'Customerලා ඉන්නවා කියලා විතරක් market asset එකක් නැහැ', assets: [
    { n: 7, en: 'Positioning', enText: 'The specific space you own in the market, not "I sell to everyone".', si: 'Market එකේ ඔයා occupy කරන specific space එක. "මම හැමෝටම sell කරනවා" කියන්නේ positioning නෙවෙයි.' },
    { n: 8, en: 'Channels', enText: 'Repeatable ways customers find you, so you don\'t start from zero each month.', si: 'Customers ඔයාව හොයාගෙන එන repeatable channels. නැත්නම් හැම මාසෙම zero ඉඳන් start කරනවා.' },
    { n: 9, en: 'Data', enText: 'Customer names, purchase history, lead sources, conversion and repeat rates.', si: 'Customer names, purchase history, lead sources, conversion rates. Data නැති business එක guess කරනවා.' },
  ] },
  { id: 'product', en: 'Product', si: 'Product එකක් නෙවෙයි, product ecosystem එකක්', assets: [
    { n: 10, en: 'Gifts', enText: 'Something valuable you give away first: a sample, guide or checklist.', si: 'Free sample, guide, checklist වගේ first interaction එකේ දෙන small value එකක්.' },
    { n: 11, en: 'Products for Prospects', enText: 'A low-risk first step: a trial, mini product or workshop.', si: 'Trial, mini product, workshop. "Buy this expensive thing" කියන්න කලින් දෙන පළවෙනි පියවර.' },
    { n: 12, en: 'Core Product', enText: 'Your main offer, clearly defined.', si: 'ඔයාගේ ප්‍රධාන product එක, clearly defined.' },
    { n: 13, en: 'Products for Clients', enText: 'Next-level products for people who already bought from you.', si: 'Existing customer කෙනෙක්ට next-level products.' },
  ] },
  { id: 'systems', en: 'Systems', si: '"මම නැත්නම් මේක කරන්න කවුද?" කියන ප්‍රශ්නය ඉවර කරන්න', assets: [
    { n: 14, en: 'Marketing & Sales Systems', enText: 'A documented sales process, customer onboarding and complaint handling.', si: 'Sales process, customer onboarding, complaint handling document කරලා තියෙනවද?' },
    { n: 15, en: 'Management & Administration Systems', enText: 'Hiring, training and reporting that run without you.', si: 'Hiring, training, reporting ඔයා නැතුවත් වෙනවද?' },
    { n: 16, en: 'Operations Systems', enText: 'Stock ordering, quality checks and daily operations written down.', si: 'Stock ordering, quality checks, daily operations ඔලුවෙන් document එකකට ඇවිත්ද?' },
  ] },
  { id: 'culture', en: 'Culture', si: 'Business එකේ මිනිස්සුත් assets', assets: [
    { n: 17, en: 'Key People of Influence', enText: 'Key people who lead and represent the business, not only the owner.', si: 'Business එක lead කරන key people. හැම දෙයක්ම owner මත depend වෙනවද?' },
    { n: 18, en: 'Sales & Marketing People', enText: 'People who can win customers without you.', si: 'ඔයා නැතුවත් customers ගේන්න පුළුවන් sales people.' },
    { n: 19, en: 'Management & Administration People', enText: 'Managers who keep the business organised.', si: 'Business එක organise කරලා තියාගන්න managers.' },
    { n: 20, en: 'Technicians', enText: 'Skilled specialists who deliver the work to standard.', si: 'වැඩේ quality එකට කරන technical specialists.' },
  ] },
  { id: 'funding', en: 'Funding', si: 'Money ගැන තියෙන confusion එක clear කරමු', assets: [
    { n: 21, en: 'Business Plan', enText: 'Real clarity about where the business is going, not just a document for the bank.', si: 'Bank එකට දෙන්න document එකක් විතරක් නෙවෙයි. ඔයාට future එක ගැන clarity තියෙනවද?' },
    { n: 22, en: 'Valuation', enText: 'Knowing what the business is worth, and why.', si: 'Business එක worth කීයද? Why? Revenue, profit, customers, brand, IP, systems.' },
    { n: 23, en: 'Structure', enText: 'Clear tax, ownership and legal responsibility.', si: 'Tax, ownership, legal responsibility clear කරන structure එක.' },
    { n: 24, en: 'Risk Mitigation', enText: 'Designing how the business survives supplier, staff, founder, customer, legal and cash-flow risks.', si: 'Problem එකක් ආවොත් business එක survive වෙන විදිහ design කරන එක. Founder, supplier, cash-flow dependency.' },
  ] },
];

const LEVELS = [
  { en: 'Nothing yet', si: 'කිසිම දෙයක් නෑ' },
  { en: 'Basic', si: 'Basic' },
  { en: 'There, but weak', si: 'තියෙනවා, හැබැයි weak' },
  { en: 'Decent', si: 'Decent' },
  { en: 'Strong', si: 'Strong' },
  { en: 'Competitive advantage', si: 'Competitive advantage එකක්' },
];

const STORE_KEY = 'gt-24-assets-scores';
const ALL = ASSET_GROUPS.flatMap((g) => g.assets.map((a) => ({ ...a, group: g })));

let scores = {};
try { scores = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { scores = {}; }
const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(scores)); } catch { /* private mode */ } };

const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
};

function renderMap(root) {
  ASSET_GROUPS.forEach((g, gi) => {
    const group = el('section', `asset-group asset-group--${g.id}`);
    group.id = `assets-${g.id}`;
    const head = el('header', 'asset-group-head');
    head.append(el('span', 'asset-group-num', String(gi + 1)));
    const titles = el('div');
    titles.append(el('h3', null, `${g.en} Assets`));
    const si = el('p', 'si', g.si); si.lang = 'si';
    titles.append(si);
    head.append(titles);
    head.append(el('span', 'asset-group-score', ''));
    group.append(head);

    const list = el('div', 'asset-list');
    g.assets.forEach((a) => {
      const card = el('article', 'asset');
      card.dataset.n = a.n;
      const top = el('div', 'asset-top');
      top.append(el('span', 'asset-n', String(a.n).padStart(2, '0')));
      top.append(el('h4', null, a.en));
      card.append(top);
      card.append(el('p', 'asset-en', a.enText));
      const asi = el('p', 'asset-si si', a.si); asi.lang = 'si';
      card.append(asi);

      const scale = el('div', 'score-scale');
      scale.setAttribute('role', 'radiogroup');
      scale.setAttribute('aria-label', `Score for ${a.en}, 0 to 5`);
      LEVELS.forEach((lvl, v) => {
        const b = el('button', 'score-btn', String(v));
        b.type = 'button';
        b.setAttribute('role', 'radio');
        b.title = `${v} · ${lvl.en} · ${lvl.si}`;
        b.addEventListener('click', () => {
          if (scores[a.n] === v) delete scores[a.n]; else scores[a.n] = v;
          save();
          update();
        });
        scale.append(b);
      });
      card.append(scale);
      card.append(el('p', 'score-label', ''));
      list.append(card);
    });
    group.append(list);
    root.append(group);
  });
}

function update() {
  document.querySelectorAll('.asset').forEach((card) => {
    const n = Number(card.dataset.n);
    const v = scores[n];
    card.classList.toggle('is-scored', v != null);
    card.querySelectorAll('.score-btn').forEach((b, i) => {
      b.classList.toggle('is-on', v != null && i <= v);
      b.setAttribute('aria-checked', String(v === i));
    });
    card.querySelector('.score-label').textContent = v == null ? 'Tap a score · score එකක් දෙන්න' : LEVELS[v].en === LEVELS[v].si ? LEVELS[v].en : `${LEVELS[v].en} · ${LEVELS[v].si}`;
  });

  ASSET_GROUPS.forEach((g) => {
    const vals = g.assets.map((a) => scores[a.n]).filter((v) => v != null);
    const max = g.assets.length * 5;
    const total = vals.reduce((s, v) => s + v, 0);
    document.querySelector(`#assets-${g.id} .asset-group-score`).textContent = vals.length ? `${total} / ${max}` : `– / ${max}`;
  });

  const scored = ALL.filter((a) => scores[a.n] != null);
  const total = scored.reduce((s, a) => s + scores[a.n], 0);
  const done = scored.length;
  document.getElementById('score-total').textContent = total;
  document.getElementById('score-count').textContent = `${done} of 24 scored · assets ${done}ක් score කළා`;
  document.getElementById('score-meter-fill').style.width = `${(total / 120) * 100}%`;

  const bars = document.getElementById('score-bars');
  bars.replaceChildren();
  ASSET_GROUPS.forEach((g) => {
    const vals = g.assets.map((a) => scores[a.n] ?? 0);
    const pct = (vals.reduce((s, v) => s + v, 0) / (g.assets.length * 5)) * 100;
    const row = el('div', 'score-bar');
    row.append(el('span', 'score-bar-name', g.en));
    const track = el('span', 'score-bar-track');
    const fill = el('span', 'score-bar-fill');
    fill.style.width = `${pct}%`;
    track.append(fill);
    row.append(track);
    row.append(el('span', 'score-bar-pct', `${Math.round(pct)}%`));
    bars.append(row);
  });

  const weakest = document.getElementById('score-weakest');
  weakest.replaceChildren();
  if (done < 24) {
    weakest.append(el('li', 'score-hint', `Score all 24 to find your weakest three · assets 24ම score කළාම lowest තුන මෙතන පේනවා (${24 - done} left).`));
  } else {
    [...ALL].sort((a, b) => scores[a.n] - scores[b.n] || a.n - b.n).slice(0, 3).forEach((a) => {
      const li = el('li');
      li.append(el('strong', null, `${a.n}. ${a.en}`));
      li.append(el('span', null, ` · ${a.group.en} · ${scores[a.n]}/5`));
      weakest.append(li);
    });
  }
}

const mapRoot = document.getElementById('asset-map');
if (mapRoot) {
  renderMap(mapRoot);
  update();
  document.getElementById('score-reset').addEventListener('click', () => {
    if (!Object.keys(scores).length || confirm('Clear all your scores? · ඔයාගේ scores සියල්ල මකන්නද?')) {
      scores = {};
      save();
      update();
    }
  });
  document.getElementById('score-print').addEventListener('click', () => window.print());
}

const entries = window.BROTATO_DATA.entities
  .filter(e => e.publication.status === 'published' && e.publication.reuse === 'allowed')
  .map(e => ({...e, name: e.names['zh-Hans'] || e.names.en}));
const normalize = s => s.normalize('NFKC').toLocaleLowerCase().replace(/[-–—]/g,' ').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
let kind = '全部';
const search = document.querySelector('#search');
const cards = document.querySelector('#cards');
const dialog = document.querySelector('#detail');
function showDetail(e) {
  document.querySelector('#detail-title').textContent = e.name + ' · ' + e.names.en;
  document.querySelector('#description').textContent = e.description;
  const link = document.querySelector('#source-link');
  const url = new URL(e.provenance.wikiPage);
  url.searchParams.set('oldid', e.provenance.revisionId);
  link.href = url.href;
  link.textContent = e.names.en + ' · 英文 Wiki 参考页';
  document.querySelector('#source-meta').textContent = '修订 ' + e.provenance.revisionId + ' · 核查于 ' + e.provenance.checkedAt + ' · 游戏版本未单独确认';
  dialog.showModal();
}
function render() {
  const q = normalize(search.value);
  const filtered = entries.filter(e => (kind === '全部' || e.kind === kind) && normalize([
    ...Object.values(e.names), ...e.aliases.filter(a => a.status === 'reviewed').map(a => a.text), e.description
  ].join(' ')).includes(q));
  cards.replaceChildren();
  for (const e of filtered) {
    const card = document.createElement('button'); card.className = 'card';
    const icon = document.createElement('span'); icon.className = 'icon'; icon.textContent = e.icon; icon.setAttribute('aria-hidden','true');
    const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = e.kind + ' / 编辑译名';
    const title = document.createElement('h2'); title.textContent = e.name;
    const description = document.createElement('p'); description.textContent = e.names.en + ' · ' + e.description;
    card.append(icon,tag,title,description);
    card.addEventListener('click', () => showDetail(e)); cards.append(card);
  }
  document.querySelector('#count').textContent = `显示 ${filtered.length} 个词条`;
  document.querySelector('#empty').hidden = filtered.length > 0;
}
search.addEventListener('input',render);
document.querySelectorAll('[data-kind]').forEach(button => button.addEventListener('click', () => {
  kind = button.dataset.kind;
  document.querySelectorAll('[data-kind]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  render();
}));
document.querySelector('#close').addEventListener('click', () => dialog.close());
document.querySelector('#reset').addEventListener('click', () => {search.value = '';document.querySelector('[data-kind="全部"]').click();search.focus();});
render();

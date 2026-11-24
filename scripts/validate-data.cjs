const fs = require('node:fs');
const path = require('node:path');
function loadData(file) {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^\/\* (?:Original demonstration data only\.|Original editorial entries; source pages are references, not relicensed content\.) \*\/\s*window\.BROTATO_DATA = ([\s\S]+);\s*$/);
  if (!match) throw new Error('Expected JSON data assigned to window.BROTATO_DATA');
  return JSON.parse(match[1]);
}
function validate(data) {
  const errors = [], ids = new Set(), sources = new Map();
  const check = (ok, message) => { if (!ok) errors.push(message); };
  const text = v => typeof v === 'string' && v.trim().length > 0;
  const url = v => { try { return new URL(v).protocol === 'https:'; } catch { return false; } };
  check(data.schemaVersion === 1, 'Unsupported schemaVersion');
  check(Array.isArray(data.sources), 'sources must be an array');
  check(Array.isArray(data.entities), 'entities must be an array');
  for (const s of data.sources || []) {
    check(text(s.id) && !sources.has(s.id), 'Duplicate or missing source ID');
    sources.set(s.id, s);
    check(url(s.url), s.id + ': source URL must use HTTPS');
    check(['original','official','wiki','community'].includes(s.type), s.id + ': invalid source type');
    check(text(s.license) && s.reuse === 'allowed', s.id + ': published source needs a license and allowed reuse');
  }
  for (const e of data.entities || []) {
    const id = e.id || '(missing ID)';
    check(text(e.id) && !ids.has(e.id), id + ': duplicate or missing entity ID'); ids.add(e.id);
    check(['角色','武器','道具','机制'].includes(e.kind), id + ': invalid category');
    check(text(e.names?.en) || text(e.names?.['zh-Hans']), id + ': missing display name');
    for (const [locale,value] of Object.entries(e.names || {})) check(['en','zh-Hans','zh-Hant'].includes(locale) && text(value), id + ': invalid localized name');
    check(text(e.description) && text(e.icon), id + ': missing description/icon');
    check(['demo','published'].includes(e.publication?.status) && e.publication?.reuse === 'allowed', id + ': draft or unapproved data must not ship');
    const source = sources.get(e.provenance?.sourceId), translationSource = sources.get(e.translation?.sourceId);
    check(!!source && !!translationSource, id + ': unresolved provenance/translation source');
    check(['original','official','community','reviewed'].includes(e.translation?.status), id + ': unreviewed translation');
    check(/^\d{4}-\d{2}-\d{2}$/.test(e.translation?.reviewedAt || ''), id + ': review date required');
    check(text(e.content?.set), id + ': content set required');
    if (e.publication?.status === 'published') check(url(e.provenance?.wikiPage) && Number.isInteger(e.provenance?.revisionId) && text(e.provenance?.checkedAt), id + ': factual reference required');
    if (e.publication?.status === 'demo') check(e.content?.set === 'demo' && source?.type === 'original', id + ': demo must be original');
    if (e.content?.set === 'mod') check(text(e.content.modId), id + ': mod ID required');
    if (source && source.type !== 'original') check(url(e.provenance.wikiPage) && text(String(e.provenance.revisionId || '')) && text(e.provenance.syncedAt), id + ': third-party source revision required');
    if (translationSource && translationSource.type !== 'original') check(text(e.translation.key) && text(e.translation.sourceVersion), id + ': translation key/version required');
    check(Array.isArray(e.aliases), id + ': aliases must be an array');
    for (const a of e.aliases || []) check(text(a.text) && ['en','zh-Hans','zh-Hant'].includes(a.locale) && a.status === 'reviewed' && sources.has(a.sourceId), id + ': invalid or unreviewed alias');
    check(Array.isArray(e.stats), id + ': stats must be an array');
    for (const s of e.stats || []) check(text(s.statId) && Number.isFinite(s.value) && text(s.unit) && sources.has(s.sourceId) && (s.tier === null || Number.isInteger(s.tier)), id + ': invalid statistic');
  }
  return errors;
}
module.exports = { loadData, validate };
if (require.main === module) {
  const data = loadData(path.join(__dirname, '../site/data.js'));
  const errors = validate(data);
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`Validated ${data.entities.length} entities and ${data.sources.length} sources.`);
}

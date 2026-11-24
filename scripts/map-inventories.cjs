/* Match metadata only. Never export translated text. */
const {parseCSV}=require('./audit-translations.cjs');
const norm=s=>s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
function matchInventories(inputs,targets){
 const records=[];
 for(const input of inputs){
  const rows=parseCSV(input.text),h=rows.shift(),idx=Object.fromEntries(h.map((v,i)=>[v,i]));
  if(!['keys','en','zh','zh_TW'].every(k=>k in idx))throw Error('Missing CSV columns');
  for(const row of rows){if(row.length!==h.length)throw Error('Malformed CSV row');const key=row[idx.keys];if(!key||key==='loc_keys')continue;records.push({file:input.file,key,en:row[idx.en],zhPresent:!!row[idx.zh].trim(),zhHantPresent:!!row[idx.zh_TW].trim()});}
 }
 return targets.map(t=>{
  const pool=records.filter(r=>r.key.startsWith(t.kind.toUpperCase()+'_'));
  let hits=pool.filter(r=>norm(r.en)===norm(t.name)),method='exact';
  if(!hits.length){hits=pool.filter(r=>norm(r.en).replace(/[-–—]/g,' ').replace(/[’‘]/g,"'")===norm(t.name).replace(/[-–—]/g,' ').replace(/[’‘]/g,"'"));method='punctuation_candidate';}
  const candidateKeys=hits.map(({en,...r})=>r);
  const duplicate=hits.some(h=>records.filter(r=>r.file===h.file&&r.key===h.key).length>1);
  return {...t,candidates:candidateKeys,matchMethod:hits.length?method:null,status:duplicate?'duplicate_key':hits.length>1?'ambiguous':hits.length===1?'candidate':'unmatched',reviewStatus:'pending',publishable:false};
 });
}
module.exports={matchInventories};
if(require.main===module){
 const fs=require('node:fs');const [targets,...paths]=process.argv.slice(2);
 if(!targets||!paths.length)throw Error('Usage: node map-inventories.cjs targets.json CSV...');
 const inputs=paths.map(file=>({file:require('node:path').basename(file),text:fs.readFileSync(file,'utf8')}));
 console.log(JSON.stringify(matchInventories(inputs,JSON.parse(fs.readFileSync(targets,'utf8'))),null,2));
}

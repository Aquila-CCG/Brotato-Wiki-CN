/* CSV audit: accepts local inputs; never fetches or publishes translations. */
function parseCSV(text) {
 const rows=[];let row=[],cell='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v!==''))rows.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw Error('Unclosed CSV quote');
 if(cell||row.length){row.push(cell);rows.push(row);}
 return rows;
}
const normalize=s=>s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
function analyze(text,targets=[]){
 const all=parseCSV(text),header=all.shift();
 if(!header||!['keys','en','zh','zh_TW'].every(k=>header.includes(k)))throw Error('Missing required columns');
 const ix=Object.fromEntries(header.map((h,i)=>[h,i]));
 const rows=all.filter(r=>r[ix.keys]&&r[ix.keys]!=='loc_keys');
 const keys=new Map(),duplicates=[],malformed=rows.filter(r=>r.length!==header.length).length;
 for(const r of rows){const k=r[ix.keys];keys.set(k,(keys.get(k)||0)+1);}
 for(const [key,count]of keys)if(count>1)duplicates.push({key,count});
 const langs={};
 const tokens=s=>(s.match(/\{\d+\}/g)||[]).sort().join('|');
 for(const lang of ['zh','zh_TW']){
  const missing=rows.filter(r=>!(r[ix[lang]]||'').trim());
  const mismatch=rows.filter(r=>(r[ix[lang]]||'').trim()&&tokens(r[ix.en]||'')!==tokens(r[ix[lang]]||''));
  langs[lang]={nonempty:rows.length-missing.length,missing:missing.length,missingKeys:missing.map(r=>r[ix.keys]),numericPlaceholderMismatchKeys:mismatch.map(r=>r[ix.keys])};
 }
 const mappings=targets.map(t=>{
  const hits=rows.filter(r=>normalize(r[ix.en]||'')===normalize(t.csvEnglishOverride || t.name));
  return {...t,candidateKeys:hits.map(r=>r[ix.keys]),status:hits.length===1?'candidate':hits.length?'ambiguous':'unmatched',zhPresent:hits.length===1&&!!(hits[0][ix.zh]||'').trim(),zhHantPresent:hits.length===1&&!!(hits[0][ix.zh_TW]||'').trim(),publishable:false};
 });
 return {rows:rows.length,uniqueKeys:keys.size,malformedRows:malformed,duplicateKeys:duplicates,locales:langs,mappings};
}
module.exports={parseCSV,analyze};
if(require.main===module){
 const fs=require('node:fs'),crypto=require('node:crypto');
 const [csv,targets]=process.argv.slice(2);
 if(!csv)throw Error('Usage: node audit-translations.cjs CSV [targets.json]');
 const bytes=fs.readFileSync(csv);
 console.log(JSON.stringify({inputSha256:crypto.createHash('sha256').update(bytes).digest('hex'),...analyze(bytes.toString('utf8'),targets?JSON.parse(fs.readFileSync(targets,'utf8')):[])},null,2));
}

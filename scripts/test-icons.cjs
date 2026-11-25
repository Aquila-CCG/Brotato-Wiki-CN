const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../data');const map=JSON.parse(fs.readFileSync(path.join(root,'icon-mapping.json')));const raw=JSON.parse(fs.readFileSync(path.join(root,'icon-assets.json')));
assert.equal(new Set(map.entities.map(e=>e.id)).size,map.entities.length);
for(const e of map.entities){assert.ok(e.images.length,e.id);for(const a of e.images){assert.equal(a.publishable,false);assert.equal(a.reuse,'unverified');assert.ok(a.url.startsWith('https://brotato.wiki.spellsandguns.com/images/'));assert.ok(a.width>0&&a.height>0);assert.match(a.sha1,/^[a-f0-9]{40}$/);assert.ok(raw.assets.some(r=>r.fileTitle===a.fileTitle));}}
assert.equal(map.entities.find(e=>e.id==='stat-engineering').images[0].fileTitle,'File:Engineering_Stat.png');
assert.equal(map.entities.find(e=>e.id==='stat-ranged-damage').images[0].fileTitle,'File:Ranged_Damage.png');
console.log('PASS icon identities, file references, dimensions, checksums and publication gate; no visual review.');

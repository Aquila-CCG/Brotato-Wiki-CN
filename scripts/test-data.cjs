const assert = require('node:assert/strict');
const path = require('node:path');
const {loadData,validate} = require('./validate-data.cjs');
const data = loadData(path.join(__dirname,'../site/data.js'));
assert.deepEqual(validate(data),[]);
for (const mutate of [
 d=>d.entities.push(structuredClone(d.entities[0])),
 d=>d.entities[0].provenance.sourceId='missing',
 d=>d.entities[0].publication.status='draft',
 d=>d.entities[0].publication.reuse='unknown',
 d=>d.sources[0].reuse='unknown',
 d=>d.entities[0].aliases[0].status='pending',
 d=>d.entities[0].names={},
 d=>d.sources[0].type='wiki',
 d=>d.entities[0].stats=[{statId:'damage',value:'10',unit:'points',sourceId:'original-demo',tier:1}]
]) { const candidate=structuredClone(data);mutate(candidate);assert.ok(validate(candidate).length>0); }
console.log('Passed valid data and 9 invalid-data rejection cases.');

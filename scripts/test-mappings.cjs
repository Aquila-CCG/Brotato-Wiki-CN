const assert=require('node:assert/strict');
const {matchInventories}=require('./map-inventories.cjs');
const csv='keys,en,zh,zh_TW\nCHARACTER_ONE_ARM,One-Armed,甲,甲\nITEM_ONE_ARM,One Armed,乙,乙\nWEAPON_CAPTAINS_SWORD,Captain’s Sword,丙,丙\nITEM_DUP,Duplicate,甲,甲\nITEM_DUP,Other,乙,乙\n';
const targets=[{name:'One Armed',kind:'character'},{name:"Captain's Sword",kind:'weapon'},{name:'Duplicate',kind:'item'},{name:'Missing',kind:'item'}];
const results=matchInventories([{file:'demo.csv',text:csv}],targets);
assert.equal(results[0].candidates[0].key,'CHARACTER_ONE_ARM');assert.equal(results[0].matchMethod,'punctuation_candidate');assert.equal(results[1].status,'candidate');assert.equal(results[2].status,'duplicate_key');assert.equal(results[3].status,'unmatched');assert.ok(results.every(x=>x.publishable===false&&x.reviewStatus==='pending'));
const ambiguous=matchInventories([{file:'a',text:csv},{file:'b',text:csv}],[targets[0]]);assert.equal(ambiguous[0].status,'ambiguous');
assert.throws(()=>matchInventories([{file:'bad',text:'keys,en\nA,B'}],targets));
console.log('PASS: category isolation, punctuation, duplicate-key blocking, unmatched, ambiguity, review gate and malformed input.');

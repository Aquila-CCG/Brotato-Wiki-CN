const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
function el(){return {value:'',children:[],dataset:{},handlers:{},setAttribute(k,v){this[k]=v},addEventListener(k,f){this.handlers[k]=f},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]},click(){this.handlers.click()},focus(){},showModal(){this.open=true},close(){this.open=false}}}
const ids=Object.fromEntries(['search','cards','detail','detail-title','description','count','empty','close','reset','source-link','source-meta'].map(k=>['#'+k,el()]));
const filters=['全部','角色','武器','道具'].map(kind=>Object.assign(el(),{dataset:{kind}}));
const document={createElement:el,querySelector:q=>ids[q]||filters.find(x=>q.includes(x.dataset.kind)),querySelectorAll:()=>filters};
const window={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../site/data.js'),'utf8'),{window});
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../site/app.js'),'utf8'),{document,window,URL});
assert.equal(ids['#cards'].children.length,6);filters[1].click();assert.equal(ids['#cards'].children.length,2);
ids['#search'].value='均衡型';ids['#search'].handlers.input();assert.equal(ids['#cards'].children.length,1);
ids['#cards'].children[0].click();assert.equal(ids['#detail'].open,true);assert.match(ids['#detail-title'].textContent,/均衡型/);ids['#close'].click();assert.equal(ids['#detail'].open,false);
ids['#search'].value='不存在';ids['#search'].handlers.input();assert.equal(ids['#cards'].children.length,0);assert.equal(ids['#empty'].hidden,false);
ids['#reset'].click();assert.equal(ids['#cards'].children.length,6);assert.equal(ids['#search'].value,'');
console.log('PASS: initial list, category, Chinese search, detail open/close, empty state, reset. Mock DOM only; no visual/browser validation.');

for(const query of ['Stick','綠植','棍棒','Ｓｔｉｃｋ']){ids['#search'].value=query;ids['#search'].handlers.input();assert.ok(ids['#cards'].children.length>0,query)}
ids['#cards'].children[0].click();assert.match(ids['#source-link'].href,/oldid=6782/);
console.log('PASS multilingual, alias and full-width search');

"""Collect image metadata only. No image binaries or article prose are downloaded."""
import json,time,urllib.error,urllib.request,urllib.parse,urllib.robotparser,re
from html.parser import HTMLParser
from pathlib import Path
BASE='https://brotato.wiki.spellsandguns.com'
UA='Brotato-Wiki-CN-AssetAudit/1.0 (+https://github.com/Aquila-CCG/Brotato-Wiki-CN)'
ROOT=Path(__file__).resolve().parents[1]

def get(url):
    time.sleep(2)
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=60) as r:return r.read().decode('utf-8')
def api(**params):
    d=json.loads(get(BASE+'/api.php?'+urllib.parse.urlencode(dict(format='json',maxlag=5,**params))))
    if 'error' in d:raise RuntimeError(d['error'])
    return d
class Images(HTMLParser):
    def __init__(self):super().__init__();self.anchor=None;self.rows=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='a':self.anchor=a
        if tag=='img':self.rows.append({'image':a,'anchor':self.anchor or {}})
    def handle_endtag(self,tag):
        if tag=='a':self.anchor=None

def main():
    try: robots=get(BASE+'/robots.txt')
    except urllib.error.HTTPError as e:
        if e.code!=404: raise
        robots='' # A missing robots file imposes no robots rules; not a content license.
    rp=urllib.robotparser.RobotFileParser();rp.parse(robots.splitlines())
    if not rp.can_fetch(UA,BASE+'/api.php'):raise RuntimeError('robots.txt disallows API; stopped')
    old=json.loads((ROOT/'data/expanded-targets.json').read_text())
    known={x['name']:x['id'] for x in old};assets={};inventories=[]
    for page,kind in [('Characters','character'),('Weapons','weapon'),('Stats','stat')]:
        d=api(action='parse',page=page,prop='text|revid')['parse'];p=Images();p.feed(d['text']['*'])
        inventories.append({'page':page,'revision':d['revid'],'imageOccurrences':len(p.rows)})
        for row in p.rows:
            im,a=row['image'],row['anchor'];src=urllib.parse.urljoin(BASE,im.get('src',''))
            if not src.startswith(BASE+'/images/'):continue
            parts=urllib.parse.unquote(urllib.parse.urlparse(src).path).split('/')
            filename=parts[-2] if '/thumb/' in src else parts[-1]
            if not re.search(r'\.(png|webp|jpg|jpeg|svg|gif)$',filename,re.I):continue
            title='File:'+filename
            rec=assets.setdefault(title,{'fileTitle':title,'occurrences':[],'reuse':'unverified','publishable':False})
            href=a.get('href','');target=urllib.parse.unquote(href.removeprefix('/')).replace('_',' ')
            if href.startswith('/index.php?'):target=urllib.parse.parse_qs(urllib.parse.urlparse(href).query).get('title',[''])[0].replace('_',' ')
            if ':' in target or href.startswith(('http','#')):target=''
            name=a.get('title') or target
            if name.startswith('File:'):name=''
            entity=known.get(name)
            # Image links to an entity are evidence; filename guesses are not.
            if not entity and target and name:entity=kind+'-'+re.sub(r'[^a-z0-9]+','-',name.lower()).strip('-')
            rec['occurrences'].append({'inventory':page,'inventoryRevision':d['revid'],'linkedName':name or None,'entityId':entity,'mappingStatus':'linked-page' if entity else 'needs-review','previewUrl':src,'alt':im.get('alt',''),'width':im.get('width'),'height':im.get('height'),'link':urllib.parse.urljoin(BASE,href)})
    titles=list(assets)
    for offset in range(0,len(titles),40):
        d=api(action='query',titles='|'.join(titles[offset:offset+40]),prop='imageinfo',iiprop='url|size|sha1|extmetadata')
        for page in d['query']['pages'].values():
            key=page['title'];rec=assets.get(key) or assets.get(key.replace(' ','_'))
            if rec is None:
                rec=next((v for k,v in assets.items() if k.replace('_',' ')==key),None)
            if rec is not None:rec['imageInfo']=page.get('imageinfo',[])
    out={'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Images occurring on Characters, Weapons and Stats inventories; completeness and mappings require review. No image binaries.','inventories':inventories,'assets':list(assets.values())}
    (ROOT/'data/icon-assets.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'inventories':inventories,'uniqueFiles':len(assets),'unmappedOccurrences':sum(not o['entityId'] for a in assets.values() for o in a['occurrences'])}))
if __name__=='__main__':main()

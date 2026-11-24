"""Single metadata probe; does not collect wiki content."""
import json
import urllib.request
url = "https://brotato.wiki.spellsandguns.com/api.php?action=query&meta=siteinfo&siprop=general%7Crightsinfo&format=json"
request = urllib.request.Request(url, headers={"User-Agent": "Brotato-Wiki-CN-Phase0/0.1 (single metadata probe)"})
with urllib.request.urlopen(request, timeout=30) as response:
    result = json.load(response)
if "error" in result:
    raise RuntimeError(result["error"])
print(json.dumps({"generator": result["query"]["general"]["generator"], "rightsinfo": result["query"]["rightsinfo"]}, ensure_ascii=False, indent=2))

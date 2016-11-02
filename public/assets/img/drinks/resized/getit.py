import requests
import json
import urllib

key = "&apiKey=3333501cb1af4603beccb822dc764f03"

dbHost = "http://addb.absolutdrinks.com/drinks/?start=0&pageSize=3000000"

picHost1 = "https://assets.absolutdrinks.com/drinks/transparent-background-white/soft-shadow/654x972/"
picHost2 = ".png"
		
r = requests.get(dbHost + key)
resp = json.loads(r.text)
if r.text == "File Not Found":
 	print "Not Found: " + r['id']

for r in resp['result']:
	urllib.urlretrieve(picHost1 + r['id'] + picHost2, r['id'] + '.png')

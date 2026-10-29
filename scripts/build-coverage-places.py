"""
Build the coverage lookup data from GeoNames (CC BY 4.0):
  cities500.txt  -> towns with population (ranking)
  US.txt (postal) -> every ZIP with its post-office town; towns missing from
                     cities500 are added at the average of their ZIPs.
Keeps WA, ID, OR, MT. Writes compact JSON: {places: [[name, st, lat, lon, pop]], zips: [[zip, name, st, lat, lon]]}.

Usage (download and unzip both files from download.geonames.org first:
export/dump/cities500.zip and export/zip/US.zip):
  python3 scripts/build-coverage-places.py cities500.txt US.txt content/coverage-places.json
"""
import csv, json, sys
from collections import defaultdict

cities_path, zips_path, out_path = sys.argv[1:4]
STATES = {"WA", "ID", "OR", "MT"}
r3 = lambda v: round(float(v), 3)

places = {}
with open(cities_path, encoding="utf-8") as f:
    for row in csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE):
        if row[8] != "US" or row[10] not in STATES or row[6] != "P":
            continue
        name, st, pop = row[1], row[10], int(row[14] or 0)
        key = (name.lower(), st)
        if key not in places or pop > places[key][4]:
            places[key] = [name, st, r3(row[4]), r3(row[5]), pop]

zips = []
by_town = defaultdict(list)
with open(zips_path, encoding="utf-8") as f:
    for row in csv.reader(f, delimiter="\t", quoting=csv.QUOTE_NONE):
        st = row[4]
        if st not in STATES or not row[9]:
            continue
        lat, lon = r3(row[9]), r3(row[10])
        zips.append([row[1], row[2], st, lat, lon])
        by_town[(row[2].lower(), st)].append((lat, lon, row[2]))

added = 0
for key, pts in by_town.items():
    if key in places:
        continue
    lat = round(sum(p[0] for p in pts) / len(pts), 3)
    lon = round(sum(p[1] for p in pts) / len(pts), 3)
    places[key] = [pts[0][2], key[1], lat, lon, 0]
    added += 1

out = sorted(places.values(), key=lambda p: (-p[4], p[0]))
zips.sort(key=lambda z: z[0])
with open(out_path, "w", encoding="utf-8") as f:
    json.dump({"places": out, "zips": zips}, f, ensure_ascii=False, separators=(",", ":"))
print(f"places {len(out)} (added from postal {added}), zips {len(zips)}")

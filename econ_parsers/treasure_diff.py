import json

if __name__ == "__main__":
  print("Starting...")


  print("Loading JSON")
  with open('treasures.json') as data_file:    
    treasures = json.load(data_file)
  with open('treasures.json.old') as data_file:    
    treasures_old = json.load(data_file)

  print("JSON loaded")

  new_items = []

  for treasure in treasures:
    new = True
    for t in treasures_old:
      if treasure["name"] == t["name"]:
        new = False
        if sorted(treasure["common_loot"]) != sorted(t["common_loot"]):
          new = True
        if sorted(treasure["very_rare_loot"]) != sorted(t["very_rare_loot"]):
          new = True
        if sorted(treasure["extra_rare_loot"]) != sorted(t["extra_rare_loot"]):
          new = True
        if sorted(treasure["unusual_loot"]) != sorted(t["unusual_loot"]):
          new = True
    
    if new:
      new_items.append(treasure["name"])
      for i in treasure["common_loot"]:
        new_items.append(i["name"])
      for i in treasure["very_rare_loot"]:
        new_items.append(i["name"])
      for i in treasure["extra_rare_loot"]:
        new_items.append(i["name"])
      for i in treasure["unusual_loot"]:
        new_items.append(i["name"])

print("Found " + str(len(new_items)) + " new items!")

print("Dumping to new_items.json")
with open('new_items.json', 'w') as fp:
  json.dump(new_items, fp, indent = True)
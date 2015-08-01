import json
import sys, os

def dict_duplicates(ordered_pairs):
  #Handle duplicate JSON keys
  #JSON doesn't support duplicate keys, Valve's VDF format does: why????
  #come on Valve, use Json. VDF is shit.
  #if duplicated VDF keys let's add the values to a list
  d = {}
  for k, v in ordered_pairs:
    if k in d:
      if not isinstance(d[k], list):
        temp = d[k]
        d[k] = []
        d[k].append(temp)

      d[k].append(v)
    else:
      d[k] = v
  return d


drop_rate = ["common", "very_rare","extra_rare","unusual"]

if __name__ == "__main__":
  print("Starting...")

  if len(sys.argv) > 1: #update flag
    os.rename('treasures.json','treasures.json.old')

  print("Loading JSON")
  with open('items_game.json') as data_file:    
    data = json.load(data_file, object_pairs_hook=dict_duplicates)
  print("JSON loaded")

  treasures = [];
  
  items = data["items_game"]["items"];
  loot_lists = data["items_game"]["loot_lists"];

  reserved_names = ["add_random_gems","add_empty_socket","additional_drop", "hero_gems_only", "can_have_duplicates","grant_one_of_each_item"]

  print("Parsing " + str(len(items)) + " items.")
  for key, item in items.items():
    try:
      if "prefab" in item:
        if item["prefab"] == "treasure_chest"  or item["prefab"] == "retired_treasure_chest":
          if "Autographed" not in item["name"] and "Summer Sale" not in item["name"]:
            treasure = {}
            treasure["name"] = item["name"]
            treasure["id"] = key
            treasure["common_loot"] = [] 
            treasure["very_rare_loot"] = [] 
            treasure["extra_rare_loot"] = [] 
            treasure["unusual_loot"] = [] 

            treasure["prefab"] = item["prefab"]
            if "price_info" in item:
              treasure["price_info"] = item["price_info"]

            if "creation_date" in item:
              treasure["creation_date"] = item["creation_date"]
            else:
              treasure["creation_date"] = "1970-01-01"
              
            if "treasure loot list" in item["static_attributes"]:
              loot_list_name = item["static_attributes"]["treasure loot list"]["value"];
              
              #treasure["number"] = int(loot_list_name.split("_")[2])
              
              loots_dict = loot_lists[loot_list_name]
          
              for loot_key, loot_value in loots_dict.items():
                if loot_key.endswith("_items") or loot_key.endswith("_sets") or loot_key.endswith("_chests") or loot_key.endswith("_wards") or loot_key.endswith("_2015"): #it is a "list pointer" 
                  itemsDict = loot_lists[loot_key];
                  for i in itemsDict.keys():
                    treasure["common_loot"].append({ "name": i, "drop_rate": "common"})
                elif loot_key not in reserved_names: #it is a simple item!
                  treasure["common_loot"].append({ "name": loot_key, "drop_rate": "common"})
                elif loot_key == "additional_drop": #reserved names, we only care for additional drops
                  ad = loot_value
                  #loot could be a list, because of duplicated keys in the JSON/VDF
                  if not isinstance(ad, list): #if not a list we make it a list
                    ad = [ad]

                  j = 1
                  for i in ad: #for each item
                    if "item" in i: #could be an item name
                      treasure[drop_rate[j] + "_loot"].append({ "name": i["item"], "drop_rate": drop_rate[j]})
                    elif "loot_list" in i: #or coule be a "list pointer"
                      if "courier" in i["loot_list"]:
                        pointedList = loot_lists[i["loot_list"]]
                        for i in pointedList.keys():
                          treasure["unusual_loot"].append({"name": i, "drop_rate": "unusual"})
                      else:
                        pointedList = loot_lists[i["loot_list"]]
                        for i in pointedList.keys():
                          treasure["extra_rare_loot"].append({"name": i, "drop_rate": "extra_rare"})
                    j += 1
                else:
                  pass

              for k in drop_rate:
                for l in reversed(treasure[k + "_loot"]):
                  if l["name"] in reserved_names:
                    treasure[k + "_loot"].remove(l)

              treasures.append(treasure)

    except Exception as e:
      print("Warning while parsing items: "  + str(e) + ".Shit happens, don't worry, treasure skipped") 
  #treasures done
  print("Parsing complete")

  print("Dumping to treasures.json")
  with open('treasures.json', 'w') as fp:
    json.dump(treasures, fp, indent = True)

  print("Complete!")

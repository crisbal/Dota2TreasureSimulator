# File Parsers

These scripts are a mess but they work, they only problem is that they are a big "hack" and might stop working if Valve changes something.

## First time only

* Get a clean items_game.txt
    * From the Dota2 game files
* Convert items_game.txt to JSON via the vdf2json.php script
    * You need php for this
    * This JSON file will have multiple values associated to the same keys, because VDF allows this

* Run treasure_parser.py to get treasures.json
    * You might need to manually fix some problems in the items\_game.json file because the php script fucks up.
        * It produces wrong JSON for the item "Gladius TGD2 Season 1"
    * I tried to handle the *Single Key - Multiple Values* problem, basically if the json is { A: 1, A:2, B: 1 } it gets converted for Python to { A: [1,2], B: 1 } and then to { A: [1,2], B: [1] }.
        * Not the best thing but it works and it is easy to work with.

* Run item\_detail\_parser.py
    * You need to set your Steam API key in this file
    * This script will build item_details.json
    * This script will make a web requests to the Steam API for each item (every treasure and its content) so we can get the url to the image file.
    * This might take some time but usually less than 1 hour, it is optimized to skip unwanted items  
* Manually fix Faceless Rex droprate
    * In treasures.json find the chest that contains it. Move him to unusual_loot

* Everything is ready for the Angular App to work: it requires treasures.json and item_detail.json in this folder
  * You can delete the unneeded json/txt files.


## Updating

If an update that adds new treasures hits the Dota 2 Client, we will need to update the website.

All this is done to to avoid redownloading image URLs for the items.

I need a script to do all of this automatically.

* Get the new up-to-date items_game.txt from the Dota 2 files
* Backup treasures.json and items_detail.json to avoid data loss, because it could maybe happen and if it happens you need to redo everything from the start (mainly redownloading the image URLs).
* Convert items_game.txt to json (same as before)
* Run "treasure_parser.py -update" **Don't forget the *-update* argument**
    * To re-build the list of all the treasures and items
    * This will produce treasures.json and rename the old treasure.json to treasure.json.old
* Run treasure_diff.py
    * This will compare treasure.json.old and treasures.json searching for new treasures and items and produce "new\_items.json"
* Run update\_item\_detail.py
    * This will read "new\_items.json", get the required details from "items_game.json" and download the new image URLs from the Dota 2 API.
    * This will produce items\_detail.json merging old and new items and renaming the old items\_detail.json to items\_detail.json.old
* Manually fix Faceless Rex droprate
    * In treasures.json find the chest that contains it. Move him to unusual_loot
* The website is now up to date! 
  






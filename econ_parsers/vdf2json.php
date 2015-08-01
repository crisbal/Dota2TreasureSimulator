

<?php

    //THANKS TO https://gist.github.com/AlienHoboken/5571903

    //load VDF data either from API call or fetching from file/url
    //no matter your method, $json must contain the VDF data to be parsed
    $json = file_get_contents("items_game.txt");

    //encapsulate in braces
    $json = "{\n$json\n}";

    //replace open braces
    $pattern = '/"([^"]*)"(\s*){/';
    $replace = '"${1}": {';
    $json = preg_replace($pattern, $replace, $json);

    //replace values
    $pattern = '/"([^"]*)"\s*"([^"]*)"/';
    $replace = '"${1}": "${2}",';
    $json = preg_replace($pattern, $replace, $json);

    //remove trailing commas
    $pattern = '/,(\s*[}\]])/';
    $replace = '${1}';
    $json = preg_replace($pattern, $replace, $json);

    //add commas
    $pattern = '/([}\]])(\s*)("[^"]*":\s*)?([{\[])/';
    $replace = '${1},${2}${3}${4}';
    $json = preg_replace($pattern, $replace, $json);

    //object as value
    $pattern = '/}(\s*"[^"]*":)/';
    $replace = '},${1}';
    $json = preg_replace($pattern, $replace, $json);

    //we now have valid json which we can use and/or store it for later use
    file_put_contents("items_game.json", $json);

    /* NB: this does not allow for creation of json arrays, however.
     * if you wish to keep working with the json data in PHP, you could
     * do something like this to get an array where needed. eg. for items
     */
    $data->items_game->items = get_object_vars($data->items_game->items); //items object is now an array
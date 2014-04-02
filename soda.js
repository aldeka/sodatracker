$(document).ready(function() {
    var i, j, k;

    /* 
     *** Initial app data and state ***
     */

    var filters = [];
    var sodas = [
        {
            id: 1,
            name: "Coke",
            color: "red"
        },
        {
            id: 2,
            name: "Diet Coke w. Lime",
            color: "#0f9950"
        },
        {
            id: 3,
            name: "Barq's",
            color: "#ffaa00"
        },
        {
            id: 4,
            name: "Squirt",
            color: "#cfcc00"
        },
        {
            id: 5,
            name: "Coconut water",
            color: "#d000cc"
        },
        {
            id: 6,
            name: "Canada Dry",
            color: "#0000cc"
        }
    ];
    var stations = [
        {
            id: 1,
            name: "Station One",
            loc: "Building 11, 2nd floor break room",
            sodas: [sodas[0], sodas[2], sodas[4], sodas[5]]
        },
        {
            id: 2,
            name: "Station Two",
            loc: "Building 42, first floor elevator",
            sodas: [sodas[3], sodas[2]]
        },
        {
            id: 3,
            name: "Troll Refueling Station",
            loc: "Under the bridge",
            sodas: [sodas[3], sodas[1], sodas[2]]
        },
        {
            id: 4,
            name: "Welcome Station",
            loc: "Building 11 atrium",
            sodas: [sodas[0], sodas[4], sodas[1]]
        }
    ];

    /* Fills in all of the templates needed for a given station */
    var initializeStation = function(station) {
        var stationID = station.id.toString();
        // make base station template
        $('#station-template').tmpl(station).appendTo('.station-list');
        // fill in sodas the station has
        $('#the-sodas-template').tmpl(
            {'sodas': station.sodas}
            ).appendTo('#station-' + stationID + ' .the-sodas:first-child');
        // fill in dropdown menus
        refreshDropdowns(station);
    };

    /* (Re)instantiates the add and remove dropdown menus for a given station */
    var refreshDropdowns = function(station) {
        var stationID = station.id.toString();
        var remainingSodas = processedSodas(station);
        $('#station-'+ stationID +' .dropdown-menu').empty();
        /* Fill in adder menu */
        $('#soda-dropdown-template').tmpl(
            {
                'sodas': remainingSodas
            }
            ).appendTo('#station-'+ stationID +' .adder-group .dropdown-menu');
        /* Fill in remover menu */
        $('#soda-dropdown-template').tmpl(
            {
                'sodas': station.sodas
            }
            ).appendTo('#station-'+ stationID +' .remover-group .dropdown-menu');
    };

    /* For a given station, returns list of sodas the station doesn't already have */
    var processedSodas = function(station) {
        var processed = [];
        for(j=0; j<sodas.length; j++) {
            var temp = sodas[j];
            for(k=0; k<station.sodas.length; k++) {
                if (sodas[j] === station.sodas[k]){
                    temp = undefined;
                }
            }
            if (temp) {
                processed.push(temp);
            }
        }
        return processed;
    };

    /* Reapplies classes to the list of stations based on the current filters list */
    var refilterStations = function() {
        if (filters.length === 0) {
            $('.station').removeClass('filtered');
        } else {
            // populate list of visible stations' IDs
            acceptable_stations = [];
            for (i=0; i<stations.length; i++) {
                var station = stations[i];
                for (j=0; j<filters.length; j++) {
                    for (k=0; k<station.sodas.length; k++) {
                        if (station.sodas[k].id === filters[j]) {
                            acceptable_stations.push(station.id);
                        }
                    }
                }
            }
            // we filter everything...
            $('.station').addClass('filtered');
            // then remove the class selectively
            for (i=0; i<acceptable_stations.length; i++) {
                $('#station-' + acceptable_stations[i].toString()).removeClass('filtered');
            }
        }
    };

    /* Generates random hex color within some brightness constraints */
    var generateColor = function() {
        var color1, color2, color3, result;
        var minBrightness = 300;
        var maxBrightness = 550;

        color1 = getRandomInt(0,255);
        color2 = getRandomInt(0,255);
        // calculate appropriate third color value
        if (color1 + color2 < 400) {
            color3 = getRandomInt(minBrightness - (color1 + color2), 255);
        } else {
            color3 = getRandomInt(0, Math.max(maxBrightness - (color1 + color2), 255));
        }
        // Convert color integers to hex strings
        // and put them in an array
        colors = [color1.toString(16), color2.toString(16), color3.toString(16)];
        colors = shuffle(colors);
        result = '';
        for (i=0; i<colors.length; i++) {
            var color = colors[i];
            if (color.length == 1) {
                color = "0" + color;
            }
            result += color;
        }
        return "#" + result;
    };

    /* Initial app setup */
    var initApp = function() {
        // initialize soda list
        for (i=0; i<sodas.length; i++) {
            $('#soda-template').tmpl(sodas[i]).appendTo('.soda-list');
        }

        // initialize stations list
        for (i=0; i<stations.length; i++) {
            initializeStation(stations[i]);
        }

        /* 
         *** DOM Handlers! ***
         */

        /* Handler for menu for adding new sodas to stations */
        $('body').on('click', '.station .adder-group .dropdown-menu a', function(e) {
            e.preventDefault();
            var soda, station, remainingSodas;
            var sodaID = $(this).attr('data-attribute').slice(5);
            var stationID = $($(this).parents('.station')[0]).attr('id').slice(8);
            for (i=0; i<sodas.length; i++){
                if (sodas[i].id === parseInt(sodaID,10)){
                    soda = sodas[i];
                    break;
                }
            }
            if (soda){
                for (i=0; i<stations.length; i++) {
                    if (stations[i].id === parseInt(stationID,10)) {
                        station = stations[i];
                        // add to station's sodas
                        station.sodas.push(soda);
                        $('#station-' + stationID + ' .the-sodas').empty();
                        // refresh station's list of sodas
                        $('#the-sodas-template').tmpl(
                            {'sodas': station.sodas}
                            ).appendTo('#station-' + stationID + ' .the-sodas');
                        // refresh dropdown menu
                        refreshDropdowns(station);
                        break;
                    }
                }
                refilterStations();
            }
        });

        /* Handler for menu for removing sodas from stations */
        $('body').on('click', '.station .remover-group .dropdown-menu a', function(e) {
            e.preventDefault();
            var soda, station, remainingSodas;
            var sodaID = $(this).attr('data-attribute').slice(5);
            var stationID = $($(this).parents('.station')[0]).attr('id').slice(8);
            for (i=0; i<sodas.length; i++){
                if (sodas[i].id === parseInt(sodaID,10)){
                    soda = sodas[i];
                    break;
                }
            }
            if (soda){
                for (i=0; i<stations.length; i++) {
                    if (stations[i].id === parseInt(stationID,10)) {
                        station = stations[i];
                        // remove from station's sodas
                        station.sodas.splice(station.sodas.indexOf(soda), 1);
                        $('#station-' + stationID + ' .the-sodas').empty();
                        // refresh station's list of sodas
                        $('#the-sodas-template').tmpl(
                            {'sodas': station.sodas}
                            ).appendTo('#station-' + stationID + ' .the-sodas');
                        // refresh dropdown menus
                        refreshDropdowns(station);
                        break;
                    }
                }
                refilterStations();
            }
        });

        /* Handler for filtering stations by soda offered */
        $('body').on('click', '#sodas ul div', function(e) {
            var sodaID, acceptable_stations;
            // toggle soda style
            $(this).toggleClass('active');
            sodaID = $(this).attr('data-attribute').slice(5);
            // toggling filter
            // check if filter already exists, and if so, remove it
            for (i=0; i<filters.length; i++) {
                if (filters[i] === parseInt(sodaID,10)) {
                    filters.splice(i, 1);
                    sodaID = '';
                    break;
                }
            }
            // add new filter, if it exists
            if (sodaID) {
                filters.push(parseInt(sodaID,10));
            }
            // remove class filtered from all matching stations
            // add class filtered to any station we want filtered out
            refilterStations();
        });

        /* Handler for creating a new soda */
        $('body').on('submit', '#sodamaker', function(e) {
            e.preventDefault();
            var newSoda;
            var sodaName = $(this).find('[name="name"]').val();
            if (sodaName){
                newSoda = {
                    id: sodas.length + 1,
                    name: sodaName,
                    color: generateColor()
                };
                sodas.push(newSoda);
                $('#soda-template').tmpl(newSoda).appendTo('.soda-list');
                for (i=0; i < stations.length; i++) {
                    var id = stations[i].id.toString();
                    var remainingSodas = processedSodas(stations[i]);
                    $('#station-'+ id +' .dropdown-menu').empty();
                    $('#soda-dropdown-template').tmpl(
                        {
                            'sodas': remainingSodas
                        }
                        ).appendTo('#station-'+ id +' .dropdown-menu');
                }
                $(this).find('[name="name"]').val('');
            }
        });

        /* Handler for creating a new station */
        $('body').on('submit', '#stationmaker', function(e) {
            e.preventDefault();
            var stationName, stationLoc;
            stationName = $(this).find('[name="name"]').val();
            stationLoc = $(this).find('[name="loc"]').val();
            if (stationName){
                newStation = {
                    id: stations.length + 1,
                    name: stationName,
                    loc: stationLoc,
                    sodas: []
                };
                stations.push(newStation);
                initializeStation(newStation);
                $(this).find('[name="name"]').val('');
                $(this).find('[name="loc"]').val('');
            }
        });
    };

    initApp();

    /* Helper functions for color generator */

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var shuffle = function(l) {
      var currentIndex = l.length;
      var randomIndex, temp;

      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temp = l[currentIndex];
        l[currentIndex] = l[randomIndex];
        l[randomIndex] = temp;
      }

      return l;
    };
});
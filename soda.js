$(document).ready(function(){
    var sodas = [
        {
            id: 1,
            name: "Barq's",
            color: "#ff9900"
        },
        {
            id: 2,
            name: "Squirt",
            color: "#0f9950"
        },
        {
            id: 3,
            name: "Diet Coke with Lime",
            color: "#99dd00"
        }
    ];
    var stations = [
        {
            id: 1,
            name: "Station One",
            loc: "Building 24, 3rd floor break room",
            sodas: [sodas[0], sodas[2]],
        }
    ];

    /* For a given station, returns list of sodas the station doesn't already have */
    var processedSodas = function(station){
        var processed = [];
        for(i=0; i<sodas.length; i++) {
            var temp = sodas[i];
            for(j=0; j<station.sodas.length; j++) {
                if (sodas[i] === station.sodas[j]){
                    temp = undefined;
                }
            }
            if (temp) {
                processed.push(temp);
            }
        }
        return processed;
    };

    var initializeStation = function(station){
        var id = station.id.toString();
        var remainingSodas = processedSodas(station);
        // make base station template
        $('#station-template').tmpl(station).appendTo('.station-list');
        // fill in sodas the station has
        $('#the-sodas-template').tmpl(
            {'sodas': station.sodas}
            ).appendTo('#station-' + id + ' .the-sodas:first-child');
        // fill in dropdown menu with the sodas the station doesn't have
        $('#soda-dropdown-template').tmpl(
            {
                'sodas': remainingSodas
            }
            ).appendTo('#station-'+ id +' .dropdown-menu');
    };

    // initialize soda list
    for (i=0; i<sodas.length; i++) {
        $('#soda-template').tmpl(sodas[i]).appendTo('.soda-list');
    }

    // initialize stations list
    for (i=0; i<stations.length; i++) {
        initializeStation(stations[i]);
    }

    $('body').on('click', '.station .dropdown-menu a', function(e){
        e.preventDefault();
        console.log('clicked');
        var soda, station, remainingSodas;
        var sodaID = $(this).attr('data-attribute').slice(5);
        var stationID = $($(this).parents('.station')[0]).attr('id').slice(8);
        console.log(sodaID);
        console.log(stationID);
        for (i=0; i<sodas.length; i++){
            if (sodas[i].id === parseInt(sodaID,10)){
                soda = sodas[i];
                break;
            }
        }
        console.log(soda);
        if (soda){
            console.log(stations.length);
            for (i=0; i<stations.length; i++) {
                console.log(stations[i]);
                console.log(parseInt(stationID,10));
                if (stations[i].id === parseInt(stationID,10)) {
                    station = stations[i];
                    console.log(station);
                    // add to station's sodas
                    station.sodas.push(soda);
                    $('#station-' + stationID + ' .the-sodas').empty();
                    // refresh station's list of sodas
                    $('#the-sodas-template').tmpl(
                        {'sodas': station.sodas}
                        ).appendTo('#station-' + stationID + ' .the-sodas');
                    // refresh dropdown menu
                    remainingSodas = processedSodas(station);
                    $('#station-'+ stationID +' .dropdown-menu').empty();
                    $('#soda-dropdown-template').tmpl(
                        {
                            'sodas': remainingSodas
                        }
                        ).appendTo('#station-'+ stationID +' .dropdown-menu');
                    break;
                }
            }
        }
    });

    $('body').on('submit', '#sodamaker', function(e){
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

    $('body').on('submit', '#stationmaker', function(e){
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

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    };

    var generateColor = function() {
        var color1, color2, color3, result;
        var minBrightness = 400;
        var maxBrightness = 600;

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
});
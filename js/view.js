
  var markers = [];
  var items =[];
  var nbrMarkers;
  var $wikiElem = $('#wikiArticles');
  var map;
  var Loc = function(data){
    this.location= data.location;//ko.observable(data.location); //these are referred to as location()
    this.address =data.address;//ko.observable(data.address);
    this.lat = data.lat;//ko.observable(data.lat);
    this.lng = data.lng;//ko.observable(data.lng);
    this.streetView = "https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +data.lat+ "," +data.lng + "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik";
    this.visible = ko.observable(data.visible);
    this.wikiUrl ='http://en.wikipedia.org/w/api.php?action=opensearch&search=' + data.location + '&format=json&callback=wikiCallback';
    this.contentForWindow =  data.location + "<br/><img src=\"https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" + data.location +" " + data.address  + "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom\-mZOiik\">'";
    this.markerItem  =new google.maps.Marker({
        position: {lat: data.lat, lng:data.lng},
        title: data.location,
        animation: google.maps.Animation.DROP,
        visible:  data.visible
    });
  };

//MV - the only place where you can access the MODEL AND the VIEW
// MODEL = MyListOfPlaces
// VIEW - stuff you do to build the display
var Octopus = function() {
    //DATA
    //do self = this so this works correctly. THIS is the octopus... not the data
    var self = this;
    this.chosenMarker = ko.observable();
    this.koMarkerArray = ko.observableArray([]);
    MyListOfPlaces.forEach(function(datapoint){
      //used for the filter functionality and the list objects
      self.koMarkerArray.push (new Loc(datapoint));
      //used for the markers on the google map
      markers.push (new Loc(datapoint));
      });
      nbrMarkers = markers.length;
      this.filter = ko.observable('');

    //BEHAVIORS
    this.goToMarker = function(x) {
      //if the media width is too small, then close the menuvar mq = window.matchMedia( "(min-width: 500px)" );
      var mq = window.matchMedia( "(min-width: 600px)" );
      if (mq.matches) {
        // do nothing
      } else {
        drawer.classList.remove('open');
      }
        self.chosenMarker(x.location);
        for (i=0; i < nbrMarkers; i++)
          {if (x.location == markers[i].markerItem.title)
            {
              google.maps.event.trigger(markers[i].markerItem, 'click');
            }
          }
        };

    this.filteredItems = ko.computed(function() {
      var lcFilter = this.filter().toLowerCase();
      if (!lcFilter) {
          //if there is no filter, then return the whole list
          for (i=0; i< nbrMarkers; i++) {
            markers[i].markerItem.setVisible(true);
          }
          return this.koMarkerArray();}
        else {
          //if there is a filter then use arrayFilter to shorten the list
          return ko.utils.arrayFilter(this.koMarkerArray(), function(item) {
            var string = item.location.toLowerCase();
            for (i=0; i < nbrMarkers; i++) {
              var str2 = markers[i].markerItem.title.toLowerCase();
              if(str2.search(lcFilter) >=0)
                {markers[i].markerItem.setVisible(true);}
              else
                {markers[i].markerItem.setVisible(false);}
              }
          if( string.search(lcFilter) >= 0 )
              {return true;}
            else
              {return false;}
              });
          }
    }, this);
  };

//VIEW tasks:
  //create and set Google Map with marker
  //initialize is a VIEW element

function viewThing() {
    //setup the Map
  	var mapCanvas = document.getElementById('map');
  	var mapOptions = {
   		 center:  new google.maps.LatLng(44.955241, -92.075459),
       zoom: 4,
    	 mapTypeId: google.maps.MapTypeId.ROADMAP
     };
    map = new google.maps.Map(mapCanvas, mapOptions);
    var bounds = new google.maps.LatLngBounds();
    menu = menuSetup();
    for (i=0; i< markers.length; i++) {
      LinkMarkerToContent(markers[i].markerItem, markers[i].contentForWindow, markers[i].wikiUrl);
      markers[i].markerItem.setMap(map);
      google.maps.event.addListener(markers[i].markerItem, 'click', toggleBounce);
      bounds.extend(markers[i].markerItem.position);
    }
    map.fitBounds(bounds);

}


  function menuSetup(){
      var menuControl = document.getElementById("menu");
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(menuControl);
      menuControl.addEventListener('click', function(e) {
        drawer.classList.toggle('open');
        e.stopPropagation();

      });
      var main = document.querySelector('#map');
      var drawer = document.querySelector('#drawer');
      var exitStep = document.querySelector('#exit');

      main.addEventListener('click', function() {
        drawer.classList.remove('open');
        menuControl.classList.remove('open');
        });

      exitStep.addEventListener('click',function(){
        drawer.classList.remove('open');
        });
  }

  //link infowindow to marker
  function LinkMarkerToContent(marker, string, wikiUrl){
    var formattedDefaultStr = "<ul id='wikiArticles'>" + string + "</div>";
    var infowindow = new google.maps.InfoWindow({
      content: formattedDefaultStr
      });

    map.addListener('click',function(){
      if (infowindow.opened){
          infowindow.close();
        }
      });
    marker.addListener('click', function() {
      if(infowindow.opened){
          infowindow.close();
          infowindow.opened = false;
        }
      else{
        getWikiArticles(wikiUrl,infowindow, formattedDefaultStr);
        infowindow.open(marker.get('map'), marker);
        infowindow.opened = true;
        }
    });
  }

  //bounce markers on click, end after 1.5sec
  function toggleBounce (marker) {
  	var self = this;
  	if(self.getAnimation() !== null) {
  		self.setAnimation(null);
  	}
     else {
  		self.setAnimation(google.maps.Animation.BOUNCE);
  		setTimeout(function(){self.setAnimation(null); }, 1500);
  	}
  }
  function initRoutine(){
    var octo = new Octopus();
    ko.applyBindings(octo);
    google.maps.event.addDomListener(window, 'load', function() {
      viewThing();
    });
  }
  function errorHandling(){
    console.log("there was an error in the google load");
    $("#map").append("Error in google map load");
  }
  function getWikiArticles(wikiURL, infowindow, string) {

    $.ajax({
      url: wikiURL,
      dataType: "jsonp",
      timeout: 8000,
      //jsonp: "callback"
    })
      .done (function ( response) {
          var articleStr = response[0];
          console.log(articleStr);
          var url = 'http://en.wikipedia.org/wiki/' + articleStr + " target='_blank'";
          infowindow.setContent(string + '<p><a href="' + url + '"  target="_blank">' + 'Wikipedia Link to ' +
                articleStr   + '</a>');
        })
        .error(function(error){
          alert('problem with wiki article');
        })
      };

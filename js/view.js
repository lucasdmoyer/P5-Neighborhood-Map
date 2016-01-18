
  var markers = [];
  var markerWindows = [];
  var map;
  var Loc = function(data){
    this.location= data.location;//ko.observable(data.location); //these are referred to as location()
    this.address =data.address;//ko.observable(data.address);
    this.lat = data.lat;//ko.observable(data.lat);
    this.lng = data.lng;//ko.observable(data.lng);
    this.streetView = "https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +data.lat+ "," +data.lng + "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik"
    this.visible = ko.observable(data.visible);
    this.nyt = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + data.location + "," + data.address + "&page=2&sort=newest&api-key=a83fb0e20722ea3a4e8b4b05dda2786f:8:38135839"
    this.contentForWindow = data.location + "<br/><img src=\"https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" + data.location +" " + data.address  + "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik\">'"
    //this.koMarkerItem = ko.observable(0);
    this.MarkerItem =new google.maps.Marker({
      position: {lat: data.lat, lng:data.lng},
      title:data.location,
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
    //this puts all the objects from the data model into an array you can use here
    //once here you should not use MyListOfPlaces again...
    MyListOfPlaces.forEach(function(datapoint){
      //used for the filter functionality and the list objects
      self.koMarkerArray.push (new Loc(datapoint));
      //used for the markers on the google map
      markers.push (new Loc(datapoint));
      });

    //console.log('The first element is ' + this.koMarkerArray()[0].location);
    this.filter = ko.observable('');
    //BEHAVIORS
    this.goToMarker = function(x) {
        self.chosenMarker(x.location);
        for (i=0; i < markers.length; i++)
          {if (x.location == markers[i].title)
            {
              google.maps.event.trigger(markers[i], 'click');
            };
          };
        };

    this.filteredItems = ko.computed(function() {
      var lcFilter = this.filter().toLowerCase();
      if (!lcFilter) {
          //if there is no filter, then return the whole list
          return this.koMarkerArray();}
        else {
          //if there is a filter then use arrayFilter to shorten the list
          return ko.utils.arrayFilter(this.koMarkerArray(), function(item) {
            var string = item.location.toLowerCase();
            for (i=0; i < markers.length; i++) {
              var str2 = markers[i].MarkerItem.title.toLowerCase();
              if(str2.search(lcFilter) >=0)
                {markers[i].MarkerItem.setVisible(true);}
              else
                {markers[i].MarkerItem.setVisible(false);}
              };
          if( string.search(lcFilter) >= 0 )
              {return true;}
            else
              {return false;}
              });
          };
    }, this);
  };
  var octo = new Octopus;
  ko.applyBindings(octo);

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
  		 }
  	 map = new google.maps.Map(mapCanvas, mapOptions)

    //this seems to need to be AFTER the construct of the map to work.
    //set up the menu
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
      menu.classList.remove('open');
      });

    exitStep.addEventListener('click',function(){
      drawer.classList.remove('open');
      })

    //set up the markers
    //console.log('The first element is ' + octo.koMarkerArray()[0].location);
    for (i=0; i< markers.length; i++) {
      LinkMarkerToContent(markers[i].MarkerItem, markers[i].contentForWindow);
      markers[i].MarkerItem.setMap(map);
    	google.maps.event.addListener(markers[i].MarkerItem, 'click', toggleBounce);
    }
    };

  //link infowindow to marker
  var LinkMarkerToContent=function(marker, contentString){
    var infowindow = new google.maps.InfoWindow({
      content: contentString
      });

    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
       setTimeout(function () { infowindow.close(); }, 5000);
    });
  };
  //bounce markers on click, end after 1.5sec
  var toggleBounce = function(marker) {
  	var self = this;
  	if(self.getAnimation() !== null) {
  		self.setAnimation(null);
  	} else {
  		self.setAnimation(google.maps.Animation.BOUNCE);
  		setTimeout(function(){self.setAnimation(null); }, 1500);
  	};
  };

  google.maps.event.addDomListener(window, 'load', viewThing);

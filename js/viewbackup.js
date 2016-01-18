//var geocoder = new google.maps.Geocoder();

var markers = [];
var markerWindows = [];
var map
var Loc = function(data){
  this.location= data.location;//ko.observable(data.location); //these are referred to as location()
  this.address =data.address;//ko.observable(data.address);
  this.lat = data.lat;//ko.observable(data.lat);
  this.lng = data.lng;//ko.observable(data.lng);
  this.streetView = "https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +data.address+ "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik"
  //ko.computed(function() {
  //    return "https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +this.address()+ "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik"},this);
  this.visible = ko.observable(data.visible);
  this.contentForWindow = data.location + "<br/><img src=\"https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +data.address+ "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik\">'"
  this.koMarkerItem = ko.observable(0);
  this.MarkerItem =new google.maps.Marker({
    position: {lat: data.lat, lng:data.lng},
    //map: map,
    title:data.location,
    animation: google.maps.Animation.DROP,
    visible:  data.visible
  });
//  this.contentForWindow = ko.computed(function(){
//    return this.location ;
     //+ "<br/><img src='" + this.streetview + "'";
  // });

};

var Octopus = function() {
  //DATA
  //do self = this so this works correctly. THIS is the octopus... not the data
  var self = this;
  this.koMarkerArray = ko.observableArray([]);
  //this puts all the objects from the data model into an array you can use here
  //once here you should not use MyListOfLocations again...
  MyListOfLocations.forEach(function(datapoint){
    //add a new entry to the locList array correspond ing to each data element in the data model
    //this is the variable defined with ko observables outside the octopus
    // you need to do this to create the full list of locations that you use to initialize the view
    self.koMarkerArray.push (new Loc(datapoint));
    //parallel none ko array
    Markers.push(new Loc(datapoint));
  });

  //console.log( this.koMarkerArray().length);
  //console.log('The first element is ' + this.koMarkerArray()[0].location);
  this.filter = ko.observable('');
  //BEHAVIORS
  this.filteredItems = ko.computed(function() {
    var lcFilter = this.filter().toLowerCase();
      if (!lcFilter) {
        //if there is no filter, then return the whole list
        return this.koMarkerArray();
        }
      else {
        //if there is a filter then use arrayFilter to shorten the list
        return ko.utils.arrayFilter(this.koMarkerArray(), function(item) {
          //console.log(item.streetView);
          item.MarkerItem.setMap(null);
          var string = item.location.toLowerCase();
             if( string.search(lcFilter) >= 0 )
              {  //item.setVisibility('True');
                //console.log(item.MarkerItem);
                return true;}
              else {
                item.visible('False');
                //x=setMarkers();
                return false;}
            });
        console.log('last step of filteredItems');}

  }, this);


function setMarkers(){
  console.log('in set markers');
  for (var i = 0; i < octo.koMarkerArray().length; i++) {
   //octo.koMarkerArray[i].koMarkerItem.remove;
   //console.log(markers[i]);
   octo.koMarkerArray[i]().MarkerItem.setMap(null);
 };
  for (i=0; i< octo.filteredItems().length; i++){
   //octo.filteredItems[i]().koMarkerItem().setMap(map)
   //console.log('adding pins');
      octo.filteredItems[i]().MarkerItem.setMap(null);
  }
}
};
var octo = new Octopus;
ko.applyBindings(octo);
//ko.applyBindings(new octopus);

//create and set Google Map with marker
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center:  new google.maps.LatLng(44.955241, -92.075459),
  		zoom: 11,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	 map = new google.maps.Map(mapCanvas, mapOptions)
  //console.log('The first element is ' + octo.koMarkerArray()[0].location);
  for (i=0; i< octo.koMarkerArray().length; i++) {
    //console.log(octo.koMarkerArray()[i].visible());
    markerHolder= new google.maps.Marker({
      position: {lat: octo.koMarkerArray()[i].lat, lng:octo.koMarkerArray()[i].lng},
      //map: map,
      title: octo.koMarkerArray()[i].location,
      animation: google.maps.Animation.DROP,
      visible:  octo.koMarkerArray()[i].visible()
    });
    markers.push(markerHolder);
    // To add the marker to the map, call setMap();

    octo.koMarkerArray()[i].koMarkerItem(markerHolder);
    //create an array of infoWindow content
    LinkMarkerToContent(octo.koMarkerArray()[i].koMarkerItem(), octo.koMarkerArray()[i].contentForWindow);
    octo.filteredItems()[i].koMarkerItem().setMap(map);
  	google.maps.event.addListener(octo.koMarkerArray()[i].koMarkerItem(), 'click', toggleBounce);
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

google.maps.event.addDomListener(window, 'load', initialize);
/*
// we have to give it access to the map object, so that
// it can register and de-register itself
var Pin = function Pin(map, name, lat, lon, text) {
  var marker;

  this.name = ko.observable(name);
  this.lat  = ko.observable(lat);
  this.lon  = ko.observable(lon);
  this.text = ko.observable(text);

  marker = new google.maps.Marker({
    position: new google.maps.LatLng(lat, lon),
    animation: google.maps.Animation.DROP
  });

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setMap(map);
    } else {
      marker.setMap(null);
    }
  });

  this.isVisible(true);
}
self.filterPins = ko.computed(function () {
    var search  = self.query().toLowerCase();

    return ko.utils.arrayFilter(self.pins(), function (pin) {
        var doesMatch = pin.name().toLowerCase().indexOf(search) >= 0;

        pin.isVisible(doesMatch);

        return doesMatch;
    });
})

pin = new Pin(map, 1, 2, 'text')
*/

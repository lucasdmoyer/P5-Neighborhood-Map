//var geocoder = new google.maps.Geocoder();

var markers = [];
var markerWindows = [];
ko.utils.stringStartsWith = function (string, startsWith) {
       string = string || "";
       if (startsWith.length > string.length)
           return false;
       return string.substring(0, startsWith.length) === startsWith;
   };

var Loc = function(data){
  this.location= ko.observable(data.location); //these are referred to as location()
  this.address =ko.observable(data.address);
  this.clickCount= ko.observable(data.clickCount);
  this.imgSrc= ko.observable(data.imgSrc);
  this.imgAttribution= ko.observable(data.imgAttribution);
  this.products = ko.observableArray(data.products);
  this.lat = ko.observable(data.lat);
  this.lng = ko.observable(data.lng);
  this.hidden = ko.observable(data.hidden);
  this.streetView = ko.computed(function() {
      return "https://maps.googleapis.com/maps/api/streetview?size=100x50&location='" +this.address()+ "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik"},this);

};
var octopus = function() {
  //do self = this so this works correctly. THIS is the octopus... not the data
  var self = this;
  //this is a NEW array -- made to be an observable array
  this.markers = ko.observableArray([]);
  this.filter = ko.observable('');

  this.filteredItems = ko.computed(function() {
      var lcFilter = this.filter().toLowerCase();
      if (!lcFilter) {
          //if there is no filter, then return the whole list
          return this.markers();
        }
      else {
        //if there is a filter then use arrayFilter to shorten the list
          return ko.utils.arrayFilter(this.markers(), function(item) {
            var string = item.location().toLowerCase();
             if( string.search(lcFilter) >= 0 )
              {return true;}
              else {return false;}
            });
          }
  }, this);
  //this puts all the objects from the data model into an array you can use here
  InitialLocations.forEach(function(locItem){
    //add a new entry to the locList array corresponding to each data element in the data model
    self.markers.push (new Loc(locItem));
  });
};
ko.applyBindings(new octopus);


//create and set Google Map with marker
function initialize() {
	var mapCanvas = document.getElementById('map');
		var mapOptions = {
 		center:  new google.maps.LatLng(44.955241, -92.075459),
  		zoom: 11,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
		}
	var map = new google.maps.Map(mapCanvas, mapOptions)
	//google.maps.event.addListener(button, 'click', toggleBounce);
  for (i=0; i< InitialLocations.length; i++) {
    markers[i] = new google.maps.Marker({
      position: {lat: InitialLocations[i].lat, lng:InitialLocations[i].lng},
      map: map,
      title: InitialLocations[i].location,
      animation: google.maps.Animation.DROP
    });
  //create an array of infoWindow content

  markerWindows.push(InitialLocations[i].location + "<br/>"+ InitialLocations[i].address
   + "<br/><img src='https://maps.googleapis.com/maps/api/streetview?size=100x50&location="+ InitialLocations[i].address
   + "'key=AIzaSyAaeEKsxpkvy9N4aNx4GKYd7eom-mZOiik>" );

  LinkMarkerToContent(markers[i], markerWindows[i]);
	google.maps.event.addListener(markers[i], 'click', toggleBounce);
  }
  };

//link infowindow to marker
var LinkMarkerToContent=function(marker, contentString){
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener('click', function() {
    console.log();
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
	}
}
google.maps.event.addDomListener(window, 'load', initialize);

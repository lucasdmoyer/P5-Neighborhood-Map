<script>
var myCenter = new google.maps.LatLng(45.203573, -91.895454);

function initialize() {
var mapCanvas = document.getElementById('map');
var mapOptions = {
  center: myCenter,
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP
}
var map = new google.maps.Map(mapCanvas, mapOptions);
google.maps.event.addListener(map, 'click', function(event) {
placeMarker(event.latLng);
});
var marker=new google.maps.Marker({
  position: myCenter,
  });

marker.setMap(map);

var infowindow = new google.maps.InfoWindow({
  content:"My house"
  });

  google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
      map.setZoom(13);
      map.setCenter(marker.getPosition());
    });
  google.maps.event.addListener(map,'center_changed',function() {
      window.setTimeout(function() {
        map.panTo(marker.getPosition());
          }
          ,3000);
    });
};

google.maps.event.addDomListener(window, 'load', initialize);
</script>

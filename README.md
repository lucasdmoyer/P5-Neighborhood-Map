# P5-Neighborhood-Map
To view use : http://meckmeier.github.io/P5-Neighborhood-Map/index.html

This is a single-page application featuring a map of selected National parks. Included in this application are map markers for each park, a search function to easily find these parks on the map, and a list to support simple browsing of all parks.

Click on parks listed in the left pane to toggle the marker and show the info window.
You may also click directly on the marker to pop up the info window.
To hide the marker, you can click on the list item name, the marker itself, or any place on the map.

You can filter the list of parks by typing a search value into the search box to filter both the markers and the list items.

If you are using a mobile device, you can click the hamburger menu to show the list of parks.


TO DO: You will then research and implement third-party APIs that provide additional information about each of these locations (such as StreetView images -- apparently StreetView is not considered enough of an api call to complete this task--  I will plan to use the ny times app).

* uses Knockout.js to handle the list, filter and TODO the menu hide/show functionality.
<i>Things that should not be handled by knockout: anything the map api is used for, tracking markers, making the map, refreshing the map.</i>
Google map API is called async.
Search uses text box input and leverages knockout to filter the list view.

Add additional functionality using third-party APIs when a map marker, or list view entry is clicked (ex. Yelp reviews, Wikipedia, Flickr images, etc). If you need a refresher on making AJAX requests to third-party servers, check out our Intro to AJAX course.

Add additional functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.

Info window is launched when clicking a marker OR when clicking a list item.

TODO: Error Handling: In case of error (e.g. in a situation where a third party api does not return the expected result) we expect your webpage to do one of the following: A message is displayed notifying the user that the data can't be loaded, OR There are no negative repercussions to the UI. Note: Please note that we expect students to handle errors if the browser has trouble initially reaching the 3rd-party site as well. For example, imagine a user is using your neighborhood map, but her firewall prevents her from accessing the Instagram servers. Here is a reference article on how to block websites with the hosts file. It is important to handle errors to give users a consistent and good experience with the webpage. Read this blogpost to learn more .Some JavaScript libraries provide special methods to handle errors. For example: refer to .fail() method discussed here if you use jQuery's ajax() method. We strongly encourage you to explore ways to handle errors in the library you are using to make API calls.

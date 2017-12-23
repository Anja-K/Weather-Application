
    	var map, infoWindow;

    	var lat, lon;
    	var WeatherApicall;

    	var flag = false;

    	var cordsFlag = false;

    	var date = new Date();

    	var interval;


    	var searchLat, searchLon;

      function initMap() {
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 10
        });

        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            	lat = pos.lat;
            	lon = pos.lng;
            	flag = true;

            	

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
          flag = false;
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

      
    	$(function(){

    		$(window).on('load', function(){
    			$('#loader').fadeOut('slow', function(){$(this).remove();});
    			$('form').fadeIn('slow', function(){
    						$(this).css('display', 'block');
    					});
    		});

    		function checkFlag() {
    				if(flag === false) {
       					window.setTimeout(checkFlag, 100); 
    				} else {

    					
						WeatherApicall = 'lat=' + lat + '&lon=' + lon;

    					callweatherApi();
    					$('.info').fadeIn('slow', function(){
    						$(this).css('visibility', 'visible');
 
    					});
    				}
			}
			checkFlag();


			

		$('#search').on('click', function(e){
			e.preventDefault();

			clearInterval(interval);

			var value = $("#search-val").val();
			$("#search-val").val('');

			WeatherApicall = 'q=' + value; 

			callweatherApi();

			cordsFlag = true;
			$('.info').css('display', 'block');

			
		});

		function callweatherApi(){

			//Api 1 request

			$.ajax({

						url:'https://api.openweathermap.org/data/2.5/weather?' + WeatherApicall +'&units=metric' +'&APPID=5a3bc4e75b0b457ea29d7c6f91e97a08',
						type: "GET",
						dataType: "jsonp",
						success: function(data){
							console.log(data);

							var City = data.name;
							var weather = data.weather[0].description;
							var temperature = data.main.temp;
							temperature = parseInt(temperature);
							var humidity = data.main.humidity;
							var wind = data.wind.speed;
							var weathericon = data.weather[0].icon;
							var icon = 'icons/' + weathericon + '.svg';

							var bgr = 'url("backgrounds/' + weathericon + '.jpg")'

							
							

							$('#city-name').text(City);
							$('#weather').text(weather);
							$('#temperature').text(temperature);
							$('#humidity').text(humidity);
							$('#wind').text(wind);
							$('#icon').attr('src',icon);
							$('#background').css('background-image', bgr );
							$('#general-info').css('background-image', bgr );


							lat = data.coord.lat;
							lon = data.coord.lon;


							if(cordsFlag === true){

							pos = {
								lat: lat,
								lng: lon
							}


							map = new google.maps.Map(document.getElementById('map'), {
				          center: {lat: lat, lng: lon},
				          zoom: 10
				        });

							console.log(map);
							infoWindow.setPosition(pos);
							infoWindow.open(map);
							map.setCenter(pos);
							infoWindow.setContent('Location found');
							}


							getTimezone();

							cordsFlag = false;
							

							

						}

					});

    				//Api 2 request

    				$.ajax({

						url:'https://api.openweathermap.org/data/2.5/forecast/daily?' + WeatherApicall +'&units=metric' +'&APPID=5a3bc4e75b0b457ea29d7c6f91e97a08',
						type: "GET",
						dataType: "jsonp",
						success: function(data){
							console.log(data);

							var temp_max =  data.list[0].temp.max;
							temp_max = parseInt(temp_max);
							var temp_min =  data.list[0].temp.min;
							temp_min = parseInt(temp_min);
			

							var morning = data.list[0].temp.morn;
							morning = parseInt(morning);
							var day =  data.list[0].temp.day;
							day = parseInt(day);
							var evening = data.list[0].temp.eve;
							evening = parseInt(evening);
							var night = data.list[0].temp.night;
							night = parseInt(night);
							

						
						

							$('#temp_max').text(temp_max);
							$('#temp_min').text(temp_min);
							$('#morning').text(morning);
							$('#day').text(day);
							$('#evening').text(evening);
							$('#night').text(night);

							

						}

					});

		}

        // Api 3 call  - google timezone
		function getTimezone(){

			var location = lat + ", " + lon;

			console.log(location);
			var timestamp = date.getTime()/1000 + date.getTimezoneOffset() * 60;

			$.ajax({
				crossOrigin: true,
				url:'https://maps.googleapis.com/maps/api/timezone/json?location=' + location + '&timestamp=' +timestamp + '&key=AIzaSyCo4_tqmbZh6Ua_BgjjNRY8xuSGLzT8WFQ',
						type: "GET",
						success: function(data){
							console.log(data);

							var offsets = data.dstOffset * 1000 + data.rawOffset * 1000;
							var localdate = new Date(timestamp * 1000 + offsets);

							var months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

							var days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

							
							
							var month = months[localdate.getMonth()];
							var day = days[localdate.getDay()];
							var d = localdate.getDate();
							var year = localdate.getFullYear();

							var dateTemplate = day + '<br/> ' + d + ' ' + month + ' ' + year;

							$('#date').html(dateTemplate);

						var refreshDate = new Date();
                var millisecondselapsed = refreshDate - date; 

                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed); 
                			
                			
			               interval = setInterval(function(){
			                    localdate.setSeconds(localdate.getSeconds()+1);

			                   	$('#time').text(localdate.toTimeString().substr(0, 5));
			                }, 1000)

						}
			});

			
		}


		

    	});
     

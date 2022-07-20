$(function() {

	// Display a bit on the LED display
	function setBit(bit, on) {
		if (on) {
			$("#bit" + bit).css("background-color", "Red");		
		} else {
			$("#bit" + bit).css("background-color", "LimeGreen");
		}
	}

	//functions to display a byte on the LED display for certain weather conditions

	function displayChar(ch) {
		// console.log("Key: " + String.fromCharCode(ch) + "[" + ch + "]");
		// less hot temperatures(off)
		setBit(7, (ch | 1))
		setBit(6, (ch | 1))
		setBit(5, (ch | 1))
	}
	function displayChar1(ch) {
		// midium hot temperatures
		setBit(4, (ch | 1))
		setBit(3, (ch | 1))
		setBit(2, (ch | 1))
	}
	function displayChar2(ch){
		//extreme high temperatures
		setBit(1, (ch | 1))
		setBit(0, (ch | 1))	
	}

//functions for cold temp(for off)
function displayChar3(ch) {
	// console.log("Key: " + String.fromCharCode(ch) + "[" + ch + "]");
	// less cool temperatures
	setBit(7, (ch & 0))
	setBit(6, (ch & 0))
	setBit(5, (ch & 0))
}
function displayChar4(ch) {
	// midium cold temperatures
	setBit(4, (ch & 0))
	setBit(3, (ch & 0))
	setBit(2, (ch & 0))
}
function displayChar5(ch){
	//freezing
	setBit(1, (ch & 0))
	setBit(0, (ch & 0))	
}


	// Clears the display back to grey
	function clearDisplay() {
		$(".bitbtn").css("background-color", "LightGray");		
	}

	// Animate the string into the LED display
	$("#go").click(function() {

        //accessing values from class display in html that carry weather details
        var name = document.querySelector('.name');
        var temp = document.querySelector('.temp');
		var humid =  document.querySelector('.humidity');
		var weather = document.querySelector('.weather');
        var country = document.querySelector('.country');
		const showText = document.querySelector('.showText'); // for error text

		//function to displaya text incase an invalid city is typed, cool, cold, coldest, warm, hot and hottest temperatures
		function invalidCity(){
			$(".showText").css("color", "Red");
			showText.textContent = "Check if city name is correct or internet connectivty is available"
		}
		function coldest(){
			$(".showText").css("color", "Blue");
			showText.textContent = "The city is freezing"
		}
		function cold(){
			$(".showText").css("color", "LightSkyBlue");
			showText.textContent = "The city has cold temperatures"
		}
		function cool(){
			$(".showText").css("color", "LimeGreen");
			showText.textContent = "The city has cool to warm temperatures"
		}
		function warm(){
			$(".showText").css("color", "Orange");
			showText.textContent = "The city is hot"
		}
		function hot(){
			$(".showText").css("color", "orangered");
			showText.textContent = "The city is very hot"
		}
		function fireBurn(){
			$(".showText").css("color", "Red");
			showText.textContent = "The city is extreme hot"
		}
        

		var pos = 0;
		var city = $("#keyboard").val();// getting typed input
		clearDisplay();
		if (city.length == 0) return;
		var interval = setInterval(function() {
			var ch = city.charCodeAt(pos);
			if (pos++ >= city.length) {
				clearInterval(interval);
				clearDisplay();
			} else {

                //getting data from weather api
                fetch('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=034795d263223627ad84c7b03bd874f9')
                .then(res =>res.json()) //getting data in json format
                .then(data =>{ console.log(data) //displays data as object properties in console
                //accessing data from the fetched weather api object properties
                    var nameVal = data['name'];
                    var tempVal = data['main']['temp'];
					var humidVal = data['main']['humidity']
					var weatherVal = data['weather'][0]['description']
                    var sys = data['sys']['country'];
                    
                //connecting with html attributes to display in browser
					$('.display').css("padding", "4px")//adding padding to weather content
					$('.showText').css("padding", "5px") // adding padding to texts displayed in browser
					
                    name.innerHTML = 'place/city: ' + nameVal
                    temp.innerHTML =  'Temperatures(K): ' + tempVal
					humid.innerHTML = 'Humidity: ' + humidVal
					weather.innerHTML = 'Weather: ' + weatherVal
                    country.innerHTML = 'Country: ' + sys
                    
					//displaying respective LEDs for the hottness or coldness with the functions for LEDs
					if(tempVal < 283.15){
						console.log('freezing')
						displayChar3(ch)
						displayChar4(ch)
						displayChar5(ch)
						coldest()
					}
					else if(tempVal < 288.15){
						console.log('coldest')
						displayChar3(ch)
						displayChar4(ch)
						cold()
					}
					else if(tempVal < 299.15){
						console.log('cool to warm')
						displayChar3(ch)
						cool()
					}
					else if(tempVal < 303.15){
						console.log('hot')
						displayChar(ch)
						warm()
					}else if(tempVal < 313.15){
						console.log('very hot')
						displayChar(ch)
						displayChar1(ch)
						hot()
					}else{
						console.log('extreme hot')
						displayChar(ch)
						displayChar1(ch)
						displayChar2(ch)
						fireBurn()
					}
					
                })
                .catch(	
					err =>{
						console.log(`Error occured ${err} + ${invalidCity()}`)}) //if wrong city is typed an error is caught, and text displayed in browser
			}
		}, 1000)

		return false;
	});


})
/**
 * Created by Arthur on 18/04/2016.
 */
$(document).ready(function () {
    helperfunctions.bindEvents();
});

var helperfunctions = {
    bindEvents: function(){
        $(window).bind('orientationchange', helperfunctions.toggleMap);
        $('[data-role="panel"]').panel().enhanceWithin();
        $('#submitLogin').on('tap', databaseActions.loginUser);
        $('#registerBtn').on('tap', weatherActions.checkParameters);
        $('.btnLogout').on('tap', userActions.logoutCurrentUser);
        $('#newcityform').on('submit', cityActions.submitNewCityForm);
        $('#editcityform').on('submit', cityActions.submitEditCityForm);

        $('#citylist').on('swipeleft', '.citybtn', cityActions.addRemoveCityButton);
        $('#citylist').on('swiperight', '.citybtn', cityActions.undoDeleteCityButton);
        $('#citylist').on('taphold', '.citybtn', cityActions.editCity);
        $('#citylist').on('tap', '.citybtn-remove', cityActions.removeCity);
        $('.screensize').on('tap', helperfunctions.toggleFullScreen);
    },
    toggleMap: function () {
        var orientation = Math.abs(window.orientation);
        if (orientation == 90) {
            if(!($("#map").is(":empty"))){
                $('#map').show();
            }
        } else {
            $('#map').hide();
        }
    },
    isUsernameCorrect: function (username) {
        return username !== "";
    },
    isPasswordCorrect: function (password) {
        return password !== "";
    },
    isPasswordLengthCorrect: function (password) {
        return password.length > 4;
    },
    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    clearForm: function () {
        $('input').val('');
    },
    toggleFullScreen: function () {
        var screenState = !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement;
        if (screenState) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        $('.screensize').toggleClass('fullscreen-exit');
    },
    initMap: function(crd) {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: crd.latitude, lng: crd.longitude},
            scrollwheel: false,
            zoom: 15
        });
    }
}

var databaseActions = {
    registerUser: function () {
        var self = this;
        userActions.checkUserGeoLocation();
        var locatiegebruik = localStorage.getItem("geolocation");
        $.ajax({
            url: '../Backend/handle-request.php/register/',
            data: {
                name: $('#Rusername').val(),
                email: $('#Remail').val(),
                password: $('#Rwachtwoord').val(),
                geolocation: locatiegebruik
            },
            type: 'POST'
        }).done(function (response) {
            var res = JSON.parse(response);
            var status = "";
            var id = res[0].id;
            res = !null ? status = "gelukt" : status = "niet gelukt";
            console.log("Uw registratie is " + status);
            localStorage.setItem('userid', id);
            userActions.showUserWelcome("register");
            self.getCitiesOfUser();
            $("body").pagecontainer("change", "#weather", {transition: 'slide'});
            helperfunctions.clearForm();
        }).fail(function () {
            console.log('registration failed')
        })
    },
    loginUser: function () {
        $.ajax({
            url: '../Backend/handle-request.php/login/',
            data: {name: $('#Lusername').val(), password: $('#Lwachtwoord').val()},
            type: 'POST'
        }).done(function (response) {
            console.log(response);
            response = JSON.parse(response);
            if (response.length > 0) {
                $("body").pagecontainer("change", "#weather", {transition: 'slide'});
                userActions.showUserWelcome("login");
                localStorage.setItem('userid', response[0].id);
                databaseActions.getCitiesOfUser();
                $('#loginerror').hide();
            } else {
                $('#loginerror').show();
            }
        }).fail(function () {
            console.log('login failed')
        })
    },
    getCitiesOfUser: function () {
        $.ajax({
            url: '../Backend/handle-request.php/getcity/' + localStorage.getItem('userid'),
            type: 'GET'
        }).done(function (response) {
            var res = JSON.parse(response);
            console.log(res)
            var myCities = [];
            $('#weatherdata').html("");
            try {
                res.forEach(function (o) {
                    var city = o.city;
                    myCities.push(city);
                    weatherActions.getWeatherOnCity(o.city);
                });
                cityActions.setCityPage(myCities);
            } catch (e) {
                console.log("failed getting cities")
            }
        })
    },
    editCityOfUser: function (id, oldCity, newCity) {
        var self = this;
        $.ajax({
            url: '../Backend/handle-request.php/editCityOfUser/',
            data: {
                id: id,
                oldCity: oldCity,
                newCity: newCity
            },
            type: 'POST'
        }).done(function () {
            console.log("you changed " + oldCity + ' to ' + newCity);
            self.getCitiesOfUser();
            $("body").pagecontainer("change", "#steden", {transition: 'slide'});
        }).fail(function () {
            console.log("could not change city " + oldCity);
        })
    },
    removeCityFromUser: function (city, id) {
        var self = this;
        $.ajax({
            url: '../Backend/handle-request.php/removeCityFromUser/', //$(this).attr('action')
            data: {
                city: city,
                id: id
            },
            type: 'POST'
        }).done(function (response) {
            if (response != null) {
                $("#" + city + "Bttns").remove();
                console.log('removed city ' + city);
                self.getCitiesOfUser();
            }
        }).fail(function () {
            console.log('removing city ' + city + (' failed'))
        })
    },
    registerCityWithUser: function (city, userid) {
        var self = this;
        $.ajax({
            url: '../Backend/handle-request.php/registerCity/',
            type: "POST",
            data: {
                id: userid,
                city: city
            }
        }).done(function (response) {
            if (response != null) {
                console.log("city " + city + " registered for user " + userid);
                self.getCitiesOfUser();
            }
        })

    }
};

var weatherActions = {
    apikey: "6db2b4ee19cd83b702843189b2c05022",
    getWeatherOnGeoLocation: function (crd) {
        var self = this;
        $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather",
                type: "GET",
                dataType: "",
                data: {
                    appid: this.apikey,
                    lat: crd.latitude,
                    lon: crd.longitude,
                    lang: "nl",
                    units: "metric"
                }
            })
            .success(function (resp) {
                self.generateFields(resp);
                var city = resp.name;
                var userid = localStorage.getItem('userid');
                databaseActions.registerCityWithUser(city, userid);
            })
            .fail(function () {
                console.log("failed getting local weather");
            })
    },
    getWeatherOnCity: function (city) {
        var self = this;
        $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather",
                type: "GET",
                dataType: "JSON",
                data: {
                    appid: this.apikey,
                    q: city,
                    lang: "nl",
                    units: "metric"
                }
            })
            .success(function (resp) {
                self.generateFields(resp);
            })
            .fail(function () {
                console.log("failed getting weather of " + city);
            })
    },
    generateFields: function (resp) {
        var city = resp.name;
        try {
            city = city.replace("Arrondissement", ''); //de plaats 'Arrondissement Brugge' wordt 'Brugge', is een mooiere locatie ;)
        } catch (e) {
            //een stad begint niet altijd met 'arrondissement'
        }

        var description = resp.weather[0].description;
        var degrees = Math.round(resp.main.temp);
        var degreesMin = Math.round(resp.main.temp_min);
        var degreesMax = Math.round(resp.main.temp_max);
        var windSpeed = resp.wind.speed;
        var imgSrc = resp.weather[0].icon;

        var html = `
         <div id=weather${city} class="cityweather">
            <p>Huidige plaats: <em>${city}</em></p>
            <em>${degrees} °C</em> <em id="status">${description}</em>
            <img src="http://api.openweathermap.org/img/w/${imgSrc}" />
            <p>min <em>${degreesMin} °C</em></p>
            <p>max <em>${degreesMax} °C</em></p>
            <em>${windSpeed} km/u</em>
            <img src="assets/icons/wind.png" name=wind alt="wind"  />
         </div>
         `;
        $('#weatherdata').append(html);
    },
    checkParameters: function () {
        var username = $('#Rusername').val();
        var password = $('#Rwachtwoord').val()
        var email = $('#Remail').val();
        var errormessage = "<ul>";
        if (!helperfunctions.isUsernameCorrect(username)) {
            errormessage += "<li>please fill in a username</li>";
        }
        if (!helperfunctions.isPasswordCorrect(password)) {
            errormessage += "<li>please provide a password</li>";
        }
        if (!helperfunctions.isPasswordLengthCorrect(password)) {
            errormessage += "<li>password must contain at least 5 caracters</li>";
        }
        if (!helperfunctions.validateEmail(email)) {
            errormessage += "<li>please provide a correct email</li>";
        }
        else {
            databaseActions.registerUser();
            $('#registererror').hide();
        }
        errormessage += "</ul>"
        $('#registererror').html(errormessage).show();

    }
};

var cityActions = {
    submitEditCityForm: function (e) {
        e.preventDefault();
        var oldCity = localStorage.getItem('edit');
        var newCity = $('#editcityname').val();
        var userid = localStorage.getItem('userid');
        databaseActions.editCityOfUser(userid, oldCity, newCity);
        localStorage.removeItem('edit');
    },
    submitNewCityForm: function (e) {
        e.preventDefault();
        var cityname = $('#cityname').val();
        var userid = localStorage.getItem('userid');
        databaseActions.registerCityWithUser(cityname, userid);
        $("body").pagecontainer("change", "#steden", {transition: 'slide'});
        $('#cityname').val('');
    },
    editCity: function () {
        var userid = localStorage.getItem('userid');
        var city = $(this).attr('id');
        $('#editcityname').val('');
        $('#editcityname').val(city);
        localStorage.setItem('edit', city);
        $("body").pagecontainer("change", "#editCity", {transition: 'slide'});
    },
    removeCity: function () {
        var city = $(this).attr('data');
        var userid = localStorage.getItem('userid');
        databaseActions.removeCityFromUser(city, userid);
    },
    setCityPage: function (cities) {
        $('#citylist').html("");
        var htmlCities = "";
        for (var i = 0; i < cities.length; i++) {
            var city = cities[i];
            htmlCities += `<div id="${city}Bttns">
                            <button class="citybtn" data-theme="b" id=${cities[i]} >${cities[i]}</button>
                            <button id="removebtn" data-theme=b data=${cities[i]} class="citybtn-remove ${cities[i]}-remove">Verwijder</button>
                       </div>`
        }
        //Sometimes Jquery Mobile has problems with the css of these buttons, sometimes the buttons doesn't get a style. I fixed this with custom css --> see style.css
        $('#citylist').html(htmlCities);
    },
    addRemoveCityButton: function () {
        var city = $(this).attr('id');
        $(this).css('width', '70%').css('display', 'inline-block');
        var removeBtnSelector = '.' + city + '-remove';
        $(removeBtnSelector).css('display', 'inline-block');
    },
    undoDeleteCityButton: function () {
        var city = $(this).attr('id');
        $(this).css('width', '100%').css('display', 'inline-block');
        var removeBtnSelector = '.' + city + '-remove';
        $(removeBtnSelector).css('display', 'none');
    }
}

var userActions = {
    logoutCurrentUser: function () {
        localStorage.removeItem("userid");
        $("body").pagecontainer("change", "#login", {transition: 'slide'});
        $("#Lusername").val('');
        $("#Lwachtwoord").val('');
        $('#weatherdata').html("");
    },
    showUserWelcome: function (action) {
        var Lusername = $('#Lusername').val();
        var Rusername = $('#Rusername').val();
        var message = "Welkom "
        action === "login" ? message += Lusername : message += Rusername;
        $('#message').text(message);
    },
    checkUserGeoLocation: function () {
        var locatiegebruik = "";
        if ($("#locatie").is(':checked')) {

            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser");
            }

            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);

            locatiegebruik = "yes";

        } else {
            locatiegebruik = "no";
        }

        localStorage.setItem("geolocation", locatiegebruik);
    },
    geoSuccess: function (pos) {
        crd = {latitude: pos.coords.latitude, longitude: pos.coords.longitude};
        weatherActions.getWeatherOnGeoLocation(crd);
        helperfunctions.initMap(crd);
    },
    geoError: function () {
        alert("Unable to retrieve your location");
    }
};













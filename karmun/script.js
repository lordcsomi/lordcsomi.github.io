// this is the script for the index.html page
setTimeout(function() {
	if (window.scrollY === 0) {
		var intro = document.getElementById('navbar');
		intro.scrollIntoView({behavior: "smooth", });
	}
}, 3000);


var navbar = document.getElementById('navbar');
var navbarHeight = navbar.offsetHeight;
sections = document.querySelectorAll('section');
for (section of sections) {
	section.style.scrollMarginTop = navbarHeight + 'px';
}
addEventListener('resize', function() {
	navbar = document.getElementById('navbar');
	navbarHeight = navbar.offsetHeight;
	for (section of sections) {
		section.style.scrollMarginTop = navbarHeight + 'px';
	}
});
// onclick function for the navbar,Solar,Wind,Hydro,Tidal,Geothermal,Biofuel,Nuclear,Fusion,Quiz
function aboutButton() {
	var about = document.getElementById('intro');
	console.log(about.offsetTop);
	about.scrollIntoView({behavior: "smooth", top: about.offsetTop-navbarHeight});
}

function solarButton() {
	var solar = document.getElementById('solar');
	solar.scrollIntoView({behavior: "smooth", top: solar.offsetTop-navbarHeight});
}

function windButton() {
	var wind = document.getElementById('wind');
	wind.scrollIntoView({behavior: "smooth", top: wind.offsetTop-navbarHeight });
}

function hydroButton() {
	var hydro = document.getElementById('hydro');
	hydro.scrollIntoView({behavior: "smooth", to: hydro.offsetTop-navbarHeight});
}

function tidalButton() {
	var tidal = document.getElementById('tidal');
	tidal.scrollIntoView({behavior: "smooth", top: tidal.offsetTop-navbarHeight});
}

function geothermalButton() {
	var geothermal = document.getElementById('geothermal');
	geothermal.scrollIntoView({behavior: "smooth", top: geothermal.offsetTop-navbarHeight });
}

function biofuelButton() {
	var biofuel = document.getElementById('biofuel');
	biofuel.scrollIntoView({behavior: "smooth", top: biofuel.offsetTop-navbarHeight});
}

function nuclearButton() {
	var nuclear = document.getElementById('fission');
	nuclear.scrollIntoView({behavior: "smooth", top: nuclear.offsetTop-navbarHeight});
}

function fusionButton() {
	var fusion = document.getElementById('fusion');
	fusion.scrollIntoView({behavior: "smooth", top: fusion.offsetTop-navbarHeight});
}

function quizButton() {
	var quiz = document.getElementById('quiz');
	quiz.scrollIntoView({behavior: "smooth", top: quiz.offsetTop-navbarHeight});
}

// quiz code
var quiz = document.getElementById('quiz');
var results = document.getElementById('results');

addEventListener('submit', function(event) {
	event.preventDefault();
	var score = 0;
	var answers = document.querySelectorAll('input:checked');
	for (answer of answers) {
		if (answer.value === 'correct') {
			score++;
		}
	}
	var results = document.getElementById('results');
	results.innerHTML = 'You got ' + score + ' out of 10 correct!';
});
// Language: javascript
// sorrry for the mess

var windowWidth = window.screen.availWidth; // Get the width of the screen
var windowHeight = window.screen.availHeight; // Get the height of the screen
console.log(windowWidth, 'width');
console.log(windowHeight, 'height');

const toggle = document.getElementById('toggleDark'); // Get the toggle button
const body = document.querySelector('body'); // Get the body element
const headerLi = document.querySelectorAll('header li a'); // Get all the header li a elements

toggle.addEventListener('click', function(){ // When the toggle button is clicked
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')){ // If the toggle button has the class 'bi-brightness-high-fill'
        body.style.background = 'white';
        body.style.color = 'black';
        body.style.transition = '2s';
        body.style.filter = 'grayscale(0%)';
        headerLi.forEach(function(item){   // For each header li a element
            item.style.color = 'black'; 
        });
    }else{
        body.style.background = 'black';
        body.style.color = 'white';
        body.style.transition = '2s';
        body.style.filter = 'grayscale(70%)';
        headerLi.forEach(function(item){ // For each header li a element
            item.style.color = 'white';
        });
    }
});

function updateOsztaly(){ // When the osztaly is changed
    var mylist = document.getElementById("myList"); // Get the select element
    document.getElementById("osztaly").value = mylist.options[mylist.selectedIndex].text; // Set the value of the input to the selected option

    document.cookie = "osztaly=" + mylist.options[mylist.selectedIndex].text; // Set the cookie to the selected option
}

function updateName(){ // When the name is changed
    console.log('Changed name');
    document.cookie = "name=" + document.getElementById("name").value; // Set the cookie to the value of the input
}

function onload(){ // When the page is loaded
    var osztaly = getCookie("osztaly"); // Get the cookie named 'osztaly'
    var name = getCookie("name"); // Get the cookie named 'name'
    document.getElementById("osztaly").value = osztaly; // Set the value of the input to the cookie
    document.getElementById("myList").value = osztaly;
    document.getElementById("name").value = name; 
}


const observer = new IntersectionObserver((entries) => { // When the element is in the viewport
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show'); // Add the class 'show'
            } else { // If the element is not in the viewport
                /*entry.target.classList.remove('show');*/
            }

        });
});

const hiddenElements = document.querySelectorAll('.hidden'); // Get all the elements with the class 'hidden'
hiddenElements.forEach((el) => observer.observe(el)); // For each element, observe it

function getCookie(cname) { // Get the cookie
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
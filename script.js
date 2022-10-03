var windowWidth = window.screen.availWidth;
console.log(windowWidth, 'px');

const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');
const headerLi = document.querySelectorAll('header li a');

toggle.addEventListener('click', function(){
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')){
        body.style.background = 'white';
        body.style.color = 'black';
        body.style.transition = '2s';
        body.style.filter = 'grayscale(0%)';
        /*make all the headerLi elements black */
        headerLi.forEach(function(item){
            item.style.color = 'black';
        });
    }else{
        body.style.background = 'black';
        body.style.color = 'white';
        body.style.transition = '2s';
        body.style.filter = 'grayscale(70%)';
        /*make all the headerLi elements white */
        headerLi.forEach(function(item){
            item.style.color = 'white';
        });
    }
});

function updateOsztaly(){
    var mylist = document.getElementById("myList");
    document.getElementById("osztaly").value = mylist.options[mylist.selectedIndex].text;

    document.cookie = "osztaly=" + mylist.options[mylist.selectedIndex].text;
}

function updateName(){
    console.log('Changed name');
    document.cookie = "name=" + document.getElementById("name").value;
}

function onload(){
    var osztaly = getCookie("osztaly");
    var name = getCookie("name");
    document.getElementById("osztaly").value = osztaly;
    document.getElementById("myList").value = osztaly;
    document.getElementById("name").value = name; 
}


const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                /*entry.target.classList.remove('show');*/
            }

        });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

function getCookie(cname) {
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
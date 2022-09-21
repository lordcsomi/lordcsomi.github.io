const toggle = document.getElementById('toggleDark');
const body = document.querySelector('body');

toggle.addEventListener('click', function(){
    this.classList.toggle('bi-moon');
    if(this.classList.toggle('bi-brightness-high-fill')){
        body.style.background = 'white';
        body.style.color = 'black';
        body.style.transition = '2s';
    }else{
        body.style.background = 'black';
        body.style.color = 'white';
        body.style.transition = '2s';
    }
});

function updateOsztaly(){
    console.log('Changed osztály');
    var mylist = document.getElementById("myList");
    document.getElementById("osztaly").value = mylist.options[mylist.selectedIndex].text;
    document.getElementById("osztaly2").value = mylist.options[mylist.selectedIndex].text;
}


function checkEmail(){
    var email = document.getElementById("email").value;
    let myString = "@karinthy.hu";
    let result = email.includes(myString);
    console.log(result);
    if(result == false){
        alert("Nem karinthy email címet adtál meg!");
        document.getElementById("email").value = "";
    }
}
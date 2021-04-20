const inputemail = document.querySelector('#email');
const inputpassword = document.querySelector('#Password');
const inputcompass = document.querySelector('#compass');
const error = document.querySelector('.error');
const errorpass = document.querySelector('.errorpass');
const errorcom = document.querySelector('.errorcom');
const hotelname = document.querySelector('#hotelname')
const icone = document.querySelector('.icone');
const cont = document.querySelector('.cont-einer');
const getStarted = document.querySelector('.btn');
const registerBtn = document.querySelector('#register');
const url = 'http://localhost:3000';
const user = document.querySelector('.user');
const loginbtn = document.querySelector('.login-btn');

user.addEventListener('click' ,() => {
    console.log('123')
    const loginForm = document.querySelector('.user-reg'); 
    loginForm.classList.toggle('visible');
    console.log(loginForm)
})


registerBtn.addEventListener('click' ,addHotel);


getStarted.addEventListener('click', function () {
    cont.classList.add('visible');
})

icone.addEventListener('click', function () {
    cont.classList.remove('visible');
})

inputemail.onblur = function () {
if (!inputemail.value.includes('@')) {
    inputemail.classList.add('invalid')
    error.innerHTML = "please enter correct email!"
}
}

inputemail.onfocus = function () {
if (inputemail.classList.contains('invalid')) {
    this.classList.remove('invalid')
    error.innerHTML = ''
}
}


inputpassword.onblur = function () {
    if (inputpassword.value.length < 8 ) {
        inputpassword.classList.add('invalid')
        errorpass.innerHTML = "please check input parameters"
    } 
    if (inputpassword.value.length > 20 ) {
        inputpassword.classList.add('invalid')
        errorpass.innerHTML = "please check input parameters"
    }
}


inputpassword.onfocus = function () {
if (inputpassword.classList.contains('invalid')) {
    this.classList.remove('invalid')
    errorpass.innerHTML = ''
}
}

inputcompass.onblur = function () {
    if (!(inputcompass.value === inputpassword.value)) {
     inputcompass.classList.add('invalid')
     errorcom.innerHTML = "error"
    }
}

inputcompass.onfocus = function () {
    if (inputcompass.classList.contains('invalid')) {
     this.classList.remove("invalid")
     errorcom.innerHTML = ""
    }
}


/*inputpassword.onblur = function () {
    if ((inputpassword.value.length < 8 && inputpassword.value.length > 20 )
        && inputpassword.value[0].includes(/[a-z]/)) {
        inputpassword.classList.add('invalid')
        errorpass.innerHTML = "please check input parameters"
    }
}

inputpassword.onfocus = function () {
if (inputpassword.classList.contains('invalid')) {
    this.classList.remove('invalid')
    errorpass.innerHTML = ''
}
}*/

// db.json

async function addHotel(e) {
    e.preventDefault();
    try {
          const username = document.querySelector('#username');
    const mail = document.querySelector('#email');
    const password = document.querySelector('#Password');
    const hotelName = document.querySelector('#hotelname');
    const loc = document.querySelector('#location');
    const address = document.querySelector('#address');
    const phone = document.querySelector('#phone-number');
    const stars = document.querySelector('#stars');
    console.log(username.value);

    fetch(`${url}/hotels`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            mail: mail.value,
            password: password.value,
            hotelName: hotelName.value,
            location: loc.value,
            address: address.value,
            phone: phone.value,
            stars: stars.value,
            rooms: [
            ]
        })
    })
    }
    catch (error) {
        console.log(error);
    }
  finally {
       cont.classList.remove('visible');
  }
    
}

async function loginHotel(e) {
    e.preventDefault();
    const username = document.querySelector('#login-username').value;
    const password = document.querySelector('#login-password').value;
    console.log(username);
    let user = await fetch(`${url}/hotels?username=${username}&password=${password}`);
    let json = await user.json();
    console.log(json);
    console.log(json[0].username)
    if (json.length == 0) {
        alert('invalid user');
    } else {
        let current = await fetch(`${url}/currenthotel`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": "4",
                "username": json[0].username
            })
        });
        let currentJson = await current.json();
        console.log(currentJson);
        window.location.href = '../hotel/hotel.html';
    }
}

loginbtn.addEventListener('click', loginHotel)


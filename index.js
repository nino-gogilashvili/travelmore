const users = document.querySelector('.user');
const login = document.querySelector('.login-popup');
const loginbtn = document.querySelector('.login');
const signbtn = document.querySelector('.sign');
const regbtn = document.querySelector('.register');
const singupForm =document.querySelector('.signup-form');
const loginForm =document.querySelector('.log-in-form');
const logBtn = document.querySelector('.logbtn');
const checkin = document.querySelector('.check-in');
const checkout = document.querySelector('.check-out');
const city = document.querySelector('.location-select');
const numberOfGuests = document.querySelector('.number-of-persons');
const roomContainer  = document.querySelector('.rooms-container');
const checkBtn = document.querySelector('.bxs-check-circle');
const url = "http://localhost:3000";
let currentUser = "";


async function getUser() {
    let user = await fetch(`${url}/currentuser`);
    let userJson = await user.json();
    console.log(userJson);
    let username = userJson.username;
    currentUser = username;
    let userInfo = await fetch(`${url}/users?name=${username}`);
    let userInfoJson = await userInfo.json();
    console.log(userInfoJson);
}

getUser();

async function getFreeRooms() {
   if (checkin.value && checkout.value) {
       roomContainer.classList.add('vis');
       let hotels = await fetch(`${url}/hotels`);
       let hotelsJson = await hotels.json();
       
       let number = numberOfGuests.value;
       let type = "";
       switch (number) {
        case "1":
            type = "single"
            break;
        case "2":
            type = "double"
            break;
        case "3":
            type = "family"
            break;
        }
        let checkin = document.querySelector('.check-in').value;
        let checkout = document.querySelector('.check-out').value;
        let from = getDay(checkin);
        let to = getDay(checkout);
        hotelsJson.forEach(hotel => {
            hotel.rooms.forEach(room => {
            if (room.type == type) {
                let isFree = true;
                for (let day of room.reservation) {
                    if (day[0] == true) {
                        isFree = false;
                    }
                }
                if (isFree) {
                    let div = document.createElement('div');
                    div.classList.add('room');
                    div.innerHTML = `
                        <span class="hotel-name">${hotel.hotelName}</span>
                        <span class="room-type">${room.type}</span>
                        <span class="price">100$</span>
                        <button class="reserve" data-room-id="${room.roomId}" data-hotel-id="${hotel.id}">Reserve</button>
                    `
                    roomContainer.appendChild(div);
                    checkin.value = "";
                    checkout.value = "";
                }
            }
        });
    });
       }
}


async function reserve(e) {
    if (e.target.className == 'reserve') {
        const roomId = e.target.dataset.roomId;
        const hotelId = e.target.dataset.hotelId;
        console.log(hotelId);
        const from = getDay(checkin.value);
        const to = getDay(checkout.value);

        let hotel = await fetch(`${url}/hotels/${hotelId}`);
        let hotelJson = await hotel.json();
        console.log(hotelJson);

        let rooms = hotelJson.rooms;
        console.log(rooms);

        for (let room of rooms) {
            if (room.roomId == roomId) {
                for (let i = 0; i < room.reservation.length; i++) {
                    if (i >= from && i <= to) {
                        console.log(room.reservation[i]);
                        room.reservation[i] = [true, currentUser];
                    }
                }
            }
        }
        console.log(rooms);
        fetch(`${url}/hotels/${hotelId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: hotelJson.username,
                mail: hotelJson.mail,
                password: hotelJson.password,
                location: hotelJson.location,
                address: hotelJson.address,
                phone: hotelJson.phone,
                rooms: rooms,
                id: hotelJson.id
            })
        })
    }
}

function getDay(date) {
    let date1 = new Date();
    let today = date1.getDate();
    let month = date1.getMonth();
    let arr = date.split('-');
    let day = arr[2] - today;
    if (+arr[1] - 1 > month) {
        day += 30;
    }
    return day;
}

checkBtn.addEventListener('click', getFreeRooms);


function showLoginForm() {
    login.classList.toggle('vis');
}
function popRegForm() {
    const regForm = document.querySelector('.signup-form');
    regForm.classList.toggle('vis');
}


async function signupUser(e) {
    e.preventDefault();
    const username = document.querySelector('.reg-username').value;
    const fullname = document.querySelector('.reg-fullname').value;
    const email = document.querySelector('.reg-email').value;
    const password = document.querySelector('.reg-password').value;
    const phone = document.querySelector('.reg-phone').value;
    fetch(`${url}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            fullname,
            email,
            password,
            phone
        })
    })
};

regbtn.addEventListener('click', signupUser);
users.addEventListener('click' , showLoginForm);
signbtn.addEventListener('click', popRegForm);
logBtn.addEventListener('click', loginUser);


loginbtn.addEventListener('click', ()=>{
loginForm.classList.toggle('vis')
})


async function loginUser(e) {
    e.preventDefault();
    const logUsername = document.querySelector('.log-username').value;
    const logpass = document.querySelector('.log-password').value;

    let loguser = await  fetch (`${url}/users?username=${logUsername}&password=${logpass}`);
    console.log(loguser);
    let userJson = await loguser.json();
    console.log(userJson);

    if (userJson.length == 0) {
        alert("invalid User");
        return;
    }

    fetch(`${url}/currentuser`, {
        method : "PATCH" ,
        headers : {
            "Content-Type" : "application/json"
        }, 
        body : JSON.stringify({
            id : "3",
            username : logUsername
        })
    })

    setTimeout(() => {location.reload()}, 1000);
}


roomContainer.addEventListener('click', reserve);
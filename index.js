const users = document.querySelector('.user');
const login = document.querySelector('.login-popup');
const loginbtn = document.querySelector('.login');
const signbtn = document.querySelector('.sign');
const regbtn = document.querySelector('.register');
const singupForm = document.querySelector('.signup-form');
const loginForm = document.querySelector('.log-in-form');
const logBtn = document.querySelector('.logbtn');
const checkin = document.querySelector('.check-in');
const checkout = document.querySelector('.check-out');
const city = document.querySelector('.location-select');
const numberOfGuests = document.querySelector('.number-of-persons');
const roomContainer = document.querySelector('.rooms-container');
const checkBtn = document.querySelector('.bxs-check-circle');
const citySelect = document.querySelector('.location-select');
const tbody = document.querySelector('tbody');
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
        let type = [];
        switch (number) {
            case "1":
                type = ["single"]
                break;
            case "2":
                type = ["double", "twin"]
                break;
            case "3":
                type = ["family"]
                break;
        }

        let from = getDay(checkin.value);
        let to = getDay(checkout.value);
        let city = citySelect.value;
        console.log(city);

        hotelsJson.forEach(hotel => {
            if (hotel.location.toLowerCase() == city) {
                console.log(hotel);
                hotel.rooms.forEach(room => {
                    let isFree = true;
                    if (type.length == 1) {
                        if (room.type == type[0]) {
                            room.reservation.forEach((res, index) => {
                                if (index >= from && index <= to) {
                                    if (res[0] == true) {
                                        isFree = false;
                                    }
                                }
                            })
                            if (isFree) {
                                let stars = +hotel.stars;
                                console.log(stars);
                                let tr = document.createElement('tr');
                                tr.innerHTML = `
                                <td>${hotel.hotelName}</td>
                               `
                                let td = document.createElement('td');
                                for (let i = 0; i < 5; i++) {
                                    let icon = document.createElement('i');
                                    icon.classList.add('bx');
                                    if (i < stars) {
                                        icon.classList.add('bxs-star');
                                    } else {
                                        icon.classList.add('bx-star');
                                    }
                                    td.appendChild(icon);
                                }
                                tr.appendChild(td);
                                tr.innerHTML += `
                                <td>${room.type}</td>
                                <td>${calculatePrice(stars, type)}$</td>
                                <td>
                                    <button class="reserve" data-hotel-id="${hotel.id}" data-room-id="${room.roomId}">Reserve</button>
                                </td>
                                `
                                tbody.appendChild(tr);
                            }
                        }
                    } else if (type.length == 2) {
                        if (room.type == type[0] || room.type == type[1]) {
                            console.log(room);
                        }
                    }
                })
            }
        });
    }
}

function calculatePrice(stars, type) {
    let basePrice = 30;
    let starPrice = stars * 10;
    switch (type) {
        case "single":
            basePrice *= 1;
            break;
        case "double":
        case "twin":
            basePrice *= 2;
            break;
        case "family":
            basePrice *= 3;
            break;
    }
    let price = basePrice + starPrice;
    return price;
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

        setTimeout(location.reload(), 1000);
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
users.addEventListener('click', showLoginForm);
signbtn.addEventListener('click', popRegForm);
logBtn.addEventListener('click', loginUser);


loginbtn.addEventListener('click', () => {
    loginForm.classList.toggle('vis')
})


async function loginUser(e) {
    e.preventDefault();
    const logUsername = document.querySelector('.log-username').value;
    const logpass = document.querySelector('.log-password').value;

    let loguser = await fetch(`${url}/users?username=${logUsername}&password=${logpass}`);
    console.log(loguser);
    let userJson = await loguser.json();
    console.log(userJson);

    if (userJson.length == 0) {
        alert("invalid User");
        return;
    }

    fetch(`${url}/currentuser`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: "3",
            username: logUsername
        })
    })

    setTimeout(() => { location.reload() }, 1000);
}


roomContainer.addEventListener('click', reserve);
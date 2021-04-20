const url = 'http://localhost:3000';
const addRoom = document.querySelector('.add-room');
const buttonContainer = document.querySelector('.button-container');
const add = document.querySelector('.add');
const tbody = document.querySelector('tbody');
const userIcon = document.querySelector('.user-container');
const hotelInfo = document.querySelector('.hotel-info');
const hotelInfoContainer = document.querySelector('.hotel-information')
const resBtn = document.querySelector('.res-btn');
const resTable = document.querySelector('.reservation-table');
const xBtn = document.querySelector('.bx-x');
let id = ""

async function getHotel() {
    let username = await fetch(`${url}/currenthotel`);
    let json = await username.json();

    let user = await fetch(`${url}/hotels?username=${json.username}`);
    let userJson = await user.json();
    console.log(userJson);
    const hotelName = hotelInfoContainer.querySelector('h1');
    hotelName.textContent = userJson[0].hotelName;
    const address = hotelInfoContainer.querySelector('.hotel-address');
    address.textContent = `${userJson[0].location}, ${userJson[0].address}`;
    const numberOfRooms = hotelInfoContainer.querySelector('.number-of-rooms');
    numberOfRooms.textContent = userJson[0].rooms.length;
    const numberOfStars = +userJson[0].stars;
    const stars = hotelInfoContainer.querySelector('.hotel-stars');
    renderStars(stars, numberOfStars);
    console.log(numberOfStars);
    id = userJson[0].id;
    let rooms = await fetch(`${url}/hotels/${id}`);
    let roomsjson = await rooms.json();
    let roomsArray = roomsjson.rooms;
    roomsArray.forEach(room => renderRoom(room));
}

getHotel();

function renderStars(span, n) {
    for (let i = 0; i < 5; i++) {
        let icon = document.createElement('i');
        icon.classList.add('bx');
        i < n ? icon.classList.add('bxs-star') : icon.classList.add('bx-star');
        span.appendChild(icon);
    }
}


function renderRoom(room) {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${room.roomId}</td>
        <td>${room.type}</td>
    `
    tbody.appendChild(tr);
    room.reservation.forEach(reserve => {
        let td = document.createElement('td');
        if (reserve[0] == true) {
            td.textContent = reserve[1]
        } else {
            td.textContent = "-"
        }
        tr.appendChild(td);
        // if (reserve[0] == true)
    })
}

function addDates() {
    let date = new Date();
    let day = date.getDate();
    const headRow = document.querySelector('.head-row')

    for (let i = 0; i < 30; i++) {
        let month = "apr";
        let d = i + day;
        if (d > 30) {
            d -= 30;
            month = "may"
        }
        let th = document.createElement('th');
        th.textContent = `${d} ${month}`;
        headRow.appendChild(th)
    }
}

addDates();

function changeInterface(e) {
    const infoContainer = document.querySelector('.info-container');
    const roomsContainer = document.querySelector('.rooms-container');
    const reservationContainer = document.querySelector('.reservation-container');
    if (e.target.classList[0] == 'info-btn') {
        infoContainer.style.display = 'block';
        roomsContainer.style.display = 'none';
        reservationContainer.style.display = 'none';
    }
    if (e.target.classList[0] == 'rooms-btn') {
        infoContainer.style.display = 'none';
        roomsContainer.style.display = 'block';
        reservationContainer.style.display = 'none';
    }
    if (e.target.classList[0] == 'reservation-btn') {
        infoContainer.style.display = 'none';
        roomsContainer.style.display = 'none';
        reservationContainer.style.display = 'block';
    }
}



async function addNewRoom() {
    const type = document.querySelector('#room-type').value;
    let rooms = await fetch(`${url}/hotels/${id}`);
    let json = await rooms.json();
    let r = json.rooms;
    let roomId = `${json.username}-${r.length}`;
    let newRoom = {
        type,
        roomId,
        reservation: []
    }
    for (let i = 0; i < 30; i++) {
        newRoom.reservation.push([false, ""]);
    }
    r.push(newRoom);
    fetch(`${url}/hotels/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: json.username,
            mail: json.mail,
            password: json.password,
            location: json.location,
            address: json.address,
            phone: json.phone,
            rooms: r,
            id: json.id
        })
    })
}


resBtn.addEventListener('click', () => {
    resTable.classList.toggle('vis');
})
userIcon.addEventListener('click', () => {
    hotelInfo.classList.toggle('vis');
})
hotelInfo.addEventListener('click', (e) => {
    if (e.target.textContent == "hotel info") {
        hotelInfoContainer.classList.toggle('vis');
    }
    if (e.target.textContent == "log out") {
        fetch(`${url}/currenthotel/5`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: "5",
                "user": ""
            })
        })
        setTimeout(() => {
            window.location.href = "index.html"
        })
    }
})
hotelInfoContainer.addEventListener('click', (e) => {
    if (e.target.classList[0] == 'add-room') {
        const roomContainer = document.querySelector('.room-container');
        roomContainer.classList.toggle('block');
    }
    if (e.target.classList[0] == 'confirm-room') {
        addNewRoom();
        setTimeout(() => location.reload(), 800);
    }
})

xBtn.addEventListener('click', () => {
    resTable.classList.remove('vis');
})



document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('http://localhost:3000/meetings');

        const meetings = response.data;

        console.log(meetings)

        // Count bookings for each time
        const bookedSlots = {};

        console.log("runing:")

        meetings.forEach(meeting => {
            bookedSlots[meeting.time] = (bookedSlots[meeting.time] || 0) + 1;
        });

        console.log("bookedSlots: ",bookedSlots)


        for (const time in bookedSlots) {

            const slot = document.getElementById(time);

            console.log(time,slot);

            const available = Math.max(0, slot.dataset.available - bookedSlots[time]);

            // console.log(booked,available)

            slot.dataset.available = available;

            slot.querySelector('.available').textContent =
                `${available} Available`;

            if (available === 0) {
                slot.style.display = 'none';
            }
        }

        // Display existing meetings
        meetings.forEach(meeting => {
            display(meeting);
        });

    } catch (error) {
        console.error("Error fetching meetings:", error);
    }
});




function closeBookingForm() {
    document.getElementById("bookingForm").classList.remove("show");
    document.getElementById("bookingPlaceholder").style.display = '';
}



function selectTime(time) {

    const form = document.getElementById('bookingForm');

    form.querySelector('form').reset()

    form.querySelector('h2').textContent = "Book a Meeting";
    form.querySelector('.book-btn').textContent = "Book Meeting";
    
    document.getElementById('time').value = time;
    document.getElementById('time').type = "hidden";

    form.classList.add('show');
    document.getElementById("bookingPlaceholder").style.display = "none";
    document.getElementById("selectedTimeText").textContent = time



    document.getElementById('time').value = time;
    // document.getElementById('bookingForm').classList.add('show');
    // document.getElementById("bookingPlaceholder").style.display = "none";
    // document.getElementById("selectedTimeText").textContent = time
}



// function closeBookingForm() {
//     document.getElementById('bookingForm').classList.remove("show");
//     document.getElementById("bookingPlaceholder").style.display = '';
// }



// function selectTime(time) {
//     const form = document.getElementById('bookingForm');

//     form.querySelector('form').reset()

//     form.querySelector('h2').textContent = "Book a Meeting";
//     form.querySelector('.book-btn').textContent = "Book Meeting";

//     document.getElementById('time').type = "hidden";

//     form.classList.add('show');
//     document.getElementById("bookingPlaceholder").style.display = "none";
//     document.getElementById("selectedTimeText").textContent = time
// }



async function bookMeeting(event) {
    event.preventDefault();

    // const slotId = document.getElementById('slotId').value;

    const editId = sessionStorage.getItem("editId")

    const meeting = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        time: document.getElementById('time').value
    };

    if(editId){
        updateMeeting(editId,meeting);
        sessionStorage.removeItem("editId")
    }
    else{
        addMeeting(meeting)
    }


    event.target.reset();

    document.getElementById('bookingForm')
            .classList.remove('show');

    document.getElementById("bookingPlaceholder").style.display = '';
}



async function updateMeeting(editId,meeting){

    const slot = document.getElementById(meeting.time);

    let available = Number(slot.dataset.available); 

    if(available===0){
        alert('No slot available for booking for specified time');
        return ;
    }

    console.log(meeting);
    console.log(slot)

    try{
        const result = await axios.put(
            `http://localhost:3000/meetings/${editId}`,
            meeting
        );

        console.log("result: ", result)

        available--;

        slot.dataset.available = available;

        slot.querySelector('.available').textContent =
            `${available} Available`;

        if(available===0){
            slot.style.display = 'none';
        }




        const li = document.getElementById(editId);

        console.log(li)

        const details = li.querySelector('.meeting-details')

        console.log(li,details)

        const prevTime = details.querySelector('.time').textContent.split(" ")[1];

        console.log('prev time: ', prevTime)

        details.querySelector('.name').textContent = result.data.name;
        details.querySelector('.email').textContent = `Email: ${result.data.email}`;
        details.querySelector('.time').textContent = `Time: ${result.data.time}`;


        const prevSlot = document.getElementById(prevTime);

        console.log("preslot: ",prevSlot);

        let prevAvailable = Number(prevSlot.dataset.available);

        prevAvailable++;

        prevSlot.dataset.available = prevAvailable;

        prevSlot.querySelector('.available').textContent =
            `${prevAvailable} Available`;

        prevSlot.style.display = ''

        alert('Meeting updated successfully');

    }
    catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'updation failed');
    }
}


async function addMeeting(meeting){
    try {
        const result = await axios.post(
            'http://localhost:3000/meetings',
            meeting
        );

        const slot = document.getElementById(meeting.time);

        let available = Number(slot.dataset.available);
        available--;

        slot.dataset.available = available;

        slot.querySelector('.available').textContent =
            `${available} Available`;

        if(available===0){
            slot.style.display = 'none';
        }

        display(result.data);

        alert('Meeting booked successfully!');

    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || 'Booking failed');
    }
}


function display(meeting) {

    const ul = document.getElementById('meetingList');

    const li = document.createElement('li');
    li.className = 'meeting-card';
    li.id = meeting.id;

    const details = document.createElement('div');
    details.className = 'meeting-details';

    const name = document.createElement('h2');
    name.className = 'name'
    name.textContent = meeting.name;

    const email = document.createElement('p');
    email.className = 'email'
    email.textContent = `Email: ${meeting.email}`;

    const time = document.createElement('p');
    time.className = 'time'
    time.textContent = `Time: ${meeting.time}`;
    

    const link = document.createElement('p');

    const meetLink = "http://meet.google.com/ctd-xkmz-ybe";

    const a = document.createElement('a');
    a.href = meetLink;
    a.textContent = meetLink;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    link.textContent = "Link: ";
    link.appendChild(a);
    


    details.append(name, email, time, link);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', () => {
        deleteMeeting(meeting.id, li, meeting.time);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';

    editBtn.addEventListener('click', () => {
        editMeeting(meeting,li);
    });

    li.append(details, deleteBtn, editBtn);

    ul.appendChild(li);

}



async function deleteMeeting(id, li, time) {
    try {
        const response = await axios.delete(
            `http://localhost:3000/meetings/${id}`
        );

        if (response.status === 200) {
            li.remove();
            alert('Meeting deleted successfully!');

            const slot = document.getElementById(time);

            console.log(time, slot)

            // Increase available seats
            let available = Number(slot.dataset.available);
            available++;

            // Update button data
            slot.dataset.available = available;

            // Update displayed count
            slot.querySelector('.available').textContent =
                `${available} Available`;

            slot.style.display = '';
        }


    } catch (error) {
        console.error('Error deleting meeting:', error);
        alert(error.response?.data?.message || 'Failed to delete meeting');
    }
}




function editMeeting(meeting,li) {
    const form = document.getElementById('bookingForm');

    document.getElementById('time').type = "text";

    
    // const li = document.getElementById(meeting.id)
    const details = li.querySelector('.meeting-details')
    
    const email = details.querySelector('.email').textContent.split(" ")[1];
    const name = details.querySelector('.name').textContent;
    const time = details.querySelector('.time').textContent.split(" ")[1];

    console.log("update details: ",details);


    document.getElementById('time').value = time;
    document.getElementById('name').value = name;
    document.getElementById('email').value = email;

    // document.getElementById('slotId').value = meeting._id;

    form.classList.add('show');

    form.querySelector('h2').textContent = "Update a Meeting";
    form.querySelector('.book-btn').textContent = "Update Meeting";

    document.getElementById('bookingPlaceholder').style.display = "none";
    document.getElementById('selectedTimeText').textContent = meeting.time;


    sessionStorage.setItem("editId",meeting.id)
}


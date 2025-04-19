alert("✅ floorplan.js connected");

document.addEventListener('DOMContentLoaded', () => {
    const buildingDropdown = document.getElementById('buildingDropdown');
    const classDropdown = document.getElementById('classDropdown');
    const roomDropdown = document.getElementById('roomDropdown');
    const searchButton = document.getElementById('searchButton');
    const floorPlanContainer = document.getElementById('floorPlanContainer');
    let campusData = {};

    fetch('data/class.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            campusData = data.campusBuildings;
        })
        .catch(error => {
            console.error('Error loading campus data:', error);
            showNotification('Failed to load campus data. Please try again later.', 'error');
        });

    searchButton.addEventListener('click', () => {
        const selectedBuilding = buildingDropdown.value;
        const selectedRoomId = roomDropdown.value;
        if (selectedBuilding && selectedRoomId) {
            displayFloorPlanImage(selectedBuilding, selectedRoomId);
        } else {
            showNotification('Please select both a building and a room.', 'error');
        }
    });

    async function displayFloorPlanImage(building, roomId) {
        let floor = '';
        let roomFound = false;

        // Locate the room and identify its floor
        for (const f in campusData[building].floors) {
            const rooms = campusData[building].floors[f].rooms;
            if (rooms.some(r => r.name === roomId)) {
                floor = f;
                roomFound = true;
                break;
            }
        }

        floorPlanContainer.innerHTML = '';

        if (!roomFound) {
            showNotification('Room not found.', 'error');
            return;
        }

        try {
            const response = await fetch(`/first-image?building=${building}&floor=${floor}&room=${roomId}`);
            if (!response.ok) throw new Error('Image not found');
            const data = await response.json();

            const imageElement = document.createElement('img');
            imageElement.src = data.imageUrl;
            imageElement.alt = 'Room Floor Plan';
            imageElement.className = 'floor-plan-image';
            floorPlanContainer.appendChild(imageElement);
        } catch (error) {
            showNotification('No floor plan image available for the selected room.', 'error');
        }
    }

    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification-floor');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification-floor ${type}`;
        const iconSvg = type === 'success' ?
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"...></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"...></svg>';

        notification.innerHTML = `
            <div class="notification-icon">${iconSvg}</div>
            <div class="notification-message">${message}</div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

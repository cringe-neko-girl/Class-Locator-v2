alert("✅ floorlevel.js connected");

async function loadClassesData() {
    try {
        const response = await fetch('data/class.json');
        return await response.json();
    } catch (error) {
        showNotification("Error loading classes data: " + error, 'error');
        return null;
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconSvg = type === 'success' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>' :
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    
    notification.innerHTML = `
        <div class="notification-icon">${iconSvg}</div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function createBuildingDisplay(targetFloor, totalFloors) {
    const existingDisplay = document.querySelector('.building-display');
    if (existingDisplay) existingDisplay.remove();

    const MAX_CONTAINER_HEIGHT = 150;
    const MIN_FLOOR_HEIGHT = 40;
    const CONTAINER_WIDTH = 300;

    const calculatedHeight = Math.max(MIN_FLOOR_HEIGHT * totalFloors, MAX_CONTAINER_HEIGHT);
    const floorHeight = calculatedHeight / totalFloors;

    const container = document.createElement('div');
    container.className = 'building-display';
    container.style.cssText = `
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        width: ${CONTAINER_WIDTH}px;
        height: ${calculatedHeight + 32}px;
        background: rgba(30, 30, 50, 0.9);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    `;

    const buildingStructure = document.createElement('div');
    buildingStructure.className = 'building-structure';
    buildingStructure.style.cssText = `
        display: flex;
        flex-direction: column-reverse;
        height: ${calculatedHeight}px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    `;

    for (let i = 1; i <= totalFloors; i++) {
        const isTarget = i === targetFloor;
        const floorSection = document.createElement('div');
        floorSection.className = `floor-section ${isTarget ? 'active' : ''}`;
        floorSection.style.cssText = `
            width: 100%;
            height: ${floorHeight}px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            transition: all 0.3s ease;
            background: ${isTarget
                ? 'linear-gradient(to right, #9e50bb, #6a3093)'
                : 'rgba(100, 100, 120, 0.4)'};
            color: ${isTarget ? 'white' : 'rgba(255, 255, 255, 0.7)'};
            font-weight: ${isTarget ? '600' : '500'};
            font-size: 0.85rem;
        `;

        const floorText = document.createElement('div');
        floorText.textContent = `Floor ${i}`;
        floorSection.appendChild(floorText);

        if (!isTarget) {
            for (let w = 0; w < 3; w++) {
                const window = document.createElement('div');
                window.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    ${w === 0 ? 'left: 20%' : w === 1 ? 'left: 50%' : 'left: 80%'};
                    transform: translateX(-50%);
                `;
                floorSection.appendChild(window);
            }
        }

        buildingStructure.appendChild(floorSection);
    }

    container.appendChild(buildingStructure);

    const title = document.createElement('div');
    title.style.cssText = `
        position: absolute;
        top: 1rem;
        left: 1rem;
        font-size: 0.9rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
    `;
    title.textContent = '';
    container.appendChild(title);

    const legend = document.createElement('div');
    legend.style.cssText = `
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.7);
    `;
    legend.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 12px; height: 12px; background: linear-gradient(to right, #9e50bb, #6a3093); border-radius: 2px;"></div>
            <span>Destination</span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 12px; height: 12px; background: rgba(100, 100, 120, 0.4); border-radius: 2px;"></div>
            <span>Other Floors</span>
        </div>
    `;
    container.appendChild(legend);

    document.body.appendChild(container);

    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 10);
}


document.getElementById("searchButton").addEventListener("click", async function () {
    const buildingId = document.getElementById("buildingDropdown").value;
    const courseName = document.getElementById("classDropdown").value;
    const room = document.getElementById("roomDropdown").value;

    if (!buildingId || !courseName || !room) {
        showNotification("Please select a building, class, and room.", 'error');
        return;
    }

    const data = await loadClassesData();
    if (!data) return;

    const building = data.campusBuildings[buildingId];
    if (!building) {
        showNotification("Building not found.", 'error');
        return;
    }

    let floorNumber = null;
    for (let floor in building.floors) {
        const rooms = building.floors[floor].rooms;
        if (!rooms || rooms.length === 0) continue;

        const roomDetails = rooms.find(r => r.name === room);
        if (roomDetails) {
            floorNumber = parseInt(floor);
            showNotification(`Room ${room} found on Floor ${floor}`);
            break;
        }
    }

    if (floorNumber !== null) {
        createBuildingDisplay(floorNumber, Object.keys(building.floors).length);
    } else {
        showNotification(`Room ${room} not found in the selected building.`, 'error');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('checkbox-container');
    const resetGridButton = document.getElementById('reset-grid');
    const randomEggButton = document.getElementById('random-egg');
    const selectedCheckboxInfo = document.getElementById('selected-checkbox-info');
    const numGroupsInput = document.getElementById('num-groups');

    let numGroups = parseInt(localStorage.getItem('numGroups')) || 3; // Default number of groups

    // Function to create the grid with a specified number of groups
    function createGrid(numGroups, reset=false) {
        container.innerHTML = ''; // Clear the previous grid

        const rows = 5; // Number of rows
        const cols = 6; // Number of columns

        // Retrieve or initialize checkbox state
        const savedState = JSON.parse(localStorage.getItem('checkboxState')) || {};

        for (let i = 0; i < numGroups; i++) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'checkbox-group';

            // Create header for the group
            const groupHeader = document.createElement('h2');
            groupHeader.textContent = `Box ${i + 1}`;
            groupDiv.appendChild(groupHeader);

            const checkboxesContainer = document.createElement('div');
            checkboxesContainer.className = 'checkboxes-container';

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const index = row * cols + col + 1;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = reset ? true : savedState[`checkbox-${i}-${index}`] || false;
                    checkbox.dataset.group = i;
                    checkbox.dataset.index = index;
                    checkbox.id = `checkbox-${i}-${index}`;
                    checkboxesContainer.appendChild(checkbox);

                    // Event listener for checkbox click to store state
                    checkbox.addEventListener('change', () => {
                        savedState[checkbox.id] = checkbox.checked;
                        localStorage.setItem('checkboxState', JSON.stringify(savedState));
                    });

                    // Event listener for checkbox click to remove highlight from other checkboxes
                    checkbox.addEventListener('click', () => {
                        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                            cb.classList.remove('highlight');
                        });
                    });
                }
            }

            groupDiv.appendChild(checkboxesContainer);
            container.appendChild(groupDiv);
        }
        
        storeCheckboxState();
    }

    // Function to store checkbox state in localStorage
    function storeCheckboxState() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const state = {};

        checkboxes.forEach(cb => {
            state[cb.id] = cb.checked;
        });

        localStorage.setItem('checkboxState', JSON.stringify(state));
    }

    // Event listener for the reset grid button
    resetGridButton.addEventListener('click', () => {
        const confirmReset = confirm('Are you sure you want to reset the grid?');
        if (confirmReset) {
            numGroups = parseInt(numGroupsInput.value);
            localStorage.setItem('numGroups', numGroups);
            createGrid(numGroups, true);
        }
        // If not confirmed, do nothing
    });

    // Event listener for the random egg button
    randomEggButton.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            alert('No checkboxes selected');
            return;
        }

        const randomIndex = Math.floor(Math.random() * checkboxes.length);
        const randomCheckbox = checkboxes[randomIndex];

        const group = randomCheckbox.dataset.group;
        const index = randomCheckbox.dataset.index;

        // Display selected checkbox info
        selectedCheckboxInfo.textContent = `Chosen Box ${parseInt(group) + 1}, No. ${index}`;

        // Uncheck the selected checkbox
        randomCheckbox.checked = false;

        // Remove highlight from all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.classList.remove('highlight');
        });

        // Highlight the randomly chosen checkbox
        randomCheckbox.classList.add('highlight');

        // Store entire checkbox state in localStorage after modification
        storeCheckboxState();
    });

    // Initialize the grid with the stored number of groups on page load
    createGrid(numGroups);

    // Restore checkbox state from localStorage on page load
    const savedState = JSON.parse(localStorage.getItem('checkboxState')) || {};
    Object.entries(savedState).forEach(([id, checked]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = checked;
        }
    });
});

const gistId = 'c049b8379985c4531c9c6d799249a21b';
const accessToken = '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'; // Use a personal access token with the "gist" scope

// JavaScript code to manage the Gist JSON list
let charactersArray = [];

async function fetchGistContent() {
    const gistApiUrl = `https://api.github.com/gists/${gistId}`;

    try {
        const response = await fetch(gistApiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const gistData = await response.json();

        // Extract characters from 'letters.json'
        const files = gistData.files;
        if (files && files['letters.json']) {
            charactersArray = JSON.parse(files['letters.json'].content);
        }

        // Update the displayed list
        updateCharactersList();
    } catch (error) {
        console.error('Error fetching Gist content:', error);
    }
}

function updateCharactersList() {
    const charactersListDiv = document.getElementById('characters-list');
    charactersListDiv.innerHTML = '';

    // Display each character in the list
    charactersArray.forEach(char => {
        const listItem = document.createElement('li');
        listItem.textContent = char;
        charactersListDiv.appendChild(listItem);
    });
}

function validateInput() {
    const inputElement = document.getElementById('letter');
    const inputValue = inputElement.value.trim();

    if (inputValue.length !== 1) {
        alert('Please enter exactly one character.');
        inputElement.value = ''; // Clear input if not one character
    }
}

function addCharacterToGist(character) {
    charactersArray.push(character);
    updateGist(); // Now updateGist is asynchronous, so it returns a Promise
}

function updateGist() {
    const gistApiUrl = `https://api.github.com/gists/${gistId}`;

    fetch(gistApiUrl, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: {
                'letters.json': {
                    content: JSON.stringify(charactersArray),
                },
            },
        }),
    })
        .then(response => response.json())
        .then(() => {
            // Update the displayed list
            updateCharactersList();
        })
        .catch(error => {
            console.error('Error updating Gist:', error);
        });
}

function addCharacterManually() {
    const inputElement = document.getElementById('letter');
    const inputValue = inputElement.value.trim();

    if (inputValue.length === 1) {
        addCharacterToGist(inputValue)
            .then(() => {
                inputElement.value = ''; // Clear the input
            });
    } else {
        alert('Please enter exactly one character.');
    }
}

// Initial display
fetchGistContent();
const POLLING = 10000; // every 10 seconds
let isSearching = false;
let searchResults = [];

// Initial fetch and set interval
updateChatMessages();
setInterval(updateChatMessages, POLLING);

// Fetch new messages and update the chat
function updateChatMessages() {
    if (!isSearching) {
        fetch("/chatroom/messages")
            .then(response => response.json())
            .then(messages => {
                displayMessages(messages);
            })
            .catch(error => console.error("Error fetching messages:", error));
    } else {
        displayMessages(searchResults);
    }
}

// Send a message
document.getElementById("messageForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const message = document.getElementById("message").value.trim();
    if (!message) {
        alert("Message cannot be empty");
        return;
    }

    fetch("/chatroom/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    }).then(() => {
        document.getElementById("message").value = ''; // Clear the input field
        updateChatMessages(); // Refresh the chat
    });
});

// Delete a message
function deleteMessage(id) {
    fetch(`/chatroom/delete/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            updateChatMessages(); // Refresh the chat
        });
}

// Edit a message
function editMessage(id) {
    const messageElement = document.querySelector(`button[onclick="editMessage(${id})"]`).closest('.message').querySelector('p');
    const originalText = messageElement.innerText;

    const newText = prompt("Edit your message:", originalText);
    if (newText !== null && newText.trim() !== "" && newText !== originalText) {
        fetch(`/chatroom/edit/${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newText })
        })
            .then(response => response.json())
            .then(updatedMessage => {
                alert("Message updated");
                updateChatMessages(); // Refresh the chat
            });
    }
}

function searchMessages() {
    const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    if (searchTerm === "") {
        return;
    }

    isSearching = true;
    document.getElementById("doneButton").style.display = 'inline-block';
    document.getElementById("searchButton").style.display = 'none';

    fetch(`/chatroom/search?term=${searchTerm}`) 
        .then(response => response.json())
        .then(messages => {
            searchResults = messages;
            displayMessages(searchResults);
        })
        .catch(error => console.error("Error fetching messages:", error));
}

// Function to reset the search state
function resetSearch() {
    isSearching = false;
    document.getElementById("doneButton").style.display = 'none';
    document.getElementById("searchButton").style.display = 'inline-block';
    document.getElementById("searchInput").value = '';
    updateChatMessages();
}

// Function to display messages
function displayMessages(messages) {
    const chatMessages = document.getElementById("chatMessages");
        chatMessages.innerHTML = "";

        messages.forEach(msg => {
            const isEdited = new Date(msg.createdAt).getTime() !== new Date(msg.updatedAt).getTime();
            const isSentByUser = msg.email === userData.email;

            chatMessages.innerHTML += `
                <div class="message ${isSentByUser ? 'sent' : 'received'}">
                    <div class="message-content">
                        <strong>${msg.user}</strong>
                        <p>${msg.text}</p>
                        <span class="timestamp">
                            ${new Date(msg.createdAt).toLocaleString()}
                            ${isEdited ? '<span class="edited">(edited)</span>' : ''}
                        </span>
                    </div>
                    ${isSentByUser ? `
                        <div class="message-actions">
                            <button onclick="editMessage(${msg.id})">✏️</button>
                            <button onclick="deleteMessage(${msg.id})">🗑️</button>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Logout
document.getElementById("logoutButton").addEventListener("click", function () {
    fetch("/logout", { method: "GET" })
        .then(() => {
            window.location.href = "/"; // Redirect to login page after logout
        })
        .catch(error => console.error("Error logging out:", error));
});

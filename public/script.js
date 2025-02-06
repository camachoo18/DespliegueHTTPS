// /public/script.js

const API_KEY = '1234567890abcdef'; // La misma APIKEY hardcodeada

const messageList = document.getElementById('message-list');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const userInput = document.getElementById('user');

// Función para obtener y mostrar los mensajes
async function fetchMessages() {
    try {
        const response = await fetch('http://dev3.cyberbunny.online:3000/', {
            method: 'GET',
            headers: {
                'APIKEY': API_KEY
            }
        });
        

        if (response.ok) {
            const data = await response.json();
            messageList.innerHTML = ''; // Limpiar los mensajes existentes
            data.messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.content}`;
                messageList.appendChild(messageElement);
            });
        } else {
            console.error('Error al obtener los mensajes:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Función para enviar un nuevo mensaje
async function sendMessage(event) {
    event.preventDefault();

    const content = messageInput.value;
    const user = userInput.value;

    if (!content || !user) {
        alert('El mensaje y el usuario son obligatorios.');
        return;
    }

    try {
        const response = await fetch('http://dev3.cyberbunny.online:3000/?content=' + encodeURIComponent(content) + '&user=' + encodeURIComponent(user), {
            method: 'POST',
            headers: {
                'APIKEY': API_KEY
            }
        });

        if (response.ok) {
            const newMessage = await response.json();
            messageInput.value = '';  // Limpiar el campo de mensaje
            userInput.value = '';     // Limpiar el campo de usuario
            fetchMessages();          // Volver a cargar los mensajes
        } else {
            console.error('Error al enviar el mensaje:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

// Llamada inicial para cargar los mensajes
fetchMessages();

// Agregar el manejador de eventos para el formulario
messageForm.addEventListener('submit', sendMessage);

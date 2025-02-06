// /public/script.js

const API_KEY = '1234567890abcdef'; // La misma APIKEY hardcodeada

const messageList = document.getElementById('message-list');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message');
const userInput = document.getElementById('user');
const feedbackElement = document.getElementById('feedback'); // Área para feedback visual

// Función para obtener y mostrar los mensajes
async function fetchMessages() {
    try {
        const response = await fetch('http://localhost:3000/messages', {
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
    let user = userInput.value.trim();  // Obtener el nombre del usuario

    // Limpiar feedback previo
    feedbackElement.textContent = '';
    feedbackElement.classList.remove('success', 'error');

    if (!content) {
        // Mostrar mensaje de error si no hay mensaje
        feedbackElement.textContent = '¡Error! El mensaje es obligatorio.';
        feedbackElement.classList.add('error');
        return;
    }

    // Si el campo de nombre está vacío, asignamos "Anónimo"
    if (!user) {
        user = 'Anónimo';
    }

    try {
        const response = await fetch('http://localhost:3000/messages?content=' + encodeURIComponent(content) + '&user=' + encodeURIComponent(user), {
            method: 'POST',
            headers: {
                'APIKEY': API_KEY
            }
        });

        if (response.ok) {
            const newMessage = await response.json();
            messageInput.value = '';  // Limpiar el campo de mensaje
            userInput.value = '';     // Limpiar el campo de usuario

            // Mostrar mensaje de éxito
            feedbackElement.textContent = '¡Mensaje enviado con éxito!';
            feedbackElement.classList.add('success');
            fetchMessages();          // Volver a cargar los mensajes
        } else {
            console.error('Error al enviar el mensaje:', response.statusText);
            feedbackElement.textContent = '¡Error al enviar el mensaje!';
            feedbackElement.classList.add('error');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        feedbackElement.textContent = '¡Error en la conexión!';
        feedbackElement.classList.add('error');
    }
}

// Llamada inicial para cargar los mensajes
fetchMessages();

// Agregar el manejador de eventos para el formulario
messageForm.addEventListener('submit', sendMessage);

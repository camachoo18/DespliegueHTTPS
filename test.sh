curl -X POST "http://localhost:3000/messages?content=Hola%20Mundo&user=Juan" -H "APIKEY: 1234567890abcdef"

curl -X GET "http://localhost:3000/messages" -H "APIKEY: 1234567890abcdef"

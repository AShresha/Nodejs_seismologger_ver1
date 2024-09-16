const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Web Server Setup
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('build'));
let latestData = {};

// MQTT Setup with Authentication
const mqttOptions = {
    username: 'rts',  // Replace with your MQTT username
    password: 'rts'   // Replace with your MQTT password
};

const mqttClient = mqtt.connect('mqtt://ring.wscada.net', mqttOptions); // Replace with your MQTT broker URL

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('seismo/#', (err) => { // Replace 'seismo/#' with your topic
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log('Successfully subscribed to topic');
        }
    });
});

mqttClient.on('message', (topic, message) => {
    try {
        latestData = JSON.parse(message.toString());
        console.log('Received message on topic:', topic, 'Data:', latestData);
        
        // Broadcast the latest data to WebSocket clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(latestData));
            }
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});

mqttClient.on('error', (err) => {
    console.error('MQTT client error:', err);
});

// Serve Static Files
app.use(express.static('build'));

// HTTP Route for fetching latest data
app.get('/', (req, res) => {
    res.json(latestData);
});

// WebSocket Setup
wss.on('connection', ws => {
    console.log('New WebSocket connection');
    ws.on('message', message => {
        console.log('Received from client:', message);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

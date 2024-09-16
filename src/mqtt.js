// src/useMqtt.js
import { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const useMqtt = (brokerUrl, topic, username, password) => {
  //const [message, setMessage] = useState(null);
  const [message, setMessages] = useState([]);


  useEffect(() => {
    const mqttOptions = {
      username,
      password,
      connectTimeout: 3000, // Optional: adjust as needed
    };

    const client = mqtt.connect(brokerUrl, mqttOptions);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = message.toString();
        setMessages((prevMessages) => [...prevMessages, JSON.parse(payload)])
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT client error:', err);
    });

    return () => {
      client.end();
    };
  }, [brokerUrl, topic, username, password]);

 return message;
};

export default useMqtt;

import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Box from './Box';

const App = () => {
  const [data, setData] = useState([]);
  const brokerUrl = 'ws://ring.wscada.net:8080'; // Replace with your broker URL
  const topic = 'seismo/#'; // Replace with your topic
  const username = 'rts'; // Replace with your MQTT username
  const password = 'rts'; // Replace with your MQTT password

  useEffect(() => {

    const mqttOptions = {
      username,
      password,
      connectTimeout: 3000, // Optional: adjust as needed
    };

    const client = mqtt.connect(brokerUrl, mqttOptions); // Your broker URL

    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (err) console.error('Subscription error:', err);
      });
    });

    client.on('message', (topic, message) => {
      try {
        const newData = JSON.parse(message.toString());

        // Handle nested data (e.g., { items: [...] })
        if (newData && typeof newData === 'object') {
          const itemsArray = newData.items || [newData]; // Convert to array if needed
          replaceData(itemsArray);
        } else {
          console.error('Unexpected data format:', newData);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });

    return () => {
      client.end();
    };
  }, []);

  const replaceData = (newDataArray) => {
    setData(prevData => {
      // Create a Map with the previous data
      const dataMap = new Map(prevData.map(item => [item.id, item]));

      // Replace or add new items
      newDataArray.forEach(newItem => {
        if (newItem && newItem.id) {
          dataMap.set(newItem.id, newItem);
        }
      });

      // Convert Map back to an array and update state
      return Array.from(dataMap.values());
    });
  };
  
  return (
    <div className="container"> {/* Apply the container class */}
      
      {data.length === 0 ? (
        <p>Waiting for data...</p>
      ) : (
          data.sort((a, b) => (parseInt(a.id.substring(3,a.length)) - parseInt(b.id.substring(3,b.length)))).map((message, index) => (
          <Box key={index} data={message} />
        ))
      )}
    </div>
  );
};

export default App;
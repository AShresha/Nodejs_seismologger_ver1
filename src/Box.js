import React from 'react';
import './Box.css'; // Import the CSS file for styling

const Box = ({ data }) => {
  return (
    <div className="box">
        <div><strong>  ID:</strong> {data.id}</div>
        <div><strong>  Timestamp:</strong> {data.timestamp}</div>
        <div><strong>  SolarVoltage:</strong> {data.solarVoltage}</div>
        <div><strong>  BatteryVoltage:</strong> {data.batteryVoltage}</div>
        <div><strong>  RAMStartPointer:</strong> {data.ramStartPointer}</div>
        <div><strong>  RAMEndPointer:</strong> {data.ramEndPointer}</div>
        <div><strong>  ReadWriteTrack:</strong> {data.readWriteTrack}</div>
        <div><strong>  StatusCSQ:</strong> {data.statusCsq}</div>
        <div><strong>  DatalinkConnected:</strong> {data.datalinkConnected}</div>
        <div><strong>  CSQ:</strong> {data.csq}</div>
        <div><strong>  Date:</strong> {data.date}</div>
        <div><strong>  --------------------------------------------------------------------</strong></div>

    </div>
  );
};

export default Box;
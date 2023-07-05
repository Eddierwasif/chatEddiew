import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';
import InfoBar from '../info/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = () => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io();

    setName(name);
    setRoom(room);
    socket.emit('join', { name, room }, () => {});

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
    socket.on('locationMessage', ({ user, url }) => {
      const message = {
        user,
        text: url,
        isLocation: true,
      };
      setMessages((messages) => [...messages, message]);
    });
    socket.on('imageMessage', ({ user, image }) => {
      const message = {
        user,
        image,
        isImage: true,
      };
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off('message');
      socket.off('roomData');
      socket.off('locationMessage');
      socket.off('imageMessage');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault()
    if (message) {
        socket.emit('sendMessage', message, () => {
            setMessage('')
        })
    }
}
console.log(message, messages);

  const sendLocation = () => {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        socket.emit('sendLocation', location);
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  const sendImage = (image) => {
    socket.emit('sendImage', image);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage} 
          sendLocation={sendLocation}
          sendImage={sendImage}
        />
      </div>
      <TextContainer users={users} room={room} />
    </div>
  );
  
};

export default Chat;

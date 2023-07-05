import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from '../Messages/Message';

import './Messages.css';

const Messages = React.memo(({ messages, name }) => {

  return (
    <ScrollToBottom className="messages">
      {messages.map((message, index) => (
        <div key={index}>
          <Message message={message} name={name} />
        </div>
      ))}
    </ScrollToBottom>
  )
});

export default Messages

import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    {users && (
      <div className="activeContainer">
        <h2>
          {users.map(({ name }) => (
            <div key={name} className="activeItem">
              {name}
              <img alt="Online Icon" src={onlineIcon} />
            </div>
          ))}
        </h2>
      </div>
    )}
  </div>
);

export default TextContainer;

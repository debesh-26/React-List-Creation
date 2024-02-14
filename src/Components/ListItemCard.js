import React from 'react';
import './ListItemCard.css';

const ListItemCard = ({ item, onMoveLeft, onMoveRight }) => {
  const [name, description] = item.split(': ');

  return (
    <div className="list-item-card">
      <div className="item-actions">
        {onMoveLeft && <button onClick={onMoveLeft} style={{fontSize:'20px'}}>&larr;</button>}
        
      </div>
      <div className="item-content">
        <div className="item-name">{name}</div>
        <div className="item-description">{description}</div>
      </div>
      <div className="item-actions">
        {onMoveRight && <button onClick={onMoveRight} style={{fontSize:'20px',fontWeight:'200px'}}>&rarr;</button>}
      </div>
    </div>
  );
};

export default ListItemCard;

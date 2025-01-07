import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemType } from '../Utils/ItemTypes';
import { Tooltip } from 'react-tooltip'
import { Badge, Stack } from 'react-bootstrap';
import { handleDate } from '../Utils/DateFormatting';

function Card(
  {
    heading,
    cardId,
    backgroundColor,
    title,
    description,
    assignTo,
    priority,
    startDate,
    endDate,
    handleDeleteClick,
    handleEditClick
  }) {

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: {
      type: ItemType.CARD,
      cardId
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const badgeTagAndColor = {
    "1": { color: 'danger', value: 'High' },
    "2": { color: 'warning', value: 'Med' },
    "3": { color: 'success', value: 'Low' }
  }


  return (
    <div ref={drag} className="card" style={{ width: '90%', margin: '20px auto 0 auto', opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}>

      <div className="card-body" style={{}}>
        {heading !== 'Completed' &&
          <span className="badge position-absolute top-0 end-0 translate-middle badge rounded-pill text-primary" data-tooltip-id="Edit-Tooltip" data-tooltip-content="Edit" data-tooltip-place="top-end" data-tooltip-variant="info" style={{ cursor: 'pointer' }} >
            <Tooltip id="Edit-Tooltip" />
            <FontAwesomeIcon icon={faPen} onClick={() => handleEditClick(cardId)} />
          </span>}
        <span className="badge position-absolute top-0 start-100 translate-middle badge rounded-pill text-danger" data-tooltip-id="Delete-Tooltip" data-tooltip-content="Delete" data-tooltip-place="top-end" data-tooltip-variant="error" style={{ cursor: 'pointer' }}>
          <Tooltip id="Delete-Tooltip" />
          <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteClick(cardId)} />
        </span>
        <div className='d-flex flex-column gap-2'>
          <div className='d-flex justify-content-baseline gap-2'>
            {heading !== 'Completed' ?

              <h6 className="card-title d-flex gap-4">
                {title}
                <Badge bg={badgeTagAndColor[`${priority}`].color}>{badgeTagAndColor[`${priority}`].value}</Badge>
              </h6>
              :
              <h6 className="card-title"><s>{title}</s></h6>
            }
          </div>
          <div className='d-flex justify-content-baseline'>
            {heading !== 'Completed' ?
              <p className="card-text">{description}</p> :
              <p className="card-text"><s>{description}</s></p>
            }
          </div>
        </div>
      </div>
    </div >
  );
}

export default Card;
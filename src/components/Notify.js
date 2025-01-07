import Offcanvas from 'react-bootstrap/Offcanvas';
import { textColor, textToString } from '../Constant/ConstantVar';
import { handleDate } from '../Utils/DateFormatting';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEllipsisH, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import BellIcon from '../Assets/notification.png'

function Notify({ canvas, notifications, handleCanvasClose, hideNotification }) {

    const HideNotificationPopover = (notificationId) => {
        return <Popover onClick={() => hideNotification(notificationId)}>
            <Popover.Body className='d-flex gap-2' style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon className='mt-1' icon={faEyeSlash} />
                Hide this notification
            </Popover.Body>
        </Popover>
    }


    return (
        <Offcanvas show={canvas} onHide={handleCanvasClose} placement='end'>
            <Offcanvas.Header>
                <Offcanvas.Title>Notifications</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className='d-flex flex-column'>
                {notifications?.length > 0 ?
                    notifications?.map(({ tasksDetails, _id, assignBy }, _) => (
                        <div className="card mb-1" key={_id}>
                            <div className="card-body">
                                <div className='d-flex justify-content-between'>
                                    <h5 className="card-title text-primary fw-bold">{tasksDetails?.title}</h5>
                                    <OverlayTrigger trigger={'click'} placement='left' overlay={HideNotificationPopover(_id)}>
                                        <span type='button' style={{ fontSize: '20px', cursor: 'pointer' }}>
                                            <FontAwesomeIcon icon={faEllipsisH} />
                                        </span>
                                    </OverlayTrigger>
                                </div>
                                <h6 className="card-subtitle mb-3 text-muted">
                                    <i className="bi bi-person-fill"></i> Assigned By: {assignBy}
                                </h6>
                                <div className="d-flex align-items-center mb-3">
                                    <span
                                        className="badge"
                                        style={{
                                            backgroundColor: textColor[textToString[tasksDetails?.priority]],
                                            color: "#fff",
                                        }}
                                    >
                                        Priority: {textToString[tasksDetails?.priority]}
                                    </span>
                                </div>
                                <div className="bg-light p-3 rounded mb-3 description-text">
                                    <p className="card-text">{tasksDetails?.description}</p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-success fw-semibold">
                                        <i className="bi bi-calendar-event"></i> Start:{" "}
                                        {handleDate(tasksDetails?.startDate)}
                                    </span>
                                    <span className="text-danger fw-semibold">
                                        <i className="bi bi-calendar-event-fill"></i> End:{" "}
                                        {handleDate(tasksDetails?.endDate)}
                                    </span>
                                </div>
                            </div>

                        </div>
                    )) : <div className='text-center' style={{ marginTop: '50px', color: '#909090', fontSize: '20px' }}>
                        <img src={BellIcon} alt='BellIcon' width={100}></img>
                        <p className=''>No New Notifications...</p>
                    </div>}
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default Notify;
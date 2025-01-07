import { Button, Container, Navbar, OverlayTrigger, Popover } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { AxiosFetch, Fetch } from "../Utils/Fetch"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from "react-hot-toast"
import { faBell, faSignOut, faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import Notify from "./Notify";
import { NotificationContext } from "./context/NotificationContext";
import { Tooltip } from 'react-tooltip';
import UserProfile from "./UserProfile";


const badgeStyle = {
    position: 'absolute',
    top: '10px',
    right: '90px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '4px 4px',
    fontSize: '11px',
    fontWeight: 'bold',
    lineHeight: '1',
    minWidth: '15px',
    height: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '9999',
}

function Header() {
    const [canvas, setCanvas] = useState(false)
    const [showPopOver, setShowPopOver] = useState(false)
    const [profileShow, setProfileShow] = useState(false)
    const navigate = useNavigate()
    const { notifications, isFetchNotification, setNotifications, setIsFetchNotification } = useContext(NotificationContext)
    const [length, setLength] = useState(0)
    const isLogin = JSON.parse(localStorage.getItem('userData'))?.userID !== undefined
    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

    const handleLogOut = async () => {
        try {
            const { data } = await AxiosFetch.get('/auth/logout')
            toast.success(data?.message)
            localStorage.removeItem('userData')
            setNotifications([])
            setShowPopOver(false)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }


    const handleProfile = () => {
        setProfileShow(prev => !prev)
    }

    const handleCanvasClose = () => {
        setNotifications([])
        setCanvas(false)
    }

    const hideNotification = async (id) => {
        try {
            await Fetch('PATCH', `/notification/${id}`, null);
            const filter = notifications?.filter(({ _id }, _) => id !== _id)
            setNotifications(filter)
        } catch (e) {
            console.log(e)
        }
    }

    const handleClick = async () => {
        try {
            setCanvas(true)
            const res = await Fetch('GET', `/notification/all/${loggedInUser?.userID}`, null);
            // see notification which is not created by him/her self
            setNotifications(res?.data)
            setLength(0)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePopOver = () => {
        setShowPopOver(prev => !prev)
    }

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const res = await Fetch('GET', `/notification/all/${loggedInUser?.userID}`, null);
                setNotifications(res?.data)
                setLength(res?.data?.length)
            } catch (error) {
                console.log(error)
            }
        }
        loggedInUser && fetchNotification()

    }, [isFetchNotification])


    return (
        <>
            <Navbar className="navbar" bg="primary" data-bs-theme="dark">
                <Container style={{ margin: 0, justifyContent: 'flex-start' }}>
                    <Link to='/' style={{ textDecoration: 'none' }} >
                        <Navbar.Brand >KanbanBoard</Navbar.Brand>
                    </Link>
                </Container>
                <Container style={{ marginRight: '20px', gap: 3, justifyContent: 'flex-end' }}>
                    {
                        isLogin &&
                        <>
                            <span className="p-0 m-0" data-tooltip-id="Add-Tooltip" data-tooltip-content="Notifications" data-tooltip-place="left">
                                <Tooltip id="Add-Tooltip" style={{ fontSize: '0.8rem' }} />
                                <FontAwesomeIcon icon={faBell} onClick={handleClick} style={{ color: '#fff', marginRight: '20px', cursor: 'pointer' }} />
                                {length > 0 && <span style={badgeStyle}>{notifications.length}</span>}
                            </span>
                            {/* <span className="mt-1" style={{ cursor: 'pointer', color: '#fff' }}>{loggedInUser?.user}</span> */}
                            <div
                                className="circle font-style cursor-pointer"
                            >
                                <span onMouseEnter={handleProfile}>{loggedInUser?.user}</span>
                            </div>
                        </>
                    }
                </Container>
                {/* {isLogin &&
                        <div className="d-flex gap-2">
                            <span className="p-0 m-0" data-tooltip-id="Add-Tooltip" data-tooltip-content="Notifications" data-tooltip-place="left">
                                <Tooltip id="Add-Tooltip" style={{ fontSize: '0.8rem' }} />
                                <FontAwesomeIcon icon={faBell} onClick={handleClick} style={{ color: '#fff', padding: '10px', cursor: 'pointer' }} />
                            </span>
                            {length > 0 && <span style={badgeStyle}>{length}</span>}
                            <Button variant="success" style={{ width: '80px' }} onClick={() => handleLogOut()}>Logout</Button>
                        </div>
                    } */}
            </Navbar>
            {canvas && <Notify
                canvas={canvas}
                handleCanvasClose={handleCanvasClose}
                notifications={notifications}
                hideNotification={hideNotification}
            />}
            {profileShow &&
                <UserProfile
                    profileShow={profileShow}
                    handleProfile={handleProfile}
                    loggedInUser={loggedInUser}
                    handleLogOut={handleLogOut}
                />}
        </>
    )
}

export default Header
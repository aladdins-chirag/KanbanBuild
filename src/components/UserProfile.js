import { faSignOut } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Offcanvas } from 'react-bootstrap'

function UserProfile({ loggedInUser, profileShow, handleProfile, handleLogOut }) {
    return (
        <div className='profile-modal' onClick={handleProfile}>
            <div className='d-flex flex-column profile-heading text-center'>
                <h5>{loggedInUser?.user}</h5>
                <span>{loggedInUser?.email}</span>
            </div>
            <div className='divider' />
            <button className='footer-logout no-button-style' onClick={handleLogOut}>
                <FontAwesomeIcon icon={faSignOut} /> Logout
            </button>
        </div>
    )
}

export default UserProfile 
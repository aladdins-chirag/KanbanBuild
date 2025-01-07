import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"
import { Fetch } from "../../Utils/Fetch"
import { useContext } from "react"
import { DragCard } from "../context/DragCardContext"


const ShowAlert = ({ setIsDrop, showAlert, setShowAlert }) => {
    const { draggedCardId } = useContext(DragCard)
    const handleClose = () => {
        setShowAlert(false)
        setIsDrop(prev => !prev)
    }
    const handleClick = async (cardId) => {
        try {
            const data = { status: 'Completed' }
            await Fetch('PATCH', `/users/taskStatus/${draggedCardId}`, data)
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className={`modal fade ${showAlert ? 'show' : ''}`} style={{ display: showAlert ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden={!showAlert}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ color: "red", fontSize: '40px' }} />
                        <h5 className="text-center m-2"> Are you Sure?</h5>
                        Want to move to complete section.
                    </div>
                    <div className="modal-footer d-flex justify-content-center">
                        <Button type="button" onClick={() => handleClick()}>Yes</Button>
                        <Button type="button" onClick={handleClose}>No</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowAlert
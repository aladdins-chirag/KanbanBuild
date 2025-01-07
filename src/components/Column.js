import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cardBackGroundColor } from '../Constant/CardBgColor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { io } from 'socket.io-client'
import Card from './Card';
import DropTarget from './DropTarget';
import { AxiosFetch, Fetch } from '../Utils/Fetch';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import ShowAlert from './Modal/ShowAlert';
import AddTask from './Modal/AddTask'
import { NotificationContext } from './context/NotificationContext';



export const TaskContext = createContext({
  markDown: (id, dropZone) => { },
})

var ENDPOINT = 'http://localhost:5001/'
var socketConnection

function Column() {
  const [toDo, setToDo] = useState([])
  const [editToDo, setEditTodo] = useState({})
  const { setIsFetchNotification } = useContext(NotificationContext)
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDrop, setIsDrop] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [reload, setReload] = useState(false)
  const userID = JSON.parse(localStorage.getItem('userData'))?.userID || null

  const handleAddClick = () => {
    setShowModal(true)
  }

  const handleDeleteClick = async (cardId) => {
    try {
      const res = await Fetch('DELETE', `/users/deleteTask/${cardId}`, null)
      setToDo(oldToDo => oldToDo.filter((task) => task?._id !== cardId))
      toast.success(res.message)
    } catch (err) {
      if (err.response) {
        const { data } = err.response
        if (data?.message === 'Invalid Token!') {
          toast.error('Session Expired! Log-In Again to Continue', { position: 'top-center' })
        }
        else {
          toast.error(data?.message)
        }
      }
    }
  }

  const handleEditClick = (cardId) => {
    setShowModal(true)
    setIsEdit(true)
    const editTask = toDo.filter((task) => task._id === cardId)[0]
    setEditTodo(editTask)
  }

  // FOR DROP AREA
  const markDown = useCallback(async (cardId, dropZone) => {

    // JSON formatting
    const data = { status: dropZone }

    // API call to patch to change taskStatus 
    try {
      if (dropZone === 'Completed') {
        setShowAlert(true)
      }
      else {
        await Fetch('PATCH', `/users/taskStatus/${cardId}`, data)
        setIsDrop((prev) => !prev)
      }

    } catch (err) {
      if (err.response) {
        const { data } = err.response
        if (data?.message === 'Invalid Token!') {
          toast.error('Session Expired! Log-In Again to Continue', { position: 'top-center' })
        }
        else {
          toast.error(data?.message)
        }
      }
    }
  }, [])


  useEffect(() => {
    socketConnection = io(ENDPOINT)
    socketConnection.on('connect', () => {
      console.log("connected to server")
    })

    socketConnection.on('task notify', () => {
      setIsFetchNotification(prev => !prev)
      setReload(prev => !prev) // to render the changes
    })

    // disconnect with socket
    return () => socketConnection.disconnect()
  }, [])





  useEffect(() => {
    AxiosFetch.get(`/users/${userID}`)
      .then(res => {
        return res
      })
      .then(({ data }) => {
        setToDo(data?.data?.tasks)
      })
      .catch(err => { })

  }, [isDrop, isEdit, reload])


  return (
    <TaskContext.Provider value={markDown}>
      <div className="container-fluid" >
        <div className='row'>
          <div className="col-lg-3 col-md-3 col-12 mt-3 mb-3 ">
            <div className="card" style={{ boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)", minHeight: '86vh', maxHeight: '86vh' }}>
              <h5 className="card-header" style={{ backgroundColor: '#f8d7da' }}>Backlog</h5>
              <div className='scrollable-div'>
                {
                  toDo?.length > 0 && toDo?.filter(({ taskStatus }, _) => taskStatus === 'Backlog').map((task, _) => (
                    <Card
                      key={task?._id}
                      cardId={task?._id}
                      heading={task?.taskStatus}
                      backgroundColor={cardBackGroundColor[0]}
                      title={task?.title}
                      description={task?.description}
                      assignTo={task?.assignTo}
                      priority={task?.priority}
                      startDate={task?.startDate}
                      endDate={task?.endDate}
                      handleDeleteClick={handleDeleteClick}
                      handleEditClick={handleEditClick}
                    />
                  ))
                }
                <DropTarget status={'Backlog'} />
              </div>
            </div>
          </div>


          <div className="col-lg-3 col-md-3 col-12 mt-3 mb-3">
            <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", minHeight: '86vh', maxHeight: '86vh' }} >
              <h5 className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#fff3cd' }}>TO-DO
                <span data-tooltip-id="Add-Tooltip" data-tooltip-content="Add Task" data-tooltip-place="left" data-tooltip-variant="success">
                  <Tooltip id="Add-Tooltip" style={{ fontSize: '0.8rem' }} />
                  <FontAwesomeIcon icon={faPlus} onClick={handleAddClick} />
                </span>
              </h5>
              <div className='scrollable-div'>
                {
                  toDo?.length > 0 && toDo?.filter(({ taskStatus }, _) => taskStatus === 'TODO').map((task, _) => (
                    <Card
                      key={task?._id}
                      cardId={task?._id}
                      heading={task?.taskStatus}
                      backgroundColor={cardBackGroundColor[1]}
                      title={task?.title}
                      description={task?.description}
                      assignTo={task?.assignTo}
                      priority={task?.priority}
                      startDate={task?.startDate}
                      endDate={task?.endDate}
                      handleDeleteClick={handleDeleteClick}
                      handleEditClick={handleEditClick}
                    />
                  ))
                }
                <DropTarget status={'TODO'} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-3 col-12 mt-3 mb-3">
            <div className="card" style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", minHeight: '86vh', maxHeight: '86vh' }} >
              <h5 className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#B9D9EB' }}>In-Progress</h5>
              <div className='scrollable-div'>
                {
                  toDo?.length > 0 && toDo?.filter(({ taskStatus }, i) => taskStatus === 'InProgress').map((task, i) => (
                    <Card
                      key={task?._id}
                      cardId={task?._id}
                      heading={task?.taskStatus}
                      backgroundColor={cardBackGroundColor[2]}
                      title={task?.title}
                      description={task?.description}
                      assignTo={task?.assignTo}
                      priority={task?.priority}
                      startDate={task?.startDate}
                      endDate={task?.endDate}
                      handleDeleteClick={handleDeleteClick}
                      handleEditClick={handleEditClick}
                    />
                  ))
                }
                <DropTarget status={'InProgress'} />
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-3 col-12 mt-3 mb-3">
            <div className="card" style={{ boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)", minHeight: '86vh', maxHeight: '86vh' }}>
              <h5 className="card-header" style={{ backgroundColor: '#d4edda' }}>Completed</h5>
              <div className='scrollable-div'>
                {
                  toDo?.length > 0 && toDo?.filter(({ taskStatus }, i) => taskStatus === 'Completed').map((task, i) => (
                    <Card
                      key={task?._id}
                      cardId={task?._id}
                      heading={task?.taskStatus}
                      backgroundColor={cardBackGroundColor[3]}
                      title={task?.title}
                      description={task?.description}
                      assignTo={task?.assignTo}
                      priority={task?.priority}
                      startDate={task?.startDate}
                      endDate={task?.endDate}
                      handleDeleteClick={handleDeleteClick}
                      handleEditClick={handleEditClick}
                    />
                  ))
                }
                <DropTarget status={'Completed'} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal ?
        <AddTask editToDo={editToDo} isEdit={isEdit} showModal={showModal} setShowModal={setShowModal} setIsEdit={setIsEdit} setToDo={setToDo} setReload={setReload} socketConnection={socketConnection} />
        : null
      }

      {showAlert ? <ShowAlert setIsDrop={setIsDrop} showAlert={showAlert} setShowAlert={setShowAlert} /> : null}
    </TaskContext.Provider>
  );
}

export default Column;

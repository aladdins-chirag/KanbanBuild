import { useEffect, useRef, useState } from 'react';
import './Modal.css'
import { Fetch } from '../../Utils/Fetch';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { optionValues, Priority } from '../../Constant/ConstantVar';


function AddTask({ editToDo, isEdit, showModal, setShowModal, setToDo, setIsEdit, setReload, socketConnection }) {
    const titleRef = useRef(null)
    const [isClearableStart, setIsClearableStart] = useState(false)
    const [isClearableEnd, setIsClearableEnd] = useState(false)
    const [isDisable, setIsDisable] = useState('')

    const taskSchema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string().max(120, 'Description cannot exceed 120 char').required('Description is required'),
        assignTo: yup.array().required(' Atleast One person is required')
    })

    const { register, setFocus, control, setValue, getValues, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(taskSchema)
    })


    const handleClose = () => {
        setShowModal(false)
        setIsEdit(false)
    }


    const saveDetails = (details) => {
        const priority = handlePriority()
        const assignTo = handleSelectOptions(getValues('assignTo'))


        let taskData = {
            title: details?.title,
            description: details?.description,
            priority: priority,
            assignTo: assignTo,
            startDate: details?.startDate?.toDateString(),
            endDate: details?.endDate?.toDateString(),
            userID: JSON.parse(localStorage.getItem('userData'))?.userID,
            assignBy: JSON.parse(localStorage.getItem('userData'))?.user,
        }

        // handle put or post request based on isEdit
        Fetch(!isEdit ? 'POST' : 'PATCH', !isEdit ? '/users/createTask' : `/users/updateTask/${editToDo?._id}`, taskData).then((res) => {
            if (isEdit) {
                setIsEdit(prev => !prev)
            }
            else {
                setToDo((oldTask) => (
                    [...oldTask, res.data]
                ))
                if (!isEdit) setReload(prev => !prev)
                // setting latest task id so that it can render on other app
                taskData.taskId = res?.data?._id
            }
            toast.success(res.message)
            socketConnection.emit('new task', taskData)
            handleClose()
        }).catch(err => {
            if (err.response) {
                const { data } = err.response
                if (data?.message === 'Invalid Token!') {
                    toast.error('Session Expired! Log-In Again To Continue', { position: 'top-center' })
                }
            }
        })
    }

    const handleSelectOptions = (options) => {
        const names = options?.map(({ value }, _) => value)
        return names
    }
    const handlePriority = () => {
        const priorityObj = getValues('priority')
        const priorityValue = Object.keys(priorityObj).find(key => priorityObj[key] === true)
        return Priority[priorityValue]
    }

    const handleDisable = (e) => {
        if (e.target?.checked)
            setIsDisable(e.target?.name)
        else
            setIsDisable('')
    }

    useEffect(() => {
        setFocus('title')

        if (isEdit) {
            setValue('title', editToDo?.title)
            setValue('description', editToDo?.description)
        }

    }, [isEdit, editToDo, setValue])

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="addTaskModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-center">
                    <div className="modal-header">
                        <h5 className="modal-title text-center">{isEdit ? "Edit TO-DO's" : "Add TO-DO's"}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => handleClose()}></button>
                    </div>
                    <div className="modal-body">
                        <form className='mt-1' onSubmit={handleSubmit(saveDetails)}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>Title<span className="text-danger">*</span></h6>
                                        </td>
                                        <td style={{ paddingBottom: "15px" }}>
                                            <input type="text" className='form-control' {...register('title')} ></input>

                                            {errors.title?.message ? (<span className="text-danger mt-1">{errors.title?.message}</span>) : null}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>Description<span className="text-danger">*</span></h6>
                                        </td>
                                        <td style={{ paddingBottom: "15px" }}>
                                            <input type="text" className="form-control" {...register('description')}></input>

                                            {errors.description?.message ? (<span className="text-danger">{errors.description?.message}</span>) : null}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>Priority<span className="text-danger">*</span></h6>
                                        </td>
                                        <td style={{ paddingBottom: "20px" }}>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="Checkbox1" {...register('priority.high', { onChange: handleDisable })} disabled={isDisable && isDisable !== 'priority.high' ? true : false} />
                                                <label className="form-check-label" style={{ color: 'red' }} htmlFor="inlineCheckbox1">High</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="Checkbox2" {...register('priority.med', { onChange: handleDisable })} disabled={isDisable && isDisable !== 'priority.med' ? true : false} />
                                                <label className="form-check-label" style={{ color: 'tomato' }} htmlFor="inlineCheckbox2">Med</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" id="Checkbox3" {...register('priority.low', { onChange: handleDisable })} disabled={isDisable && isDisable !== 'priority.low' ? true : false} />
                                                <label className="form-check-label" style={{ color: 'green' }} htmlFor="inlineCheckbox3">Low</label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>AssignTo<span className="text-danger">*</span></h6>
                                        </td>
                                        <td style={{ paddingBottom: "15px" }}>
                                            <Controller
                                                name='assignTo'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={optionValues}
                                                        {...field}
                                                        isMulti
                                                        isClearable={true}
                                                    />
                                                )}
                                            />

                                            {errors.assignTo?.message ? (<span className="text-danger">{errors.assignTo?.message}</span>) : null}

                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>StartDate<span className="text-danger">*</span></h6>
                                        </td>
                                        <td>
                                            <Controller
                                                name='startDate'
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        selected={field.value}
                                                        onChange={(date) => {
                                                            field.onChange(date)
                                                            setIsClearableStart(true)
                                                        }}
                                                        closeOnScroll={true}
                                                        placeholderText='Start Date..'
                                                        isClearable={isClearableStart}
                                                    />
                                                )}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: "left" }}>
                                            <h6>EndDate<span className="text-danger">*</span></h6>
                                        </td>
                                        <td>
                                            <Controller
                                                name='endDate'
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        selected={field.value}
                                                        onChange={(date) => {
                                                            field.onChange(date)
                                                            setIsClearableEnd(true)
                                                        }}
                                                        closeOnScroll={true}
                                                        placeholderText='End Date..'
                                                        isClearable={isClearableEnd}
                                                    />
                                                )}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='d-flex gap-2 justify-content-center mt-2'>
                                <button type="submit" className="btn btn-primary" style={{ width: '80px' }}>Save</button>
                                <button type="button" className="btn btn-secondary" style={{ width: '80px' }} onClick={handleClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTask;

import { useContext, useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { AxiosFetch } from "../../Utils/Fetch"
import toast from "react-hot-toast"
import { NotificationContext } from "../context/NotificationContext"



function Login() {
    const navigate = useNavigate()
    const { setIsFetchNotification } = useContext(NotificationContext)
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginInfo(oldInfo => {
            return {
                ...oldInfo,
                [name]: value
            }
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await AxiosFetch.post('/auth/login', loginInfo)
            toast.success(data?.message)
            localStorage.setItem("userData", JSON.stringify(data?.data))
            setIsFetchNotification(true)
            navigate('/dashboard')
        } catch (e) {
            if (e.response) {
                toast.error(e.response?.data?.message)
            }
        }
    }


    return (
        <Container style={{ marginTop: '55px', width: '700px' }}>
            <Form onSubmit={handleSubmit}>
                <h2 className="text-center mb-3">Login</h2>

                <Form.Group className="mb-3">
                    <Form.Label>Email address<span className="text-danger">*</span></Form.Label>
                    <Form.Control required type="email" placeholder="name@example.com" name='email' value={loginInfo.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control required autoComplete='off' type="password" placeholder="Password" name='password' value={loginInfo.password} onChange={handleChange} />
                </Form.Group>
                <div className="d-flex gap-2 justify-content-center">
                    <Button type="submit" variant="primary" style={{ width: '100px' }}>Login</Button>
                    <Link to='/register'>
                        <Button type='button' variant="outline-primary" style={{ width: '100px' }}>Register</Button>
                    </Link>
                </div>
            </Form>
        </Container>
    )
}

export default Login
















































// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { useContext, useState } from 'react';
// import { Form, Button, Container, InputGroup } from 'react-bootstrap';
// import toast from 'react-hot-toast'
// import { Link, useNavigate } from 'react-router-dom';


// function Login() {
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [viewPass, setViewPass] = useState(false)
//     //   const { userLoggedIn } = useContext(LoginContext)


//     const toggleView = () => {
//         setViewPass((prev) => !prev)
//     }

//     const handleSubmit = async (e) => {
//         // try {
//         //     e.preventDefault()
//         //     let username = e.target[0].value
//         //     let password = e.target[1].value

//         //     const res = await AxiosFetch.post('/auth/login', {
//         //         username, password
//         //     })

//         //     const { data, message } = res.data
//         //     toast.success(message)
//         //     userLoggedIn('LOGIN')
//         //     localStorage.setItem('User', data.username)
//         //     navigate('/home')

//         // } catch (error) {
//         //     if (error.response) {
//         //         toast.error(error.response.data.message)
//         //     }
//         // }
//     }

//     return (
//         <Container className="mt-5" style={{ maxWidth: '400px' }}>
//             <h3 className="text-center mb-4">Login</h3>
//             <Form autoComplete='off' onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3" controlId="formBasicUsername">
//                     <Form.Label>Username</Form.Label>
//                     <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
//                 </Form.Group>

//                 <Form.Group className="mb-3" controlId="formBasicPassword">
//                     <Form.Label>Password</Form.Label>
//                     <InputGroup>
//                         <Form.Control
//                             type={viewPass ? "text" : "password"}
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <InputGroup.Text onClick={toggleView}>
//                             {/* {viewPass ? <i className="fa-regular fa-eye-slash" /> : <i className="fa-regular fa-eye" />} */}
//                             {viewPass ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
//                         </InputGroup.Text>
//                     </InputGroup>
//                 </Form.Group>

//                 <div className="d-flex gap-2">
//                     <Button variant="primary" type="submit" >
//                         Login
//                     </Button>

//                 </div>
//             </Form>
//         </Container>
//     );
// }

// export default Login;

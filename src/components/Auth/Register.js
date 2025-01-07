import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { Fetch } from "../../Utils/Fetch"
import toast from "react-hot-toast"


function Register() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserData(oldData => {
            return {
                ...oldData,
                [name]: value
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = await Fetch('POST', '/auth/register', userData)
            toast.success(data?.message)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Container style={{ marginTop: 'auto', width: '700px' }}>
            <Form onSubmit={handleSubmit}>
                <h2 className="text-center mb-3">Register Here</h2>
                <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control size="sm" type="text" required name="username" value={userData?.username} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email address<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required name="email" value={userData?.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control type="password" required name="password" value={userData?.password} onChange={handleChange} />
                </Form.Group>
                <div className="d-flex gap-2 justify-content-center">
                    <Button type="submit" variant="primary" style={{ width: '100px' }}>Submit</Button>
                </div>
            </Form>
        </Container>
    )
}

export default Register
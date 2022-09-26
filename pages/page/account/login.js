import React, { useState } from 'react';
import CommonLayout from '../../../components/shop/common-layout';
import { Container, Row, Form, Label, Input ,Col,Button} from 'reactstrap';

const Login = () => {
    const [data,setData]= useState({})
    const handleChange = (e) => { 
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
        console.log("data: " ,data);
    }
    const handleSubmit = (e) => { 
        e.preventDefault()
console.log("data: " ,data);
    }
    return (
        <CommonLayout parent="home" title="login">
            <section className="login-page section-b-space">
                <Container>
                    <Row>
                        <Col lg="6">
                            <h3>Login</h3>
                            <div className="theme-card">
                                <Form className="theme-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <Label for="email">Email</Label>
                                        <Input type="text" name='email' onChange={handleChange} className="form-control" id="email" placeholder="Email" required="" />
                                    </div>
                                    <div className="form-group">
                                        <Label for="review">Password</Label>
                                        <Input type="password" name='password' onChange={handleChange} className="form-control" id="password"
                                            placeholder="Enter your password" required="" />
                                    </div><Button   type='submit' className="btn btn-solid">Login</Button>
                                </Form>
                            </div>
                        </Col>
                        <Col lg="6" className="right-login">
                            <h3>New Customer</h3>
                            <div className="theme-card authentication-right">
                                <h6 className="title-font">Create A Account</h6>
                                <p>Sign up for a free account at our store. Registration is quick and easy. It allows you to be
                            able to order from our shop. To start shopping click register.</p><a href="#"
                                    className="btn btn-solid">Create an Account</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </CommonLayout>
    )
}

export default Login;
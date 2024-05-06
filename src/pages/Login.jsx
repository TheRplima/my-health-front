import React, { useEffect, useState } from 'react';
import { useAuth } from "../hooks/auth";

import { Col, Container, Row, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const { login, cookies } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = () => {
        login({ email, password, keepLoggedIn }).then(() => {
            console.log('Login efetuado com sucesso!');
        }).catch((error) => {
            alert(error);
        });
    };

    useEffect(() => {
        const token = cookies.token
        const keepLoggedIn = cookies.keepLoggedIn
        if (token && keepLoggedIn) {
            navigate(process.env.REACT_APP_HOME_PAGE);
        }
        if (keepLoggedIn) {
            setKeepLoggedIn(true)
        }
    }, []);

    return (
        <div className='login'>
            <Container>
                <Row className='mb-5'>
                    <Col>
                        <h1>Login</h1>
                        <p>Preencha seus dados e faça login no sistema para ter acesso a todas as funcionalidades.</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group className="mb-3" controlId="loginFormEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control required type="email" name={'email'} onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="loginFormPassword">
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control required type="password" name={'password'} minLength={6} onChange={(e) => setPassword(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="keepLogggedIn">
                                        <Form.Check // prettier-ignore
                                            type='checkbox'
                                            name={'keepLoggedIn'}
                                            label={'Manter conectado'}
                                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                            checked={keepLoggedIn}
                                        />
                                    </Form.Group>

                                    <Button variant="primary" onClick={handleSubmit}>
                                        Enviar
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <p className="mt-5 text-end">
                            <Link className="back-link" to="/register">
                                Não tenho cadastro{' '}
                                <FiLogIn size={20} color="#3498db" />
                            </Link>
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
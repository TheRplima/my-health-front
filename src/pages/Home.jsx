import React from 'react';
import { Container } from 'react-bootstrap';

import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className='home'>
            <Container>
                <h1>Home</h1>
                <p>Seja bem-vindo(a) a home do sistema.</p>
                <Link className="back-link mb-5" to="/login">Fazer login</Link>
            </Container>
        </div>
    )
}
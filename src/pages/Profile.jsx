import React from 'react'
import CardProfileInfo from '../components/CardProfileInfo'
import { Col, Container, Row } from 'react-bootstrap'
import CardConsumoAguaHoje from '../components/CardConsumoAguaHoje'
import CardControlePeso from '../components/CardControlePeso'

const Profile = () => {

    return (
        <div className='profile'>
            <Container>
                <Row>
                    <Col>
                        <CardProfileInfo />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <CardConsumoAguaHoje />
                    </Col>
                    <Col>
                        <CardControlePeso />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Profile

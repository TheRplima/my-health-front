import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MonthlyWaterIntake from '../components/MonthlyWaterIntake';
import WeeklyWaterIntake from '../components/WeeklyWaterIntake';
import BodyWeightVariationGraph from '../components/BodyWeightVariationGraph';
import CardConsumoAguaHoje from '../components/CardConsumoAguaHoje';
import CardControlePeso from '../components/CardControlePeso';

export default function Dashboard() {

    return (
        <div className='profile'>
            <Container>
                <Row>
                    <Col className='mb-3 d-flex align-items-stretch'>
                        <WeeklyWaterIntake />
                    </Col>
                    <Col className='mb-3 d-flex align-items-stretch'>
                        <MonthlyWaterIntake />
                    </Col>
                </Row>
                <Row>
                    <Col className='mb-3 d-flex align-items-stretch'>
                        <BodyWeightVariationGraph />
                    </Col>
                </Row>
                <Row>
                    <Col className='mb-3 d-flex align-items-stretch'>
                        <CardConsumoAguaHoje />
                    </Col>
                    <Col className='mb-3 d-flex align-items-stretch'>
                        <CardControlePeso />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
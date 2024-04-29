import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import MonthlyWaterIntake from '../components/MonthlyWaterIntake';
import WeeklyWaterIntake from '../components/WeeklyWaterIntake';
import BodyWeightVariationGraph from '../components/BodyWeightVariationGraph';
import CardConsumoAguaHoje from '../components/CardConsumoAguaHoje';
import CardControlePeso from '../components/CardControlePeso';

export default function Dashboard() {

    return (
        <div className='home'>
            <Container>
                <Row className='mb-3'>
                    <Col>
                        <WeeklyWaterIntake />
                    </Col>
                    <Col>
                        <MonthlyWaterIntake />
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <BodyWeightVariationGraph />
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
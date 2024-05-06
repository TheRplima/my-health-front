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
                <Row>
                    <Col className='mb-3'>
                        <WeeklyWaterIntake />
                    </Col>
                    <Col className='mb-3'>
                        <MonthlyWaterIntake />
                    </Col>
                </Row>
                <Row>
                    <Col className='mb-3'>
                        <BodyWeightVariationGraph />
                    </Col>
                </Row>
                <Row>
                    <Col className='mb-3'>
                        <CardConsumoAguaHoje />
                    </Col>
                    <Col className='mb-3'>
                        <CardControlePeso />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
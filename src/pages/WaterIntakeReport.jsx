import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import useWaterIntakeData from '../services/useWaterIntakeData';

import FormControlWaterIntakeContainerSelect from '../components/FormControlWaterIntakeContainerSelect';
import { Pagination } from 'react-laravel-paginex'
import { confirm } from "../components/ConfirmationModal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

export default function WaterIntakeReport() {
    library.add(fas);
    const [amount, setAmount] = useState(0);
    const [initialDate, setInitialDate] = useState(new Date().toISOString().split('T')[0]);
    const [finalDate, setFinalDate] = useState(new Date().toISOString().split('T')[0]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalAmount, setTotalAmount] = useState(0);
    const [waterIntakes, setWaterIntakes] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const { getWaterIntakeReport, deleteWaterIntake } = useWaterIntakeData()
    const [params, setParams] = useState({})

    const handleWaterIntakeReportFormSubmit = async (e) => {
        e.preventDefault()

        setParams({ initialDate, finalDate, amount, perPage })
        await getWaterIntakeReport({ initialDate, finalDate, amount, page, perPage }).then(response => {
            setWaterIntakes(response.data.water_intake_list.data);
            setTotalAmount(response.data.total_amount);
            setPaginationData(response.data.water_intake_list);
        }).catch((error) => {
            console.log(error)
        });
    }

    const paginationClicked = (data) => {
        getWaterIntakeReport(data).then(response => {
            setWaterIntakes(response.data.water_intake_list.data);
            setPaginationData(response.data.water_intake_list);
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleDeleteButtonClick = (id,e) => {
        confirm('Deseja realmente excluir este registro?', 'Remover registro', 'Sim', 'Não').then(
            (response) => {
                if (response) {
                    deleteWaterIntake(id).then(() => {
                        handleWaterIntakeReportFormSubmit(e)
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            })
    }

    return (
        <div className="app-container">
            <div className="content">
                <Container>
                    <Card>
                        <Card.Body>
                            <Card.Title>Relatório de consumo de água</Card.Title>
                            <Form onSubmit={handleWaterIntakeReportFormSubmit}>
                                <Row className='d-flex align-items-end'>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Form.Label>De: </Form.Label>
                                            <Form.Control type="date" name='initial_date' defaultValue={initialDate} onChange={(event) => setInitialDate(event.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Form.Label>Até: </Form.Label>
                                            <Form.Control type="date" name='final_date' defaultValue={finalDate} onChange={(event) => setFinalDate(event.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group>
                                            <Form.Label>Recipiente: </Form.Label>
                                            <FormControlWaterIntakeContainerSelect setAmount={setAmount} toReport={true} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Form.Label>Registros por página: </Form.Label>
                                            <Form.Select name='per_page' defaultValue={perPage} onChange={(event) => setPerPage(event.target.value)}>
                                                <option value="2">2</option>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                                <option value="40">40</option>
                                                <option value="50">50</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Button variant="primary" type='submit'>
                                                <FontAwesomeIcon icon={['fa', 'search']} /> Pesquisar
                                            </Button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                            <Row className='mt-5'>
                                <Col>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th scope="col" className='text-center col-lg-3 col-md-5'>Data</th>
                                                <th scope="col" className='text-center col-lg-3 col-md-5'>Quantidade</th>
                                                <th scope="col" className='text-end'>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {waterIntakes.length > 0 ? (
                                                waterIntakes.map((waterIntake, index) => (
                                                    <tr key={index}>
                                                        <td className='text-center'>{new Date(waterIntake.created_at).toLocaleString('pt-BR')}</td>
                                                        <td className='text-center'>{waterIntake.amount} ml</td>
                                                        <td className='text-end'>
                                                            <Button variant="danger" size={'sm'} onClick={(e) => handleDeleteButtonClick(waterIntake.id,e)}>
                                                                <FontAwesomeIcon icon={['fa', 'trash']} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className='text-center'>
                                                        <Card.Text>Nenhum registro encontrado</Card.Text>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        {waterIntakes.length > 0 ? (
                                            <tfoot>
                                                <tr>
                                                    <td colSpan={3} className='text-end'><b>Total ingerido no período: </b> {totalAmount} ml</td>
                                                </tr>
                                            </tfoot>
                                        ) : null}
                                    </Table>
                                    <Row>
                                        <Col className='text-center'>
                                            <Pagination changePage={paginationClicked} data={paginationData} requestParams={params} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    )
}
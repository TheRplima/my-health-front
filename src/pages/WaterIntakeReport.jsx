import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

import useWaterIntakeData from '../services/useWaterIntakeData';

import FormControlWaterIntakeContainerSelect from '../components/FormControlWaterIntakeContainerSelect';
import { confirm } from "../components/ConfirmationModal";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import ReportsPagination from '../components/ReportsPagination';

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
    const { getWaterIntakeReport } = useWaterIntakeData()

    const handleWaterIntakeReportFormSubmit = async (e) => {
        e.preventDefault()

        await getWaterIntakeReport({ initialDate, finalDate, amount, page, per_page: perPage }).then(response => {
            console.log(response)
            setWaterIntakes(response.data.water_intake_list.data);
            setTotalAmount(response.data.total_amount);
            delete response.data.water_intake_list.data;
            setPaginationData(response.data.water_intake_list);
        }).catch((error) => {
            console.log(error)
        });
    }

    const paginationClicked = (event) => {
        const url = event.target.getAttribute('data-page');
        setPage(url.split("=")[1]);
        getWaterIntakeReport({ initialDate, finalDate, amount, page, per_page: perPage }).then(response => {
            setWaterIntakes(response.data.water_intake_list.data);
            setTotalAmount(response.data.total_amount);
            delete response.data.water_intake_list.data;
            setPaginationData(response.data.water_intake_list);
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleDeleteButtonClick = (id) => {
        confirm('Deseja realmente excluir este registro?', 'Remover registro', 'Sim', 'Não').then(
            (response) => {
                if (response) {
                    // deleteWeightControl(id)
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
                            {/* <Form>
                                    <Form.Group>
                                        <Form.Label>Meta diária de consumo de água</Form.Label>
                                        <Form.Control type="number" placeholder="Digite a meta diária de consumo de água" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Consumo de água no dia</Form.Label>
                                        <Form.Control type="number" placeholder="Digite o consumo de água no dia" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Consumo de água no mês</Form.Label>
                                        <Form.Control type="number" placeholder="Digite o consumo de água no mês" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Consumo de água no ano</Form.Label>
                                        <Form.Control type="number" placeholder="Digite o consumo de água no ano" />
                                    </Form.Group>
                                    <Link to="/home" className="btn btn-primary">Voltar</Link>
                                </Form> */}
                            {/* Formulario para filtrar o consumo de agua por um periodo de tempo */}
                            <Form onSubmit={handleWaterIntakeReportFormSubmit}>
                                <Row className='d-flex align-items-end'>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Form.Label>De: </Form.Label>
                                            <Form.Control type="date" name='initial_date' defaultValue={initialDate} onChange={(event) => setInitialDate(event.target.value)} onClick={(event) => setInitialDate(event.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group>
                                            <Form.Label>Até: </Form.Label>
                                            <Form.Control type="date" name='final_date' defaultValue={finalDate} onChange={(event) => setFinalDate(event.target.value)} onClick={(event) => setFinalDate(event.target.value)} />
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
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col" className='text-center'>Data</th>
                                                <th scope="col" className='text-center'>Quantidade</th>
                                                <th scope="col" className='text-center'>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {waterIntakes.length > 0 ? (
                                                waterIntakes.map((waterIntake, index) => (
                                                    <tr key={index}>
                                                        <td className='text-center'>{new Date(waterIntake.created_at).toLocaleString('pt-BR')}</td>
                                                        <td className='text-center'>{waterIntake.amount} ml</td>
                                                        <td className='text-center'>
                                                            <Button variant="danger" size={'sm'} onClick={() => handleDeleteButtonClick(waterIntake.id)}>
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
                                        <tfoot>
                                            <tr>
                                                <td colSpan="2" className='text-center'>
                                                    <ReportsPagination paginationData={paginationData} paginationClicked={paginationClicked} />
                                                </td>
                                                <td colSpan="2" className='text-center'>Total</td>
                                                <td className='text-center'>{totalAmount} ml</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </div>
    )
}
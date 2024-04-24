import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

export default function RegisterWeightControl(props) {
    const [show, setShow] = useState(false);

    library.add(fas);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleAdd = () => {
        props.handleRegisterWeightControl();
        handleClose();
    }
    return (
        <>
            <Button className='ms-auto' size='sm' variant="primary" title='Registrar peso atual' onClick={handleShow} >
                <FontAwesomeIcon icon={['fa', 'plus']} />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar peso atual</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                        <Col>
                        <Form.Control type='date' name="dob" defaultValue={new Date().toISOString().split('T')[0]} onChange={e => props.setDate(e.target.value)} />
                        </Col>
                        <Col>
                    <Form.Control required name="weight" placeholder="Peso atual em Kg" onChange={e => props.setWeight(e.target.value)} autoFocus={true} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAdd}>
                        Registrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
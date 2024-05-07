import React, { useState, useEffect } from 'react'

import { useAuth } from "../hooks/auth";

import useWeightControlData from '../services/useWeightControlData'
import RegisterWeightControlModal from './RegisterWeightControlModal';
import { confirm } from "./ConfirmationModal";

import Card from 'react-bootstrap/Card';
import { FiTrash } from 'react-icons/fi';
import Button from 'react-bootstrap/esm/Button';
import Spinner from 'react-bootstrap/Spinner';

const CardControlePeso = () => {
    const [weight, setWeight] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [userProfileData, setUserProfileData] = useState({});
    const [weightControls, setWeightControls] = useState([]);
    const [loading, setLoading] = useState(false);
    const { cookies } = useAuth();
    const { setWeightControlData, deleteWeightControl, getWeightControlData } = useWeightControlData()

    const handleRegisterWeightControl = async (e) => {
        setWeightControlData(date, weight)
    }

    const handleDeleteButtonClick = (id) => {
        confirm('Deseja realmente excluir este registro?', 'Remover registro', 'Sim', 'Não').then(
            (response) => {
                if (response) {
                    deleteWeightControl(id)
                }
            })
    }

    useEffect(() => {
        async function loadStorageData() {
            const payload = {
                max: 5,
                initial_date: null,
                final_date: null,
                refresh: false
            }
            await getWeightControlData(payload).then(response => {
                setUserProfileData(cookies.user);
                setWeightControls(response);
                setLoading(false);
            }).catch((error) => {
                console.log(error.message)
                setLoading(false);
            });

        }

        if (!loading) {
            setLoading(true);
            loadStorageData();
        }

        return () => {
            setWeightControls([]);
            setLoading(false);
        }
    }, [cookies.weight_controls]);

    return (
        <>
            <Card className="mb-3">
                <Card.Header className='d-flex'>
                    <Card.Title>Controle de Peso</Card.Title>
                    <RegisterWeightControlModal handleRegisterWeightControl={handleRegisterWeightControl} setWeight={setWeight} setDate={setDate} />
                </Card.Header>
                {(!loading) ? (
                    <Card.Body>
                        <Card.Subtitle className="mb-3 text-muted"><strong>Peso atual:</strong> {userProfileData.weight}  Kg</Card.Subtitle>
                        <Card.Subtitle className="mb-3 text-muted"><strong>Últimos 5 registros</strong></Card.Subtitle>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col" className='text-center'>Data</th>
                                    <th scope="col" className='text-center'>Peso</th>
                                    <th scope="col" className='text-center'>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {weightControls && weightControls.length > 0 ? (
                                    weightControls.map((weightControl, index) => (
                                        <tr key={index}>
                                            <td className='text-center'>{new Date(weightControl.created_at).toLocaleDateString('pt-BR')}</td>
                                            <td className='text-center'>{weightControl.weight} Kg</td>
                                            <td className='text-center'>
                                                <Button variant='danger' size={'sm'} title={'Remover registro'} onClick={(e) => handleDeleteButtonClick(weightControl.id)}><FiTrash /></Button>
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
                        </table>
                    </Card.Body>
                ) : (
                    <Card.Body className='text-center'>
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </Card.Body>
                )}
            </Card>
        </>
    )
}

export default CardControlePeso
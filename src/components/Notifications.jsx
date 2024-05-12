import React, { useState, useEffect } from 'react'

import { Link } from "react-router-dom";

import { useAuth } from "../hooks/auth";

import { Nav, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import parse from 'html-react-parser';

function Notifications() {
    library.add(fas);
    const { cookies } = useAuth();
    const token = cookies.token;

    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(false);

    const getNotifications = async () => {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/notifications-unread', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token
            }
        });
        return await response.json();
    }

    const markAsRead = async (id) => {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/mark-notification/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token
            }
        });
        const result = await response.json();
        setData(result.notifications);
    }

    const markAllAsRead = async () => {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + 'api/mark-notifications', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + cookies.token
            }
        });
        const result = await response.json();
        setData(result.notifications);
    }

    const showContent = (e) => {
        e.preventDefault();
        e.target.nextElementSibling.classList.toggle('expanded');
        setTimeout(() => {
            e.target.nextElementSibling.classList.toggle('expanded');
            markAsRead(e.target.parentElement.parentElement.parentElement.parentElement.id)
        }, 15000);
    }

    useEffect(() => {
        async function fetchData() {
            const result = await getNotifications();
            setData(result);
            console.log(result)
        }
        fetchData();
    }, []);

    return (
        <>
            <Button size="lg" variant="link" style={(data === null) ? { 'color': 'white' } : (data.length > 0 ? { 'color': 'red' } : { 'color': 'white' })} onClick={(e) => { setVisible(!visible) }}>
                <FontAwesomeIcon icon={['fa', 'envelope']} />
            </Button>
            <Nav id={'notifications-container'} className="justify-content-end flex-grow-1 pe-3">
                {token ? (
                    <Card id={'notifications-card'} className={(!visible) ? 'd-none' : ""}>
                        <Card.Header className='d-flex justify-content-between align-items-center'>
                            <Card.Title>Notificações</Card.Title>
                            <Button size="sm" title="Marcar todas como lido" onClick={markAllAsRead} className={(data !== null && data.length === 0) ? 'disabled' : ""}>
                                <FontAwesomeIcon icon={['fa', 'check-double']} />
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-2">
                            {data && data.length > 0 ? (
                                data.map((item, index) => {
                                    return (
                                        <Card className="m-0 mb-1 notification-item" id={item.id} key={index}>
                                            <Card.Body className="p-1 d-flex justify-content-between align-items-center">
                                                <div className="notification-item-content d-flex w-100 align-items-center">
                                                    <p className="p-0 m-0"><img src={item.image} alt="Water Ingestion Reminder Icon" /></p>
                                                    <div className="p-2 w-100">
                                                        <Link to={'#'} onClick={showContent} className="w-100">
                                                            {item.title}
                                                        </Link>
                                                        <p className="p-0 my-2">{parse(item.body)}</p>
                                                        <span className="text-muted m-0 d-block">{item.receivedTime}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button size="sm" title="Marcar como lido" onClick={(e) => { markAsRead(item.id) }}>
                                                        <FontAwesomeIcon icon={['fa', 'check']} />
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                }
                                )
                            ) : (
                                <Card.Text className="text-center">Nenhuma notificação encontrada</Card.Text>
                            )}
                        </Card.Body>
                    </Card>
                ) : null}
            </Nav>
        </>
    )
}

export default Notifications

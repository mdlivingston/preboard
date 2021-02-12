import React from 'react'
import { Container } from 'react-bootstrap'
import logo from '../logo.svg';
export default function CenteredContainer({ children })
{
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ height: '50%', flexDirection: 'column' }}>
            <div style={{ fontSize: 32 }}>
                Preboard Exams
            <img className={'App-logo'} src={logo} alt="React"></img>
            </div>
            <br></br>
            <br></br>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                {children}
            </div>
        </Container >
    )
}

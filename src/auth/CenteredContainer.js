import React from 'react'
import { Container } from 'react-bootstrap'

export default function CenteredContainer({ children })
{
    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ height: '50%', flexDirection: 'column' }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                {children}
            </div>
        </Container >
    )
}

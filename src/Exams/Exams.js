import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddExam from './AddExam';
import { db } from '../firebase';

export default function Exams()
{
    const [exams, setExams] = useState([])
    useEffect(() =>
    {
        // if (!currentUser)
        // {
        //     console.error("Error: Not Signed In!");
        //     return
        // }

        return db.exams
            //.where("userId", "==", currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot =>
            {
                setExams(snapshot.docs.map(db.formatDoc))
            })

    }, [])
    return (
        <div className="exams-page">
            <div className="flex-r">

            </div>
            <div className="flex-r">
                <AddExam />
            </div>
            <br></br>
            <div className="content">
                {exams && (
                    exams.map(e => (
                        <Button
                            key={e.id}
                            style={{ margin: 5 }}
                            to={{ pathname: `/exams/${e.id}` }}
                            as={Link}>
                            {e.name}
                        </Button>
                    )))
                }
            </div>
        </div>
    )
}

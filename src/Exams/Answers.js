import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Col, Form } from 'react-bootstrap';
import { ACTIONS } from './Exam';

export const answerKeys = ["A", "B", "C", "D", "E", "F", "G", "H"]

export default function Answers({ state, dispatch, saveEditorData })
{
    function answerOnChange(e, i)
    {
        state.answers[state.questionIndex].list[i].text = e.target.value
        dispatch({
            type: ACTIONS.SET_ANSWERS,
            payload: { answers: state.answers }
        })
    }
    function correctOnChange(e, i)
    {
        state.answers[state.questionIndex].list.forEach((a, mi) =>
        {
            a.isCorrect = mi === i && e.target.value === 'on' ? true : false
        })

        dispatch({
            type: ACTIONS.SET_ANSWERS,
            payload: { answers: state.answers }
        })
        saveEditorData()
    }
    function addAnswer()
    {
        state.answers[state.questionIndex].list = [...state.answers[state.questionIndex].list, { text: "", isCorrect: false }]
        dispatch({
            type: ACTIONS.SET_ANSWERS,
            payload: { answers: state.answers }
        })
        saveEditorData()
    }

    return (
        <>
            <Button variant="contained" disabled={state.answers[state.questionIndex] && state.answers[state.questionIndex].list.length > 7} style={{ backgroundColor: 'lightblue', marginBottom: '20px' }} onClick={addAnswer}>
                <FontAwesomeIcon icon={faPlus} />
                                &nbsp; Add Answer
            </Button>
            <div style={{ width: '400px' }}>
                <Form.Group>
                    {state.answers[state.questionIndex] && state.answers[state.questionIndex].list.map((a, i) => (
                        <div key={i}>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    <Form.Check
                                        type="radio"
                                        label={answerKeys[i] + '.'}
                                        checked={a.isCorrect}
                                        onChange={(e) => correctOnChange(e, i)}
                                    />
                                </Form.Label>
                                <Col>
                                    <Form.Control onBlur={saveEditorData} value={a.text} onChange={(e) => answerOnChange(e, i)} type="text" as={'textarea'} placeholder="Answer text..." />
                                </Col>
                            </Form.Row>
                            <br></br>
                        </div>
                    ))}
                </Form.Group>
            </div>
        </>
    )
}

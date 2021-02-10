import React, { useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { Button, Col, Form, ListGroup } from 'react-bootstrap';
import './Exam.css'

const editorConfiguration = {
    toolbar: {
        items: [
            'heading', '|',
            'bold', 'italic', '|',
            'link', '|',
            'outdent', 'indent', '|',
            'bulletedList', 'numberedList', '|',
            'insertTable', '|',
            'undo', 'redo'
        ],
    },
    mediaEmbed: {
        previewsInData: true
    }
};

const answerKeys = ["A", "B", "C", "D", "E", "F", "G", "H"]

export default function Exam()
{
    const [questionId, setQuestionId] = React.useState();
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [editorState, setEditorState] = React.useState();
    const [questions, setQuestions] = React.useState([]);
    const [answers, setAnswers] = React.useState([[{ text: "", isCorrect: false }]]);

    const { examId } = useParams()

    function getQuestions(index) 
    {
        db.questions
            .where("examId", "==", examId)
            .orderBy("createdAt")
            .get()
            .then(querySnapshot =>
            {
                const data = querySnapshot.docs.map(doc => db.formatDoc(doc));

                // No questions
                if (data.length === 0)
                {
                    addQuestion()
                    return
                }

                setQuestions(data)

                // First load with questions
                if (!questionId)
                {
                    setEditorState(data[0].html)
                    setQuestionId(data[0].id)
                    setQuestionIndex(0)
                }
                else // After first load
                {
                    setQuestionIndex(index)
                    setEditorState(data[index].html)
                    setQuestionId(data[index].id)
                }
            });
    }

    useEffect(() =>
    {
        getQuestions(0)
    }, [])


    return (
        <div className="exam-page">
            <div className="sidebar">
                <div className="sidebar-section"><b>Questions</b></div>
                {!questions && <div className="sidebar-section">1</div>}
                {questions && questions.map((q, i) =>
                (
                    <div key={q.id} onClick={() => goToQuestion(i)} className="sidebar-section" style={{ backgroundColor: i === questionIndex ? 'lightgrey' : '' }}>{i + 1}</div>
                ))}
                <div onClick={addQuestion} className="sidebar-section"> + </div>
            </div>
            <div className="question-editor">
                <br></br>
                <h3> Question {questionIndex + 1}</h3>
                <br></br>
                <div style={{ width: '750px' }}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorState}
                        config={editorConfiguration}
                        onReady={editor =>
                        {
                        }}
                        onChange={(event, editor) =>
                        {
                            const data = editor.getData();
                            setEditorState(data)
                            //console.log({ event, editor, data });
                        }}
                        onBlur={(event, editor) =>
                        {
                            //console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) =>
                        {
                            //console.log('Focus.', editor);
                        }}
                    />
                </div>
                <br></br>
                <div>
                    <Form.Group>
                        {answers[questionIndex] && answers[questionIndex].map((a, i) => (
                            <div>
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
                                        <Form.Control type="text" as={'textarea'} placeholder="Answer text..." />
                                    </Col>
                                </Form.Row>
                                <br></br>
                            </div>
                        ))}
                    </Form.Group>

                </div>
                <Button variant="contained" style={{ backgroundColor: 'lightblue', marginBottom: '20px' }} onClick={addAnswer}>Add Anwser</Button>
                <Button variant="contained" style={{ backgroundColor: 'lightblue', marginBottom: '20px' }} onClick={saveEditorData}>Save Data</Button>
            </div>

        </div>
    )

    function saveEditorData()
    {
        if (questionId)
            editQuestion()
        else
            addQuestion()
    }

    function goToQuestion(index)
    {
        setAnswers([...answers, [{ text: "", isCorrect: false }]])
        setQuestionId(questions[index].id)
        setQuestionIndex(index)
        setEditorState(questions[index].html)

    }

    function correctOnChange(e, i)
    {
        let tempArr = [...answers]
        tempArr[questionIndex].forEach((a, mi) =>
        {
            a.isCorrect = mi === i && e.target.value === 'on' ? true : false
        })
        setAnswers(tempArr)
    }

    function addAnswer()
    {
        let tempArr = [...answers];
        tempArr[questionIndex] = [...tempArr[questionIndex], { text: "", isCorrect: false }]
        setAnswers(tempArr)
    }

    function addQuestion()
    {
        db.questions.add({
            html: "",
            examId,
            createdAt: db.getCurrentTimeStamp(),
            //userId: User.uid
        })
            .then(function (questionData)
            {
                debugger
                getQuestions(questions.length)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

    function editQuestion()
    {
        db.questions.doc(questionId).set({
            html: editorState,
            examId,
            //userId: User.uid
        }, { merge: true })
            .then(function ()
            {
                getQuestions(questionIndex)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

}

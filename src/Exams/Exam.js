import React, { useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { Button, Col, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import './Exam.css'
import AddFileButton from './AddFileButton';

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
    const [answers, setAnswers] = React.useState([]);
    const [images, setImages] = React.useState([]);
    const [radioValue, setRadioValue] = React.useState('1');


    const { examId } = useParams()

    useEffect(() =>
    {
        getQA(0)
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
                <div onClick={addQA} className="sidebar-section"> + </div>
            </div>
            <br></br>

            <div className="question-editor">
                <br></br>
                <ToggleButtonGroup type="radio" name="options" defaultValue={"1"}>
                    <ToggleButton onClick={(e) => setRadioValue('1')} value={'1'}>Admin View</ToggleButton>
                    <ToggleButton onClick={(e) => setRadioValue('2')} value={'2'}>Customer View</ToggleButton>
                </ToggleButtonGroup>

                <br></br>

                {radioValue === '1' && (
                    <>
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
                                    saveEditorData()
                                    //console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) =>
                                {
                                    //console.log('Focus.', editor);
                                }}
                            />
                        </div>
                        <br></br>
                        <div className="half-container">
                            <div className="half">
                                <Button variant="contained" disabled={answers[questionIndex] && answers[questionIndex].list.length > 7} style={{ backgroundColor: 'lightblue', marginBottom: '20px' }} onClick={addAnswer}>
                                    <FontAwesomeIcon icon={faPlus} />
                                &nbsp; Add Answer
                                </Button>
                                <div style={{ width: '400px' }}>
                                    <Form.Group>
                                        {answers[questionIndex] && answers[questionIndex].list.map((a, i) => (
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
                            </div>

                            <div className="half">
                                <AddFileButton questionId={questionId} />
                                <br></br>
                                {images.length > 0 && images.map((image) => (
                                    <div key={image.id} style={{ padding: 10 }}>
                                        <img src={image.url} height="75"></img>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {radioValue === '2' && (
                    <>
                        <div className="customer-images">
                            {images.length > 0 && images.map((image) => (
                                <div key={image.id} style={{ padding: 10 }}>
                                    <img src={image.url} height="75"></img>
                                </div>
                            ))}
                        </div>
                        <p style={{ margin: 20 }} dangerouslySetInnerHTML={{ __html: editorState }}></p>
                        <div>
                            {answers[questionIndex] && answers[questionIndex].list.map((a, i) => (
                                <div key={i}>
                                    <Form.Check
                                        type="radio"
                                        label={answerKeys[i] + '. ' + a.text}
                                        checked={a.isCorrect}
                                        onChange={(e) => correctOnChange(e, i)}
                                    />

                                    <br></br>
                                </div>
                            ))}
                        </div>

                    </>
                )}
                {/* <br></br>
                <Button variant="contained" style={{ backgroundColor: 'green', marginBottom: '20px' }} onClick={saveEditorData}>Save Data</Button> */}
            </div>

        </div>
    )

    function saveEditorData()
    {
        if (questionId)
            editQA()
        else
            addQA()
    }

    function goToQuestion(index)
    {
        setQuestionId(questions[index].id)
        setQuestionIndex(index)
        setEditorState(questions[index].html)
        getQuestionImages(questions[index].id)
    }

    function answerOnChange(e, i)
    {
        let tempArr = [...answers]
        tempArr[questionIndex].list[i].text = e.target.value
        setAnswers(tempArr)
    }
    function correctOnChange(e, i)
    {
        let tempArr = [...answers]
        tempArr[questionIndex].list.forEach((a, mi) =>
        {
            a.isCorrect = mi === i && e.target.value === 'on' ? true : false
        })
        setAnswers(tempArr)
        saveEditorData()
    }

    function addAnswer()
    {
        let tempArr = [...answers];
        tempArr[questionIndex].list = [...tempArr[questionIndex].list, { text: "", isCorrect: false }]
        setAnswers(tempArr)
        saveEditorData()
    }
    async function getQA(index) 
    {
        await getAnswers()
        await getQuestions(index)
    }

    function getQuestionImages(qId)
    {
        return db.files.where("questionId", "==", qId)
            .onSnapshot((querySnapshot) =>
            {
                let data = querySnapshot.docs.map(doc => db.formatDoc(doc));

                setImages(data)
            })
    }

    async function getAnswers()
    {
        let querySnapshot = await db.answers.where("examId", "==", examId)
            .orderBy("createdAt")
            .get()

        let data = querySnapshot.docs.map(doc => db.formatDoc(doc));

        setAnswers([...data])
    }

    async function getQuestions(index)
    {
        const querySnapshot = await db.questions.where("examId", "==", examId)
            .orderBy("createdAt")
            .get()

        const data = querySnapshot.docs.map(doc => db.formatDoc(doc));

        // No questions
        if (data.length === 0)
        {
            addQA()
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
        getQuestionImages(data[index].id)
    }

    function addQA()
    {
        db.questions.add({
            html: "",
            examId,
            createdAt: db.getCurrentTimeStamp(),
            //userId: User.uid
        })
            .then(async function (questionData)
            {
                await db.answers.add({ list: [{ text: "", isCorrect: false }], examId, questionId: questionData.id, createdAt: db.getCurrentTimeStamp(), })
                getQA(questions.length)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

    function editQA()
    {
        db.questions.doc(questionId).set({
            html: editorState,
            examId,
            //userId: User.uid
        }, { merge: true })
            .then(async function ()
            {
                await db.answers.doc(answers[questionIndex].id).set({ list: answers[questionIndex].list }, { merge: true })
                getQA(questionIndex)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

}

import React, { useEffect, useReducer } from 'react'
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import './Exam.css'
import AddFileButton from './AddFileButton';
import Header from '../Header';
import Sidebar from './Sidebar';
import TextEditor from './TextEditor';
import Answers from './Answers';
import { answerKeys } from './Answers'



export const ACTIONS = {
    SET_QUESTIONS: 'set-questions',
    SET_ANSWERS: 'set-answers',
    SET_IMAGES: 'set-images',
    SET_CURRENT_QUESTION: 'set-current-question',
    SET_EDITOR_DATA: 'set-editor-data'
}

function reducer(state, { type, payload })
{
    switch (type)
    {
        case ACTIONS.SET_QUESTIONS:
            return {
                ...state,
                questions: payload.questions
            }
        case ACTIONS.SET_ANSWERS:
            return {
                ...state,
                answers: payload.answers
            }
        case ACTIONS.SET_IMAGES:
            return {
                ...state,
                images: payload.images
            }
        case ACTIONS.SET_EDITOR_DATA:
            return {
                ...state,
                editorState: payload.editorState
            }
        case ACTIONS.SET_CURRENT_QUESTION:
            return {
                ...state,
                questionId: payload.questionId,
                questionIndex: payload.questionIndex,
                editorState: payload.editorState
            }
        default:
            return state
    }
}

export default function Exam()
{
    const [radioValue, setRadioValue] = React.useState('1');

    const [state, dispatch] = useReducer(reducer, {
        questions: [],
        answers: [],
        images: [],
        questionId: '',
        questionIndex: 0,
        editorState: ''
    })

    const { examId } = useParams()

    useEffect(() =>
    {
        getQA(0)
    }, [])

    return (
        <>
            <Header />
            <div className="exam-page">

                <Sidebar state={state} goToQuestion={goToQuestion} addQA={addQA} />

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
                            <TextEditor state={state} dispatch={dispatch} saveEditorData={saveEditorData} />

                            <br></br>

                            <div className="half-container">

                                <div className="half">
                                    <Answers state={state} dispatch={dispatch} saveEditorData={saveEditorData} />
                                </div>

                                <div className="half">
                                    <AddFileButton questionId={state.questionId} />
                                    <br></br>
                                    {state.images.length > 0 && state.images.map((image) => (
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
                                {state.images.length > 0 && state.images.map((image) => (
                                    <div key={image.id} style={{ padding: 10 }}>
                                        <img src={image.url} height="75"></img>
                                    </div>
                                ))}
                            </div>
                            <p style={{ margin: "20px 75px 20px 75px" }} dangerouslySetInnerHTML={{ __html: state.editorState }}></p>
                            <div>
                                {state.answers[state.questionIndex] && state.answers[state.questionIndex].list.map((a, i) => (
                                    <div key={i}>
                                        <Form.Check
                                            type="radio"
                                            label={answerKeys[i] + '. ' + a.text}
                                            checked={a.isCorrect}
                                            onChange={(e) => { }}
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
        </>
    )

    function saveEditorData()
    {
        if (state.questionId)
            editQA()
        else
            addQA()
    }

    function goToQuestion(index)
    {
        dispatch({
            type: ACTIONS.SET_CURRENT_QUESTION,
            payload: {
                editorState: state.questions[index].html,
                questionIndex: index,
                questionId: state.questions[index].id
            }
        })

        getQuestionImages(state.questions[index].id)
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

                dispatch({
                    type: ACTIONS.SET_IMAGES,
                    payload: { images: data }
                })
            })
    }

    async function getAnswers()
    {
        let querySnapshot = await db.answers.where("examId", "==", examId)
            .orderBy("createdAt")
            .get()

        let data = querySnapshot.docs.map(doc => db.formatDoc(doc));

        dispatch({
            type: ACTIONS.SET_ANSWERS,
            payload: { answers: data }
        })
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

        dispatch({
            type: ACTIONS.SET_QUESTIONS,
            payload: { questions: data }
        })

        // First load with questions
        if (!state.questionId)
        {
            dispatch({
                type: ACTIONS.SET_CURRENT_QUESTION,
                payload: {
                    editorState: data[0].html,
                    questionIndex: 0,
                    questionId: data[0].id
                }
            })
        }
        else // After first load
        {
            dispatch({
                type: ACTIONS.SET_CURRENT_QUESTION,
                payload: {
                    editorState: data[index].html,
                    questionIndex: 0,
                    questionId: data[index].id
                }
            })
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
                getQA(state.questions.length)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

    function editQA()
    {
        db.questions.doc(state.questionId).set({
            html: state.editorState,
            examId,
            //userId: User.uid
        }, { merge: true })
            .then(async function ()
            {
                await db.answers.doc(state.answers[state.questionIndex].id).set({ list: state.answers[state.questionIndex].list }, { merge: true })
                getQA(state.questionIndex)
                console.log("Document successfully written!");
            })
            .catch(function (error)
            {
                console.error("Error writing document: ", error);
            });
    }

}

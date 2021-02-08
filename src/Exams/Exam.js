import React, { useEffect } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { db } from '../firebase'
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
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

export default function Exam()
{
    const [questionId, setQuestionId] = React.useState();
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [editorState, setEditorState] = React.useState();
    const [questions, setQuestions] = React.useState();

    const { examId } = useParams()

    useEffect(() =>
    {
        db.questions
            .where("examId", "==", examId)
            //.orderBy("createdAt")
            .get()
            .then(querySnapshot =>
            {
                const data = querySnapshot.docs.map(doc => db.formatDoc(doc));

                if (data.length === 0)
                    return

                setQuestions(data)
                setEditorState(data[0].html)
                setQuestionId(data[0].id)
                setQuestionIndex(0)
            });
    }, [])

    return (
        <div className="exam-page">
            <div className="sidebar">
                <div className="sidebar-section"><b>Questions</b></div>
                <div className="sidebar-section">1</div>
                <div className="sidebar-section">1</div>
                <div className="sidebar-section">1</div>
                <div className="sidebar-section">1</div>
                <div className="sidebar-section">1</div>

            </div>
            <div className="question-editor">
                <h3> Question {questionIndex + 1}</h3>
                <div style={{ width: '750px' }}>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorState ? editorState : 'Enter question here...'}
                        config={editorConfiguration}
                        onReady={editor =>
                        {
                        }}
                        onChange={(event, editor) =>
                        {
                            const data = editor.getData();
                            setEditorState(data)
                            console.log({ event, editor, data });
                        }}
                        onBlur={(event, editor) =>
                        {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) =>
                        {
                            console.log('Focus.', editor);
                        }}
                    />
                </div>

                <Button variant="contained" style={{ backgroundColor: 'lightblue', marginBottom: '20px' }} onClick={saveEditorData}>Save Data</Button>
            </div>
        </div>
    )

    function saveEditorData()
    {
        if (questionId)
        {
            db.questions.doc(questionId).set({
                html: editorState,
                examId
                //userId: User.uid
            })
                .then(function ()
                {
                    console.log("Document successfully written!");
                })
                .catch(function (error)
                {
                    console.error("Error writing document: ", error);
                });
        }
        else
        {
            db.questions.add({
                html: editorState,
                examId,
                createdAt: db.getTimeStamp(),
                //userId: User.uid
            })
                .then(function (questionData)
                {
                    setQuestionId(questionData.id)
                    console.log("Document successfully written!");
                })
                .catch(function (error)
                {
                    console.error("Error writing document: ", error);
                });
        }


    }

}

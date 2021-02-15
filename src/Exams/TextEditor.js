import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ACTIONS } from './Exam';

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

export default function TextEditor({ state, dispatch, saveEditorData })
{
    return (
        <div style={{ width: '750px' }}>
            <CKEditor
                editor={ClassicEditor}
                data={state.editorState}
                config={editorConfiguration}
                onReady={editor =>
                {
                }}
                onChange={(event, editor) =>
                {
                    const data = editor.getData();
                    dispatch({
                        type: ACTIONS.SET_EDITOR_DATA,
                        payload: { editorState: data }
                    })
                    //setEditorState(data)
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
    )
}

import React from 'react'

export default function Sidebar({ state, goToQuestion, addQA })
{

    return (
        <div className="sidebar">
            <div className="sidebar-section"><b>Questions</b></div>
            {!state.questions && <div className="sidebar-section">1</div>}
            {state.questions && state.questions.map((q, i) =>
            (
                <div key={q.id}
                    onClick={() => goToQuestion(i)}
                    className="sidebar-section"
                    style={{ backgroundColor: i === state.questionIndex ? 'royalblue' : '', color: i === state.questionIndex ? 'white' : '' }}>
                    {i + 1}
                </div>
            ))}
            <div onClick={addQA} className="sidebar-section"> + </div>
        </div>
    )
}

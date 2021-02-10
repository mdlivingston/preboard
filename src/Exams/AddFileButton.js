import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from "react"
import { db, storage } from '../firebase'
import { v4 as uuidV4 } from "uuid"
import { ProgressBar, Toast } from "react-bootstrap"
import ReactDOM from "react-dom"

export default function AddFileButton({ questionId })
{
    const [uploadingFiles, setUploadingFiles] = useState([])

    function handleUpload(e)
    {
        const file = e.target.files[0]
        if (questionId == null || file == null) return

        const id = uuidV4()
        setUploadingFiles(prevUploadingFiles => [
            ...prevUploadingFiles,
            { id: id, name: file.name, progress: 0, error: false },
        ])
        const filePath = `${questionId}/${file.name}`

        const uploadTask = storage
            .ref(`/questionFiles/${filePath}`)
            .put(file)

        uploadTask.on(
            "state_changed",
            snapshot =>
            {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes
                setUploadingFiles(prevUploadingFiles =>
                {
                    return prevUploadingFiles.map(uploadFile =>
                    {
                        if (uploadFile.id === id)
                        {
                            return { ...uploadFile, progress: progress }
                        }

                        return uploadFile
                    })
                })
            },
            () =>
            {
                setUploadingFiles(prevUploadingFiles =>
                {
                    return prevUploadingFiles.map(uploadFile =>
                    {
                        if (uploadFile.id === id)
                        {
                            return { ...uploadFile, error: true }
                        }
                        return uploadFile
                    })
                })
            },
            () =>
            {
                setUploadingFiles(prevUploadingFiles =>
                {
                    return prevUploadingFiles.filter(uploadFile =>
                    {
                        return uploadFile.id !== id
                    })
                })

                uploadTask.snapshot.ref.getDownloadURL().then(url =>
                {
                    db.files
                        .where("name", "==", file.name)
                        .where("questionId", "==", questionId)
                        .get()
                        .then(existingFiles =>
                        {
                            const existingFile = existingFiles.docs[0]
                            if (existingFile)
                            {
                                existingFile.ref.update({ url: url })
                            } else
                            {
                                db.files.add({
                                    url: url,
                                    name: file.name,
                                    createdAt: db.getCurrentTimeStamp(),
                                    questionId
                                })
                            }
                        })
                })
            }
        )
    }

    return (
        <>
            <label className="btn btn-outline-success btn-sm m-0 mr-2">
                <FontAwesomeIcon icon={faFileUpload} />
                &nbsp; Upload Images
                <input
                    type="file"
                    onChange={handleUpload}
                    style={{ opacity: 0, position: "absolute", left: "-9999px" }}
                />
            </label>
            {uploadingFiles.length > 0 &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            maxWidth: "250px",
                        }}
                    >
                        {uploadingFiles.map(file => (
                            <Toast
                                key={file.id}
                                onClose={() =>
                                {
                                    setUploadingFiles(prevUploadingFiles =>
                                    {
                                        return prevUploadingFiles.filter(uploadFile =>
                                        {
                                            return uploadFile.id !== file.id
                                        })
                                    })
                                }}
                            >
                                <Toast.Header
                                    closeButton={file.error}
                                    className="text-truncate w-100 d-block"
                                >
                                    {file.name}
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        animated={!file.error}
                                        variant={file.error ? "danger" : "primary"}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={
                                            file.error
                                                ? "Error"
                                                : `${Math.round(file.progress * 100)}%`
                                        }
                                    />
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    )
}

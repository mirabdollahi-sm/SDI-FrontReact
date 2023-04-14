import React from "react";
import Modal from 'react-modal';
import { useState, useEffect } from "react";
import useAxiosPrivateDownload from "../hooks/useAxiosPrivateDownload";

const ReadMeModal = (props) => {
    const currentDirectoty = props.currentDirectoty;
    const axiosPrivateDownload = useAxiosPrivateDownload();
    const [ readMe, setReadme ] = useState('');
    const [ readMePath, setReadMePath ] = useState('')

    useEffect(() => {
        setReadme(currentDirectoty)
    })
    const fetchHtml = async () => {
        if (!!readMe) {
            const target = `/read/${readMe}_Readme.html`
            await axiosPrivateDownload.get(target).then((response) => {
                const htmlObjectURL = URL.createObjectURL(response.data);                          
                setReadMePath(htmlObjectURL)                   
            });
        }
    }
    useEffect(() => {
        fetchHtml();
    }, [readMe]);
    
    return (
        <Modal
            isOpen={!!currentDirectoty}
            contentLabel="ReadMeModal"
            onRequestClose={() => {
                props.handleClose();
            }}
            ariaHideApp={false}
            closeTimeoutMS={200}
            className='modal'
        >
            <h1>{currentDirectoty.split('_').pop()}</h1>
            <iframe
            className="modal__content" 
            src={readMePath} 
            title="description" />
        </Modal>
    )
};



export default ReadMeModal;
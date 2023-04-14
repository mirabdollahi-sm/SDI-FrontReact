import React from "react";
import { useState, useEffect } from "react";
import useAxiosPrivateDownload from "../hooks/useAxiosPrivateDownload";
import { b64EncodeUnicode } from "../actions/urlDecode";

const ReadMe = (props) => {
    const axiosPrivateDownload = useAxiosPrivateDownload();
    const [ readMe, setReadme ] = useState(false);
    const [ readMePath, setReadMePath ] = useState('');
    useEffect(() => {
        setReadme(props.readMeId)
    })
    const fetchHtml = async () => {
        if (readMe !== false) {
            const target = `/read/${b64EncodeUnicode(readMe)}`
            await axiosPrivateDownload.get(target).then((response) => {
                const htmlObjectURL = URL.createObjectURL(response.data);                          
                setReadMePath(htmlObjectURL)               
            });
        } else setReadMePath(null)
    }
    useEffect(() => {
        fetchHtml();
    }, [readMe]);
    return (
        <iframe className="modal__content" src={readMePath} title="description"></iframe>
    )
};

export default ReadMe;
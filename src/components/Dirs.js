import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivateDownload from "../hooks/useAxiosPrivateDownload";
import { b64EncodeUnicode } from "../actions/urlDecode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from '../hooks/useAuth';
import { faFolder, faLevelUp, faFileZipper, faImage, faVideo, faFileWord } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf, faFileText, faFileExcel, faFilePowerpoint, faFileAudio, faFile } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from 'file-saver';
import ReadMe from "./ReadMe";


const Dirs = () => {
  const { auth } = useAuth();
  const [ dirs, setDirs ] = useState([]);
  const [ currentDirectotyId, setCurrentDirectoryId ] = useState(1);
  const [ parent, setParent] = useState('.');
  const [ parentId, setParentId ] = useState(0)
  const [ refreshDb, setRefreshDb ] = useState(false)
  const [ readmeId, setReadmeId ] = useState(false);
  const [ readMeModal, setReadMeModal] = useState('');
  const axiosPrivate = useAxiosPrivate();
  const axiosPrivateDownload = useAxiosPrivateDownload();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getDirs = async () => {
      try {
        const target = `/read/${b64EncodeUnicode(currentDirectotyId)}`
        const response = await axiosPrivate.get(target, {
          signal: controller.signal
        });
        setParent(response.data.name);
        setParentId(response.data.parent_id);
        setReadmeId(response.data.readMe);
        isMounted && setDirs(response.data.children);
      } catch(err) {
        console.error(err);
      }
    }
    getDirs();
    setRefreshDb(false)
    return () => {
        isMounted = false;
        controller.abort();
    }
  },[currentDirectotyId, refreshDb])

  return (
    <div className="content-container">
        {/*<ReadMeModal currentDirectoty={readMeModal} handleClose={() => {setReadMeModal('')}} />*/}
        <div className="list-header" >
          <div 
          className="list-item__title__parentdir"
          onClick={() => {
            if( currentDirectotyId !== 1 ) {
              setCurrentDirectoryId(parentId);
            }
          }} >
            <div className="show-for-mobile">
              <FontAwesomeIcon className="icon" icon={faLevelUp} />
              {parent.slice(3).replaceAll('/',' / ')}
            </div>
            <div className="show-for-descktop">
              <FontAwesomeIcon className="icon" icon={faLevelUp} />
              {parent.slice(3).replaceAll('/',' / ')}
            </div>
          </div>
          {auth.role === 'admin' && <button
            className="button button--regular"
            onClick={() => {
              axiosPrivate.get('/refdb');
              setRefreshDb(true);
            }}
          >
            RefreshDB
          </button>}
        </div>
        <div className="list-body">
          {
            dirs?.length? (     
              <span>
                {dirs.map((dir, i) => {
                  const type = dir.file_type
                  const size = parseInt(dir.file_size) >= 1048576 ?
                  `${(parseInt(dir.file_size)/1048576).toFixed(2)}MB` :
                  `${(parseInt(dir.file_size)/1024).toFixed(0)}KB`
                  return (
                    <div className="list-item list-item--dir" key={i} onClick={() => {
                      if (type.search('folder') !== -1) {
                        setCurrentDirectoryId(dir.file_id)
                      } else {
                        axiosPrivateDownload.get(`/read/${b64EncodeUnicode(dir.file_id)}`).then((response) => {                              
                          saveAs(response.data, dir.file_name.split('/').pop());
                        });
                      }
                    }}>
                      <div>
                        <FontAwesomeIcon className="icon" icon={ 
                          type.search('zip') !== -1
                            ? faFileZipper 
                            : type.search('image') !== -1
                            ? faImage
                            : type.search('audio') !== -1
                            ? faFileAudio
                            : type.search('video') !== -1
                            ? faVideo
                            : type.search('pdf') !== -1
                            ? faFilePdf
                            : type.search('word') !== -1
                            ? faFileWord
                            : type.search('text') !== -1
                            ? faFileText
                            : type.search('excel') !== -1
                            ? faFileExcel
                            : type.search('powerpoint') !== -1
                            ? faFilePowerpoint
                            : type.search('html') !== -1
                            ? faFileText
                            : type.search('folder') !== -1
                            ? faFolder
                            : faFile
                        }/>
                        {dir.file_name.split('/').pop()}
                        {
                          type.search('folder') === -1 && 
                          <span className="list-item__data">
                            {size}
                          </span>
                        }
                      </div>
                    </div>
                  )
                })}
              </span>
            ) : <div className="list-item" >No content to display</div>
          }
        </div>
        {readmeId && <ReadMe readMeId={readmeId}/>}
    </div>
  )
}

export default Dirs;
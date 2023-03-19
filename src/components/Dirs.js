import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAxiosPrivateDownload from "../hooks/useAxiosPrivateDownload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faLevelUp, faFileZipper, faImage, faVideo, faFilePdf, faFileWord, faFileText, faFileExcel, faFilePowerpoint, faFileAudio, faFile } from "@fortawesome/free-solid-svg-icons";
import ReadMeModal from "./ReadMeModal";
import fileType from "../actions/fileType";
import { saveAs } from 'file-saver';


const Dirs = () => {
  const [ dirs, setDirs ] = useState([]);
  const [ currentDirectoty, setCurrentDirectory ] = useState('root');
  const [ parent, setParent] = useState('.');
  const [ hasReadme, setHasReadme ] = useState(false);
  const [ readMeModal, setReadMeModal] = useState('')
  const axiosPrivate = useAxiosPrivate();
  const axiosPrivateDownload = useAxiosPrivateDownload();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getDirs = async () => {
      try {
        const target = '/read/' + currentDirectoty
        const response = await axiosPrivate.get(target, {
          signal: controller.signal
        }); 
        setParent(response.data.par);
        setHasReadme(response.data.readme);
        isMounted && setDirs(response.data.children);
      } catch(err) {
        console.error(err);
      }
    }
    getDirs();
    return () => {
        isMounted = false;
        controller.abort();
    }
  },[currentDirectoty])

  return (
    <div className="content-container">
        <ReadMeModal currentDirectoty={readMeModal} handleClose={() => {setReadMeModal('')}} />
        <div className="list-header" >
          <div 
          className="list-item__title__parentdir"
          onClick={() => {
            if(currentDirectoty !== 'root') {
              let parentRequest = parent;
              parentRequest = parentRequest.replaceAll('/' , '_').slice(3);
              setCurrentDirectory(parentRequest);
            }
          }} >
            <div className="show-for-mobile">
              <FontAwesomeIcon className="icon" icon={faLevelUp} />
              {currentDirectoty.replaceAll('_' , ' / ')}
            </div>
            <div className="show-for-descktop">
              <FontAwesomeIcon className="icon" icon={faLevelUp} />
              {currentDirectoty.replaceAll('_' , ' / ')}
            </div>
          </div>
            { hasReadme && <button
                          className="button button--regular"
                          onClick={() => {
                            setReadMeModal(currentDirectoty)
                          }}
                        >ReadMe
                        </button> 
            }
        </div>
        <div className="list-body">
          {
            dirs?.length? (     
              <span>
                {dirs.map((dir, i) => {
                  const ext = dir.split('.').pop();
                  const type = fileType(ext);
                  return (
                    <div className="list-item list-item--dir" key={i} onClick={() => {
                      if (type === 'folder') {
                        setCurrentDirectory(`${currentDirectoty}_${dir}`)
                      } else {
                        const target = `/read/${currentDirectoty}_${dir}`
                        axiosPrivateDownload.get(target).then((response) => {                               
                          saveAs(response.data, dir);
                        });
                      }
                    }}>
                      <div>
                        <FontAwesomeIcon className="icon" icon={ 
                          type === 'zip' 
                            ? faFileZipper 
                            : type === 'image'
                            ? faImage
                            : type === 'audio'
                            ? faFileAudio
                            : type === 'video'
                            ? faVideo
                            : type === 'pdf'
                            ? faFilePdf
                            : type === 'word'
                            ? faFileWord
                            : type === 'text'
                            ? faFileText
                            : type === 'excel'
                            ? faFileExcel
                            : type === 'powerpoint'
                            ? faFilePowerpoint
                            : type === 'html'
                            ? faFileText
                            : type === 'sup'
                            ? faFile
                            : faFolder
                        }/>
                        {dir}
                      </div>
                    </div>
                  )
                })}
              </span>
            ) : <div className="list-item" >No content to display</div>
          }
        </div>
    </div>
  )
}

export default Dirs;
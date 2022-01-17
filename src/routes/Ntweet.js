import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
const  NtweetObject = require('models/Ntweet');

function Ntweet(props){

    const [ Ntweet, setNtweet ] = useState(props.Ntweet);
    const [ IsOwner ] = useState(props.IsOwner);
    const [ Editing, setEditing ] = useState(false);
    const [ NewNwteetText, setNewNwteetText ] = useState(props.Ntweet.text);
    const [ NewImageSrc, setNewImageSrc ] = useState("");
    const [ OriginFileName, setOriginFileName ] = useState("");
    const NewFileRef = useRef(null);

    useEffect(()=>{
        setNtweet(props.Ntweet);
    },[props.Ntweet]);

    const toggleEditing = () => {
        setEditing((prev)=>!prev);
    }
    const onClickDelete = async (e) => {
        const ok = window.confirm("정말로 삭제하시겠습니까?");
        if(!ok) return false;
        progressTweet(Ntweet.id, "delete");
    }

    const onClickPhotoDelete = async (e) => {
        console.log('delete');
        let ok = window.confirm('해당 파일을 삭제하시겠습니까?');
        if(!ok) return false;
        await progressTweet(Ntweet.id, "delete_photo");
        clearImage();
    }
    const progressTweet = async (ntweetId, type) => {
        try {
            if(!IsOwner){
                throw new Error("등록한 사용자가 아닙니다.");
            }
            const ntweetObject = new NtweetObject(Ntweet, Ntweet.creatorId);
            const ntweet = await ntweetObject.getNweetById(ntweetId);

            switch(type){
                case "delete_photo" :
                    ntweetObject.setAttachment('');
                    ntweetObject.setText(NewNwteetText);
                    await ntweetObject.deleteFile(Ntweet);
                    return await ntweetObject.updateNtweet(ntweet, ntweetObject.getObject());
                case "delete" : 
                    if(Ntweet.attachment){
                        await ntweetObject.deleteFile(Ntweet);
                    }
                    return ntweetObject.deleteNtweet(ntweet);
                case "update" :
                    let file = '';
                    if(NewFileRef.current){
                        file = NewFileRef.current.files[0];
                    }
                    let attachmentObject = Ntweet.attachment ? Ntweet.attachment : '';
                    if(file){
                        attachmentObject = await ntweetObject.uploadFile(file, NewImageSrc);
                    } 
                    ntweetObject.setAttachment(attachmentObject);
                    ntweetObject.setText(NewNwteetText);
                    return await ntweetObject.updateNtweet(ntweet,ntweetObject.getObject());
                default :
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
    const onSubmitHanlder = async (e) => {
        e.preventDefault();
        await progressTweet(Ntweet.id, "update");
        setEditing(false);
    }
    const onChangeHanlder = (e) => {
        const { target : {name, value, files }} = e;
        if(name === "ntweet"){
            setNewNwteetText(value);
        } else if( name === "tweet_image"){
            let file = files[0];
            imagePreview(file);
        }
    }
    const imagePreview = (file) => {
        let reader = new FileReader();
        let filename = file.name;
        reader.onloadend = () => {
            setNewImageSrc(reader.result);
            setOriginFileName(filename);
        }
        reader.readAsDataURL(file);
    }
    const clearImage = () => {
        setTimeout(()=>{
            if(NewFileRef.current){
                NewFileRef.current.value = null; 
            }
            setNewImageSrc("");
        },1000);
    }


    return (
        <>
        { Ntweet &&
            <div className="nweet">
                { Editing && IsOwner ? (
                    <>
                        <form onSubmit={onSubmitHanlder} className="container nweetEdit">
                            <input
                                value={NewNwteetText} 
                                onChange={onChangeHanlder}
                                name="ntweet"
                                type="text"
                                required
                                placeholder='Edit your ntweets'
                                className="formInput"
                            />
                            {
                                Ntweet.attachment ? (
                                <div>
                                    <img alt={OriginFileName} src={Ntweet.attachment.attachmentUrl} width={`50px`} height={`50px`}/>
                                    <button onClick={onClickPhotoDelete} className="formBtn">x</button>
                                </div>)
                                 :
                                (
                                <>
                                <input 
                                    type="file" 
                                    name="tweet_image"
                                    accept="image/*"
                                    onChange={onChangeHanlder}
                                    className="formInput"
                                    ref={NewFileRef}
                                />
                                    { NewImageSrc && 
                                        <div>
                                            <h4>{OriginFileName}</h4>
                                            <img src={NewImageSrc} alt={OriginFileName} width="50px" height="50px" />
                                            <button type='button' onClick={clearImage} className="formBtn">Clear</button>
                                        </div>
                                    }
                                </>
                                )
                            }
                            <button type='submit' className="formBtn">Update ntweet</button>
                        </form>
                        <button type='button' onClick={toggleEditing} className="formBtn cancelBtn">Cancle</button>
                    </>
                ) : (
                        <>
                        {
                            Ntweet.attachment && 
                            <div>
                                <img alt={OriginFileName} src={Ntweet.attachment.attachmentUrl} width={`50px`} height={`50px`}/>
                            </div>
                        }
                            <h4>{Ntweet.text}</h4>
                            {
                                IsOwner &&
                                <div className="nweet__actions">
                                    <span name="delete" value={Ntweet.id} onClick={onClickDelete}><FontAwesomeIcon icon={faTrash} /></span>
                                    <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt} /></span>
                                </div>
                            }
                        </>
                    )
                }
            </div>
        }
        </>
    );
}
export default Ntweet;
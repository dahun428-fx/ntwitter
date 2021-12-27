import React,{useEffect, useState} from 'react';
import { Modal, Button } from 'antd';

function Popup (props){

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
   
    useEffect(()=>{
        setVisible(props.visible);
    },[props.visible]);


    const handleOk = async (e) => {
        setConfirmLoading(true);
        let result = await onSubmitHanlderModal(e);
        setConfirmLoading(false);
        if(!result){
            handleCancel();
        }
    };
    
    const handleCancel = () => {
        return props.handleCancle();
    };
    const onChangeHanlder = (e) => {
        return props.onChangeHanlder(e);
    }
    const onSubmitHanlderModal = (e) => {
        return props.onSubmitHanlderModal(e);
    }

    return (
        <>
            <Modal
                title={props.title}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                maskClosable={false}
                onCancel={handleCancel}
            >
            <form onSubmit={onSubmitHanlderModal}>
                <p>해당 아이디의 유저가 제공업체에 연결합니다. 비밀번호를 입력해주세요</p>
                <p>userID : {props.userEmail}</p>
                <label>Password : </label>
                <input type="password" name="modalPwd" value={props.PromptUserPwd} onChange={onChangeHanlder}/>
            </form>
            {
                props.ModalError &&
                <div>{props.ModalErrorMsg}</div>
            }
            </Modal>
        </>
    );
}
export default Popup;
import { IonButton, IonHeader, IonLoading, IonPage, IonSpinner, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { adminSignIn, convertAndUploadMeal } from '../service/uploadMeal.service';
import * as XLSX from 'xlsx';
import './Upload.scss';

interface UploadProps {

}


/**
 * **식단 업로드 페이지**
 */
export const Upload: React.FC<UploadProps> = () => {

    const [present, dismiss] = useIonAlert()
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const [arrayForUpload, setArrayForUpload] = useState<any[][] | null>(null);

    const [sheetLoading, setSheetLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const [canUpload, setCanUpload] = useState(false);

    const history = useHistory();

    
    const checkPassword = async (password: string) => {
        setLoading(true);
        await dismiss();
        try {
            await adminSignIn(password);
            setCanUpload(true);
        } catch (errorName: string | any) {
            setLoading(false);
            present({
                mode: 'ios',
                header: '확인 실패',
                message: errorName,
                buttons: ['확인'],
                onDidDismiss: () => {
                    history.replace('/home')
                }
            })
        }
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            await present({
                mode: 'ios',
                header: '비밀번호 입력',
                inputs: [
                    {
                        name: 'password',
                        type: 'password',
                        placeholder: '비밀번호'
                    }
                ],
                buttons: [
                    {
                        text: '취소',
                        role: 'cancel',
                        handler: () => {
                            history.replace('/home')
                        }
                    },
                    { text: '완료', handler: async ({ password }) => { await checkPassword(password) } }
                ],
                backdropDismiss: false
            })
        })()
        return () => {
        }
    }, [])



    const convert = async (e: any) => {
        setSheetLoading(true)
        const input = e.target;
        const reader = new FileReader();
        reader.onload = async function () {
            const fileData = reader.result;
            const wb = XLSX.read(fileData, { type: 'binary' });
            const sheetNameList = wb.SheetNames; // 시트 이름 목록 가져오기
            const firstSheetName = sheetNameList[0]; // 첫번째 시트명
            setFileName(firstSheetName);
            const firstSheet = wb.Sheets[firstSheetName]; // 첫번째 시트
            const csv = XLSX.utils.sheet_to_csv(firstSheet);
            const forUpload = csv.split("\n").map(function (row) { return row.split(","); })
            setArrayForUpload(forUpload)
            setSheetLoading(false);
        };

        reader.readAsBinaryString(input.files[0]);
    }

    useEffect(() => {
        askUpload()
    }, [arrayForUpload])

    const askUpload = () => {
        if (!arrayForUpload) { return }
        if (!fileName) { return }

        present({
            mode: 'ios',
            header: '업로드',
            subHeader: fileName,
            message: '이 파일로 업로드 하시겠습니까?',
            buttons: [
                {
                    text: '취소',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: '확인',
                    handler: async () => {
                        setUploadLoading(true);
                        try {
                            await convertAndUploadMeal(arrayForUpload)
                            await sayUploadResult(true)
                        } catch (error) {
                            await sayUploadResult(false)
                        }
                    }
                }
            ]
        })
    }

    const sayUploadResult = async (result: boolean) => {
        setUploadLoading(false)
        await dismiss()
        if (result) {
            present({
                mode: 'ios',
                header: '업로드 성공',
                message: '업로드에 성공하였습니다.',
                buttons: [
                    {
                        text: '확인',
                        handler: () => {
                            history.replace('/home')
                        }
                    }
                ]
            })
        }
        else {
            present({
                mode: 'ios',
                header: '업로드 실패',
                message: '업로드에 실패하였습니다.',
                buttons: [
                    {
                        text: '확인',
                        handler: () => {
                            history.replace('/home')
                        }
                    }
                ]
            })
        }
    }


    return (
        <IonPage className="upload">
            <IonHeader mode='ios'>
                <IonToolbar>
                    <IonTitle>업로드</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div className='uploadContainer'>
                {canUpload ?
                    <div className='uploadContent'>
                        <div className='uploadTitle'>
                            <div>파일 선택</div>
                        </div>
                        {fileName ? <div className='uploadDescription' >{fileName}</div> : <div className='uploadDescription'>업로드할 파일을 선택해주세요.</div>}
                        <div className='uploadButton'>
                            <input type="file" id="file" accept=".xlsx" onChange={convert} ref={inputRef} style={{ display: 'none' }} />
                            <IonButton onClick={() => inputRef.current?.click()} mode='ios' disabled={sheetLoading}>{sheetLoading ? <IonSpinner></IonSpinner> : '파일 선택'}</IonButton>
                        </div>
                    </div>
                    :
                    null
                }
            </div>

            <IonLoading isOpen={loading} message={'로딩중...'} mode='ios' />
            <IonLoading isOpen={uploadLoading} message={'업로드 중...'} mode='ios' />
        </IonPage >
    );
}

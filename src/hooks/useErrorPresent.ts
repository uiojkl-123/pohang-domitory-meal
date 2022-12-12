import { useIonAlert } from "@ionic/react"

export const useErrorPresent = () => {
    const [present, dismissPresent] = useIonAlert();

    const presentError = (title: string, message: string) => present({
        header: title,
        message,
        buttons: [
            {
                text: '닫기',
                handler: () => {
                }
            }
        ]
    })

    return [presentError, dismissPresent];
}
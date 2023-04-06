import { View, Text } from "react-native"
import styleSheet from "./styleSheet"

interface NotificationFormProps {
    message: string
    type: "error" | "success"
    messageDefault?: string

}


export default function NotificationForm({ message, type, messageDefault }: NotificationFormProps) {
    return (

        message.length > 0 ?
            <View
                style={[styleSheet.container, type === "error" ? styleSheet.error : styleSheet.success]}
            >
                <Text
                    style={styleSheet.text}
                >{message}</Text>
            </View> : messageDefault ? <View
                style={styleSheet.container}
            >
                <Text
                    style={styleSheet.text}
                >{messageDefault}</Text>
            </View> : null


    )
}

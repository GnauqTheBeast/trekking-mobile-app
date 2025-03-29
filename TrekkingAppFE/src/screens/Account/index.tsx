import React from "react";
import { TouchableOpacity, View, Text } from "react-native"; // Sử dụng Text từ react-native
import styles from "./styles";
import TaskBar from "../../components/TaskBar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AccountStackParamList } from "../../navigation/main/AccountNavigator";

const AccountScreen: React.FC = () => {

    const navigation = useNavigation<StackNavigationProp<AccountStackParamList>>();

    return(
        <View style={styles.container}>
            <View style={styles.authContainer}>
                <TouchableOpacity>
                    <Text style={{ color: 'red', fontSize: 18 }} onPress={() => navigation.navigate('LoginScreen')}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={{ color: 'red', fontSize: 18 }} onPress={() => navigation.navigate('SignUpScreen')}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default AccountScreen;

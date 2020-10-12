import React from "react";
import { StatusBar, KeyboardAvoidingView, StyleSheet, Alert } from "react-native";
import DismissKeyboard from '../../../utils/dismissKeyboard';
import api from '../../../services/api';
import FormUser from '../../../components/Form User';

function NewUsers() {
    async function save(id, data) {        

        await api.post("/users", data)
        .then(function (response) {                
            Alert.alert('Prontinho', 'Usuário cadastrado com sucesso!');
        })
        .catch(function (error) {
            console.log(error)
            Alert.alert('Oops...', 'Houve um erro ao tentar cadastrar as informações, verifique se não há outro usuário com as mesmas informações');
        });
    }

    return(
        <DismissKeyboard>
            <KeyboardAvoidingView style={styles.main} behavior="padding" enabled>
                <StatusBar backgroundColor="#042963" barStyle="light-content"/>
                <FormUser onSubmit={save} user={''}/>
            </KeyboardAvoidingView>
        </DismissKeyboard>
    );
}

const styles = StyleSheet.create({
    loading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.10)',
        justifyContent: 'center',
        alignItems: 'center',
        

    },
    main: {
        flex: 1,
        backgroundColor: '#7c90b1',
        padding: 10
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: '#F1F1F1',
        alignSelf: 'stretch',
        marginTop: 5,
        fontSize: 16,
        borderWidth: 0
    },
    titleText: {
        fontSize: 16,
        color: '#999'
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10
    },
    cardBetween: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 15,
        height: 'auto',
        borderRadius: 4,
        backgroundColor: '#FFF',
        marginRight: 5,
        marginLeft: 5
    },
    card: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
        height: 'auto',
        borderRadius: 4,
        backgroundColor: '#FFF',
        marginRight: 5,
        marginLeft: 5
    },
    cardDisabled: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
        height: 'auto',
        borderRadius: 4,
        backgroundColor: '#CCC',
        marginRight: 5,
        marginLeft: 5
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#042963',
        alignSelf: 'stretch',
        marginTop: 10,
        flex: 1,
        marginRight: 5,
        marginLeft: 5,
        marginBottom: 15
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginRight: 5
    },
});

export default NewUsers;
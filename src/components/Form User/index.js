import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Select2 from "react-native-select-two";
import api from '../../services/api';

function FormUser({ onSubmit, user, navigation }) {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [functionUser, setFunctionUser] = useState('');
    const [campus, setCampus] = useState('');

    const [campuses, setCampuses] = useState([]);
    const [functions, setFunctions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        defineFunctions();
        defineCampuses();
    }, []);

    useEffect(() => {
        if(user){
            setEmail(user.email);
            setUsername(user.username);
            setFullname(user.fullname);
            setCampus(user.campus.id);
        }
    }, [campuses])

    async function defineCampuses() {
        await api.get("/campuses")
        .then(response => {
            const array = response.data;
            array.forEach(campus => {
                campus["name"] = campus["city"];
                if(user) {
                    if(campus["id"] == user.campus.id) {
                        campus["checked"] = true
                    }
                }
            });
            setCampuses(array); 
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Oops', 'Houve um erro ao recuperar a lista de campus')
        });  
    }

    function defineFunctions(){
        setFunctions([{ id: "adm", name: "Administrador", checked: user?.function == 'adm' ? true : false }, { id: "user", name: "Usuário", checked: user?.function == 'user' ? true : false}]);
        setFunctionUser(user ? user.function == 'adm' ? 'adm' : 'user' : '')
    }

    function save() {    
        if(!email) { Alert.alert('Campo obrigatório', 'O campo email deve ser preenchido'); return }
        if(!fullname) { Alert.alert('Campo obrigatório', 'O campo nome completo deve ser preenchido'); return }
        if(!username) { Alert.alert('Campo obrigatório', 'O campo nome de usuário deve ser preenchido'); return }
        if(!password) { Alert.alert('Campo obrigatório', 'O campo senha deve ser preenchido'); return }
        if(!functionUser) { Alert.alert('Campo obrigatório', 'O campo função deve ser preenchido'); return }
        if(!campus) { Alert.alert('Campo obrigatório', 'O campo campus deve ser preenchido'); return }

        setIsLoading(true);
        onSubmit(user.id, {
            username,
            password,
            email,
            fullname,
            function: functionUser,
            status: 'Ativo',
            campus_id: campus,                
        })
        .then(function (response) {
            clear()
            setIsLoading(false);   
            if(navigation) { navigation.navigate('ViewUsers') }
            Alert.alert('Prontinho', 'Usuário salvo com sucesso!');
        })
        .catch(function (error) {
            setIsLoading(false); 
            console.log(error)
            if(error?.response?.data?.error) { Alert.alert('Oops...', error.response.data.error) }
            else { Alert.alert('Oops...', 'Houve um erro ao tentar cadastrar as informações') }
        });
    }

    function clear() {
        setEmail('');
        setFullname('');
        setUsername('');
        setPassword('');
        setCampus('');
        setFunctionUser([]);

        defineCampuses()
        defineFunctions()
    }

    return(
        <KeyboardAwareScrollView>
            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>Nome completo *</Text>
                    <TextInput 
                        keyboardType="default" 
                        style={styles.input} 
                        placeholder="Nome completo"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>Nome de usuário *</Text>
                    <TextInput 
                        autoCapitalize={false}
                        keyboardType="default" 
                        style={styles.input} 
                        placeholder="Nome de usuário"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>E-mail *</Text>
                    <TextInput 
                        autoCapitalize={false}
                        keyboardType="email-address" 
                        style={styles.input} 
                        placeholder="E-mail"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>Senha *</Text>
                    <TextInput 
                        autoCapitalize="none" 
                        autoCorrect={false} 
                        secureTextEntry 
                        style={styles.input} 
                        placeholder="Senha"
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>Função *</Text>
                    <Select2
                        isSelectSingle
                        style={styles.input}
                        colorTheme="blue"
                        popupTitle="Selecione uma função"
                        searchPlaceHolderText="Pesquisar"
                        title="Função"
                        data={functions}
                        onSelect={data => {
                            setFunctionUser(data[0]);                                         
                        }}
                        cancelButtonText="Cancelar"
                        selectButtonText="Selecionar"
                        listEmptyTitle="Não há nada aqui"
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.card}>
                    <Text style={styles.titleText}>Campus *</Text>
                    <Select2
                        isSelectSingle
                        style={styles.input}
                        colorTheme="blue"
                        popupTitle="Selecione um campus"
                        searchPlaceHolderText="Pesquisar"
                        title="Campus"
                        data={campuses}
                        onSelect={data => {
                            setCampus(data[0]);                                         
                        }}
                        cancelButtonText="Cancelar"
                        selectButtonText="Selecionar"
                        listEmptyTitle="Não há nada aqui"
                    />
                </View>
            </View>

            <TouchableOpacity onPress={save} style={styles.button}>
                <Text style={styles.buttonText}>Salvar</Text>
                <ActivityIndicator animating={isLoading} size="small" color="#FFF" />   
            </TouchableOpacity>
            
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    loading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.10)',
        justifyContent: 'center',
        alignItems: 'center',   
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

export default FormUser;
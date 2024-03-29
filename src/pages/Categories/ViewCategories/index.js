import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, View, StyleSheet, RefreshControl } from 'react-native';
import api from '../../../services/api';
import { FlatList } from 'react-native';
import { Text } from 'react-native';
import CardCategory from '../../../components/CardCategory';
import { Modalize } from 'react-native-modalize';
import { NavigationEvents } from 'react-navigation';

function ViewCategories({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false);
    const modalizeRef = useRef(null);

    const onRefresh = useCallback(() => {
        retrieveCategories();
    }, [isRefreshing]);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const closeModal = () => {
        modalizeRef.current?.close();
    };

    useEffect(() => {
        retrieveCategories();
    }, [category]);

    async function retrieveCategories() {
        setIsRefreshing(true);   
        setIsLoading(true)
        await api.get("/categories")
        .then(function (response) {
            setIsLoading(false);  
            setIsRefreshing(false);  
            setCategories(response.data);
        })
        .catch(function (error) {
            setIsLoading(false);  
            setIsRefreshing(false);     
            console.log(error)
            Alert.alert('Oops...', 'Houve um erro ao tentar visualizar as informações');
        });
    }  

    async function deleteCategory(id) {
        setIsDeleting(true)
        await api.delete(`/categories/${id}`)
        .then(function (response) {
            setIsDeleting(false)
            setCategory({})
            Alert.alert('Prontinho', 'Ano deletado com sucesso');
            closeModal()
        })
        .catch(function (error) {
            setIsDeleting(false)
            console.log(error)
            Alert.alert('Oops...', 'Houve um tentar deletar as informações, tente novamente!');
        });
    }

    async function restoreCategory(id) {
        setIsDeleting(true)
        await api.post(`/categories/restore/${id}`)
        .then(function (response) {
            setIsDeleting(false)
            setCategory({})
            Alert.alert('Prontinho', 'Ano restaurado com sucesso');
            closeModal()
        })
        .catch(function (error) {
            setIsDeleting(false)
            console.log(error)
            Alert.alert('Oops...', 'Houve um tentar restaurar as informações, tente novamente!');
        });
    }

    function renderCard({ item }) {
        return(
            <CardCategory isOnModal={false} onOpen={onOpen} item={item} setItem={setCategory}/>
        )
    }

    return(
        <View style={styles.main}>
            <NavigationEvents onDidFocus={payload => retrieveCategories()} />
            <FlatList 
                style={styles.pdTop20}
                contentContainerStyle={styles.mh20}
                data={categories}
                renderItem={renderCard}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.txtNothing}>Nenhum ano cadastrado</Text>
                    </View>
                }
                keyExtractor={(item, index) => index.toString()}
                refreshControl={ <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
            />
            <Modalize modalTopOffset={200} ref={modalizeRef}>
                <CardCategory navigation={navigation} isOnModal={true} onOpen={onOpen} item={category} setItem={setCategory} deleteCategory={deleteCategory} isDeleting={isDeleting} restoreCategory={restoreCategory}/>
            </Modalize>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1, 
        backgroundColor: '#F0F0F0'
    },
    pdTop20: {
        paddingTop: 20
    },
    mh20: {
        paddingHorizontal: 20
    },
    center: { 
        flex: 1,
        paddingTop: 50,
        alignItems: 'center', 
    },
    txtNothing: { 
        color: '#777', 
        fontSize: 16, 
        fontWeight: '500' 
    }
});

export default ViewCategories;
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';


export default function UsuarioList({ navigation }) {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'usuarios'), snapshot => {
            const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(lista);
        });

        return () => unsubscribe();
    }, []);

    const removerUsuario = async (id) => {
        await deleteDoc(doc(db, 'usuarios', id));
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Novo Usuário" onPress={() => navigation.navigate('Novo Usuário')} />
            <Button title="Sair" color="red" onPress={() => signOut(auth)} />
            <FlatList
                data={usuarios}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginVertical: 10 }}>
                        <Text>{item.nome} - {item.email}</Text>
                        <Button title="Editar" onPress={() => navigation.navigate('Novo Usuário', { usuario: item })} />
                        <Button title="Tarefas" onPress={() => navigation.navigate('Tarefas', { usuarioId: item.id })} />
                        <Button title="Excluir" onPress={() => removerUsuario(item.id)} />
                    </View>
                )}
            />
        </View>
    );
}

import {useState, useEffect} from 'react';
import {View, Text, Flatlist, Button, TouchableOpacity} from 'react-native';
import {listarPendentes, listarConcluidas} from '../../backend/entregas';

export default function ListaEntregaScreen({route, navigation}) {

    //o route.params traz o que  a tela de login enviou no navigation.navigate
    const {entregadorId} = route.params;

    //Cada lista fica no seu próprio estado -- elas começam vazias
    const [pendentes, setPendentes] = useState([]);
    const [concluidas, setConcluidas] = useState([]);

    // Função que busca as duas listas (pendencia e conclusao) no Supabase e atualiza a tela

    async function carregarEntregas() {
        try{
            const listaPendentes = await listarPendentes(entregadorId);
            const listaConcluidas = await listarConcluidas(entregadorId);
            setPendentes(listaPendentes);
            setConcluidas(listaConcluidas);
        } catch (err) {
            console.log('Erro ao carregar entregas', err.message);
        }
    }
    useEffect(() => {
        //o useefecct roda automaticamente o carregarEntregas quando a tela abre
        carregarEntregas();
    }, []);

     return (
    <View style={{ padding: 20 }}>
      <Button
        title="Nova Entrega"
        onPress={() => navigation.navigate('FormularioEntrega', { entregadorId })}
      />
 
      <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Pendentes</Text>
      <FlatList
        data={pendentes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetalheEntrega', { entregaId: item.id })}
          >
            <Text>{item.codigo_pacote} - {item.destinatario_nome} - {item.status}</Text>
          </TouchableOpacity>
        )}
      />
 
      <Text style={{ fontWeight: 'bold', marginTop: 20 }}>Concluídas</Text>
      <FlatList
        data={concluidas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('DetalheEntrega', { entregaId: item.id })}
          >
            <Text>{item.codigo_pacote} - {item.destinatario_nome} - {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
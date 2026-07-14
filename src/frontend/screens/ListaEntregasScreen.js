import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { listarPendentes, listarConcluidas } from '../../backend/entregas';

export default function ListaEntregasScreen({ route, navigation }) {
  // o route.params traz o que a tela de login enviou no navigation.navigate
  const { entregadorId } = route.params;

  // Cada lista fica no seu próprio estado -- elas começam vazias
  const [pendentes, setPendentes] = useState([]);
  const [concluidas, setConcluidas] = useState([]);

  // Estados de carregamento e erro -- controlam o que aparece na tela
  // enquanto os dados ainda não chegaram ou quando algo dá errado
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Função que busca as duas listas (pendencia e conclusao) no Supabase e atualiza a tela
  async function carregarEntregas() {
    setCarregando(true);
    setErro(null);
    try {
      const listaPendentes = await listarPendentes(entregadorId);
      const listaConcluidas = await listarConcluidas(entregadorId);
      setPendentes(listaPendentes);
      setConcluidas(listaConcluidas);
    } catch (err) {
      console.log('Erro ao carregar entregas', err.message);
      setErro('Não foi possível carregar as entregas. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }

  // useFocusEffect roda toda vez que a tela ganha foco -- diferente do useEffect,
  // que só roda uma vez quando a tela é montada. Isso garante que, ao voltar
  // de "Nova Entrega" ou do "Detalhe", a lista já vem atualizada.
  useFocusEffect(
    useCallback(() => {
      carregarEntregas();
    }, [entregadorId])
  );

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('DetalheEntrega', { entrega: item })}
      >
        <Text style={styles.itemTitulo}>{item.codigo_pacote} — {item.destinatario_nome}</Text>
        <Text style={styles.itemStatus}>{item.status}</Text>
      </TouchableOpacity>
    );
  }

  // --- Estado de carregamento: mostra um spinner enquanto busca os dados ---
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Carregando entregas...</Text>
      </View>
    );
  }

  // --- Estado de erro: mostra a mensagem e um botão pra tentar de novo ---
  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erroTexto}>{erro}</Text>
        <Button title="Tentar novamente" onPress={carregarEntregas} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title="Nova Entrega"
        onPress={() => navigation.navigate('FormularioEntrega', { entregadorId })}
      />

      <Text style={styles.secao}>Pendentes</Text>
      {pendentes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma entrega pendente.</Text>
      ) : (
        <FlatList
          data={pendentes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}

      <Text style={styles.secao}>Concluídas</Text>
      {concluidas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma entrega concluída ainda.</Text>
      ) : (
        <FlatList
          data={concluidas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  secao: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  vazio: {
    color: '#777',
    fontStyle: 'italic',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitulo: {
    fontSize: 15,
  },
  itemStatus: {
    color: '#555',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  erroTexto: {
    color: '#b00020',
    textAlign: 'center',
    marginBottom: 12,
  },
});

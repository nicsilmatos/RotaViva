import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../../backend/supabase';
import { criarPerfilEntregador, getPerfilEntregador } from '../../backend/entregadores';

export default function LoginScreen({ navigation }) {
  // Estados: guardam o que o usuário digita nos campos
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [identificacao, setIdentificacao] = useState('');
  const [modoCadastro, setModoCadastro] = useState(false); // alterna entre Login e Cadastro

  async function handleEntrar() {
    try {
      // Autentica com email/senha no Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      // Se a senha/email estiverem errados, o Supabase devolve error aqui
      if (error) throw error;

      // Login OK -> busca o perfil (nome, identificacao, role) de quem acabou de logar
      const perfil = await getPerfilEntregador();

      // Leva para a lista de entregas, passando quem é o entregador e seu papel
      navigation.navigate('ListaEntregas', {
        entregadorId: perfil.id,
        role: perfil.role,
      });
    } catch (err) {
      Alert.alert('Erro ao entrar', err.message);
    }
  }

  async function handleCadastrar() {
    try {
      // Cria o usuário no sistema de autenticação do Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: senha,
      });

      // Se o cadastro falhar (email já existe, senha fraca, etc.)
      if (error) throw error;

      // Usa o id gerado pelo Auth para criar o perfil na tabela 'entregadores'
      const perfil = await criarPerfilEntregador(data.user.id, nome, identificacao);

      // Leva para a lista de entregas, com o perfil recém-criado
      navigation.navigate('ListaEntregas', {
        entregadorId: perfil.id,
        role: perfil.role,
      });
    } catch (err) {
      Alert.alert('Erro ao cadastrar', err.message);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{modoCadastro ? 'Cadastro' : 'Login'}</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      {modoCadastro && (
        <>
          <TextInput placeholder="Nome" value={nome} onChangeText={setNome} />
          <TextInput placeholder="Identificação" value={identificacao} onChangeText={setIdentificacao} />
        </>
      )}

      <Button
        title={modoCadastro ? 'Cadastrar' : 'Entrar'}
        onPress={modoCadastro ? handleCadastrar : handleEntrar}
      />
      <Button
        title={modoCadastro ? 'Já tenho conta' : 'Criar conta'}
        onPress={() => setModoCadastro(!modoCadastro)}
      />
    </View>
  );
}
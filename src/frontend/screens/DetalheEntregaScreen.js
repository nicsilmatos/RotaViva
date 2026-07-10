import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

/**
 * DetalheEntregaScreen — tela que exibe todos os dados completos de uma entrega.
 *
 * Recebe o objeto `entrega` via navegação (route.params.entrega).
 * Mostra:
 *  - Código do pacote, destinatário, endereço
 *  - Status atual (pendente / entregue / falha)
 *  - Foto do comprovante (se disponível) — usa a URL salva no banco
 *  - Coordenadas de GPS (latitude / longitude)
 *  - Datas de criação e registro
 *
 * ATENÇÃO: Esta tela é um esqueleto funcional mínimo para viabilizar
 * a navegação lista → detalhe. A implementação completa com:
 *  - Atualização de status (pendente → entregue / falha)
 *  - Botão de re-tirar foto
 *  - Mapa mostrando a localização
 * Fica a cargo da pessoa responsável pelo item 5 do escopo.
 */

// Mapa de cores e rótulos para cada status (mesmo padrão do CardEntrega)
const STATUS_CONFIG = {
  pendente: { label: 'Pendente', cor: '#f59e0b' },
  entregue: { label: 'Entregue', cor: '#16a34a' },
  falha:    { label: 'Falha',    cor: '#dc2626' },
};

function formatarData(dataISO) {
  if (!dataISO) return '—';
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
}

export default function DetalheEntregaScreen({ route }) {
  // Pega a entrega passada como parâmetro pela tela de listagem
  const { entrega } = route.params;

  // Configuração visual baseada no status atual
  const config = STATUS_CONFIG[entrega.status] || STATUS_CONFIG.pendente;

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho com código do pacote e status */}
      <View style={styles.header}>
        <Text style={styles.codigo}>{entrega.codigo_pacote}</Text>
        <Text style={[styles.statusBadge, { color: config.cor }]}>
          {config.label}
        </Text>
      </View>

      {/* Se houver foto do comprovante, exibe em destaque */}
      {entrega.foto_url ? (
        <Image
          source={{ uri: entrega.foto_url }}
          style={styles.foto}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.semFoto}>
          <Text style={styles.semFotoTexto}>Sem foto de comprovante</Text>
        </View>
      )}

      {/* Bloco de informações principais */}
      <View style={styles.blocoInfo}>
        <InfoLinha label="Destinatário" valor={entrega.destinatario_nome} />
        <InfoLinha label="Endereço"     valor={entrega.endereco} />
        <InfoLinha label="Latitude"     valor={entrega.latitude?.toString()} />
        <InfoLinha label="Longitude"    valor={entrega.longitude?.toString()} />
        <InfoLinha label="Criado em"    valor={formatarData(entrega.criado_em)} />
        <InfoLinha label="Registrado em" valor={formatarData(entrega.registrado_em)} />
      </View>
    </ScrollView>
  );
}

/**
 * Subcomponente simples para exibir uma linha de label + valor.
 * Usado dentro do bloco de informações do detalhe.
 */
function InfoLinha({ label, valor }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  codigo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    fontSize: 15,
    fontWeight: '600',
  },
  foto: {
    width: '100%',
    height: 280,
    backgroundColor: '#e2e8f0',
  },
  semFoto: {
    width: '100%',
    height: 200,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semFotoTexto: {
    color: '#94a3b8',
    fontSize: 14,
  },
  blocoInfo: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    // Sombra (mesmo padrão do card da listagem)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  linha: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    width: 120,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  valor: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
});

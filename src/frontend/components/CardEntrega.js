import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

/**
 * CardEntrega — componente reutilizável que representa uma entrega na lista.
 * Usado tanto na aba "Pendentes" quanto no "Histórico".
 *
 * Mostra:
 *  - Código do pacote
 *  - Nome do destinatário
 *  - Endereço
 *  - Status (com cor diferente para cada estado)
 *  - Foto miniatura (se houver)
 *  - Data/hora de registro (se já finalizada)
 *
 * @param {object} entrega  - Objeto com os dados da entrega (vindo do banco)
 * @param {function} onPress - Callback chamado ao tocar no card (navega pro detalhe)
 */

// Mapa de cores e rótulos para cada status possível da entrega
const STATUS_CONFIG = {
  pendente: { label: 'Pendente', cor: '#f59e0b', fundo: '#fef3c7' },    // Amarelo — aguardando
  entregue: { label: 'Entregue', cor: '#16a34a', fundo: '#dcfce7' },     // Verde — sucesso
  falha:    { label: 'Falha',    cor: '#dc2626', fundo: '#fee2e2' },     // Vermelho — problema
};

/**
 * Formata uma data ISO (ex: 2026-07-09T10:30:00) para o padrão
 * brasileiro legível: "09/07/2026 às 10:30".
 */
function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}

export default function CardEntrega({ entrega, onPress }) {
  // Pega a configuração visual do status atual (fallback para pendente se vier algo inesperado)
  const configStatus = STATUS_CONFIG[entrega.status] || STATUS_CONFIG.pendente;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(entrega)}  // Chama a navegação passando a entrega clicada
      activeOpacity={0.7}  // Efeito de opacidade ao tocar (feedback visual)
    >
      {/* Miniatura da foto do comprovante (se existir) */}
      {entrega.foto_url && (
        <Image
          source={{ uri: entrega.foto_url }}
          style={styles.miniatura}
          resizeMode="cover"
        />
      )}

      {/* Informações textuais da entrega */}
      <View style={styles.info}>
        {/* Código do pacote em destaque — principal identificador da entrega */}
        <Text style={styles.codigo} numberOfLines={1}>
          {entrega.codigo_pacote}
        </Text>

        {/* Nome do destinatário */}
        <Text style={styles.texto} numberOfLines={1}>
          {entrega.destinatario_nome}
        </Text>

        {/* Endereço de entrega */}
        <Text style={styles.endereco} numberOfLines={2}>
          {entrega.endereco}
        </Text>

        {/* Data de registro — aparece apenas se a entrega já foi finalizada */}
        {entrega.registrado_em && (
          <Text style={styles.data}>
            {formatarData(entrega.registrado_em)}
          </Text>
        )}
      </View>

      {/* Badge de status: cor de fundo e texto variam conforme o estado */}
      <View style={[styles.badge, { backgroundColor: configStatus.fundo }]}>
        <Text style={[styles.badgeTexto, { color: configStatus.cor }]}>
          {configStatus.label}
        </Text>
      </View>

      {/* Seta indicando que o card é clicável (navega para o detalhe) */}
      <Text style={styles.seta}>{'>'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',         // Organiza os elementos em linha (foto | info | badge | seta)
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,             // Cantos arredondados (padrão material design)
    padding: 14,
    marginHorizontal: 16,         // Espaçamento lateral
    marginVertical: 5,            // Espaçamento entre cards
    // Sombra para dar profundidade ao card (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,                 // Elevação no Android (equivale à sombra)
  },
  miniatura: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#e2e8f0',   // Cor de fundo enquanto a imagem não carrega
  },
  info: {
    flex: 1,                      // Ocupa o espaço disponível entre a miniatura e o badge
    marginRight: 8,
  },
  codigo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',             // Slate escuro — contraste alto para leitura
    marginBottom: 2,
  },
  texto: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 2,
  },
  endereco: {
    fontSize: 12,
    color: '#64748b',             // Cinza mais claro para informação secundária
    marginBottom: 2,
  },
  data: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,             // Formato de pílula (totalmente arredondado)
    marginLeft: 4,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  seta: {
    fontSize: 18,
    color: '#cbd5e1',
    marginLeft: 8,
  },
});

// src/screens/ItemDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarDoacao } from '../services/doacoesService';

const STATUS_COLOR = {
  disponivel: '#40916C',
  reservado: '#E9A900',
  entregue: '#aaa',
};

const STATUS_LABEL = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  entregue: 'Entregue',
};

const CATEGORIAS_ICON = {
  Roupas: 'shirt-outline',
  Alimentos: 'nutrition-outline',
  Móveis: 'bed-outline',
  Brinquedos: 'game-controller-outline',
  Eletrônicos: 'phone-portrait-outline',
  Livros: 'book-outline',
  Outros: 'cube-outline',
};

export default function ItemDetailScreen({ route }) {
  const { id } = route.params;
  const [doacao, setDoacao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDoacao(id)
      .then(setDoacao)
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar os detalhes.'))
      .finally(() => setLoading(false));
  }, [id]);

  const entrarContato = () => {
    if (!doacao?.contato) return;
    const numero = doacao.contato.replace(/\D/g, '');
    const url = `https://wa.me/55${numero}?text=Olá! Vi seu anúncio no DoaFácil e tenho interesse no item: ${doacao.titulo}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.')
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  if (!doacao) {
    return (
      <View style={styles.center}>
        <Text style={styles.erroText}>Item não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Ícone da categoria */}
      <View style={styles.iconWrapper}>
        <Ionicons
          name={CATEGORIAS_ICON[doacao.categoria] || 'cube-outline'}
          size={56}
          color="#40916C"
        />
      </View>

      {/* Título e status */}
      <Text style={styles.titulo}>{doacao.titulo}</Text>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[doacao.status] + '22' }]}>
        <Text style={[styles.statusText, { color: STATUS_COLOR[doacao.status] }]}>
          {STATUS_LABEL[doacao.status]}
        </Text>
      </View>

      {/* Informações */}
      <View style={styles.infoCard}>
        <InfoRow icon="pricetag-outline" label="Categoria" value={doacao.categoria} />
        <InfoRow icon="location-outline" label="Bairro" value={doacao.bairro || 'Não informado'} />
        <InfoRow
          icon="calendar-outline"
          label="Publicado em"
          value={
            doacao.criadoEm?.toDate
              ? doacao.criadoEm.toDate().toLocaleDateString('pt-BR')
              : 'Data desconhecida'
          }
        />
      </View>

      {/* Descrição */}
      {doacao.descricao ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descricao}>{doacao.descricao}</Text>
        </View>
      ) : null}

      {/* Condição do item */}
      {doacao.condicao ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condição do item</Text>
          <Text style={styles.descricao}>{doacao.condicao}</Text>
        </View>
      ) : null}

      {/* Botão de contato */}
      {doacao.contato && doacao.status === 'disponivel' ? (
        <TouchableOpacity style={styles.btnContato} onPress={entrarContato}>
          <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          <Text style={styles.btnContatoText}>Entrar em contato via WhatsApp</Text>
        </TouchableOpacity>
      ) : null}

      {doacao.status !== 'disponivel' && (
        <View style={styles.avisoIndisponivel}>
          <Ionicons name="information-circle-outline" size={18} color="#888" />
          <Text style={styles.avisoText}>Este item não está mais disponível.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color="#40916C" style={{ marginRight: 8 }} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F0' },
  content: { padding: 24, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B4332',
    textAlign: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 20,
  },
  statusText: { fontSize: 13, fontWeight: '700' },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  infoLabel: { color: '#888', fontSize: 13, marginRight: 6 },
  infoValue: { color: '#1B4332', fontWeight: '600', fontSize: 13, flex: 1 },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#40916C', marginBottom: 8 },
  descricao: { fontSize: 14, color: '#444', lineHeight: 20 },
  btnContato: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 10,
  },
  btnContatoText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  avisoIndisponivel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  avisoText: { color: '#888', fontSize: 13 },
  erroText: { color: '#c0392b', fontSize: 15 },
});

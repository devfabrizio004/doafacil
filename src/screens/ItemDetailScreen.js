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

const CATEGORIAS_ICON = {
  Roupas: 'shirt-outline',
  Alimentos: 'nutrition-outline',
  Móveis: 'bed-outline',
  Brinquedos: 'game-controller-outline',
  Eletrônicos: 'phone-portrait-outline',
  Livros: 'book-outline',
  Outros: 'cube-outline',
};

const CATEGORIA_COR = {
  Roupas: '#7C5CBF',
  Alimentos: '#2D9B6E',
  Móveis: '#C07830',
  Brinquedos: '#D64B8A',
  Eletrônicos: '#2A7FBF',
  Livros: '#C0522A',
  Outros: '#5A7A8A',
};

const STATUS_CONFIG = {
  disponivel: { cor: '#1B8A57', bg: '#E6F7EF', label: 'Disponível',  icone: 'checkmark-circle' },
  reservado:  { cor: '#C07000', bg: '#FFF4DC', label: 'Reservado',   icone: 'time' },
  entregue:   { cor: '#888',    bg: '#F0F0F0', label: 'Entregue',    icone: 'archive' },
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
    Linking.openURL(url).catch(() => Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.'));
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
        <Ionicons name="search-outline" size={48} color="#ccc" />
        <Text style={styles.erroText}>Item não encontrado.</Text>
      </View>
    );
  }

  const status = STATUS_CONFIG[doacao.status] || STATUS_CONFIG.disponivel;
  const corCategoria = CATEGORIA_COR[doacao.categoria] || '#5A7A8A';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Hero do item */}
      <View style={[styles.hero, { backgroundColor: corCategoria + '15' }]}>
        <View style={[styles.heroIcone, { backgroundColor: corCategoria + '25' }]}>
          <Ionicons name={CATEGORIAS_ICON[doacao.categoria] || 'cube-outline'} size={56} color={corCategoria} />
        </View>
        <Text style={styles.heroTitulo}>{doacao.titulo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icone} size={14} color={status.cor} />
          <Text style={[styles.statusText, { color: status.cor }]}>{status.label}</Text>
        </View>
      </View>

      {/* Informações */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>Informações</Text>
        <InfoRow icon="pricetag-outline" iconColor={corCategoria} label="Categoria" value={doacao.categoria} />
        {doacao.condicao ? (
          <InfoRow icon="star-outline" iconColor="#E9A900" label="Condição" value={doacao.condicao} />
        ) : null}
        <InfoRow
          icon="location-outline"
          iconColor="#E05C5C"
          label="Bairro"
          value={doacao.bairro || 'Não informado'}
        />
        <InfoRow
          icon="calendar-outline"
          iconColor="#888"
          label="Publicado em"
          value={
            doacao.criadoEm?.toDate
              ? doacao.criadoEm.toDate().toLocaleDateString('pt-BR')
              : 'Data desconhecida'
          }
          ultimo
        />
      </View>

      {/* Descrição */}
      {doacao.descricao ? (
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Descrição</Text>
          <Text style={styles.descricao}>{doacao.descricao}</Text>
        </View>
      ) : null}

      {/* Botão WhatsApp */}
      {doacao.contato && doacao.status === 'disponivel' ? (
        <TouchableOpacity style={styles.btnWhatsapp} onPress={entrarContato} activeOpacity={0.85}>
          <View style={styles.btnWhatsappIcone}>
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.btnWhatsappLabel}>Tenho interesse!</Text>
            <Text style={styles.btnWhatsappSub}>Abrir conversa no WhatsApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ) : null}

      {doacao.status !== 'disponivel' && (
        <View style={styles.avisoIndisponivel}>
          <Ionicons name="information-circle-outline" size={20} color="#888" />
          <Text style={styles.avisoText}>Este item não está mais disponível para doação.</Text>
        </View>
      )}

    </ScrollView>
  );
}

function InfoRow({ icon, iconColor, label, value, ultimo }) {
  return (
    <View style={[styles.infoRow, ultimo && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }]}>
      <View style={[styles.infoIcone, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F5F0' },

  hero: {
    borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 14,
  },
  heroIcone: {
    width: 100, height: 100, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  heroTitulo: {
    fontSize: 22, fontWeight: '800', color: '#1A2E22',
    textAlign: 'center', marginBottom: 12, lineHeight: 28,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
  },
  statusText: { fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: '#fff', borderRadius: 18,
    padding: 16, marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
  },
  cardTitulo: {
    fontSize: 12, fontWeight: '800', color: '#999',
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 12, marginBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  infoIcone: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  infoLabel: { fontSize: 11, color: '#aaa', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, color: '#1A2E22', fontWeight: '700' },

  descricao: { fontSize: 14, color: '#555', lineHeight: 22 },

  btnWhatsapp: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#25D366',
    borderRadius: 18, padding: 16,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnWhatsappIcone: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  btnWhatsappLabel: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnWhatsappSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },

  avisoIndisponivel: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14,
  },
  avisoText: { color: '#888', fontSize: 13, flex: 1 },

  erroText: { color: '#aaa', fontSize: 15, marginTop: 12 },
});
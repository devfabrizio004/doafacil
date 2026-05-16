// src/screens/FeedScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarDoacoes } from '../services/doacoesService';

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
  disponivel: { cor: '#1B8A57', bg: '#E6F7EF', label: 'Disponível', icone: 'checkmark-circle' },
  reservado:  { cor: '#C07000', bg: '#FFF4DC', label: 'Reservado',  icone: 'time' },
  entregue:   { cor: '#888',    bg: '#F0F0F0', label: 'Entregue',   icone: 'archive' },
};

export default function FeedScreen({ navigation }) {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState(null);

  const carregar = async () => {
    try {
      setErro(null);
      const dados = await listarDoacoes();
      setDoacoes(dados);
    } catch (e) {
      setErro('Erro ao carregar doações. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregar();
  };

  const renderItem = ({ item, index }) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.disponivel;
    const corCategoria = CATEGORIA_COR[item.categoria] || '#5A7A8A';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
        activeOpacity={0.88}
      >
        {/* Faixa lateral colorida por categoria */}
        <View style={[styles.cardAccent, { backgroundColor: corCategoria }]} />

        <View style={styles.cardBody}>
          {/* Ícone + info */}
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: corCategoria + '18' }]}>
              <Ionicons
                name={CATEGORIAS_ICON[item.categoria] || 'cube-outline'}
                size={26}
                color={corCategoria}
              />
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
              <View style={styles.cardMeta}>
                <Text style={[styles.cardCategoria, { color: corCategoria }]}>
                  {item.categoria}
                </Text>
                {item.bairro ? (
                  <>
                    <Text style={styles.separador}>·</Text>
                    <Ionicons name="location-outline" size={11} color="#999" />
                    <Text style={styles.cardLocal} numberOfLines={1}>{item.bairro}</Text>
                  </>
                ) : null}
              </View>
            </View>

            {/* Badge de status */}
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icone} size={11} color={status.cor} />
              <Text style={[styles.statusText, { color: status.cor }]}>{status.label}</Text>
            </View>
          </View>

          {/* Descrição */}
          {item.descricao ? (
            <Text style={styles.cardDescricao} numberOfLines={2}>{item.descricao}</Text>
          ) : null}

          {/* Rodapé */}
          <View style={styles.cardFooter}>
            <Text style={styles.cardVerMais}>Ver detalhes</Text>
            <Ionicons name="chevron-forward" size={14} color="#40916C" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.listHeaderLeft}>
        <Text style={styles.listHeaderCount}>{doacoes.length}</Text>
        <Text style={styles.listHeaderLabel}>
          {doacoes.length === 1 ? 'doação disponível' : 'doações disponíveis'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#40916C" />
        <Text style={styles.loadingText}>Carregando doações...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <View style={styles.erroIcone}>
          <Ionicons name="cloud-offline-outline" size={40} color="#40916C" />
        </View>
        <Text style={styles.erroTitulo}>Sem conexão</Text>
        <Text style={styles.erroText}>{erro}</Text>
        <TouchableOpacity style={styles.btnRecarregar} onPress={carregar}>
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.btnRecarregarText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (doacoes.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.emptyIcone}>
          <Ionicons name="heart-outline" size={48} color="#40916C" />
        </View>
        <Text style={styles.emptyTitulo}>Nenhuma doação ainda</Text>
        <Text style={styles.emptySubText}>Seja o primeiro a fazer a diferença!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#40916C']} tintColor="#40916C" />
        }
        ListHeaderComponent={<ListHeader />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#F2F5F0' },
  list: { padding: 16, paddingBottom: 24 },

  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  listHeaderLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  listHeaderCount: { fontSize: 22, fontWeight: '800', color: '#1B4332' },
  listHeaderLabel: { fontSize: 13, color: '#888', fontWeight: '500' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  cardAccent: {
    width: 5,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#1A2E22', marginBottom: 3 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardCategoria: { fontSize: 12, fontWeight: '600' },
  separador: { color: '#ccc', fontSize: 12 },
  cardLocal: { fontSize: 12, color: '#999', flex: 1 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  statusText: { fontSize: 10, fontWeight: '700' },

  cardDescricao: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  cardVerMais: { fontSize: 12, color: '#40916C', fontWeight: '700' },

  loadingText: { marginTop: 12, color: '#888', fontSize: 14 },

  erroIcone: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 16,
  },
  erroTitulo: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 6 },
  erroText: { color: '#888', textAlign: 'center', fontSize: 13, marginBottom: 20 },
  btnRecarregar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#40916C',
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 12,
  },
  btnRecarregarText: { color: '#fff', fontWeight: '700' },

  emptyIcone: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitulo: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 6 },
  emptySubText: { fontSize: 13, color: '#aaa' },
});
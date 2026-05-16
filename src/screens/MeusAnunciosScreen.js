// src/screens/MeusAnunciosScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarDoacoes, deletarDoacao } from '../services/doacoesService';

const CATEGORIAS_ICON = {
  Roupas: 'shirt-outline',
  Alimentos: 'nutrition-outline',
  Móveis: 'bed-outline',
  Brinquedos: 'game-controller-outline',
  Eletrônicos: 'phone-portrait-outline',
  Livros: 'book-outline',
  Outros: 'cube-outline',
};

const STATUS_CONFIG = {
  disponivel: { cor: '#1B8A57', bg: '#E6F7EF', label: 'Disponível', icone: 'checkmark-circle' },
  reservado:  { cor: '#C07000', bg: '#FFF4DC', label: 'Reservado',  icone: 'time' },
  entregue:   { cor: '#888',    bg: '#F0F0F0', label: 'Entregue',   icone: 'archive' },
};

export default function MeusAnunciosScreen({ navigation }) {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const carregar = async () => {
    try {
      const dados = await listarDoacoes();
      setDoacoes(dados);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar seus anúncios.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); carregar(); }, []));

  const confirmarExclusao = (id, titulo) => {
    Alert.alert(
      'Excluir doação',
      `Tem certeza que deseja excluir "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => handleExcluir(id) },
      ]
    );
  };

  const handleExcluir = async (id) => {
    try {
      await deletarDoacao(id);
      setDoacoes((prev) => prev.filter((d) => d.id !== id));
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir. Tente novamente.');
    }
  };

  const renderItem = ({ item }) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.disponivel;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {/* Ícone */}
          <View style={styles.cardIcone}>
            <Ionicons name={CATEGORIAS_ICON[item.categoria] || 'cube-outline'} size={22} color="#40916C" />
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
            <Text style={styles.cardCategoria}>{item.categoria}</Text>
          </View>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icone} size={11} color={status.cor} />
            <Text style={[styles.statusText, { color: status.cor }]}>{status.label}</Text>
          </View>
        </View>

        {/* Ações */}
        <View style={styles.cardAcoes}>
          <TouchableOpacity
            style={styles.btnEditar}
            onPress={() => navigation.navigate('EditarAnuncio', { doacao: item })}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={15} color="#1B4332" />
            <Text style={styles.btnEditarText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnExcluir}
            onPress={() => confirmarExclusao(item.id, item.titulo)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={15} color="#C0392B" />
            <Text style={styles.btnExcluirText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {doacoes.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcone}>
            <Ionicons name="megaphone-outline" size={40} color="#40916C" />
          </View>
          <Text style={styles.emptyTitulo}>Nenhum anúncio ainda</Text>
          <Text style={styles.emptySubText}>Vá em "Doar Item" para cadastrar sua primeira doação!</Text>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); carregar(); }}
              colors={['#40916C']}
              tintColor="#40916C"
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderCount}>{doacoes.length}</Text>
              <Text style={styles.listHeaderLabel}>
                {doacoes.length === 1 ? 'doação cadastrada' : 'doações cadastradas'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#F2F5F0' },
  list: { padding: 16, paddingBottom: 24 },

  listHeader: {
    flexDirection: 'row', alignItems: 'baseline', gap: 6,
    marginBottom: 14, paddingHorizontal: 2,
  },
  listHeaderCount: { fontSize: 22, fontWeight: '800', color: '#1B4332' },
  listHeaderLabel: { fontSize: 13, color: '#888', fontWeight: '500' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18, padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardIcone: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 15, fontWeight: '700', color: '#1A2E22', marginBottom: 3 },
  cardCategoria: { fontSize: 12, color: '#40916C', fontWeight: '600' },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  statusText: { fontSize: 10, fontWeight: '700' },

  cardAcoes: {
    flexDirection: 'row', gap: 10,
    borderTopWidth: 1, borderTopColor: '#F0F4F0',
    paddingTop: 12,
  },
  btnEditar: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    backgroundColor: '#EAF4EE',
    paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: '#C8E6D0',
  },
  btnEditarText: { color: '#1B4332', fontWeight: '700', fontSize: 13 },

  btnExcluir: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    backgroundColor: '#FDECEA',
    paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: '#F5C6C2',
  },
  btnExcluirText: { color: '#C0392B', fontWeight: '700', fontSize: 13 },

  emptyIcone: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitulo: { fontSize: 18, fontWeight: '700', color: '#1B4332', marginBottom: 8 },
  emptySubText: { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20 },
});
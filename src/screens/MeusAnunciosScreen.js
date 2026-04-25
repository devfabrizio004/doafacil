// src/screens/MeusAnunciosScreen.js
// Nota: Por simplicidade (sem autenticação), esta tela lista TODAS as doações
// e permite editar/excluir. Em produção, usaria Firebase Auth para filtrar por usuário.
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      carregar();
    }, [])
  );

  const confirmarExclusao = (id, titulo) => {
    Alert.alert(
      'Excluir Doação',
      `Deseja realmente excluir "${titulo}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleExcluir(id),
        },
      ]
    );
  };

  const handleExcluir = async (id) => {
    try {
      await deletarDoacao(id);
      setDoacoes((prev) => prev.filter((d) => d.id !== id));
      Alert.alert('Sucesso', 'Doação excluída com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir. Tente novamente.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo} numberOfLines={1}>{item.titulo}</Text>
          <Text style={styles.cardCategoria}>{item.categoria}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>
            {STATUS_LABEL[item.status]}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.btnAction, styles.btnEditar]}
          onPress={() => navigation.navigate('EditarAnuncio', { doacao: item })}
        >
          <Ionicons name="pencil-outline" size={16} color="#1B4332" />
          <Text style={styles.btnEditarText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnAction, styles.btnExcluir]}
          onPress={() => confirmarExclusao(item.id, item.titulo)}
        >
          <Ionicons name="trash-outline" size={16} color="#c0392b" />
          <Text style={styles.btnExcluirText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Ionicons name="cube-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma doação cadastrada.</Text>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} colors={['#40916C']} />
          }
          ListHeaderComponent={
            <Text style={styles.header}>{doacoes.length} {doacoes.length === 1 ? 'doação cadastrada' : 'doações cadastradas'}</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F0' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  list: { padding: 16 },
  header: { fontSize: 13, color: '#888', marginBottom: 12, fontStyle: 'italic' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: '700', color: '#1B4332', marginBottom: 2 },
  cardCategoria: { fontSize: 12, color: '#40916C', fontWeight: '600' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardActions: { flexDirection: 'row', gap: 10 },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  btnEditar: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#40916C22' },
  btnEditarText: { color: '#1B4332', fontWeight: '700', fontSize: 13 },
  btnExcluir: { backgroundColor: '#fdecea', borderWidth: 1, borderColor: '#c0392b22' },
  btnExcluirText: { color: '#c0392b', fontWeight: '700', fontSize: 13 },
  emptyText: { fontSize: 15, color: '#888', marginTop: 16 },
});

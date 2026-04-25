// src/screens/FeedScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
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

  // Recarrega sempre que a tela recebe foco (ex: após cadastrar nova doação)
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={CATEGORIAS_ICON[item.categoria] || 'cube-outline'}
            size={28}
            color="#40916C"
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo} numberOfLines={1}>
            {item.titulo}
          </Text>
          <Text style={styles.cardCategoria}>{item.categoria}</Text>
          <Text style={styles.cardLocal} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color="#888" />{' '}
            {item.bairro || 'Local não informado'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
          <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>
            {STATUS_LABEL[item.status]}
          </Text>
        </View>
      </View>
      {item.descricao ? (
        <Text style={styles.cardDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>
      ) : null}
    </TouchableOpacity>
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
        <Ionicons name="cloud-offline-outline" size={48} color="#ccc" />
        <Text style={styles.erroText}>{erro}</Text>
        <TouchableOpacity style={styles.btnRecarregar} onPress={carregar}>
          <Text style={styles.btnRecarregarText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {doacoes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma doação disponível ainda.</Text>
          <Text style={styles.emptySubText}>Seja o primeiro a doar!</Text>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#40916C']} />
          }
          ListHeaderComponent={
            <Text style={styles.header}>
              {doacoes.length} {doacoes.length === 1 ? 'item disponível' : 'itens disponíveis'}
            </Text>
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
  header: {
    fontSize: 13,
    color: '#888',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  cardTitulo: { fontSize: 16, fontWeight: '700', color: '#1B4332', marginBottom: 2 },
  cardCategoria: { fontSize: 12, color: '#40916C', fontWeight: '600', marginBottom: 2 },
  cardLocal: { fontSize: 12, color: '#888' },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardDescricao: { fontSize: 13, color: '#555', lineHeight: 18 },
  loadingText: { marginTop: 12, color: '#888', fontSize: 14 },
  erroText: { color: '#c0392b', textAlign: 'center', marginTop: 12, fontSize: 14 },
  emptyText: { fontSize: 16, color: '#888', marginTop: 16, fontWeight: '600' },
  emptySubText: { fontSize: 13, color: '#aaa', marginTop: 4 },
  btnRecarregar: {
    marginTop: 16,
    backgroundColor: '#40916C',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnRecarregarText: { color: '#fff', fontWeight: '700' },
});

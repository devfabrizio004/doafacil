// src/screens/EditarAnuncioScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { atualizarDoacao } from '../services/doacoesService';

const CATEGORIAS = ['Roupas', 'Alimentos', 'Móveis', 'Brinquedos', 'Eletrônicos', 'Livros', 'Outros'];
const CONDICOES = ['Novo', 'Seminovo', 'Usado (bom estado)', 'Usado (desgastado)'];
const STATUS_OPCOES = [
  { valor: 'disponivel', label: 'Disponível', icone: 'checkmark-circle', cor: '#1B8A57', bg: '#E6F7EF' },
  { valor: 'reservado',  label: 'Reservado',  icone: 'time',             cor: '#C07000', bg: '#FFF4DC' },
  { valor: 'entregue',   label: 'Entregue',   icone: 'archive',          cor: '#888',    bg: '#F0F0F0' },
];

export default function EditarAnuncioScreen({ route, navigation }) {
  const { doacao } = route.params;

  const [titulo,    setTitulo]    = useState(doacao.titulo    || '');
  const [categoria, setCategoria] = useState(doacao.categoria || '');
  const [descricao, setDescricao] = useState(doacao.descricao || '');
  const [bairro,    setBairro]    = useState(doacao.bairro    || '');
  const [contato,   setContato]   = useState(doacao.contato   || '');
  const [condicao,  setCondicao]  = useState(doacao.condicao  || '');
  const [status,    setStatus]    = useState(doacao.status    || 'disponivel');
  const [salvando,  setSalvando]  = useState(false);
  const [focado,    setFocado]    = useState('');

  const handleSalvar = async () => {
    if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o título do item.'); return; }

    setSalvando(true);
    try {
      await atualizarDoacao(doacao.id, { titulo, categoria, descricao, bairro, contato, condicao, status });
      Alert.alert('Salvo!', 'Doação atualizada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="create-outline" size={22} color="#74C69D" />
          <Text style={styles.bannerText}>Editando: <Text style={styles.bannerTitulo}>{doacao.titulo}</Text></Text>
        </View>

        {/* Status da doação — destaque */}
        <Label texto="Status da doação" />
        <View style={styles.statusGrid}>
          {STATUS_OPCOES.map((s) => (
            <TouchableOpacity
              key={s.valor}
              style={[styles.statusItem, status === s.valor && { borderColor: s.cor, backgroundColor: s.bg }]}
              onPress={() => setStatus(s.valor)}
              activeOpacity={0.8}
            >
              <Ionicons name={s.icone} size={20} color={status === s.valor ? s.cor : '#bbb'} />
              <Text style={[styles.statusItemText, status === s.valor && { color: s.cor, fontWeight: '800' }]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divisor} />

        {/* Título */}
        <Label texto="Título do item *" />
        <TextInput
          style={[styles.input, focado === 'titulo' && styles.inputFocado]}
          value={titulo}
          onChangeText={setTitulo}
          onFocus={() => setFocado('titulo')}
          onBlur={() => setFocado('')}
          maxLength={80}
          placeholderTextColor="#bbb"
        />

        {/* Categoria */}
        <Label texto="Categoria" />
        <View style={styles.chips}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipAtivo]}
              onPress={() => setCategoria(cat)}
            >
              {categoria === cat && <Ionicons name="checkmark" size={12} color="#fff" />}
              <Text style={[styles.chipText, categoria === cat && styles.chipTextAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condição */}
        <Label texto="Condição" />
        <View style={styles.chips}>
          {CONDICOES.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, condicao === cond && styles.chipAtivo]}
              onPress={() => setCondicao(cond)}
            >
              {condicao === cond && <Ionicons name="checkmark" size={12} color="#fff" />}
              <Text style={[styles.chipText, condicao === cond && styles.chipTextAtivo]}>{cond}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descrição */}
        <Label texto="Descrição" />
        <TextInput
          style={[styles.input, styles.inputMultiline, focado === 'descricao' && styles.inputFocado]}
          value={descricao}
          onChangeText={setDescricao}
          onFocus={() => setFocado('descricao')}
          onBlur={() => setFocado('')}
          multiline
          numberOfLines={3}
          maxLength={300}
          placeholderTextColor="#bbb"
        />

        {/* Bairro */}
        <Label texto="Bairro" />
        <View style={styles.inputIconWrap}>
          <Ionicons name="location-outline" size={18} color="#aaa" style={styles.inputIcone} />
          <TextInput
            style={[styles.inputComIcone, focado === 'bairro' && styles.inputFocado]}
            value={bairro}
            onChangeText={setBairro}
            onFocus={() => setFocado('bairro')}
            onBlur={() => setFocado('')}
            maxLength={60}
            placeholderTextColor="#bbb"
          />
        </View>

        {/* Contato */}
        <Label texto="Contato (WhatsApp)" />
        <View style={styles.inputIconWrap}>
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" style={styles.inputIcone} />
          <TextInput
            style={[styles.inputComIcone, focado === 'contato' && styles.inputFocado]}
            value={contato}
            onChangeText={setContato}
            onFocus={() => setFocado('contato')}
            onBlur={() => setFocado('')}
            keyboardType="phone-pad"
            maxLength={20}
            placeholderTextColor="#bbb"
          />
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.btnSalvar, salvando && styles.btnDesabilitado]}
          onPress={handleSalvar}
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ texto }) {
  return <Text style={styles.label}>{texto}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  content: { padding: 20, paddingBottom: 48 },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1B4332',
    borderRadius: 16, padding: 16,
    marginBottom: 20,
  },
  bannerText: { color: '#A8D5BE', fontSize: 13, flex: 1 },
  bannerTitulo: { color: '#fff', fontWeight: '700' },

  label: {
    fontSize: 12, fontWeight: '700', color: '#555',
    marginBottom: 8, marginTop: 14,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },

  statusGrid: { flexDirection: 'row', gap: 8 },
  statusItem: {
    flex: 1, flexDirection: 'column', alignItems: 'center', gap: 5,
    paddingVertical: 12, borderRadius: 14,
    backgroundColor: '#fff', borderWidth: 2, borderColor: '#E8E8E8',
  },
  statusItemText: { fontSize: 11, color: '#aaa', fontWeight: '600' },

  divisor: { height: 1, backgroundColor: '#E8EDE8', marginVertical: 20 },

  input: {
    backgroundColor: '#fff', borderRadius: 14,
    padding: 14, fontSize: 15, color: '#222',
    borderWidth: 1.5, borderColor: '#E8EDE8',
  },
  inputFocado: { borderColor: '#40916C', backgroundColor: '#FAFFFE' },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

  inputIconWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E8EDE8',
    paddingHorizontal: 14,
  },
  inputIcone: { marginRight: 10 },
  inputComIcone: { flex: 1, paddingVertical: 14, fontSize: 15, color: '#222' },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#E0E0E0',
  },
  chipAtivo: { backgroundColor: '#40916C', borderColor: '#40916C' },
  chipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  chipTextAtivo: { color: '#fff' },

  btnSalvar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#40916C', borderRadius: 16,
    paddingVertical: 18, marginTop: 28, gap: 10,
    elevation: 4,
    shadowColor: '#40916C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnDesabilitado: { backgroundColor: '#aaa', elevation: 0, shadowOpacity: 0 },
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
});
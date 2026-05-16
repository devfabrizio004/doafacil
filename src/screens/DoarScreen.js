// src/screens/DoarScreen.js
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
import { criarDoacao } from '../services/doacoesService';

const CATEGORIAS = [
  { label: 'Roupas',      icon: 'shirt-outline' },
  { label: 'Alimentos',   icon: 'nutrition-outline' },
  { label: 'Móveis',      icon: 'bed-outline' },
  { label: 'Brinquedos',  icon: 'game-controller-outline' },
  { label: 'Eletrônicos', icon: 'phone-portrait-outline' },
  { label: 'Livros',      icon: 'book-outline' },
  { label: 'Outros',      icon: 'cube-outline' },
];

const CONDICOES = ['Novo', 'Seminovo', 'Usado (bom estado)', 'Usado (desgastado)'];

export default function DoarScreen() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [contato, setContato] = useState('');
  const [condicao, setCondicao] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [focado, setFocado] = useState('');

  const limparFormulario = () => {
    setTitulo(''); setCategoria(''); setDescricao('');
    setBairro(''); setContato(''); setCondicao('');
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) { Alert.alert('Atenção', 'Informe o nome do item.'); return; }
    if (!categoria)      { Alert.alert('Atenção', 'Selecione uma categoria.'); return; }
    if (!contato.trim()) { Alert.alert('Atenção', 'Informe um contato WhatsApp.'); return; }

    setSalvando(true);
    try {
      await criarDoacao({ titulo, categoria, descricao, bairro, contato, condicao });
      Alert.alert('Publicado! 🎉', 'Sua doação foi cadastrada com sucesso!', [
        { text: 'OK', onPress: limparFormulario },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const progresso = [titulo, categoria, contato].filter(Boolean).length;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header motivacional */}
        <View style={styles.hero}>
          <View style={styles.heroIcone}>
            <Ionicons name="heart" size={32} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitulo}>Doe com amor</Text>
            <Text style={styles.heroSub}>Transforme itens em sorrisos</Text>
          </View>
          {/* Indicador de progresso */}
          <View style={styles.progressoWrap}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.progressoDot, i < progresso && styles.progressoDotAtivo]}
              />
            ))}
          </View>
        </View>

        {/* Seção 1: Item */}
        <SectionTitle numero="1" titulo="Sobre o item" />

        <Label texto="Nome do item *" />
        <TextInput
          style={[styles.input, focado === 'titulo' && styles.inputFocado]}
          placeholder="Ex: Casaco azul masculino tamanho M"
          placeholderTextColor="#bbb"
          value={titulo}
          onChangeText={setTitulo}
          onFocus={() => setFocado('titulo')}
          onBlur={() => setFocado('')}
          maxLength={80}
        />

        <Label texto="Categoria *" />
        <View style={styles.categoriasGrid}>
          {CATEGORIAS.map(({ label, icon }) => (
            <TouchableOpacity
              key={label}
              style={[styles.categoriaItem, categoria === label && styles.categoriaItemAtivo]}
              onPress={() => setCategoria(label)}
            >
              <Ionicons
                name={icon}
                size={22}
                color={categoria === label ? '#fff' : '#40916C'}
              />
              <Text style={[styles.categoriaText, categoria === label && styles.categoriaTextAtivo]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label texto="Condição do item" />
        <View style={styles.chips}>
          {CONDICOES.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, condicao === cond && styles.chipAtivo]}
              onPress={() => setCondicao(cond)}
            >
              {condicao === cond && (
                <Ionicons name="checkmark" size={13} color="#fff" />
              )}
              <Text style={[styles.chipText, condicao === cond && styles.chipTextAtivo]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label texto="Descrição (opcional)" />
        <TextInput
          style={[styles.input, styles.inputMultiline, focado === 'descricao' && styles.inputFocado]}
          placeholder="Tamanho, cor, quantidade, observações..."
          placeholderTextColor="#bbb"
          value={descricao}
          onChangeText={setDescricao}
          onFocus={() => setFocado('descricao')}
          onBlur={() => setFocado('')}
          multiline
          numberOfLines={3}
          maxLength={300}
        />

        {/* Seção 2: Localização e contato */}
        <SectionTitle numero="2" titulo="Localização e contato" />

        <Label texto="Bairro" />
        <View style={styles.inputIconWrap}>
          <Ionicons name="location-outline" size={18} color="#aaa" style={styles.inputIcone} />
          <TextInput
            style={[styles.inputComIcone, focado === 'bairro' && styles.inputFocado]}
            placeholder="Ex: Tijuca, Botafogo, Centro..."
            placeholderTextColor="#bbb"
            value={bairro}
            onChangeText={setBairro}
            onFocus={() => setFocado('bairro')}
            onBlur={() => setFocado('')}
            maxLength={60}
          />
        </View>

        <Label texto="WhatsApp para contato *" />
        <View style={styles.inputIconWrap}>
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" style={styles.inputIcone} />
          <TextInput
            style={[styles.inputComIcone, focado === 'contato' && styles.inputFocado]}
            placeholder="(21) 99999-9999"
            placeholderTextColor="#bbb"
            value={contato}
            onChangeText={setContato}
            onFocus={() => setFocado('contato')}
            onBlur={() => setFocado('')}
            keyboardType="phone-pad"
            maxLength={20}
          />
        </View>

        {/* Botão publicar */}
        <TouchableOpacity
          style={[styles.btnPublicar, salvando && styles.btnDesabilitado]}
          onPress={handleSalvar}
          disabled={salvando}
          activeOpacity={0.85}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="paper-plane" size={20} color="#fff" />
              <Text style={styles.btnPublicarText}>Publicar Doação</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.rodape}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionTitle({ numero, titulo }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionNumero}>
        <Text style={styles.sectionNumeroText}>{numero}</Text>
      </View>
      <Text style={styles.sectionTituloText}>{titulo}</Text>
    </View>
  );
}

function Label({ texto }) {
  return <Text style={styles.label}>{texto}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F5F0' },
  content: { padding: 20, paddingBottom: 48 },

  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B4332',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    gap: 14,
  },
  heroIcone: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#40916C',
    justifyContent: 'center', alignItems: 'center',
  },
  heroTitulo: { color: '#fff', fontSize: 17, fontWeight: '800' },
  heroSub: { color: '#A8D5BE', fontSize: 13, marginTop: 2 },
  progressoWrap: { flexDirection: 'row', gap: 5, alignSelf: 'flex-start' },
  progressoDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#2D6A4F',
  },
  progressoDotAtivo: { backgroundColor: '#74C69D' },

  sectionTitle: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginTop: 8, marginBottom: 16,
  },
  sectionNumero: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: '#1B4332',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionNumeroText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  sectionTituloText: { fontSize: 15, fontWeight: '700', color: '#1B4332' },

  label: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 8, marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.5 },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: '#222',
    borderWidth: 1.5,
    borderColor: '#E8EDE8',
  },
  inputFocado: { borderColor: '#40916C', backgroundColor: '#FAFFFE' },
  inputMultiline: { minHeight: 90, textAlignVertical: 'top' },

  inputIconWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E8EDE8',
    paddingHorizontal: 14,
  },
  inputIcone: { marginRight: 10 },
  inputComIcone: {
    flex: 1, paddingVertical: 14, fontSize: 15, color: '#222',
    borderWidth: 0,
  },

  categoriasGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4,
  },
  categoriaItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#D8ECD8',
  },
  categoriaItemAtivo: { backgroundColor: '#1B4332', borderColor: '#1B4332' },
  categoriaText: { fontSize: 13, color: '#40916C', fontWeight: '600' },
  categoriaTextAtivo: { color: '#fff' },

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

  btnPublicar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#40916C',
    borderRadius: 16, paddingVertical: 18,
    marginTop: 28, gap: 10,
    elevation: 4,
    shadowColor: '#40916C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  btnDesabilitado: { backgroundColor: '#aaa', elevation: 0, shadowOpacity: 0 },
  btnPublicarText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  rodape: { textAlign: 'center', fontSize: 11, color: '#bbb', marginTop: 16 },
});
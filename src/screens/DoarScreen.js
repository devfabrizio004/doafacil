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

const CATEGORIAS = ['Roupas', 'Alimentos', 'Móveis', 'Brinquedos', 'Eletrônicos', 'Livros', 'Outros'];
const CONDICOES = ['Novo', 'Seminovo', 'Usado (bom estado)', 'Usado (desgastado)'];

export default function DoarScreen() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState('');
  const [contato, setContato] = useState('');
  const [condicao, setCondicao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const limparFormulario = () => {
    setTitulo('');
    setCategoria('');
    setDescricao('');
    setBairro('');
    setContato('');
    setCondicao('');
  };

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe o nome/título do item.');
      return;
    }
    if (!categoria) {
      Alert.alert('Atenção', 'Selecione uma categoria.');
      return;
    }
    if (!contato.trim()) {
      Alert.alert('Atenção', 'Informe um número de contato (WhatsApp).');
      return;
    }

    setSalvando(true);
    try {
      await criarDoacao({ titulo, categoria, descricao, bairro, contato, condicao });
      Alert.alert('Sucesso! 🎉', 'Sua doação foi cadastrada com sucesso!', [
        { text: 'OK', onPress: limparFormulario },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Verifique sua conexão e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.banner}>
          <Ionicons name="heart" size={28} color="#fff" />
          <Text style={styles.bannerText}>Doe com amor. Transforme vidas.</Text>
        </View>

        {/* Título do item */}
        <Label texto="Nome / Título do item *" />
        <TextInput
          style={styles.input}
          placeholder="Ex: Casaco masculino azul, tamanho M"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={80}
        />

        {/* Categoria */}
        <Label texto="Categoria *" />
        <View style={styles.chips}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipAtivo]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.chipText, categoria === cat && styles.chipTextAtivo]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Condição */}
        <Label texto="Condição do item" />
        <View style={styles.chips}>
          {CONDICOES.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, condicao === cond && styles.chipAtivo]}
              onPress={() => setCondicao(cond)}
            >
              <Text style={[styles.chipText, condicao === cond && styles.chipTextAtivo]}>
                {cond}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descrição */}
        <Label texto="Descrição (opcional)" />
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Descreva o item: tamanho, cor, quantidade, observações..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
          maxLength={300}
        />

        {/* Bairro */}
        <Label texto="Bairro / Localização" />
        <TextInput
          style={styles.input}
          placeholder="Ex: Tijuca, Centro, Botafogo..."
          value={bairro}
          onChangeText={setBairro}
          maxLength={60}
        />

        {/* Contato */}
        <Label texto="WhatsApp para contato *" />
        <TextInput
          style={styles.input}
          placeholder="(21) 99999-9999"
          value={contato}
          onChangeText={setContato}
          keyboardType="phone-pad"
          maxLength={20}
        />

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.btnSalvar, salvando && styles.btnSalvarDesabilitado]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.btnSalvarText}>Publicar Doação</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.rodape}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ texto }) {
  return <Text style={styles.label}>{texto}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F0' },
  content: { padding: 20, paddingBottom: 40 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B4332',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  bannerText: { color: '#fff', fontSize: 15, fontWeight: '600', flex: 1 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B4332',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  chipAtivo: {
    backgroundColor: '#1B4332',
    borderColor: '#1B4332',
  },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextAtivo: { color: '#fff' },
  btnSalvar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40916C',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 28,
    gap: 10,
  },
  btnSalvarDesabilitado: { backgroundColor: '#aaa' },
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  rodape: { textAlign: 'center', fontSize: 11, color: '#aaa', marginTop: 16 },
});

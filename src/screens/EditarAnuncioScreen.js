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
const STATUS_OPCOES = ['disponivel', 'reservado', 'entregue'];
const STATUS_LABEL = { disponivel: 'Disponível', reservado: 'Reservado', entregue: 'Entregue' };

export default function EditarAnuncioScreen({ route, navigation }) {
  const { doacao } = route.params;

  const [titulo, setTitulo] = useState(doacao.titulo || '');
  const [categoria, setCategoria] = useState(doacao.categoria || '');
  const [descricao, setDescricao] = useState(doacao.descricao || '');
  const [bairro, setBairro] = useState(doacao.bairro || '');
  const [contato, setContato] = useState(doacao.contato || '');
  const [condicao, setCondicao] = useState(doacao.condicao || '');
  const [status, setStatus] = useState(doacao.status || 'disponivel');
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Atenção', 'Informe o título do item.');
      return;
    }

    setSalvando(true);
    try {
      await atualizarDoacao(doacao.id, { titulo, categoria, descricao, bairro, contato, condicao, status });
      Alert.alert('Sucesso!', 'Doação atualizada com sucesso.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
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

        <Label texto="Título do item *" />
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} maxLength={80} />

        <Label texto="Categoria" />
        <View style={styles.chips}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipAtivo]}
              onPress={() => setCategoria(cat)}
            >
              <Text style={[styles.chipText, categoria === cat && styles.chipTextAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label texto="Condição" />
        <View style={styles.chips}>
          {CONDICOES.map((cond) => (
            <TouchableOpacity
              key={cond}
              style={[styles.chip, condicao === cond && styles.chipAtivo]}
              onPress={() => setCondicao(cond)}
            >
              <Text style={[styles.chipText, condicao === cond && styles.chipTextAtivo]}>{cond}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label texto="Status da doação" />
        <View style={styles.chips}>
          {STATUS_OPCOES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, status === s && styles.chipAtivo]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.chipText, status === s && styles.chipTextAtivo]}>
                {STATUS_LABEL[s]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Label texto="Descrição" />
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={3}
          maxLength={300}
        />

        <Label texto="Bairro" />
        <TextInput style={styles.input} value={bairro} onChangeText={setBairro} maxLength={60} />

        <Label texto="Contato (WhatsApp)" />
        <TextInput
          style={styles.input}
          value={contato}
          onChangeText={setContato}
          keyboardType="phone-pad"
          maxLength={20}
        />

        <TouchableOpacity
          style={[styles.btnSalvar, salvando && { backgroundColor: '#aaa' }]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
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
  container: { flex: 1, backgroundColor: '#F4F6F0' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '700', color: '#1B4332', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ccc',
  },
  chipAtivo: { backgroundColor: '#1B4332', borderColor: '#1B4332' },
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
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

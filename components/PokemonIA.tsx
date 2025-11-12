import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

export default function PokemonAI() {
  const [pregunta, setPregunta] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const consultarGemini = async () => {
    if (!pregunta.trim()) return;

    setIsLoading(true);
    setResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash", // Gemini 2.0 Flash (sin -exp)
        contents: `Eres un experto en Pokémon. Responde de forma breve y clara: ${pregunta}`,
      });

      if (result.text) {
        setResponse(result.text);
      } else {
        setResponse("No se pudo obtener la respuesta");
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      
      const errorMsg = err.message || JSON.stringify(err);
      
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        setResponse("⏳ Límite de consultas alcanzado.\n\n💡 Soluciones:\n1. Espera 1-2 minutos entre consultas\n2. Usa gemini-1.5-flash si persiste\n3. Genera nueva API key en:\nhttps://aistudio.google.com/app/apikey");
      } else if (errorMsg.includes('not found') || errorMsg.includes('404')) {
        setResponse("⚠️ Tu cuenta no tiene acceso a Gemini 2.0 aún.\n\nPrueba con: gemini-1.5-flash o gemini-1.5-pro");
      } else if (errorMsg.includes('API_KEY') || errorMsg.includes('invalid')) {
        setResponse("🔑 API Key inválida. Verifica tu archivo .env");
      } else {
        setResponse(`❌ Error: ${errorMsg.substring(0, 200)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-white rounded-3xl p-6 border-2 border-purple-200 mb-6">
      <Text className="text-2xl font-bold text-purple-900 mb-4">
        🤖 Asistente Pokémon IA
      </Text>

      <TextInput
        value={pregunta}
        onChangeText={setPregunta}
        placeholder="Ej: ¿Cuál es el mejor Pokémon inicial?"
        placeholderTextColor="#9ca3af"
        multiline
        className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200 mb-4 text-purple-900"
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />

      <TouchableOpacity
        onPress={consultarGemini}
        disabled={isLoading || !pregunta.trim()}
        className="bg-purple-600 py-4 rounded-xl mb-4"
        style={{ opacity: (isLoading || !pregunta.trim()) ? 0.5 : 1 }}
      >
        <Text className="text-white text-center font-bold text-base">
          {isLoading ? '🔄 Consultando...' : '✨ Preguntar'}
        </Text>
      </TouchableOpacity>

      {isLoading && (
        <View className="py-4 items-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      )}

      {response && !isLoading && (
        <View className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200" style={{ maxHeight: 400 }}>
          <Text className="text-purple-900 font-semibold mb-2">
            {response.includes('Error') || response.includes('⏳') || response.includes('⚠️') ? '⚠️ Aviso:' : '💬 Respuesta:'}
          </Text>
          <ScrollView>
            <Text className="text-purple-800">{response}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({ searchTerm, setSearchTerm, onSearch, loading }: SearchBarProps) {
  return (
    <View className="flex-row gap-3 mb-6">
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Busca un Pokémon..."
        placeholderTextColor="#a78bfa"
        className="flex-1 p-4 text-base rounded-xl bg-white border-2 border-purple-300"
      />
      <TouchableOpacity
        onPress={onSearch}
        disabled={loading}
        className="px-8 py-4 rounded-xl justify-center bg-pink-700 border-2 border-pink-900"
        style={{ opacity: loading ? 0.5 : 1 }}
      >
        <Text className="text-base font-bold text-white">
          {loading ? 'Buscando...' : 'Buscar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
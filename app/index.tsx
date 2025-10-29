import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import "@/global.css";
interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: {
    name: string;
    value: number;
  }[];
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPokemon = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un nombre de Pokémon');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPokemon(null);

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error('Pokémon no encontrado');
      }

      const data = await response.json();

      const pokemonData: Pokemon = {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((type: any) => type.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((ability: any) => ability.ability.name),
        stats: data.stats.map((stat: any) => ({
          name: stat.stat.name,
          value: stat.base_stat
        }))
      };

      setPokemon(pokemonData);
      setLoading(false);
    } catch (err) {
      setError('Pokémon no encontrado. Verifica el nombre e intenta de nuevo.');
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      poison: '#A040A0',
      normal: '#A8A878',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  };

  const translateStatName = (name: string) => {
    const translations: any = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'At. Especial',
      'special-defense': 'Def. Especial',
      'speed': 'Velocidad'
    };
    return translations[name] || name;
  };

  return (
    <ScrollView className="flex-1 bg-red-500">
      <View className="p-5 pt-16">
        <Text className="text-5xl font-bold text-white text-center mb-3">
          Pokédex
        </Text>
        <Text className="text-white text-center mb-8 text-base">
          Busca tu Pokémon favorito
        </Text>

        <View className="flex-row gap-3 mb-5">
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Ej: pikachu, charizard..."
            className="flex-1 p-3 text-base rounded-lg bg-white"
          />
          <TouchableOpacity
            onPress={searchPokemon}
            className="px-8 py-3 bg-yellow-400 rounded-lg justify-center"
          >
            <Text className="text-base font-bold text-gray-800">
              {loading ? 'Buscando...' : 'Buscar'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View className="p-5 items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {error && (
          <View className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-5">
            <Text className="text-red-900 text-center font-semibold">
              {error}
            </Text>
          </View>
        )}

        {pokemon && (
          <View className="bg-white rounded-2xl p-5 mb-5">
            <View className="items-center mb-5">
              <Text className="text-gray-500 text-sm font-semibold">
                #{pokemon.id.toString().padStart(3, '0')}
              </Text>
              <Text className="text-3xl font-bold text-gray-800 capitalize mt-2 mb-4">
                {pokemon.name}
              </Text>
              
              <View className="flex-row gap-2 mb-5">
                {pokemon.types.map((type) => (
                  <View
                    key={type}
                    className="py-1.5 px-4 rounded-full"
                    style={{ backgroundColor: getTypeColor(type) }}
                  >
                    <Text className="text-sm font-semibold text-white capitalize">
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="bg-gray-100 rounded-xl p-5 mb-5 items-center">
              <Image 
                source={{ uri: pokemon.image }}
                className="w-52 h-52"
              />
            </View>

            <View className="flex-row gap-4 mb-5">
              <View className="flex-1 bg-gray-50 p-4 rounded-lg items-center">
                <Text className="text-xs text-gray-500 font-semibold mb-1">
                  Altura
                </Text>
                <Text className="text-xl font-bold text-gray-800">
                  {(pokemon.height / 10).toFixed(1)} m
                </Text>
              </View>
              <View className="flex-1 bg-gray-50 p-4 rounded-lg items-center">
                <Text className="text-xs text-gray-500 font-semibold mb-1">
                  Peso
                </Text>
                <Text className="text-xl font-bold text-gray-800">
                  {(pokemon.weight / 10).toFixed(1)} kg
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Habilidades
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <View
                    key={ability}
                    className="bg-gray-200 py-1.5 px-3 rounded-md"
                  >
                    <Text className="text-sm text-gray-700 capitalize">
                      {ability.replace('-', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View>
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Estadísticas Base
              </Text>
              {pokemon.stats.map((stat) => (
                <View key={stat.name} className="flex-row justify-between mb-2 py-2 border-b border-gray-200">
                  <Text className="text-sm text-gray-600 font-semibold">
                    {translateStatName(stat.name)}
                  </Text>
                  <Text className="text-sm text-gray-800 font-bold">
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Index;
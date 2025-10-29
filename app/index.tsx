import ErrorMessage from '@/components/ErrorMessage';
import PokemonCard from '@/components/PokemonCard';
import SearchBar from '@/components/SearchBar';
import StarterCatalog from '@/components/StartedCatalog';
import "@/global.css";
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import axios from 'axios';

interface Pokemon {
  id: string;
  name: string;
  image: string | any;
  types: string[];
  height: string;
  weight: string;
  stats: { name: string; value: string }[];
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createMissingNo = () => {
    const glitchSymbols = ['█', '▓', '▒', '░', '▀', '▄', '▌', '▐', '■'];
    const randomGlitch = () => glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
    const glitchNumber = () => Array(3).fill(0).map(() => randomGlitch()).join('');
    
    return {
      id: glitchNumber(),
      name: 'MissingNo.',
      image: require('@/assets/images/MissingNo.png'),
      types: ['glitch'],
      height: `${randomGlitch()}${randomGlitch()}.${randomGlitch()} m`,
      weight: `${randomGlitch()}${randomGlitch()}.${randomGlitch()} kg`,
      stats: [
        { name: 'PS', value: glitchNumber() },
        { name: 'Ataque', value: glitchNumber() },
        { name: 'Defensa', value: glitchNumber() },
        { name: 'At. Especial', value: glitchNumber() },
        { name: 'Def. Especial', value: glitchNumber() },
        { name: 'Velocidad', value: glitchNumber() }
      ]
    };
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

  const searchPokemon = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor ingresa un nombre de Pokémon');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setPokemon(null);

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      );
      
      const data = response.data;

      const pokemonData: Pokemon = {
        id: data.id.toString().padStart(3, '0'),
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((type: any) => type.type.name),
        height: `${(data.height / 10).toFixed(1)} m`,
        weight: `${(data.weight / 10).toFixed(1)} kg`,
        stats: data.stats.map((stat: any) => ({
          name: translateStatName(stat.stat.name),
          value: stat.base_stat.toString()
        }))
      };

      setPokemon(pokemonData);
      setLoading(false);
    } catch (err) {
      // Si hay error (404 u otro), mostrar MissingNo.
      setPokemon(createMissingNo());
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-purple-600">
      <ScrollView className="flex-1">
        <View className="p-6 pt-16">
          <Text className="text-5xl font-bold text-white text-center mb-3">
            Pokédex
          </Text>

          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={searchPokemon}
            loading={loading}
          />

          {!pokemon && !loading && (
            <StarterCatalog onSelectStarter={(name) => {
              setSearchTerm(name);
              setTimeout(() => searchPokemon(), 100);
            }} />
          )}

          {loading && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="white" />
            </View>
          )}

          {error && <ErrorMessage message={error} />}

          {pokemon && <PokemonCard pokemon={pokemon} />}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
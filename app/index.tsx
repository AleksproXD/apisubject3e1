import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import SearchBar from './components/SearchBar';
import ErrorMessage from './components/ErrorMessage';
import PokemonCard from './components/PokemonCard';

interface Pokemon {
  id: string;
  name: string;
  image: string;
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
      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJBSURBVHic7dAxAcAwEAOh+jfdE/xhBpzMAO/s7F4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMATBokDfyH6zZ4AAAAASUVORK5CYII=',
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
        // Si no encuentra el Pokémon, mostrar MissingNo.
        setPokemon(createMissingNo());
        setLoading(false);
        return;
      }

      const data = await response.json();

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
      setError('Error al buscar el Pokémon');
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-b from-purple-600 to-purple-800">
      <View className="p-6 pt-16">
        <Text className="text-5xl font-bold text-white text-center mb-3">
          Pokédex
        </Text>
        <Text className="text-white text-center mb-8 text-base">
          Busca tu Pokémon favorito
        </Text>

        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={searchPokemon}
          loading={loading}
        />

        {loading && (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {error && <ErrorMessage message={error} />}

        {pokemon && <PokemonCard pokemon={pokemon} />}
      </View>
    </ScrollView>
  );
};

export default Index;
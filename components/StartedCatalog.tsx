import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

interface StarterPokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  region: string;
}

interface StarterCatalogProps {
  onSelectStarter: (name: string) => void;
}

const STARTERS = [
  { id: 1, name: 'bulbasaur', region: 'Kanto' },
  { id: 4, name: 'charmander', region: 'Kanto' },
  { id: 7, name: 'squirtle', region: 'Kanto' },
  { id: 152, name: 'chikorita', region: 'Johto' },
  { id: 155, name: 'cyndaquil', region: 'Johto' },
  { id: 158, name: 'totodile', region: 'Johto' },
  { id: 252, name: 'treecko', region: 'Hoenn' },
  { id: 255, name: 'torchic', region: 'Hoenn' },
  { id: 258, name: 'mudkip', region: 'Hoenn' },
  { id: 387, name: 'turtwig', region: 'Sinnoh' },
  { id: 390, name: 'chimchar', region: 'Sinnoh' },
  { id: 393, name: 'piplup', region: 'Sinnoh' },
];

const getTypeColor = (type: string) => {
  const colors: any = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    poison: '#A040A0',
    normal: '#A8A878',
    electric: '#F8D030',
  };
  return colors[type] || '#68A090';
};

export default function StarterCatalog({ onSelectStarter }: StarterCatalogProps) {
  const [starters, setStarters] = useState<StarterPokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStarters();
  }, []);

  const loadStarters = async () => {
    try {
      const starterPromises = STARTERS.map(async (starter) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${starter.id}`);
        const data = await response.json();
        return {
          id: data.id.toString().padStart(3, '0'),
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map((type: any) => type.type.name),
          region: starter.region
        };
      });
      
      const loadedStarters = await Promise.all(starterPromises);
      setStarters(loadedStarters);
      setLoading(false);
    } catch (err) {
      console.error('Error loading starters:', err);
      setLoading(false);
    }
  };

  const groupedStarters: { [key: string]: StarterPokemon[] } = {};
  starters.forEach(starter => {
    if (!groupedStarters[starter.region]) {
      groupedStarters[starter.region] = [];
    }
    groupedStarters[starter.region].push(starter);
  });

  if (loading) {
    return (
      <View className="py-8 items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-base mt-3">
          Cargando Pokémon iniciales...
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <Text className="text-2xl font-bold text-white text-center mb-4">
        Pokémon Iniciales por Región
      </Text>

      {Object.entries(groupedStarters).map(([region, regionStarters]) => (
        <View key={region} className="mb-6">
          <Text className="text-xl font-bold text-yellow-300 mb-3">
            {region}
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {regionStarters.map((starter) => (
              <TouchableOpacity
                key={starter.id}
                onPress={() => onSelectStarter(starter.name)}
                className="bg-white rounded-2xl p-4 items-center border-2 border-purple-200"
                style={{ width: '30%' }}
              >
                <Image 
                  source={{ uri: starter.image }}
                  className="w-24 h-24"
                />
                <Text className="text-xs text-purple-700 font-semibold mt-2">
                  #{starter.id}
                </Text>
                <Text className="text-sm font-bold text-purple-900 capitalize">
                  {starter.name}
                </Text>
                <View className="flex-row gap-1 mt-2">
                  {starter.types.map((type) => (
                    <View
                      key={type}
                      className="py-1 px-2 rounded-full"
                      style={{ backgroundColor: getTypeColor(type) }}
                    >
                      <Text className="text-xs font-semibold text-white capitalize">
                        {type}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
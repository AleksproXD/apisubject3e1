import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  { id: 495, name: 'snivy', region: 'Unova' },
  { id: 498, name: 'tepig', region: 'Unova' },
  { id: 501, name: 'oshawott', region: 'Unova' },
  { id: 650, name: 'chespin', region: 'Kalos' },
  { id: 653, name: 'fennekin', region: 'Kalos' },
  { id: 656, name: 'froakie', region: 'Kalos' },
  { id: 722, name: 'rowlet', region: 'Alola' },
  { id: 725, name: 'litten', region: 'Alola' },
  { id: 728, name: 'popplio', region: 'Alola' },
];

const REGION_COLORS: any = {
  'Kanto': { gradient: ['#ef4444', '#dc2626'], text: '#fef2f2', shadow: '#991b1b' },
  'Johto': { gradient: ['#f59e0b', '#d97706'], text: '#fffbeb', shadow: '#92400e' },
  'Hoenn': { gradient: ['#10b981', '#059669'], text: '#ecfdf5', shadow: '#065f46' },
  'Sinnoh': { gradient: ['#3b82f6', '#2563eb'], text: '#eff6ff', shadow: '#1e3a8a' },
  'Unova': { gradient: ['#6366f1', '#4f46e5'], text: '#eef2ff', shadow: '#312e81' },
  'Kalos': { gradient: ['#ec4899', '#db2777'], text: '#fdf2f8', shadow: '#9f1239' },
  'Alola': { gradient: ['#f97316', '#ea580c'], text: '#fff7ed', shadow: '#9a3412' },
};

const getTypeColor = (type: string) => {
  const colors: any = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    poison: '#A040A0',
    normal: '#A8A878',
    electric: '#F8D030',
    flying: '#A890F0',
    psychic: '#F85888',
    dark: '#705848',
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
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${starter.id}`);
        const data = response.data;
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
      <View className="py-12 items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white text-lg mt-4 font-semibold">
          Cargando Pokémon iniciales...
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      {Object.entries(groupedStarters).map(([region, regionStarters]) => {
        const colors = REGION_COLORS[region];
        return (
          <View key={region} className="mb-8">
            <View 
              className="rounded-2xl p-4 mb-4 shadow-lg"
              style={{ 
                backgroundColor: colors.gradient[0],
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8
              }}
            >
              <Text 
                className="text-2xl font-black text-center tracking-wider"
                style={{ color: colors.text }}
              >
                🗺️ {region.toUpperCase()}
              </Text>
            </View>

            <View className="flex-row flex-wrap justify-center gap-4">
              {regionStarters.map((starter) => (
                <TouchableOpacity
                  key={starter.id}
                  onPress={() => onSelectStarter(starter.name)}
                  className="bg-white rounded-3xl p-5 items-center shadow-xl border-4"
                  style={{ 
                    width: '28%',
                    borderColor: colors.gradient[1],
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 10,
                    elevation: 10
                  }}
                >
                  <View 
                    className="rounded-full p-3 mb-2"
                    style={{ backgroundColor: colors.gradient[0] + '30' }}
                  >
                    <Image 
                      source={{ uri: starter.image }}
                      className="w-20 h-20"
                    />
                  </View>
                  
                  <View 
                    className="px-3 py-1 rounded-full mb-2"
                    style={{ backgroundColor: colors.gradient[1] }}
                  >
                    <Text className="text-xs text-white font-bold">
                      #{starter.id}
                    </Text>
                  </View>

                  <Text className="text-base font-black text-gray-800 capitalize mb-2 text-center">
                    {starter.name}
                  </Text>

                  <View className="flex-row gap-1 flex-wrap justify-center">
                    {starter.types.map((type) => (
                      <View
                        key={type}
                        className="py-1 px-3 rounded-full"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        <Text className="text-xs font-bold text-white capitalize">
                          {type}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
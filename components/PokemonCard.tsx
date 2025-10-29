import { View, Text, Image } from 'react-native';

interface Pokemon {
  id: string;
  name: string;
  image: string;
  types: string[];
  height: string;
  weight: string;
  stats: { name: string; value: string }[];
}

interface PokemonCardProps {
  pokemon: Pokemon;
}

const getTypeColor = (type: string) => {
  const colors: any = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    poison: '#A040A0',
    normal: '#A8A878',
    electric: '#F8D030',
    glitch: '#8b5cf6'
  };
  return colors[type] || '#68A090';
};

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <View className="bg-white rounded-3xl p-6 border-2 border-purple-200">
      {/* Encabezado */}
      <View className="items-center mb-6">
        <Text className="text-purple-700 text-base font-semibold">
          #{pokemon.id}
        </Text>
        <Text className="text-4xl font-bold text-purple-900 capitalize mt-2 mb-4">
          {pokemon.name}
        </Text>
        
        <View className="flex-row gap-2 flex-wrap justify-center">
          {pokemon.types.map((type) => (
            <View
              key={type}
              className="py-2 px-4 rounded-full"
              style={{ backgroundColor: getTypeColor(type) }}
            >
              <Text className="text-sm font-semibold text-white capitalize">
                {type}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Imagen */}
      <View className="bg-purple-50 rounded-2xl p-6 mb-6 items-center border-2 border-purple-100">
        <Image 
          source={{ uri: pokemon.image }}
          className="w-52 h-52"
          style={{ 
            resizeMode: 'contain',
           
          }}
        />
      </View>

      {/* Información física */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-purple-50 p-4 rounded-xl items-center border border-purple-200">
          <Text className="text-sm text-purple-700 font-semibold mb-1">
            Altura
          </Text>
          <Text className="text-2xl font-bold text-purple-900">
            {pokemon.height}
          </Text>
        </View>
        <View className="flex-1 bg-purple-50 p-4 rounded-xl items-center border border-purple-200">
          <Text className="text-sm text-purple-700 font-semibold mb-1">
            Peso
          </Text>
          <Text className="text-2xl font-bold text-purple-900">
            {pokemon.weight}
          </Text>
        </View>
      </View>

      {/* Estadísticas */}
      <View>
        <Text className="text-lg font-bold text-purple-900 mb-3">
          Estadísticas
        </Text>
        {pokemon.stats.map((stat) => (
          <View key={stat.name} className="flex-row justify-between py-3 border-b border-purple-100">
            <Text className="text-sm text-purple-700 font-semibold">
              {stat.name}
            </Text>
            <Text className="text-sm text-purple-900 font-bold">
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
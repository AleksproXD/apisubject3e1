import { View, Text } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
      <Text className="text-red-900 text-center font-semibold">
        {message}
      </Text>
    </View>
  );
}
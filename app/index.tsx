import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const outfits = [
  { name: 'Pembe tulum', color: '#f9a8d4' },
  { name: 'Mavi tulum', color: '#93c5fd' },
  { name: 'Yeşil tulum', color: '#86efac' },
];

export default function GameScreen() {
  const [outfitIndex, setOutfitIndex] = useState(0);
  const outfit = outfits[outfitIndex];

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Bebeği Giydir</Text>
      <Text style={styles.hint}>Bir kıyafet seç ve bebeğini hazırla!</Text>
      <View style={styles.baby}>
        <View style={styles.head} />
        <View style={[styles.outfit, { backgroundColor: outfit.color }]}>
          <Text style={styles.outfitText}>{outfit.name}</Text>
        </View>
      </View>
      <View style={styles.choices}>
        {outfits.map((choice, index) => (
          <Pressable accessibilityRole="button" accessibilityLabel={`${choice.name} seç`} key={choice.name}
            onPress={() => setOutfitIndex(index)}
            style={[styles.choice, { backgroundColor: choice.color }, index === outfitIndex && styles.selected]}>
            <Text>{choice.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fdf2f8' },
  title: { fontSize: 32, fontWeight: '700', color: '#831843' },
  hint: { marginTop: 8, color: '#9d174d' },
  baby: { alignItems: 'center', marginVertical: 38 },
  head: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fed7aa', borderWidth: 5, borderColor: '#f59e0b' },
  outfit: { width: 180, height: 170, marginTop: -8, borderTopLeftRadius: 55, borderTopRightRadius: 55, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: 'center', justifyContent: 'center' },
  outfitText: { fontSize: 18, fontWeight: '700', color: '#3f3f46' },
  choices: { width: '100%', gap: 10 },
  choice: { padding: 14, borderRadius: 14, alignItems: 'center' },
  selected: { borderWidth: 3, borderColor: '#831843' }
});

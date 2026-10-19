import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { brokenActivity, noFixedSizeActivity, workaroundActivity } from './TimerActivity';

const props = () => ({ title: 'Timer', startedAt: Date.now(), seconds: 120 });

export default function App() {
  const endAll = () => {
    for (const factory of [brokenActivity, noFixedSizeActivity, workaroundActivity])
      for (const activity of factory.getInstances()) void activity.end('immediate');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Text(timerInterval:) + fixedSize in a Live Activity</Text>
      <Button title="Start: fixedSize (empty banner)" onPress={() => brokenActivity.start(props())} />
      <Button title="Start: no fixedSize (renders, stretched)" onPress={() => noFixedSizeActivity.start(props())} />
      <Button title="Start: overlay workaround (renders)" onPress={() => workaroundActivity.start(props())} />
      <Button title="End all" onPress={endAll} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
});

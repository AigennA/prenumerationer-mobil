import AsyncStorage from "@react-native-async-storage/async-storage";

export type LocalData = {
  price: number | null;
  rating: number | null;
};

const EMPTY: LocalData = { price: null, rating: null };

function storageKey(id: number) {
  return `prenumeration-${id}`;
}

function parse(value: string | null): LocalData {
  return value ? { ...EMPTY, ...JSON.parse(value) } : EMPTY;
}

export async function getLocalData(id: number): Promise<LocalData> {
  return parse(await AsyncStorage.getItem(storageKey(id)));
}

export async function saveLocalData(id: number, data: LocalData) {
  await AsyncStorage.setItem(storageKey(id), JSON.stringify(data));
}

export async function getAllLocalData(ids: number[]): Promise<Record<number, LocalData>> {
  const pairs = await AsyncStorage.multiGet(ids.map(storageKey));
  const result: Record<number, LocalData> = {};
  ids.forEach((id, index) => {
    result[id] = parse(pairs[index][1]);
  });
  return result;
}

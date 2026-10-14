import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Character, Icon, ItemArt, Room } from '../src/Illustration';
import { categories, Category, counts, getItem, items, Look, presets, Scene, scenes } from '../src/wardrobe';

const palette = { ink: '#503840', muted: '#8c757a', rose: '#974d65', paper: '#faf7f1', line: '#e9dfd8' };
const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });
const nativeAnimation = Platform.OS !== 'web';
type Snapshot = { look: Look; scene: Scene };

function Action({ title, onPress, secondary = false, icon = 'arrow', disabled = false }: { title: string; onPress: () => void; secondary?: boolean; icon?: string; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [s.action, secondary && s.secondary, disabled && { opacity: .35 }, pressed && { opacity: .75, transform: [{ scale: .98 }] }]}>
    <Text style={[s.actionText, secondary && { color: palette.ink }]}>{title}</Text><Icon name={icon} color={secondary ? palette.ink : '#fff5ec'} size={22} />
  </Pressable>;
}

export default function RoseGame() {
  const { width } = useWindowDimensions();
  const [hydrated, setHydrated] = useState(Platform.OS !== 'web');
  const mobile = hydrated && width < 760;
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [scene, setScene] = useState<Scene>('school');
  const [look, setLook] = useState<Look>({ ...presets.school });
  const [category, setCategory] = useState<Category>('top');
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [changes, setChanges] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const enter = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const pop = useRef(new Animated.Value(1)).current;
  const scroll = useRef<ScrollView>(null);
  const sceneInfo = scenes.find(v => v.id === scene)!;
  const visibleItems = items.filter(v => v.category === category);

  useEffect(() => {
    setHydrated(true);
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then(value => { if (alive) setReducedMotion(value); });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => { alive = false; sub.remove(); };
  }, []);

  useEffect(() => {
    enter.setValue(reducedMotion ? 1 : 0);
    const animation = Animated.timing(enter, { toValue: 1, duration: reducedMotion ? 0 : 850, easing: Easing.out(Easing.cubic), useNativeDriver: nativeAnimation });
    animation.start(); scroll.current?.scrollTo({ y: 0, animated: false });
    return () => animation.stop();
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || phase === 'play') { float.setValue(0); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeAnimation }),
      Animated.timing(float, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeAnimation }),
    ]));
    animation.start(); return () => animation.stop();
  }, [phase, reducedMotion]);

  function animateChoice() {
    if (reducedMotion) return;
    pop.stopAnimation(); pop.setValue(.97);
    Animated.spring(pop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: nativeAnimation }).start();
  }
  function update(next: Look, nextScene = scene, message = 'Kombin güncellendi') {
    setHistory(old => [...old.slice(-29), { look: { ...look }, scene }]);
    setLook({ ...next }); setScene(nextScene); setChanges(n => n + 1); setAnnouncement(message); animateChoice();
  }
  function undo() {
    const last = history[history.length - 1]; if (!last) return;
    setLook(last.look); setScene(last.scene); setHistory(old => old.slice(0, -1)); setAnnouncement('Son seçim geri alındı'); animateChoice();
  }
  function randomize() {
    const next = { ...look };
    categories.forEach(c => { const choices = items.filter(i => i.category === c.id); next[c.id] = choices[Math.floor(Math.random() * choices.length)].id; });
    update(next, scene, 'Sürpriz kombinin hazır');
  }
  function newGame() {
    setLook({ ...presets.school }); setScene('school'); setCategory('top'); setHistory([]); setChanges(0); setAnnouncement(''); setPhase('play');
  }
  const animatedStyle = { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [26, 0] }) }] };
  const figureHeight = mobile ? (phase === 'play' ? 350 : 410) : (phase === 'play' ? 555 : 575);

  function stage(isCover = false) {
    return <View style={[s.stage, { height: figureHeight + 42 }, isCover && s.coverStage]}>
      <View style={StyleSheet.absoluteFill}><Room scene={scene} /></View>
      <View style={s.stageTag}><View style={s.statusDot} /><Text style={s.stageTagText}>{phase === 'done' ? 'KOMBİN TAMAMLANDI' : 'ROSE’UN DÜNYASI'}</Text></View>
      <Animated.View style={{ transform: [{ scale: pop }, { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }] }}>
        <View accessible accessibilityLabel={`Rose: ${categories.map(c => getItem(look[c.id]).name).join(', ')}`}><Character look={look} height={figureHeight} /></View>
      </Animated.View>
      {phase !== 'play' && <>
        <Animated.View style={[s.floatingStar, { top: 90, left: '15%', transform: [{ rotate: float.interpolate({ inputRange: [0, 1], outputRange: ['-12deg', '12deg'] }) }] }]}><Icon name="spark" size={36} color="#b79561" /></Animated.View>
        <Animated.View style={[s.floatingStar, { bottom: 150, right: '12%', opacity: float.interpolate({ inputRange: [0, 1], outputRange: [.4, 1] }) }]}><Icon name="spark" size={24} color="#a66477" /></Animated.View>
      </>}
      <View style={s.nameBadge}><Text style={s.nameText}>Rose</Text><Text style={s.nameSub}>17 · stil günlüğüm</Text></View>
    </View>;
  }

  return <View style={s.root}>
    <StatusBar style="dark" />
    <ScrollView ref={scroll} contentContainerStyle={s.scrollContent}>
      <View style={[s.header, mobile && s.headerMobile]}>
        <View style={s.brand}><Icon name="rose" size={32} color={palette.rose} /><Text style={s.logo}>rose<Text style={s.logoDot}>.</Text></Text><Text style={s.brandSuffix}>GAMES</Text></View>
        <Text style={s.headerNote}>{mobile ? 'STİL STÜDYOSU' : 'KÜÇÜK SEÇİMLER, KOCAMAN BİR DÜNYA'}</Text>
      </View>
      <Animated.View style={[s.main, animatedStyle]}>
        {phase === 'intro' && <View style={[s.intro, mobile && s.column]}>
          <View style={[s.introCopy, mobile && s.introCopyMobile]}>
            <View style={s.eyebrowRow}><View style={s.line} /><Text style={s.eyebrow}>ROSE STİL STÜDYOSU</Text></View>
            <Text accessibilityRole="header" style={[s.heroTitle, mobile && { fontSize: 48 }]}>Bir gün.{ '\n' }Binbir <Text style={s.italic}>Rose.</Text></Text>
            <Text style={s.introDescription}>Rose’un dolabına hoş geldin. Okul zili, antrenman saati ya da evde tatlı bir mola… Bugünün hikâyesini sen giydir.</Text>
            <View style={s.scenePreview}>{scenes.map(v => <View key={v.id} style={s.previewPill}><Icon name={v.id} size={19} /><Text style={s.previewLabel}>{v.name}</Text></View>)}</View>
            <View style={s.introAction}><Action title="Oyuna başla" onPress={newGame} /></View>
            <Text style={s.introHint}>33 parça · 3 farklı dünya · Senin hayal gücün</Text>
            <View style={s.editorialNote}><Text style={s.noteNumber}>01 /</Text><Text style={s.noteText}>En güzel kombin,{ '\n' }kendin gibi hissettiğin.</Text></View>
          </View>
          <View style={[s.introVisual, mobile && { width: '100%' }]}>{stage(true)}<View style={s.visualCaption}><Text style={s.caption}>THE EVERYDAY COLLECTION</Text><Text style={s.caption}>✧  ROSE 2026</Text></View></View>
        </View>}
        {phase === 'play' && <>
          <View style={[s.gameTitleRow, mobile && s.column]}>
            <View><Text style={s.eyebrow}>BUGÜNÜN HİKÂYESİ</Text><Text accessibilityRole="header" style={[s.gameTitle, mobile && { fontSize: 29 }]}>{sceneInfo.title}</Text><Text style={s.subtitle}>{sceneInfo.subtitle}</Text></View>
            <View style={s.sceneTabs}>{scenes.map(v => <Pressable key={v.id} accessibilityRole="button" accessibilityLabel={`${v.name} stilini uygula`} aria-pressed={scene === v.id} accessibilityState={{ selected: scene === v.id }}
              onPress={() => update(presets[v.id], v.id, `${v.name} stili uygulandı`)} style={({ pressed }) => [s.sceneTab, scene === v.id && s.sceneActive, pressed && { opacity: .7 }]}><Icon name={v.id} size={20} color={scene === v.id ? '#fff9ee' : palette.muted} /><Text style={[s.sceneLabel, scene === v.id && { color: '#fff9ee' }]}>{v.name}</Text></Pressable>)}</View>
          </View>
          <View style={[s.workbench, mobile && s.column]}>
            <View style={[s.characterPanel, mobile && { width: '100%' }]}>{stage()}<View style={s.stageFooter}><Text style={s.stageFooterText}>Kendi tarzın, kendi kuralların.</Text><Icon name="spark" size={19} /></View></View>
            <View style={s.wardrobe}>
              <View style={s.wardrobeHeading}><View><Text style={s.eyebrow}>KARIŞTIR & EŞLEŞTİR</Text><Text accessibilityRole="header" style={s.wardrobeTitle}>Rose’un dolabı</Text></View><View style={s.countBadge}><Text style={s.countText}>33</Text><Text style={s.countSmall}>PARÇA</Text></View></View>
              <View style={s.categoryRow}>{categories.map(c => <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={`${c.label}, ${counts[c.id]} seçenek`} aria-pressed={category === c.id} accessibilityState={{ selected: category === c.id }} onPress={() => setCategory(c.id)} style={[s.category, category === c.id && s.categoryActive]}><Icon name={c.symbol} color={category === c.id ? palette.rose : '#9d8b8b'} size={24} /><Text style={[s.categoryLabel, category === c.id && { color: palette.rose, fontWeight: '700' }]}>{c.label}</Text></Pressable>)}</View>
              <View style={s.gridHeader}><Text style={s.gridHeading}>{categories.find(c => c.id === category)!.label}</Text><Text style={s.gridCount}>{visibleItems.length} seçenek · dokun ve dene</Text></View>
              <View style={s.grid}>{visibleItems.map(i => {
                const selected = look[category] === i.id;
                return <Pressable key={i.id} accessibilityRole="button" accessibilityLabel={`${i.name} seç`} aria-pressed={selected} accessibilityState={{ selected }} onPress={() => { if (!selected) update({ ...look, [category]: i.id }, scene, `${i.name} seçildi`); }} style={({ pressed }) => [s.itemCard, selected && s.itemSelected, pressed && { backgroundColor: '#f1e5df' }]}>
                  <View style={s.itemTop}><View style={[s.colorDot, { backgroundColor: i.color }]} />{selected && <View style={s.selectedCheck}><Icon name="check" color="#fff" size={14} /></View>}</View>
                  <ItemArt item={i} size={mobile ? 73 : 81} /><Text numberOfLines={2} style={[s.itemName, selected && { color: palette.rose }]}>{i.name}</Text>
                </Pressable>;
              })}</View>
              <View style={s.tools}><Pressable accessibilityRole="button" accessibilityLabel="Son seçimi geri al" accessibilityState={{ disabled: history.length === 0 }} disabled={history.length === 0} onPress={undo} style={[s.tool, history.length === 0 && { opacity: .35 }]}><Icon name="back" size={19} /><Text style={s.toolLabel}>Geri al</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Sürpriz kombin oluştur" onPress={randomize} style={s.tool}><Icon name="shuffle" size={19} /><Text style={s.toolLabel}>Bana ilham ver</Text></Pressable></View>
              <Action title="Kombini bitir" icon="check" onPress={() => setPhase('done')} />
              <Text accessibilityLiveRegion="polite" style={s.feedback}>{announcement || 'Bir parçaya dokun; Rose üzerinde hemen denesin.'}</Text>
            </View>
          </View>
        </>}
        {phase === 'done' && <View style={[s.intro, mobile && s.column]}>
          <View style={[s.introCopy, mobile && s.introCopyMobile]}>
            <View style={s.eyebrowRow}><Icon name="spark" size={22} /><Text style={s.eyebrow}>STİL GÜNLÜĞÜ · TAMAMLANDI</Text></View>
            <Text accessibilityRole="header" style={[s.heroTitle, mobile && { fontSize: 46 }]}>İşte senin{ '\n' }<Text style={s.italic}>Rose’un.</Text></Text>
            <Text style={s.introDescription}>Her parçaya kendi dokunuşunu kattın. Bu hikâyenin stilisti sensin!</Text>
            <View style={s.lookSummary}>{categories.map(c => <View key={c.id} style={s.summaryRow}><Text style={s.summaryLabel}>{c.label}</Text><Text style={s.summaryValue}>{getItem(look[c.id]).name}</Text></View>)}</View>
            <Text style={s.completedNote}>{sceneInfo.name} günü · {changes} stil dokunuşu</Text>
            <View style={s.endActions}><Action title="Yeni oyuna başla" onPress={newGame} /><Action title="Düzenlemeye devam et" secondary icon="back" onPress={() => setPhase('play')} /></View>
          </View>
          <View style={[s.introVisual, mobile && { width: '100%' }]}>{stage(true)}<View style={s.visualCaption}><Text style={s.caption}>STYLED BY YOU</Text><Text style={s.caption}>✧  ROSE GAMES</Text></View></View>
        </View>}
      </Animated.View>
      <View style={s.footer}><Text style={s.footerBrand}>rose games</Text><Text style={s.footerText}>Hayal et. Dene. Kendin ol.</Text><Text style={s.footerEdition}>STİL GÜNLÜĞÜ / 01</Text></View>
    </ScrollView>
  </View>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.paper }, scrollContent: { flexGrow: 1, paddingHorizontal: 22 },
  header: { width: '100%', maxWidth: 1240, alignSelf: 'center', minHeight: 96, borderBottomWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 15 },
  headerMobile: { minHeight: 76 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 7 }, logo: { fontFamily: serif, fontSize: 44, letterSpacing: -2, color: palette.ink }, logoDot: { color: palette.rose }, brandSuffix: { fontSize: 9, letterSpacing: 3, color: palette.muted, marginLeft: 8, marginTop: 12 }, headerNote: { fontSize: 9, letterSpacing: 1.8, color: palette.muted },
  main: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingVertical: 34 }, column: { flexDirection: 'column' },
  intro: { flexDirection: 'row', gap: 42, alignItems: 'center', paddingVertical: 14 }, introCopy: { flex: 1, paddingVertical: 20, paddingLeft: 20 }, introCopyMobile: { paddingLeft: 0, paddingVertical: 0, width: '100%' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 }, line: { width: 30, height: 1, backgroundColor: palette.rose }, eyebrow: { fontSize: 10, letterSpacing: 2.1, fontWeight: '600', color: palette.rose },
  heroTitle: { fontSize: 70, fontFamily: serif, color: palette.ink, letterSpacing: -2 }, italic: { fontStyle: 'italic', color: palette.rose }, introDescription: { maxWidth: 390, fontSize: 16, lineHeight: 27, color: palette.muted, marginTop: 22 },
  scenePreview: { flexDirection: 'row', gap: 12, marginTop: 26 }, previewPill: { flexDirection: 'row', gap: 6, alignItems: 'center', borderWidth: 1, borderColor: palette.line, borderRadius: 30, paddingHorizontal: 14, paddingVertical: 8 }, previewLabel: { fontSize: 12, color: palette.ink },
  introAction: { maxWidth: 270, marginTop: 30, width: '100%' }, introHint: { color: palette.muted, fontSize: 11, marginTop: 14 }, editorialNote: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderColor: palette.line, paddingTop: 24, marginTop: 40, maxWidth: 340 }, noteNumber: { color: '#be9c8d', fontFamily: serif, fontSize: 28 }, noteText: { fontFamily: serif, fontStyle: 'italic', fontSize: 19, lineHeight: 26, color: palette.muted },
  introVisual: { width: '47%', maxWidth: 550 }, stage: { justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', borderTopLeftRadius: 140, borderTopRightRadius: 140, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: '#e9ded5', paddingBottom: 12 }, coverStage: { borderTopLeftRadius: 240, borderTopRightRadius: 240 }, stageTag: { position: 'absolute', top: 25, flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 2 }, statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#ae7a7d' }, stageTagText: { color: '#957b7e', fontSize: 8, letterSpacing: 1.6 },
  nameBadge: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#fffaf0ed', borderWidth: 1, borderColor: '#e5d5ca', borderRadius: 6, paddingHorizontal: 19, paddingVertical: 11, transform: [{ rotate: '-5deg' }] }, nameText: { fontFamily: serif, fontStyle: 'italic', fontSize: 26, color: palette.ink }, nameSub: { fontSize: 8, letterSpacing: .5, color: palette.muted, marginTop: 3 }, floatingStar: { position: 'absolute' }, visualCaption: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16 }, caption: { color: palette.muted, fontSize: 8, letterSpacing: 1.7 },
  action: { backgroundColor: palette.rose, minHeight: 53, borderRadius: 7, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 21, gap: 16 }, actionText: { color: '#fff9ef', fontSize: 14, fontWeight: '600' }, secondary: { backgroundColor: '#eee7df', borderWidth: 1, borderColor: palette.line },
  gameTitleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 22, marginBottom: 28 }, gameTitle: { fontFamily: serif, fontSize: 36, letterSpacing: -.8, color: palette.ink, marginTop: 8 }, subtitle: { color: palette.muted, fontSize: 13, marginTop: 8 }, sceneTabs: { flexDirection: 'row', backgroundColor: '#eee8df', borderRadius: 8, padding: 5, marginTop: 13 }, sceneTab: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 11, paddingHorizontal: 17, borderRadius: 5 }, sceneActive: { backgroundColor: palette.rose }, sceneLabel: { color: palette.muted, fontSize: 12, fontWeight: '600' },
  workbench: { flexDirection: 'row', gap: 40, alignItems: 'flex-start' }, characterPanel: { width: '43%' }, stageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 17, paddingHorizontal: 8 }, stageFooterText: { color: palette.muted, fontFamily: serif, fontSize: 15, fontStyle: 'italic' },
  wardrobe: { flex: 1, width: '100%', minWidth: 0 }, wardrobeHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }, wardrobeTitle: { fontFamily: serif, fontSize: 32, color: palette.ink, letterSpacing: -.7, marginTop: 8 }, countBadge: { backgroundColor: '#f0e6e0', width: 48, height: 48, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }, countText: { fontFamily: serif, fontSize: 20, color: palette.rose }, countSmall: { fontSize: 6, letterSpacing: 1, color: palette.muted },
  categoryRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: palette.line, gap: 2 }, category: { flex: 1, alignItems: 'center', gap: 8, paddingBottom: 13, borderBottomWidth: 2, borderColor: 'transparent', minHeight: 66 }, categoryActive: { borderColor: palette.rose }, categoryLabel: { color: palette.muted, fontSize: 10 }, gridHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 17 }, gridHeading: { fontSize: 13, fontWeight: '600', color: palette.ink }, gridCount: { fontSize: 10, color: palette.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 }, itemCard: { width: '31.5%', flexGrow: 1, maxWidth: '33%', minHeight: 140, backgroundColor: '#f3eee7', borderRadius: 8, borderWidth: 1, borderColor: '#e9e0d8', alignItems: 'center', paddingHorizontal: 5, paddingTop: 7, paddingBottom: 10 }, itemSelected: { backgroundColor: '#f6e8e8', borderColor: '#b9788b', borderWidth: 1.5 }, itemTop: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 17, paddingHorizontal: 3 }, colorDot: { width: 8, height: 8, borderRadius: 4 }, selectedCheck: { width: 17, height: 17, borderRadius: 9, backgroundColor: palette.rose, justifyContent: 'center', alignItems: 'center' }, itemName: { fontSize: 10, textAlign: 'center', lineHeight: 14, color: palette.ink, marginTop: 6, fontWeight: '500' },
  tools: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }, tool: { flexDirection: 'row', gap: 7, alignItems: 'center', minHeight: 44, paddingHorizontal: 4 }, toolLabel: { color: palette.muted, fontSize: 11 }, feedback: { minHeight: 32, textAlign: 'center', marginTop: 11, fontSize: 10, color: palette.muted },
  lookSummary: { marginVertical: 22, maxWidth: 390 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: palette.line, gap: 8 }, summaryLabel: { color: palette.muted, fontSize: 12 }, summaryValue: { color: palette.ink, fontSize: 12, fontWeight: '600', flexShrink: 1 }, completedNote: { color: palette.rose, fontSize: 11, marginBottom: 20 }, endActions: { gap: 10, maxWidth: 340, width: '100%' },
  footer: { maxWidth: 1240, width: '100%', alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTopWidth: 1, borderColor: palette.line, paddingVertical: 24, marginTop: 22 }, footerBrand: { fontFamily: serif, fontSize: 18, color: palette.rose }, footerText: { fontSize: 10, color: palette.muted }, footerEdition: { fontSize: 8, letterSpacing: 1.4, color: palette.muted },
});

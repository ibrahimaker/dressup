import React from 'react';
import { SvgXml } from 'react-native-svg';
import { getItem, Item, Look, Scene } from './wardrobe';

const head = `<path fill="#211f29" d="M106 142Q92 58 143 35Q180 20 217 37Q268 60 253 143L263 292Q233 310 207 277H153Q127 310 97 292Z"/>
<path fill="#302d39" stroke="none" d="M122 99Q101 198 112 279L128 260Q114 184 139 96ZM229 99Q258 184 239 281L222 260Q246 180 217 96Z"/>
<path fill="#f8e4dc" d="M161 190H199V227Q180 244 161 227Z"/><path fill="#e9c4bc" stroke="none" d="M161 193Q180 211 199 193V210Q181 225 161 210Z"/>
<ellipse cx="121" cy="146" rx="9" ry="15" fill="#f2d5cc"/><ellipse cx="239" cy="146" rx="9" ry="15" fill="#f2d5cc"/>
<path fill="none" stroke="#a75d74" stroke-width="2.2" d="M115 157Q120 151 125 157Q124 164 120 167Q116 164 115 157ZM235 157Q240 151 245 157Q244 164 240 167Q236 164 235 157"/>
<path fill="#fae8df" d="M123 98Q126 57 180 57Q234 57 237 98L233 151Q224 190 180 209Q136 190 127 151Z"/>
<path fill="#25232d" d="M113 132Q103 67 143 43Q166 29 180 42Q165 77 128 108L120 135ZM180 42Q198 28 220 47Q258 73 246 135L231 107Q202 94 180 42Z"/>
<path fill="#302d39" d="M132 83Q107 111 123 148Q110 174 130 204L139 194Q125 168 138 142Q124 112 144 90ZM228 83Q253 111 237 148Q250 174 230 204L221 194Q235 168 222 142Q236 112 216 90Z"/>
<path fill="none" stroke="#4d4351" stroke-width="3" d="M132 83Q158 65 176 44M184 44Q203 67 230 86"/>
<path fill="none" stroke="#59434a" stroke-width="3.4" d="M132 123Q150 113 169 122M191 122Q210 113 228 123"/>
<path fill="#fffdf6" d="M128 140Q149 126 172 140Q151 153 130 146ZM188 140Q211 126 232 140L230 146Q209 153 188 140Z"/>
<ellipse cx="153" cy="140" rx="7.2" ry="8.2" fill="#514047"/><ellipse cx="207" cy="140" rx="7.2" ry="8.2" fill="#514047"/>
<ellipse cx="153" cy="141" rx="3.8" ry="5.8" fill="#24212a"/><ellipse cx="207" cy="141" rx="3.8" ry="5.8" fill="#24212a"/>
<g fill="#fff" stroke="none"><circle cx="150.5" cy="137" r="2.3"/><circle cx="204.5" cy="137" r="2.3"/></g>
<path fill="none" stroke="#352a33" stroke-width="3.2" d="M124 136Q149 124 172 140M188 140Q211 124 236 136"/>
<path fill="none" stroke="#735b63" stroke-width="1.15" d="M130 146Q151 153 171 140M189 140Q209 153 230 146"/>
<path fill="none" stroke="#352a33" stroke-width="1.4" d="M129 134L123 130M133 132L128 127M231 134L237 130M227 132L232 127"/>
<path fill="none" stroke="#cd9e95" stroke-width="1.5" d="M178 149Q175 160 175 166Q180 170 186 165M176 170Q180 172 184 169"/>
<path fill="#b67a83" stroke="none" d="M165 181Q173 175 180 179Q187 175 195 181Q188 193 180 194Q172 193 165 181Z"/><path fill="none" stroke="#8e5f6b" stroke-width="1.2" d="M166 182Q180 186 194 182"/>`;

const body = `<path fill="#fae5db" d="M148 221Q135 220 128 237L109 311 102 350Q100 364 110 369Q121 370 122 354L130 317 151 263ZM212 221Q225 220 232 237L251 311 258 350Q260 364 250 369Q239 370 238 354L230 317 209 263Z"/>
<path fill="#f7e0d6" d="M148 330H212L210 444 205 573H189L180 420 171 573H155L150 444Z"/>
<path fill="none" stroke="#dbb6ab" d="M157 451L160 544M203 451L200 544M109 349L112 357M251 349L248 357"/>
<path fill="#f5e9d9" d="M151 222L162 216Q180 232 198 216L209 222 216 344H144Z"/>
<path fill="#d5b8ab" d="M146 337H214L219 407H188L180 380 172 407H141Z"/>`;

const wrap = (content: string, viewBox = '0 0 360 640') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><g stroke="#765665" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${content}</g></svg>`;

export function characterSvg(look: Look) {
  return wrap(`<ellipse cx="180" cy="608" rx="88" ry="12" fill="#977b80" opacity=".15" stroke="none"/>${head}${body}${getItem(look.shoes).art}${getItem(look.bottom).art}${getItem(look.top).art}${getItem(look.makeup).art}${getItem(look.accessory).art}`);
}
export function Character({ look, height = 530 }: { look: Look; height?: number }) {
  return <SvgXml xml={characterSvg(look)} width={height * 360 / 640} height={height} />;
}
export function ItemArt({ item, size = 96 }: { item: Item; size?: number }) {
  const box = { top: '95 202 170 155', bottom: '110 325 140 250', shoes: '115 521 130 86', accessory: '94 45 170 145', makeup: '114 110 132 93' }[item.category];
  const content = item.category === 'makeup' ? head + item.art : item.art;
  return <SvgXml xml={wrap(content, box)} width={size} height={size} />;
}

export function Icon({ name, color = '#704250', size = 24 }: { name: string; color?: string; size?: number }) {
  const art: Record<string, string> = {
    shirt: '<path d="M8 4L3 7 1 12 6 14 8 10V22H20V10L22 14 27 12 25 7 20 4Q14 10 8 4Z"/>',
    skirt: '<path d="M8 5H20L25 23Q14 27 3 23Z M8 9H20M10 10L8 22M14 10V23M18 10L20 22"/>',
    shoe: '<path d="M6 8H12L16 15 25 18V24H3V16ZM4 20H24M13 12L10 14M16 15L13 17"/>',
    bow: '<path d="M13 13Q1 1 2 12V21Q7 23 13 15M15 13Q27 1 26 12V21Q21 23 15 15"/><circle cx="14" cy="14" r="3"/>',
    spark: '<path d="M14 2L17 11 26 14 17 17 14 26 11 17 2 14 11 11ZM24 2V7M22 4H27"/>',
    shuffle: '<path d="M3 7H7Q11 7 14 14T21 21H25M21 17L25 21 21 25M3 21H7Q10 21 12 17M16 10Q18 7 21 7H25M21 3L25 7 21 11"/>',
    back: '<path d="M10 5L2 12 10 19M3 12H17Q27 12 24 23"/>',
    arrow: '<path d="M3 14H25M18 7L25 14 18 21"/>',
    check: '<path d="M5 14L11 20 24 7"/>',
    rose: '<path d="M14 15Q2 12 6 5Q11 0 16 6Q23 0 26 8Q27 17 14 19Q3 21 2 12Q1 6 6 5M14 15Q10 6 17 7Q22 8 17 13Z M14 19V28M14 25Q3 25 5 20Q11 19 14 25"/>',
    school: '<path d="M3 12L14 4 25 12M5 12V25H23V12M11 25V17H17V25M10 12H18"/>',
    sport: '<circle cx="14" cy="14" r="11"/><path d="M3 14H25M14 3V25M6 6Q23 14 6 22M22 6Q5 14 22 22"/>',
    home: '<path d="M2 13L14 3 26 13M6 11V25H22V11M11 25V17H17V25"/>',
  };
  return <SvgXml width={size} height={size} xml={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${art[name] || art.spark}</g></svg>`} />;
}

export function Room({ scene }: { scene: Scene }) {
  const school = scene === 'school', sport = scene === 'sport';
  const wall = school ? '#eee5dc' : sport ? '#e2e8de' : '#e8e0e9';
  const room = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" preserveAspectRatio="xMidYMid slice">
    <rect width="500" height="650" fill="${wall}"/><path fill="#fffaf1" opacity=".55" d="M90 550V220A160 160 0 0 1 410 220V550Z"/>
    <path fill="none" stroke="#c7b8b0" opacity=".65" d="M78 550V216A172 172 0 0 1 422 216V550M90 550V220A160 160 0 0 1 410 220V550"/>
    <rect x="28" y="120" width="84" height="151" rx="40" fill="${sport ? '#c5d9d0' : '#d1dce0'}"/><path stroke="#fffaf0" stroke-width="5" d="M70 121V271M28 195H112"/>
    <path fill="#fffdf4" opacity=".25" d="M30 275L230 565H390L112 272Z"/>
    <rect y="553" width="500" height="97" fill="${sport ? '#bccbb8' : '#d7c4b7'}"/><path stroke="#b5a495" opacity=".45" d="M0 580H500M0 620H500M90 553L40 650M250 553V650M410 553L460 650"/>
    <ellipse cx="250" cy="577" rx="165" ry="32" fill="#f7f0e5"/>
    ${school ? '<rect x="373" y="221" width="98" height="120" rx="3" fill="#b69577"/><rect x="380" y="228" width="84" height="106" fill="#dbc8aa"/><path fill="#fff4d8" d="M391 246L418 242 421 277 394 280Z"/><path fill="#c28890" d="M429 262L452 265 449 302 426 299Z"/><circle cx="403" cy="248" r="3" fill="#aa6475"/><path stroke="#baaf97" d="M397 258L415 255M398 264L412 262"/>' : sport ? '<rect x="379" y="218" width="76" height="310" rx="14" fill="#b0c3b4"/><path stroke="#8fa797" d="M405 230V506M430 230V506"/><rect x="416" y="340" width="5" height="30" rx="2" fill="#f9f0dc"/><circle cx="431" cy="531" r="26" fill="#c9926d"/><path stroke="#8e674f" fill="none" d="M407 531H456M431 505V557M411 514Q446 531 411 549"/>' : '<rect x="375" y="393" width="103" height="145" rx="30" fill="#b99cab"/><rect x="366" y="446" width="113" height="80" rx="23" fill="#c8b0bb"/><path stroke="#826b78" stroke-width="5" d="M382 522V556M466 522V556"/><path fill="#eee1d3" d="M385 420L432 414 444 457 392 467Z"/>'}
    <path stroke="#667f67" stroke-width="4" fill="none" d="M43 509V417M43 462L24 437M43 443L62 418"/><g fill="#879c7f"><ellipse cx="24" cy="431" rx="11" ry="22" transform="rotate(-30 24 431)"/><ellipse cx="63" cy="413" rx="11" ry="22" transform="rotate(30 63 413)"/><ellipse cx="42" cy="410" rx="10" ry="20"/></g><path fill="#bd907a" d="M23 499H63L58 547H28Z"/>
    </svg>`;
  return <SvgXml xml={room} width="100%" height="100%" />;
}

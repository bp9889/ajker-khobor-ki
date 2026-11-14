#!/usr/bin/env python3
"""Draws the cast of original cartoon characters used for stories about people (a batter, a striker, a minister...).
They are invented characters for a job or a situation. They are never drawn to look like a real person.
Run:  python3 scripts/make-cast.py   -> writes public/art/<tag>.svg and public/art/<tag>-n.svg"""
import math, os

INK = '#1A1714'
S = f'stroke="{INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"'
S2 = f'stroke="{INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"'
SKIN = {'a': '#C68642', 'b': '#8D5524', 'c': '#E0AC69', 'd': '#F1C27D', 'e': '#5C3A21'}

def wedges(a, b):
    out = []
    for i in range(24):
        a1, a2 = math.radians(180 + i * 7.5), math.radians(180 + (i + 1) * 7.5)
        p1 = (200 + 520 * math.cos(a1), 250 + 520 * math.sin(a1)); p2 = (200 + 520 * math.cos(a2), 250 + 520 * math.sin(a2))
        out.append(f'<path d="M200 250 L{p1[0]:.1f} {p1[1]:.1f} L{p2[0]:.1f} {p2[1]:.1f} Z" fill="{a if i % 2 == 0 else b}"/>')
    return ''.join(out)

def frame(label, day_bg, day_alt, body, night=False, shadow=(200, 230, 110)):
    bg, alt = ('#4A5D90', '#5A6FA3') if night else (day_bg, day_alt)
    floor = '#2A3550' if night else '#E9DFC9'
    sky = ''
    if night:
        sky = ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="#F3EFE7" opacity=".7"/>' for x, y in [(40, 30), (90, 58), (150, 24), (250, 40), (300, 70), (210, 18)])
        sky += f'<circle cx="352" cy="44" r="20" fill="#F3EFE7" stroke="{INK}" stroke-width="3"/><circle cx="362" cy="38" r="17" fill="{bg}"/>'
    else:
        sky = f'<circle cx="352" cy="44" r="20" fill="#FFD400" stroke="{INK}" stroke-width="3"/>'
    dash = '#FFD400' if night else '#FFFFFF'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" role="img" aria-label="{label}"><defs><clipPath id="c"><rect width="400" height="260" rx="14"/></clipPath></defs>'
            f'<g clip-path="url(#c)"><rect width="400" height="260" fill="{bg}"/>{wedges(bg, alt)}{sky}<rect y="232" width="400" height="28" fill="{floor}"/>'
            f'<ellipse cx="{shadow[0]}" cy="{shadow[1]}" rx="{shadow[2]}" ry="9" fill="{INK}" opacity=".18"/>{body}</g>'
            f'<rect x="2" y="2" width="396" height="256" rx="13" fill="none" stroke="{INK}" stroke-width="4"/>'
            f'<rect x="11" y="11" width="378" height="238" rx="8" fill="none" stroke="{dash}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/></svg>')

def face(cx, cy, r, mood='grin', brow=0):
    e = r * 0.36; ey = cy - r * 0.08; er = r * 0.2
    eyes = (f'<circle cx="{cx-e:.1f}" cy="{ey:.1f}" r="{er:.1f}" fill="#fff" {S2}/><circle cx="{cx+e:.1f}" cy="{ey:.1f}" r="{er:.1f}" fill="#fff" {S2}/>'
            f'<circle cx="{cx-e+1.5:.1f}" cy="{ey+0.5:.1f}" r="{er*0.48:.1f}" fill="{INK}"/><circle cx="{cx+e+1.5:.1f}" cy="{ey+0.5:.1f}" r="{er*0.48:.1f}" fill="{INK}"/>')
    by = ey - er - 4
    brows = (f'<path d="M{cx-e-er:.1f} {by+brow:.1f} L{cx-e+er:.1f} {by-brow:.1f} M{cx+e-er:.1f} {by-brow:.1f} L{cx+e+er:.1f} {by+brow:.1f}" fill="none" {S2}/>')
    my = cy + r * 0.36
    if mood == 'grin':
        mouth = f'<path d="M{cx-r*0.46:.1f} {my:.1f} Q{cx:.1f} {my+r*0.8:.1f} {cx+r*0.46:.1f} {my:.1f} Z" fill="#7A1F1F" {S2}/><path d="M{cx-r*0.3:.1f} {my+r*0.16:.1f} H{cx+r*0.3:.1f}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
    elif mood == 'shout':
        mouth = f'<ellipse cx="{cx:.1f}" cy="{my+r*0.15:.1f}" rx="{r*0.3:.1f}" ry="{r*0.38:.1f}" fill="#7A1F1F" {S2}/>'
    elif mood == 'smirk':
        mouth = f'<path d="M{cx-r*0.4:.1f} {my+3:.1f} Q{cx+r*0.1:.1f} {my+r*0.4:.1f} {cx+r*0.5:.1f} {my-r*0.1:.1f}" fill="none" {S2}/>'
    else:  # worry
        mouth = f'<path d="M{cx-r*0.35:.1f} {my+r*0.3:.1f} Q{cx:.1f} {my-r*0.1:.1f} {cx+r*0.35:.1f} {my+r*0.3:.1f}" fill="none" {S2}/>'
    cheeks = f'<circle cx="{cx-r*0.62:.1f}" cy="{cy+r*0.25:.1f}" r="{r*0.15:.1f}" fill="#FF6B6B" opacity=".35"/><circle cx="{cx+r*0.62:.1f}" cy="{cy+r*0.25:.1f}" r="{r*0.15:.1f}" fill="#FF6B6B" opacity=".35"/>'
    return cheeks + eyes + brows + mouth

def head(cx, cy, r, skin, mood='grin', brow=0):
    ear = f'<circle cx="{cx-r:.1f}" cy="{cy+2:.1f}" r="{r*0.2:.1f}" fill="{skin}" {S2}/><circle cx="{cx+r:.1f}" cy="{cy+2:.1f}" r="{r*0.2:.1f}" fill="{skin}" {S2}/>'
    return ear + f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{skin}" {S}/>' + face(cx, cy, r, mood, brow)

def star(cx, cy, r1, r2, n, fill):
    pts = []
    for i in range(n * 2):
        a = math.pi * i / n - math.pi / 2; r = r1 if i % 2 == 0 else r2
        pts.append(f'{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" {S2}/>'

def conf(items):
    return ''.join(f'<rect x="{x}" y="{y}" width="8" height="5" rx="1.5" fill="{c}" transform="rotate({r} {x+4} {y+2})"/>' for x, y, c, r in items)

# ---------------------------------------------------------------- 1. the batter
def batter():
    k = SKIN['a']
    b = ''
    # stumps
    for x in (300, 318, 336): b += f'<rect x="{x}" y="132" width="9" height="90" rx="3" fill="#fff" {S2}/>'
    b += f'<rect x="297" y="126" width="26" height="7" rx="3" fill="#FFD400" {S2}/><rect x="316" y="126" width="26" height="7" rx="3" fill="#FFD400" {S2}/>'
    # legs and pads
    b += f'<rect x="124" y="190" width="20" height="38" rx="8" fill="{k}" {S}/><rect x="152" y="190" width="20" height="38" rx="8" fill="{k}" {S}/>'
    b += f'<rect x="119" y="178" width="30" height="50" rx="10" fill="#fff" {S}/><rect x="147" y="178" width="30" height="50" rx="10" fill="#fff" {S}/>'
    b += f'<path d="M122 194 h24 M122 208 h24 M150 194 h24 M150 208 h24" fill="none" stroke="{INK}" stroke-width="2"/>'
    b += f'<ellipse cx="132" cy="229" rx="17" ry="6" fill="#fff" {S2}/><ellipse cx="166" cy="229" rx="17" ry="6" fill="#fff" {S2}/>'
    # torso
    b += f'<path d="M112 186 Q108 132 130 128 H170 Q192 132 188 186 Z" fill="#D21F14" {S}/><path d="M112 168 H188" stroke="#FFD400" stroke-width="7"/><path d="M112 168 H188" fill="none" {S2} opacity=".0"/>'
    # back arm and bat
    b += f'<g transform="rotate(-48 205 128)"><rect x="196" y="38" width="16" height="64" rx="6" fill="#E8C98A" {S}/><rect x="190" y="98" width="28" height="12" rx="6" fill="#2F5BEA" {S}/><rect x="198" y="106" width="12" height="44" rx="5" fill="#2F5BEA" {S}/></g>'
    b += f'<path d="M176 140 Q196 150 208 128" fill="none" stroke="#D21F14" stroke-width="16" stroke-linecap="round"/><path d="M176 140 Q196 150 208 128" fill="none" stroke="{INK}" stroke-width="3.5" stroke-linecap="round" opacity=".0"/>'
    b += f'<circle cx="208" cy="128" r="9" fill="{k}" {S2}/>'
    # head with helmet
    b += head(150, 96, 30, k, 'shout', 3)
    b += f'<path d="M118 92 Q118 58 150 58 Q182 58 182 92 L176 80 Q150 72 124 80 Z" fill="#00924A" {S}/><path d="M118 92 L116 112 Q124 116 128 108" fill="#00924A" {S}/><path d="M150 58 V74" stroke="#fff" stroke-width="5"/>'
    # ball and burst
    b += f'<path d="M232 108 L262 84 M236 124 L270 96 M232 138 L262 120" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>'
    b += f'<circle cx="286" cy="76" r="13" fill="#D21F14" {S}/><path d="M276 70 q10 6 20 12" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>'
    b += star(334, 62, 30, 20, 9, '#FFD400') + f'<text x="334" y="70" font-family="Arial Black,Impact,Arial,sans-serif" font-weight="900" font-size="19" text-anchor="middle" fill="{INK}">SIX!</text>'
    return frame('Batter hits a six illustration', '#5CC086', '#7FD3A0', b, shadow=(200, 230, 130)), frame('Batter hits a six illustration', '', '', b, True, (200, 230, 130))

# ---------------------------------------------------------------- 2. the striker
def striker():
    k = SKIN['e']
    b = ''
    # goal and net
    b += f'<path d="M262 220 V96 H386 V220" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    for x in range(278, 386, 16): b += f'<path d="M{x} 100 V218" stroke="#fff" stroke-width="1.5" opacity=".7"/>'
    for y in range(112, 220, 16): b += f'<path d="M264 {y} H384" stroke="#fff" stroke-width="1.5" opacity=".7"/>'
    b += conf([(40, 40, '#FFD400', 20), (80, 70, '#D21F14', -30), (300, 36, '#2F5BEA', 40), (350, 80, '#fff', 10), (120, 30, '#fff', -20), (230, 54, '#FFD400', 60), (60, 120, '#2F5BEA', 30), (240, 30, '#D21F14', -50)])
    # shadow smaller: jumping
    # legs in the air
    b += f'<path d="M168 176 L150 214" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="M168 176 L150 214" fill="none" stroke="{INK}" stroke-width="3" opacity="0"/>'
    b += f'<path d="M186 176 L214 206" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round"/>'
    b += f'<path d="M150 200 L146 214 M214 196 L222 204" stroke="{k}" stroke-width="12" stroke-linecap="round"/><ellipse cx="143" cy="220" rx="14" ry="7" fill="{INK}"/><ellipse cx="226" cy="208" rx="14" ry="7" fill="{INK}" transform="rotate(30 226 208)"/>'
    b += f'<path d="M158 170 L196 170 L200 188 L154 188 Z" fill="#2F5BEA" {S}/>'
    # torso jersey
    b += f'<path d="M152 172 Q146 124 162 118 H196 Q212 124 206 172 Z" fill="#FFD400" {S}/><path d="M150 140 H208 M150 156 H208" stroke="#00924A" stroke-width="7"/>'
    # arms up
    b += f'<path d="M160 126 L122 82" fill="none" stroke="#FFD400" stroke-width="15" stroke-linecap="round"/><path d="M198 126 L238 84" fill="none" stroke="#FFD400" stroke-width="15" stroke-linecap="round"/>'
    b += f'<circle cx="118" cy="76" r="9" fill="{k}" {S2}/><circle cx="242" cy="78" r="9" fill="{k}" {S2}/>'
    # head: big hair
    b += f'<circle cx="179" cy="82" r="32" fill="{INK}" {S}/>' + head(179, 94, 28, k, 'shout', 3)
    b += f'<path d="M150 80 Q154 56 179 58 Q204 56 208 80 Q196 70 179 72 Q162 70 150 80 Z" fill="{INK}" {S2}/>'
    # ball
    b += f'<circle cx="236" cy="222" r="14" fill="#fff" {S}/><path d="M236 214 l7 5 -3 8 h-8 l-3 -8 z" fill="{INK}"/>'
    return frame('Striker celebrates a goal illustration', '#7AA7FF', '#9DC0FF', b, shadow=(185, 230, 60)), frame('Striker celebrates a goal illustration', '', '', b, True, (185, 230, 60))

# ---------------------------------------------------------------- 3. the minister
def minister():
    k = SKIN['c']
    b = ''
    # paper planes of promises
    for (x, y, r, sc) in [(90, 70, -20, 1.0), (60, 120, -10, 0.8), (320, 60, 14, 0.9)]:
        b += f'<g transform="translate({x} {y}) rotate({r}) scale({sc})"><path d="M0 0 L46 -12 L18 6 Z" fill="#fff" {S2}/><path d="M18 6 L46 -12 L22 18 Z" fill="#E9DFC9" {S2}/></g>'
    b += f'<path d="M20 84 Q40 92 70 76 M24 130 Q44 136 54 122" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>'
    # torso behind podium
    b += f'<path d="M150 152 Q148 118 172 112 H228 Q252 118 250 152 Z" fill="#1F2A44" {S}/><path d="M200 114 L190 140 L200 152 L210 140 Z" fill="#fff" {S2}/><path d="M200 120 L195 150 H205 Z" fill="#D21F14" {S2}/>'
    # raised arm
    b += f'<path d="M244 130 Q276 112 268 76" fill="none" stroke="#1F2A44" stroke-width="16" stroke-linecap="round"/><circle cx="268" cy="70" r="9" fill="{k}" {S2}/><path d="M268 62 V48" stroke="{k}" stroke-width="7" stroke-linecap="round"/>'
    # head
    b += head(200, 84, 28, k, 'smirk', -3)
    b += f'<path d="M172 80 Q172 54 200 54 Q228 54 228 80 Q214 66 200 68 Q186 66 172 80 Z" fill="#8A8A8A" {S2}/>'
    b += f'<circle cx="187" cy="80" r="11" fill="none" {S2}/><circle cx="213" cy="80" r="11" fill="none" {S2}/><path d="M198 80 H202" {S2}/>'
    # podium
    b += f'<path d="M140 148 L260 148 L272 224 L128 224 Z" fill="#D21F14" {S}/><path d="M138 148 H262" fill="none" stroke="{INK}" stroke-width="7" stroke-linecap="round"/>'
    b += f'<circle cx="200" cy="188" r="15" fill="#FFD400" {S2}/>' + star(200, 188, 9, 4, 5, '#D21F14')
    b += f'<path d="M158 146 V126 q0 -8 8 -10" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><ellipse cx="168" cy="112" rx="8" ry="11" fill="#5B6470" {S2}/>'
    return frame('Minister gives a speech illustration', '#FFB000', '#FFD400', b, shadow=(200, 230, 100)), frame('Minister gives a speech illustration', '', '', b, True, (200, 230, 100))

# ---------------------------------------------------------------- 4. the leader balancing the world
def leader():
    k = SKIN['b']
    b = ''
    # desk
    b += f'<rect x="70" y="178" width="260" height="46" rx="8" fill="#B5651D" {S}/><path d="M70 192 H330" stroke="{INK}" stroke-width="2.5" opacity=".5"/>'
    b += f'<rect x="108" y="190" width="42" height="12" rx="3" fill="#FFD400" {S2}/>'
    # torso behind desk
    b += f'<path d="M150 182 Q144 134 170 126 H230 Q256 134 250 182 Z" fill="#2A3550" {S}/><path d="M200 128 L188 152 L200 182 L212 152 Z" fill="#fff" {S2}/><path d="M200 134 L194 178 H206 Z" fill="#00924A" {S2}/>'
    # raised arm balancing globe
    b += f'<path d="M238 140 Q282 120 262 76" fill="none" stroke="#2A3550" stroke-width="16" stroke-linecap="round"/><circle cx="262" cy="70" r="9" fill="{k}" {S2}/><path d="M262 62 V52" stroke="{k}" stroke-width="7" stroke-linecap="round"/>'
    # globe
    b += f'<circle cx="262" cy="30" r="24" fill="#2F9BEA" {S}/><path d="M246 18 q10 -6 16 4 q-4 10 -12 8 q-6 -4 -4 -12 Z M264 34 q10 -4 14 6 q-6 10 -14 4 Z" fill="#5CC086" {S2}/><path d="M236 30 H288" stroke="#fff" stroke-width="2" opacity=".6"/>'
    b += f'<path d="M232 14 q-6 14 0 28 M292 14 q6 14 0 28" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 6"/>'
    # head: sweaty
    b += head(196, 86, 28, k, 'worry', 5)
    b += f'<path d="M168 78 Q172 56 196 56 Q222 56 224 78 Q214 64 196 66 Q178 64 168 78 Z" fill="{INK}" {S2}/>'
    b += f'<path d="M166 62 q-6 8 0 14 q6 -6 0 -14 Z M226 56 q-6 8 0 14 q6 -6 0 -14 Z" fill="#9BD7FF" {S2}/>'
    # other hand holds phone
    b += f'<path d="M158 144 Q128 160 134 176" fill="none" stroke="#2A3550" stroke-width="16" stroke-linecap="round"/><circle cx="136" cy="176" r="9" fill="{k}" {S2}/>'
    return frame('Leader balancing the world illustration', '#6C8CFF', '#8FA8FF', b, shadow=(200, 230, 140)), frame('Leader balancing the world illustration', '', '', b, True, (200, 230, 140))

# ---------------------------------------------------------------- 5. the founder
def founder():
    k = SKIN['d']
    b = ''
    # rocket launching out of the laptop
    b += f'<path d="M292 140 q-12 -18 0 -36 q-12 -14 0 -30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 8"/>'
    b += f'<g transform="translate(292 60) rotate(14)"><path d="M0 -40 Q16 -20 14 12 H-14 Q-16 -20 0 -40 Z" fill="#fff" {S}/><path d="M0 -40 Q8 -34 11 -26 H-11 Q-8 -34 0 -40 Z" fill="#D21F14" {S2}/><circle cx="0" cy="-6" r="6" fill="#2F9BEA" {S2}/><path d="M-14 6 L-26 22 L-14 18 Z M14 6 L26 22 L14 18 Z" fill="#D21F14" {S2}/><path d="M-8 14 Q0 40 8 14 Z" fill="#FFD400" {S2}/></g>'
    b += star(340, 40, 8, 3.5, 4, '#FFD400') + star(250, 28, 6, 2.5, 4, '#fff') + star(350, 110, 7, 3, 4, '#fff')
    # legs
    b += f'<rect x="150" y="190" width="22" height="36" rx="8" fill="#2A3550" {S}/><rect x="182" y="190" width="22" height="36" rx="8" fill="#2A3550" {S}/><ellipse cx="160" cy="228" rx="18" ry="7" fill="#fff" {S2}/><ellipse cx="196" cy="228" rx="18" ry="7" fill="#fff" {S2}/>'
    # hoodie
    b += f'<path d="M134 196 Q128 140 152 132 H206 Q232 140 226 196 Z" fill="#2F5BEA" {S}/><path d="M168 134 Q180 156 192 134" fill="#1F44B8" {S2}/><path d="M172 144 V166 M188 144 V166" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M148 176 H212 V194 H148 Z" fill="#1F44B8" opacity=".55"/>'
    # laptop arm (right) and laptop
    b += f'<path d="M222 150 Q250 160 262 148" fill="none" stroke="#2F5BEA" stroke-width="16" stroke-linecap="round"/>'
    b += f'<path d="M244 146 L276 146 L290 120 L258 120 Z" fill="#E9DFC9" {S}/><path d="M258 120 L290 120 L292 96 L262 96 Z" fill="#5B6470" {S}/><path d="M270 118 q8 -8 6 -16" fill="none" stroke="#FFD400" stroke-width="3" stroke-linecap="round"/>'
    # coffee arm
    b += f'<path d="M144 150 Q116 140 112 112" fill="none" stroke="#2F5BEA" stroke-width="16" stroke-linecap="round"/><circle cx="112" cy="106" r="9" fill="{k}" {S2}/>'
    b += f'<path d="M100 60 H126 L122 100 H104 Z" fill="#fff" {S}/><path d="M102 74 H124" stroke="#D21F14" stroke-width="7"/><path d="M110 50 q-6 -8 0 -14 M118 50 q-6 -8 0 -14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
    # head with bun and headphones
    b += f'<circle cx="180" cy="70" r="13" fill="{INK}" {S2}/>' + head(180, 100, 28, k, 'grin', -2)
    b += f'<path d="M152 96 Q152 64 180 64 Q208 64 208 96 Q196 80 180 82 Q164 80 152 96 Z" fill="{INK}" {S2}/>'
    b += f'<path d="M152 100 Q150 140 168 140 M208 100 Q210 140 192 140" fill="none" stroke="#FFD400" stroke-width="5" stroke-linecap="round"/><rect x="144" y="94" width="10" height="22" rx="5" fill="#FFD400" {S2}/><rect x="206" y="94" width="10" height="22" rx="5" fill="#FFD400" {S2}/>'
    return frame('Founder launches a startup illustration', '#B39DFF', '#CDBFFF', b, shadow=(185, 230, 90)), frame('Founder launches a startup illustration', '', '', b, True, (185, 230, 90))

# ---------------------------------------------------------------- 6. the scientist
def scientist():
    k = SKIN['a']
    b = ''
    # bench with beakers
    b += f'<rect x="250" y="176" width="130" height="48" rx="6" fill="#B5651D" {S}/>'
    b += f'<path d="M270 176 V150 H288 V176" fill="#fff" fill-opacity=".7" {S2}/><path d="M272 164 H286 V176 H272 Z" fill="#D21F14"/><path d="M310 176 L304 140 H330 L324 176 Z" fill="#fff" fill-opacity=".7" {S2}/><path d="M308 160 H326 L324 176 H310 Z" fill="#2F5BEA"/>'
    b += f'<circle cx="352" cy="162" r="14" fill="#fff" fill-opacity=".7" {S2}/><path d="M340 164 Q352 172 364 164 Q364 174 352 176 Q340 174 340 164 Z" fill="#FFD400"/><path d="M352 148 V138 M346 138 H358" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
    # idea bulb
    b += f'<path d="M150 56 V44 M122 62 L112 54 M178 62 L188 54" stroke="#FFD400" stroke-width="4" stroke-linecap="round"/><circle cx="150" cy="30" r="0" fill="none"/>'
    b += f'<path d="M136 36 Q136 14 150 14 Q164 14 164 36 Q164 44 158 50 H142 Q136 44 136 36 Z" fill="#FFD400" {S2}/><path d="M142 54 H158 M144 58 H156" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>'
    # legs
    b += f'<rect x="130" y="192" width="20" height="34" rx="8" fill="#2A3550" {S}/><rect x="162" y="192" width="20" height="34" rx="8" fill="#2A3550" {S}/><ellipse cx="138" cy="228" rx="16" ry="6" fill="{INK}"/><ellipse cx="174" cy="228" rx="16" ry="6" fill="{INK}"/>'
    # lab coat
    b += f'<path d="M110 206 Q104 140 132 130 H182 Q210 140 204 206 Z" fill="#fff" {S}/><path d="M157 132 V206" stroke="{INK}" stroke-width="2.5"/><rect x="120" y="160" width="22" height="18" rx="3" fill="none" {S2}/><path d="M126 160 V150 M134 160 V148" stroke="#D21F14" stroke-width="3" stroke-linecap="round"/><path d="M157 132 L142 150 L157 160 L172 150 Z" fill="#E9DFC9" {S2}/>'
    # arm with flask
    b += f'<path d="M190 146 Q224 150 232 122" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/><path d="M190 146 Q224 150 232 122" fill="none" stroke="{INK}" stroke-width="2.5" stroke-linecap="round" opacity="0"/><circle cx="232" cy="116" r="9" fill="{k}" {S2}/>'
    b += f'<path d="M226 60 H238 V84 L256 112 Q260 122 250 124 H216 Q206 122 210 112 L226 84 Z" fill="#fff" fill-opacity=".75" {S}/><path d="M218 104 Q232 96 248 104 L256 114 Q258 122 250 122 H216 Q208 120 212 114 Z" fill="#5CC086"/>'
    b += f'<circle cx="224" cy="48" r="6" fill="#9BE3B5" {S2}/><circle cx="244" cy="38" r="9" fill="#9BE3B5" {S2}/><circle cx="262" cy="56" r="5" fill="#9BE3B5" {S2}/><circle cx="236" cy="22" r="4" fill="#9BE3B5" {S2}/>'
    # other arm waving
    b += f'<path d="M124 148 Q94 150 90 118" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/><circle cx="88" cy="112" r="9" fill="{k}" {S2}/>'
    # head: crazy hair and goggles
    b += f'<circle cx="124" cy="92" r="15" fill="#E9E9E9" {S2}/><circle cx="190" cy="92" r="15" fill="#E9E9E9" {S2}/><circle cx="140" cy="68" r="17" fill="#E9E9E9" {S2}/><circle cx="174" cy="68" r="17" fill="#E9E9E9" {S2}/><circle cx="157" cy="62" r="17" fill="#E9E9E9" {S2}/>'
    b += head(157, 98, 27, k, 'grin', -3)
    b += f'<rect x="132" y="68" width="50" height="18" rx="9" fill="#2F5BEA" {S2}/><circle cx="144" cy="77" r="6" fill="#9BD7FF" {S2}/><circle cx="170" cy="77" r="6" fill="#9BD7FF" {S2}/>'
    return frame('Scientist makes a discovery illustration', '#3FB8AF', '#6FD0C8', b, shadow=(200, 230, 140)), frame('Scientist makes a discovery illustration', '', '', b, True, (200, 230, 140))

# ---------------------------------------------------------------- 7. the performer
def performer():
    k = SKIN['b']
    b = ''
    # spotlight cone
    b += f'<path d="M60 0 L140 0 L260 232 L40 232 Z" fill="#fff" opacity=".22"/>'
    # notes and stars
    b += f'<g fill="{INK}"><circle cx="300" cy="70" r="7"/><path d="M306 70 V36 L322 42" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><circle cx="346" cy="112" r="7"/><path d="M352 112 V80" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/></g>'
    b += star(290, 120, 10, 4, 5, '#FFD400') + star(240, 40, 8, 3, 5, '#fff') + star(350, 170, 9, 3.5, 5, '#FFD400')
    # legs and boots
    b += f'<rect x="140" y="192" width="20" height="34" rx="8" fill="#1A1714" {S}/><rect x="170" y="192" width="20" height="34" rx="8" fill="#1A1714" {S}/><path d="M126 226 H162 V234 H122 Z M166 226 H204 V234 H166 Z" fill="#FFD400" {S2}/>'
    # sparkly jacket
    b += f'<path d="M122 198 Q116 138 144 128 H188 Q216 138 210 198 Z" fill="#D21F14" {S}/><path d="M166 130 V198" stroke="{INK}" stroke-width="2.5"/>' + star(140, 160, 7, 3, 5, '#FFD400') + star(194, 150, 7, 3, 5, '#FFD400') + star(150, 186, 6, 2.5, 5, '#FFD400') + star(186, 182, 6, 2.5, 5, '#FFD400')
    # arm with mic
    b += f'<path d="M198 144 Q232 130 236 104" fill="none" stroke="#D21F14" stroke-width="16" stroke-linecap="round"/><circle cx="238" cy="98" r="9" fill="{k}" {S2}/><rect x="232" y="68" width="14" height="26" rx="7" fill="#5B6470" {S2}/><path d="M232 78 H246" stroke="{INK}" stroke-width="2"/>'
    b += f'<path d="M134 146 Q108 150 100 120" fill="none" stroke="#D21F14" stroke-width="16" stroke-linecap="round"/><circle cx="98" cy="114" r="9" fill="{k}" {S2}/><path d="M98 105 V92" stroke="{k}" stroke-width="7" stroke-linecap="round"/>'
    # head, big curly hair, shades
    for (x, y) in [(132, 72), (150, 56), (172, 54), (192, 70), (126, 96), (198, 96)]: b += f'<circle cx="{x}" cy="{y}" r="17" fill="{INK}" {S2}/>'
    b += head(165, 98, 28, k, 'shout', -3)
    b += f'<path d="M136 78 Q165 66 194 78 L192 92 Q178 98 168 90 Q165 86 162 90 Q152 98 138 92 Z" fill="{INK}" {S2}/><path d="M146 80 L154 84" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>'
    return frame('Performer on stage illustration', '#F28C00', '#FFA733', b, shadow=(165, 230, 90)), frame('Performer on stage illustration', '', '', b, True, (165, 230, 90))

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'art')
    for tag, fn in [('batter', batter), ('striker', striker), ('minister', minister), ('leader', leader), ('founder', founder), ('scientist', scientist), ('performer', performer)]:
        d, n = fn()
        open(os.path.join(out, tag + '.svg'), 'w').write(d)
        open(os.path.join(out, tag + '-n.svg'), 'w').write(n)
        print('wrote', tag)

#!/usr/bin/env python3
"""Same cast as make-cast.py, redrawn as chunky toy-brick figures (a generic building-block look: studded head, blocky body, claw hands).
They are invented characters for a job or a situation, never a likeness of a real person.
Usage: python3 scripts/make-cast-bricks.py [outdir]   (default /tmp/lab/brick)"""
import importlib.util, math, os, sys
spec = importlib.util.spec_from_file_location('cast', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'make-cast.py'))
C = importlib.util.module_from_spec(spec); spec.loader.exec_module(C)
INK, S, S2, star, conf, frame = C.INK, C.S, C.S2, C.star, C.conf, C.frame
Y = '#FFD400'

def studs(x, y, n, gap=16, r=5, fill='#fff', op=.55):
    return ''.join(f'<ellipse cx="{x+i*gap}" cy="{y}" rx="{r}" ry="{r*0.55}" fill="{fill}" {S2} opacity="1"/>' for i in range(n))

def arm(sx, sy, a, col, L=36):
    ex, ey = sx - L * math.sin(math.radians(a)), sy + L * math.cos(math.radians(a))
    r = f'<g transform="rotate({a} {sx} {sy})"><rect x="{sx-7}" y="{sy-4}" width="14" height="{L}" rx="5" fill="{col}" {S}/></g>'
    hand = f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="8" fill="{Y}" {S2}/><path d="M{ex-3:.1f} {ey-1:.1f} h6" stroke="{INK}" stroke-width="2.5" stroke-linecap="round"/>'
    return r, hand, (ex, ey)

def face(cx, cy, mood='smile', fem=False):
    eyes = f'<circle cx="{cx-8}" cy="{cy-3}" r="2.6" fill="{INK}"/><circle cx="{cx+8}" cy="{cy-3}" r="2.6" fill="{INK}"/>'
    if mood == 'smile': m = f'<path d="M{cx-9} {cy+6} Q{cx} {cy+17} {cx+9} {cy+6}" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>'
    elif mood == 'shout': m = f'<ellipse cx="{cx}" cy="{cy+9}" rx="6" ry="7" fill="#7A1F1F" {S2}/>'
    else: m = f'<path d="M{cx-8} {cy+12} Q{cx} {cy+5} {cx+8} {cy+12}" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>'
    if fem:
        eyes += f'<path d="M{cx-11} {cy-5} l-3 -3 M{cx+11} {cy-5} l3 -3" stroke="{INK}" stroke-width="2.2" stroke-linecap="round"/>'
        m = m.replace(f'stroke="{INK}" stroke-width="2.6"', 'stroke="#C0392B" stroke-width="3.4"')
    return eyes + m

def fig(cx, torso, legs, la=0, ra=0, mood='smile', base=228, hair='', torso_extra='', front='', sleeve=None, fem=None):
    sleeve = sleeve or torso
    top = base - 130
    b = ''
    # legs
    b += f'<rect x="{cx-23}" y="{base-34}" width="23" height="34" fill="{legs}" {S}/><rect x="{cx}" y="{base-34}" width="23" height="34" fill="{legs}" {S}/><rect x="{cx-23}" y="{base-44}" width="46" height="13" rx="3" fill="{legs}" {S}/>'
    # long hair behind the shoulders (female characters)
    if fem: b += f'<path d="M{cx-23} {top+14} Q{cx-29} {top+62} {cx-19} {top+66} H{cx+19} Q{cx+29} {top+62} {cx+23} {top+14} Z" fill="{fem}" {S}/>'
    # arms behind torso
    al, hl, pl = arm(cx - 25, top + 52, la, sleeve); ar, hr, pr = arm(cx + 25, top + 52, ra, sleeve)
    b += al + ar
    # torso
    b += f'<rect x="{cx-23}" y="{top+44}" width="46" height="{base-44-(top+44)+3}" rx="4" fill="{torso}" {S}/>' + torso_extra
    b += hl + hr
    # head
    b += f'<rect x="{cx-8}" y="{top-4}" width="16" height="9" rx="3" fill="{Y}" {S2}/><rect x="{cx-19}" y="{top+4}" width="38" height="38" rx="9" fill="{Y}" {S}/>'
    b += face(cx, top + 24, mood, bool(fem)) + hair + front
    return b, pl, pr


# ------------------------------------------------------------------ country flags (simple, flat) so a reader sees which country a story is about
def flag(cc, x, y, w=54, h=34):
    h3 = h / 3; g = ''
    if cc == 'bd': g = f'<rect width="{w}" height="{h}" fill="#006A4E"/><circle cx="{w*.45}" cy="{h/2}" r="{h*.3}" fill="#E8261A"/>'
    elif cc == 'us':
        g = ''.join(f'<rect y="{i*h/7:.1f}" width="{w}" height="{h/7+.3:.1f}" fill="{"#D21F14" if i % 2 == 0 else "#fff"}"/>' for i in range(7)) + f'<rect width="{w*.45:.1f}" height="{h*4/7:.1f}" fill="#2A3F8F"/>' + ''.join(f'<circle cx="{5+i*8}" cy="{5+j*7}" r="1.4" fill="#fff"/>' for i in range(3) for j in range(3))
    elif cc == 'in': g = f'<rect width="{w}" height="{h3+.3}" fill="#FF9933"/><rect y="{h3}" width="{w}" height="{h3+.3}" fill="#fff"/><rect y="{2*h3}" width="{w}" height="{h3+.3}" fill="#138808"/><circle cx="{w/2}" cy="{h/2}" r="4.5" fill="none" stroke="#1F2A8A" stroke-width="1.6"/>'
    elif cc == 'ru': g = f'<rect width="{w}" height="{h3+.3}" fill="#fff"/><rect y="{h3}" width="{w}" height="{h3+.3}" fill="#1C4FA0"/><rect y="{2*h3}" width="{w}" height="{h3+.3}" fill="#D21F14"/>'
    elif cc == 'cn': g = f'<rect width="{w}" height="{h}" fill="#DE2910"/>' + star(10, 9, 6, 2.6, 5, '#FFDE00').replace(S2, 'stroke="none"') + ''.join(star(x2, y2, 2, .9, 5, '#FFDE00').replace(S2, 'stroke="none"') for x2, y2 in [(19, 4), (22, 8), (22, 13), (19, 17)])
    elif cc == 'uk': g = f'<rect width="{w}" height="{h}" fill="#1F3F8F"/><path d="M0 0 L{w} {h} M{w} 0 L0 {h}" stroke="#fff" stroke-width="6"/><path d="M0 0 L{w} {h} M{w} 0 L0 {h}" stroke="#D21F14" stroke-width="2"/><path d="M{w/2} 0 V{h} M0 {h/2} H{w}" stroke="#fff" stroke-width="9"/><path d="M{w/2} 0 V{h} M0 {h/2} H{w}" stroke="#D21F14" stroke-width="5"/>'
    elif cc == 'tr': g = f'<rect width="{w}" height="{h}" fill="#E30A17"/><circle cx="{w*.4:.1f}" cy="{h/2}" r="{h*.28:.1f}" fill="#fff"/><circle cx="{w*.46:.1f}" cy="{h/2}" r="{h*.23:.1f}" fill="#E30A17"/>' + star(w * .58, h / 2, 4, 1.7, 5, '#fff').replace(S2, 'stroke="none"')
    elif cc == 'ir': g = f'<rect width="{w}" height="{h3+.3}" fill="#239F40"/><rect y="{h3}" width="{w}" height="{h3+.3}" fill="#fff"/><rect y="{2*h3}" width="{w}" height="{h3+.3}" fill="#DA0000"/><circle cx="{w/2}" cy="{h/2}" r="3.2" fill="#DA0000"/>'
    elif cc == 'il': g = f'<rect width="{w}" height="{h}" fill="#fff"/><rect y="4" width="{w}" height="4.5" fill="#0038B8"/><rect y="{h-8.5}" width="{w}" height="4.5" fill="#0038B8"/><path d="M{w/2} {h/2-6} L{w/2+5.2} {h/2+3} H{w/2-5.2} Z M{w/2} {h/2+6} L{w/2+5.2} {h/2-3} H{w/2-5.2} Z" fill="none" stroke="#0038B8" stroke-width="1.5"/>'
    elif cc == 'ua': g = f'<rect width="{w}" height="{h/2+.3}" fill="#0057B7"/><rect y="{h/2}" width="{w}" height="{h/2+.3}" fill="#FFD700"/>'
    elif cc == 'fr': g = f'<rect width="{w/3+.3}" height="{h}" fill="#0055A4"/><rect x="{w/3}" width="{w/3+.3}" height="{h}" fill="#fff"/><rect x="{2*w/3}" width="{w/3+.3}" height="{h}" fill="#EF4135"/>'
    elif cc == 'pk': g = f'<rect width="{w}" height="{h}" fill="#01411C"/><rect width="{w/4}" height="{h}" fill="#fff"/><circle cx="{w*.6:.1f}" cy="{h/2}" r="{h*.28:.1f}" fill="#fff"/><circle cx="{w*.65:.1f}" cy="{h/2-1.5:.1f}" r="{h*.24:.1f}" fill="#01411C"/>' + star(w * .72, h / 2 - 3, 3.5, 1.5, 5, '#fff').replace(S2, 'stroke="none"')
    return f'<g transform="translate({x} {y})"><clipPath id="fc{cc}"><rect width="{w}" height="{h}"/></clipPath><g clip-path="url(#fc{cc})">{g}</g><rect width="{w}" height="{h}" fill="none" {S2}/></g>'

def pole(cc, x, top, bottom=228):
    return f'<path d="M{x} {top-4} V{bottom}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><circle cx="{x}" cy="{top-6}" r="4" fill="{Y}" {S2}/>' + flag(cc, x + 2, top)

COUNTRIES = ['bd', 'us', 'in', 'ru', 'cn', 'uk', 'tr', 'ir', 'il', 'ua', 'fr', 'pk']


# ------------------------------------------------------------------ team kits: (shirt, stripe, shorts) so a sports story shows the right colours, never a particular player
FOOT = {'arg': ('#8FD0F5', '#FFFFFF', '#1A1714'), 'bra': ('#FFD400', '#00924A', '#2F5BEA'), 'por': ('#D21F14', '#00924A', '#00924A'), 'fra': ('#1F3F8F', '#FFFFFF', '#FFFFFF'),
        'eng': ('#FFFFFF', '#D21F14', '#1F3F8F'), 'esp': ('#D21F14', '#FFD400', '#1F3F8F'), 'ger': ('#FFFFFF', '#1A1714', '#1A1714'), 'bd': ('#00924A', '#D21F14', '#00924A'),
        'rma': ('#FFFFFF', '#FFD400', '#FFFFFF'), 'fcb': ('#A50044', '#004D98', '#1F3F8F'), 'mun': ('#D21F14', '#FFFFFF', '#FFFFFF'), 'liv': ('#D21F14', '#FFD400', '#D21F14'),
        'ars': ('#D21F14', '#FFFFFF', '#FFFFFF'), 'che': ('#2F5BEA', '#FFFFFF', '#2F5BEA'), 'mci': ('#8FD0F5', '#FFFFFF', '#FFFFFF')}
CRIC = {'bd': ('#00924A', '#D21F14', '#00924A'), 'ind': ('#2F5BEA', '#FF9933', '#2F5BEA'), 'pak': ('#01411C', '#FFFFFF', '#01411C'), 'aus': ('#FFD400', '#00924A', '#FFD400'),
        'eng': ('#1F3F8F', '#D21F14', '#1F3F8F'), 'rsa': ('#00924A', '#FFD400', '#00924A'), 'nz': ('#1A1714', '#FFFFFF', '#1A1714'), 'sl': ('#1F3F8F', '#FFD400', '#1F3F8F'), 'wi': ('#7A1F1F', '#FFD400', '#7A1F1F')}

# ------------------------------------------------------------------ scenes
def batter(cc=None, f=False):
    b = ''
    for x in (302, 320, 338): b += f'<rect x="{x}" y="136" width="10" height="90" rx="3" fill="#fff" {S2}/>'
    b += f'<rect x="298" y="130" width="28" height="7" rx="3" fill="{Y}" {S2}/><rect x="318" y="130" width="28" height="7" rx="3" fill="{Y}" {S2}/>'
    k = CRIC.get(cc, ('#D21F14', Y, '#FFFFFF'))
    f, pl, pr = fig(150, k[0], k[2] if cc else '#FFFFFF', la=-40, ra=-55, mood='shout', sleeve=k[0], fem=('#3A2418' if f else None), torso_extra=f'<rect x="127" y="176" width="46" height="9" fill="{k[1]}" {S2}/>')
    # helmet
    helm = f'<path d="M129 108 Q129 84 150 84 Q171 84 171 108 L165 98 Q150 92 135 98 Z" fill="{k[0] if cc else "#00924A"}" {S}/><rect x="126" y="104" width="10" height="22" rx="4" fill="{k[0] if cc else "#00924A"}" {S2}/><path d="M150 84 V94" stroke="#fff" stroke-width="4"/>'
    b += f.replace('</g></g>', '</g></g>', 1) + helm
    # bat across the hands
    b += f'<g transform="rotate(-40 {pr[0]} {pr[1]})"><rect x="{pr[0]-8}" y="{pr[1]-62}" width="16" height="74" rx="6" fill="#E8C98A" {S}/><rect x="{pr[0]-4}" y="{pr[1]+8}" width="8" height="26" rx="3" fill="#2F5BEA" {S}/></g>'
    b += f'<circle cx="262" cy="86" r="13" fill="#D21F14" {S}/><path d="M252 80 q10 6 20 12" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M214 104 L240 92 M216 118 L246 104" stroke="#fff" stroke-width="3" stroke-linecap="round"/>'
    b += star(336, 66, 30, 20, 9, Y) + f'<text x="336" y="74" font-family="Arial Black,Impact,Arial,sans-serif" font-weight="900" font-size="19" text-anchor="middle" fill="{INK}">SIX!</text>'
    return b

def striker(cc=None, f=False):
    b = f'<path d="M262 222 V98 H388 V222" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'
    for x in range(278, 388, 16): b += f'<path d="M{x} 102 V220" stroke="#fff" stroke-width="1.5" opacity=".7"/>'
    for y in range(114, 222, 16): b += f'<path d="M264 {y} H386" stroke="#fff" stroke-width="1.5" opacity=".7"/>'
    b += conf([(40, 40, Y, 20), (80, 70, '#D21F14', -30), (300, 36, '#2F5BEA', 40), (120, 30, '#fff', -20), (230, 54, Y, 60), (60, 120, '#2F5BEA', 30), (350, 80, '#fff', 10)])
    k = FOOT.get(cc, (Y, '#00924A', '#2F5BEA'))
    f, pl, pr = fig(170, k[0], k[2], la=150, ra=-150, mood='shout', sleeve=k[0], fem=(INK if f else None), torso_extra=f'<rect x="147" y="150" width="46" height="9" fill="{k[1]}"/><rect x="147" y="168" width="46" height="9" fill="{k[1]}"/>')
    hair = f'<path d="M151 100 Q151 82 170 82 Q189 82 189 100 Q180 92 170 92 Q160 92 151 100 Z" fill="{INK}" {S2}/>'
    b += f + hair + f'<circle cx="236" cy="222" r="14" fill="#fff" {S}/><path d="M236 214 l7 5 -3 8 h-8 l-3 -8 z" fill="{INK}"/>'
    return b

def minister(cc=None, f=False):
    b = ''
    for (x, y, r, sc) in ([(330, 64, 14, .9)] if cc else [(70, 70, -20, 1.0), (50, 124, -10, .8), (330, 64, 14, .9)]):
        b += f'<g transform="translate({x} {y}) rotate({r}) scale({sc})"><path d="M0 0 L46 -12 L18 6 Z" fill="#fff" {S2}/><path d="M18 6 L46 -12 L22 18 Z" fill="#E9DFC9" {S2}/></g>'
    f, pl, pr = fig(200, '#1F2A44', '#1F2A44', la=20, ra=-150, base=216, fem=('#4A2C1A' if f else None), torso_extra=f'<path d="M200 172 L193 150 L207 150 Z" fill="#fff" {S2}/><path d="M200 154 L196 182 H204 Z" fill="#D21F14" {S2}/>')
    hair = f'<path d="M181 100 Q181 82 200 82 Q219 82 219 100 Q210 92 200 92 Q190 92 181 100 Z" fill="{'#4A2C1A' if f else '#8A8A8A'}" {S2}/>'
    glasses = f'<circle cx="192" cy="{216-130+24-3}" r="7" fill="none" {S2}/><circle cx="208" cy="{216-130+24-3}" r="7" fill="none" {S2}/>'
    b += f + hair + glasses
    # brick podium
    b += f'<rect x="140" y="182" width="120" height="46" fill="#D21F14" {S}/><rect x="134" y="172" width="132" height="14" rx="3" fill="#B01810" {S}/>' + studs(150, 166, 8, gap=14, r=5, fill='#B01810')
    if cc: b += pole(cc, 96, 70)
    b += f'<circle cx="200" cy="206" r="12" fill="{Y}" {S2}/>' + star(200, 206, 8, 4, 5, '#D21F14')
    return b

def leader(cc=None, f=False):
    b = (pole(cc, 62, 66) if cc else '') + f'<rect x="70" y="182" width="260" height="46" fill="#B5651D" {S}/>' + studs(92, 176, 14, gap=18, r=6, fill='#B5651D')
    f, pl, pr = fig(196, '#2A3550', '#2A3550', la=-20, ra=-155, mood='worry', base=190, fem=('#2A1A12' if f else None), torso_extra=f'<path d="M196 100 L188 116 L196 128 L204 116 Z" fill="#fff" {S2}/><path d="M196 108 L192 130 H200 Z" fill="#00924A" {S2}/>')
    # the figure sits behind the desk: shift legs out of view by drawing desk after
    hair = f'<path d="M177 66 Q177 50 196 50 Q215 50 215 66 Q206 58 196 58 Q186 58 177 66 Z" fill="{INK}" {S2}/>'
    b += f + hair
    b = b.replace(f'<rect x="70" y="182"', f'<rect x="70" y="182"', 1)
    b += f'<rect x="70" y="182" width="260" height="46" fill="#B5651D" {S}/>' + studs(92, 176, 14, gap=18, r=6, fill='#B5651D')
    b += f'<path d="M168 62 q-6 8 0 14 q6 -6 0 -14 Z M226 56 q-6 8 0 14 q6 -6 0 -14 Z" fill="#9BD7FF" {S2}/>'
    gx, gy = pr[0], pr[1] - 30
    b += f'<circle cx="{gx}" cy="{gy}" r="24" fill="#2F9BEA" {S}/><path d="M{gx-16} {gy-12} q10 -6 16 4 q-4 10 -12 8 q-6 -4 -4 -12 Z M{gx+2} {gy+4} q10 -4 14 6 q-6 10 -14 4 Z" fill="#5CC086" {S2}/><rect x="{gx-6}" y="{gy-31}" width="12" height="7" rx="3" fill="#2F9BEA" {S2}/>'
    return b

def founder(cc=None, f=False):
    b = f'<path d="M292 140 q-12 -18 0 -36 q-12 -14 0 -30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 8"/>'
    b += f'<g transform="translate(292 60) rotate(14)"><path d="M0 -40 Q16 -20 14 12 H-14 Q-16 -20 0 -40 Z" fill="#fff" {S}/><path d="M0 -40 Q8 -34 11 -26 H-11 Q-8 -34 0 -40 Z" fill="#D21F14" {S2}/><circle cx="0" cy="-6" r="6" fill="#2F9BEA" {S2}/><path d="M-14 6 L-26 22 L-14 18 Z M14 6 L26 22 L14 18 Z" fill="#D21F14" {S2}/><path d="M-8 14 Q0 40 8 14 Z" fill="{Y}" {S2}/></g>'
    b += star(340, 40, 8, 3.5, 4, Y) + star(250, 28, 6, 2.5, 4, '#fff')
    f, pl, pr = fig(170, '#2F5BEA', '#2A3550', la=150, ra=-80, fem=('#5A3A24' if f else None), torso_extra=f'<rect x="153" y="166" width="34" height="14" rx="3" fill="#1F44B8" {S2}/>')
    hair = f'<circle cx="170" cy="82" r="12" fill="{INK}" {S2}/><path d="M151 100 Q151 84 170 84 Q189 84 189 100 Q180 92 170 92 Q160 92 151 100 Z" fill="{INK}" {S2}/>'
    phones = f'<path d="M150 104 Q150 82 170 82 Q190 82 190 104" fill="none" stroke="{Y}" stroke-width="5" stroke-linecap="round"/><rect x="144" y="102" width="9" height="18" rx="4" fill="{Y}" {S2}/><rect x="187" y="102" width="9" height="18" rx="4" fill="{Y}" {S2}/>'
    b += f + hair + phones
    # coffee in left hand, laptop in right
    b += f'<path d="M{pl[0]-12} {pl[1]-26} H{pl[0]+12} L{pl[0]+8} {pl[1]-2} H{pl[0]-8} Z" fill="#fff" {S}/><path d="M{pl[0]-11} {pl[1]-16} H{pl[0]+11}" stroke="#D21F14" stroke-width="6"/>'
    b += f'<path d="M{pr[0]-8} {pr[1]+4} L{pr[0]+34} {pr[1]+4} L{pr[0]+44} {pr[1]-16} L{pr[0]+2} {pr[1]-16} Z" fill="#E9DFC9" {S}/><path d="M{pr[0]+2} {pr[1]-16} L{pr[0]+44} {pr[1]-16} L{pr[0]+46} {pr[1]-44} L{pr[0]+4} {pr[1]-44} Z" fill="#5B6470" {S}/>'
    return b

def scientist(cc=None, f=False):
    b = f'<rect x="250" y="180" width="130" height="48" fill="#B5651D" {S}/>' + studs(266, 174, 7, gap=18, r=6, fill='#B5651D')
    b += f'<path d="M270 180 V154 H288 V180" fill="#fff" fill-opacity=".7" {S2}/><path d="M272 168 H286 V180 H272 Z" fill="#D21F14"/><path d="M310 180 L304 144 H330 L324 180 Z" fill="#fff" fill-opacity=".7" {S2}/><path d="M308 164 H326 L324 180 H310 Z" fill="#2F5BEA"/>'
    f, pl, pr = fig(150, '#FFFFFF', '#2A3550', la=120, ra=-100, fem=('#E9E9E9' if f else None), torso_extra=f'<path d="M150 134 V196" stroke="{INK}" stroke-width="2.5"/><rect x="128" y="160" width="14" height="12" rx="2" fill="none" {S2}/>', sleeve='#FFFFFF')
    hair = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#E9E9E9" {S2}/>' for x, y, r in [(128, 112, 10), (172, 112, 10), (136, 86, 12), (164, 86, 12), (150, 80, 12)])
    gog = f'<rect x="133" y="95" width="34" height="13" rx="6" fill="#2F5BEA" {S2}/><circle cx="141" cy="101.5" r="4" fill="#9BD7FF" {S2}/><circle cx="159" cy="101.5" r="4" fill="#9BD7FF" {S2}/>'
    b += f + hair + gog
    fx, fy = pr[0], pr[1]
    b += f'<path d="M{fx-6} {fy-52} H{fx+6} V{fy-30} L{fx+24} {fy-2} Q{fx+28} {fy+8} {fx+18} {fy+9} H{fx-18} Q{fx-28} {fy+8} {fx-24} {fy-2} L{fx-6} {fy-30} Z" fill="#fff" fill-opacity=".75" {S}/><path d="M{fx-22} {fy-6} Q{fx} {fy-14} {fx+22} {fy-6} L{fx+26} {fy+4} Q{fx+27} {fy+8} {fx+18} {fy+8} H{fx-18} Q{fx-27} {fy+8} {fx-26} {fy+4} Z" fill="#5CC086"/>'
    b += f'<circle cx="{fx-4}" cy="{fy-64}" r="6" fill="#9BE3B5" {S2}/><circle cx="{fx+14}" cy="{fy-76}" r="9" fill="#9BE3B5" {S2}/>'
    b += f'<path d="M132 52 Q132 30 150 30 Q168 30 168 52 Q168 60 162 64 H138 Q132 60 132 52 Z" fill="{Y}" {S2}/><rect x="140" y="66" width="20" height="8" rx="2" fill="#B5B5B5" {S2}/>'
    return b

def performer(cc=None, f=False):
    b = f'<path d="M60 0 L140 0 L260 232 L40 232 Z" fill="#fff" opacity=".22"/>'
    b += f'<g fill="{INK}"><circle cx="300" cy="70" r="7"/><path d="M306 70 V36 L322 42" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/><circle cx="346" cy="112" r="7"/><path d="M352 112 V80" fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/></g>'
    b += star(290, 120, 10, 4, 5, Y) + star(240, 40, 8, 3, 5, '#fff') + star(350, 170, 9, 3.5, 5, Y)
    f, pl, pr = fig(165, '#D21F14', '#1A1714', la=160, ra=-120, mood='shout', fem=(INK if f else None), torso_extra=star(165, 156, 8, 3.5, 5, Y) + star(150, 176, 6, 2.5, 5, Y) + star(181, 176, 6, 2.5, 5, Y))
    hair = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{INK}" {S2}/>' for x, y, r in [(144, 100, 13), (186, 100, 13), (150, 82, 14), (180, 82, 14), (165, 76, 14)])
    shades = f'<path d="M148 {228-130+22} H182 V{228-130+31} Q175 {228-130+35} 170 {228-130+30} Q165 {228-130+27} 160 {228-130+30} Q155 {228-130+35} 148 {228-130+31} Z" fill="{INK}" {S2}/>'
    b += f + hair + shades + f'<rect x="{pr[0]-6}" y="{pr[1]-30}" width="12" height="24" rx="6" fill="#5B6470" {S2}/>'
    return b

SCENES = [('batter', batter, '#5CC086', '#7FD3A0', 'Batter hits a six illustration'), ('striker', striker, '#7AA7FF', '#9DC0FF', 'Striker celebrates a goal illustration'),
          ('minister', minister, '#FFB000', '#FFD400', 'Minister gives a speech illustration'), ('leader', leader, '#6C8CFF', '#8FA8FF', 'Leader balancing the world illustration'),
          ('founder', founder, '#B39DFF', '#CDBFFF', 'Founder launches a startup illustration'), ('scientist', scientist, '#3FB8AF', '#6FD0C8', 'Scientist makes a discovery illustration'),
          ('performer', performer, '#F28C00', '#FFA733', 'Performer on stage illustration')]

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '/tmp/lab/brick'
    os.makedirs(out, exist_ok=True)
    for tag, fn, bg, alt, label in SCENES:
        for f in (False, True):
            sfx = '-f' if f else ''
            variants = [(None, '')]
            if tag in ('leader', 'minister'): variants += [(cc, '-' + cc) for cc in COUNTRIES]
            if tag == 'striker': variants += [(k, '-' + k) for k in FOOT]
            if tag == 'batter': variants += [(k, '-' + k) for k in CRIC]
            for cc, mid in variants:
                body = fn(cc, f)
                open(os.path.join(out, f'{tag}{mid}{sfx}.svg'), 'w').write(frame(label, bg, alt, body, shadow=(200, 230, 130)))
                open(os.path.join(out, f'{tag}{mid}{sfx}-n.svg'), 'w').write(frame(label, '', '', body, True, (200, 230, 130)))
    print('done')

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "images" / "projects"
VERIFY_DIR = ROOT / "verification" / "project-gifs"
BLACKBOARD_ICON = Path("C:/repos/BlackboardSearchExtension/assets/icons/icon512.png")

W, H = 640, 360
SCALE = 2
FRAMES = 36
DURATION_MS = 75

INK = (242, 246, 249)
MUTED = (158, 170, 181)
LINE = (49, 63, 74)
CYAN = (40, 212, 230)
TEAL = (44, 196, 164)
AMBER = (255, 174, 72)
PURPLE = (139, 84, 246)
PURPLE_LIGHT = (181, 143, 255)
RED = (245, 95, 105)


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def smooth(start: float, end: float, value: float) -> float:
    if start == end:
        return float(value >= end)
    t = clamp((value - start) / (end - start))
    return t * t * (3 - 2 * t)


def ease_out(value: float) -> float:
    value = clamp(value)
    return 1 - (1 - value) ** 3


def sc(value: float) -> int:
    return int(round(value * SCALE))


def rgba(color, alpha: int = 255):
    return tuple(color) + (int(clamp(alpha, 0, 255)),)


def scaled_box(rect):
    return tuple(sc(v) for v in rect)


def font(size: int, bold: bool = False):
    candidates = [
        Path("C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), sc(size))
    return ImageFont.load_default()


F9 = font(9)
F10 = font(10)
F11 = font(11)
F12 = font(12)
F13 = font(13)
F14 = font(14)
F16 = font(16, True)
F18 = font(18, True)
F22 = font(22, True)


def text(draw, xy, value, face=F12, fill=INK, anchor="la", alpha=255):
    draw.text((sc(xy[0]), sc(xy[1])), value, font=face, fill=rgba(fill, alpha), anchor=anchor)


def rounded(draw, rect, radius=8, fill=None, outline=None, width=1):
    draw.rounded_rectangle(
        scaled_box(rect),
        radius=sc(radius),
        fill=fill,
        outline=outline,
        width=sc(width),
    )


def line(draw, points, fill, width=1):
    draw.line([(sc(x), sc(y)) for x, y in points], fill=fill, width=sc(width), joint="curve")


def ellipse(draw, rect, fill=None, outline=None, width=1):
    draw.ellipse(scaled_box(rect), fill=fill, outline=outline, width=sc(width))


def polygon(draw, points, fill=None):
    draw.polygon([(sc(x), sc(y)) for x, y in points], fill=fill)


def gradient_frame(top, bottom):
    image = Image.new("RGB", (sc(W), sc(H)), top)
    draw = ImageDraw.Draw(image, "RGBA")
    for y in range(sc(H)):
        p = y / max(sc(H) - 1, 1)
        color = tuple(int(lerp(top[i], bottom[i], p)) for i in range(3))
        draw.line((0, y, sc(W), y), fill=rgba(color))
    return image


def glow(image, center, radius, color, alpha=80):
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    ellipse(draw, (cx - radius, cy - radius, cx + radius, cy + radius), fill=rgba(color, alpha))
    blurred = layer.filter(ImageFilter.GaussianBlur(sc(radius * 0.35)))
    image.paste(blurred, (0, 0), blurred)


def path_point(points, progress):
    progress = clamp(progress)
    lengths = []
    total = 0.0
    for a, b in zip(points, points[1:]):
        length = math.dist(a, b)
        lengths.append(length)
        total += length
    target = progress * total
    travelled = 0.0
    for index, length in enumerate(lengths):
        if travelled + length >= target:
            local = (target - travelled) / max(length, 1)
            return (
                lerp(points[index][0], points[index + 1][0], local),
                lerp(points[index][1], points[index + 1][1], local),
            )
        travelled += length
    return points[-1]


def path_slice(points, start, end, count=32):
    return [path_point(points, lerp(max(0, start), min(1, end), i / (count - 1))) for i in range(count)]


def blackboard_icon():
    if BLACKBOARD_ICON.exists():
        return Image.open(BLACKBOARD_ICON).convert("RGBA").resize((sc(38), sc(38)), Image.Resampling.LANCZOS)
    fallback = Image.new("RGBA", (sc(38), sc(38)), rgba((37, 18, 68)))
    draw = ImageDraw.Draw(fallback)
    rounded(draw, (0, 0, 38, 38), 8, fill=rgba((59, 34, 105)), outline=rgba(PURPLE_LIGHT), width=2)
    text(draw, (19, 19), "B", F22, anchor="mm")
    return fallback


def frame_blackboard(t: float):
    image = gradient_frame((9, 7, 16), (14, 10, 25))
    draw = ImageDraw.Draw(image, "RGBA")
    for y in range(58, H, 22):
        line(draw, [(0, y), (W, y)], rgba(PURPLE_LIGHT, 10), 1)

    line(draw, [(0, 58), (W, 58)], rgba((68, 44, 101), 180), 1)
    icon = blackboard_icon()
    image.paste(icon, (sc(22), sc(10)), icon)
    text(draw, (70, 25), "Blackboard Search", F16, anchor="lm")
    ellipse(draw, (70, 39, 76, 45), fill=rgba((27, 206, 151)))
    text(draw, (81, 42), "214 resources indexed", F10, MUTED, anchor="lm")
    for x in (562, 606):
        rounded(draw, (x - 15, 14, x + 15, 44), 8, fill=rgba((22, 15, 35)), outline=rgba((76, 51, 112), 210))
    line(draw, [(555, 29), (569, 29)], rgba(PURPLE_LIGHT), 2)
    line(draw, [(606, 22), (606, 36)], rgba(PURPLE_LIGHT), 2)

    sent = smooth(0.08, 0.28, t)
    answer = smooth(0.30, 0.55, t)
    sources = smooth(0.52, 0.78, t)

    composer_alpha = int(255 * (1 - sent))
    rounded(draw, (58, 285, 582, 327), 13, fill=rgba((7, 5, 13), composer_alpha), outline=rgba((73, 48, 108), composer_alpha))
    text(draw, (78, 306), "What are my upcoming deadlines?", F13, INK, anchor="lm", alpha=composer_alpha)
    rounded(draw, (536, 292, 572, 320), 9, fill=rgba(PURPLE, composer_alpha))
    line(draw, [(554, 312), (554, 299)], rgba(INK, composer_alpha), 2)
    line(draw, [(548, 305), (554, 299), (560, 305)], rgba(INK, composer_alpha), 2)

    if sent > 0:
        bubble_y = lerp(286, 78, ease_out(sent))
        bubble_x1 = lerp(58, 300, ease_out(sent))
        rounded(draw, (bubble_x1, bubble_y, 582, bubble_y + 42), 13, fill=rgba(PURPLE), outline=rgba(PURPLE_LIGHT, 120))
        text(draw, ((bubble_x1 + 582) / 2, bubble_y + 21), "What are my upcoming deadlines?", F13, anchor="mm")

    if answer > 0:
        y_offset = 10 * (1 - ease_out(answer))
        text(draw, (58, 153 + y_offset), "2 upcoming deadlines", F18, anchor="lm", alpha=int(255 * answer))
        text(draw, (58, 183 + y_offset), "Capstone interest survey", F13, anchor="lm", alpha=int(255 * answer))
        text(draw, (566, 183 + y_offset), "JUN 23", F11, PURPLE_LIGHT, anchor="rm", alpha=int(255 * answer))
        line(draw, [(58, 197 + y_offset), (566, 197 + y_offset)], rgba((63, 49, 82), int(190 * answer)), 1)
        text(draw, (58, 217 + y_offset), "Course exemption application", F13, anchor="lm", alpha=int(255 * answer))
        text(draw, (566, 217 + y_offset), "JUN 30", F11, PURPLE_LIGHT, anchor="rm", alpha=int(255 * answer))

    if sources > 0:
        text(draw, (58, 255), "SOURCES", F10, PURPLE_LIGHT, anchor="lm", alpha=int(255 * sources))
        for i, (label, title_value) in enumerate([
            ("[1] PAGE", "To Do - Pre-program"),
            ("[2] PAGE", "Course Exemption"),
        ]):
            delay = smooth(0.52 + i * 0.08, 0.72 + i * 0.08, t)
            x = 58 + i * 264
            y = lerp(304, 270, ease_out(delay))
            rounded(draw, (x, y, x + 246, y + 50), 9, fill=rgba((18, 12, 29), int(245 * delay)), outline=rgba((91, 59, 129), int(220 * delay)))
            text(draw, (x + 14, y + 15), label, F9, PURPLE_LIGHT, anchor="lm", alpha=int(255 * delay))
            text(draw, (x + 14, y + 34), title_value, F12, anchor="lm", alpha=int(255 * delay))
    return image


def frame_research(t: float):
    image = gradient_frame((6, 18, 22), (8, 27, 30))
    glow(image, (505, 195), 150, CYAN, 24)
    draw = ImageDraw.Draw(image, "RGBA")
    text(draw, (32, 31), "REDDIT SIGNAL", F11, MUTED, anchor="lm")
    text(draw, (251, 31), "TRUST FILTER", F11, MUTED, anchor="mm")
    text(draw, (608, 31), "PRICE FORECAST", F11, MUTED, anchor="rm")

    posts = [("r/stocks", 0.84, TEAL), ("r/investing", 0.31, RED), ("r/options", 0.72, TEAL), ("r/wallstreetbets", 0.18, RED)]
    for i, (name, score, color) in enumerate(posts):
        y = 75 + i * 59
        rounded(draw, (30, y, 190, y + 42), 7, fill=rgba((12, 35, 39)), outline=rgba((42, 73, 74), 220))
        ellipse(draw, (43, y + 13, 55, y + 25), fill=rgba(color))
        text(draw, (66, y + 15), name, F11, anchor="lm")
        line(draw, [(66, y + 29), (66 + 88 * score, y + 29)], rgba(color, 210), 4)

    filter_p = smooth(0.12, 0.48, t)
    cx, cy = 251, 177
    ellipse(draw, (cx - 48, cy - 48, cx + 48, cy + 48), fill=rgba((8, 29, 32)), outline=rgba((54, 91, 90), 230), width=2)
    for index in range(24):
        angle = math.radians(-210 + index * 240 / 23)
        active = index / 23 <= filter_p
        radius1, radius2 = 38, 45
        color = TEAL if active else (47, 70, 70)
        line(draw, [
            (cx + radius1 * math.cos(angle), cy + radius1 * math.sin(angle)),
            (cx + radius2 * math.cos(angle), cy + radius2 * math.sin(angle)),
        ], rgba(color, 240 if active else 100), 2)
    text(draw, (cx, cy - 4), f"{int(91 * filter_p):02d}%", F22, anchor="mm")
    text(draw, (cx, cy + 19), "trusted", F10, TEAL, anchor="mm")

    plot = (330, 74, 610, 300)
    for y in (106, 154, 202, 250, 298):
        line(draw, [(plot[0], y), (plot[2], y)], rgba(LINE, 100), 1)
    values = [0.62, 0.58, 0.66, 0.54, 0.49, 0.57, 0.46, 0.42, 0.50, 0.44, 0.39, 0.47, 0.43, 0.51]
    history = []
    for i, value in enumerate(values):
        x = lerp(plot[0], 510, i / (len(values) - 1))
        y = lerp(plot[3], plot[1], value)
        history.append((x, y))
    line(draw, history, rgba((159, 179, 184), 210), 2)

    window_p = smooth(0.18, 0.60, t)
    wx = lerp(342, 452, window_p)
    rounded(draw, (wx, 72, wx + 70, 302), 5, fill=rgba(TEAL, 18), outline=rgba(TEAL, 170), width=2)

    forecast_p = smooth(0.48, 0.84, t)
    forecast = [history[-1], (534, 183), (558, 165), (584, 137), (608, 128)]
    visible_count = max(2, int(1 + forecast_p * (len(forecast) - 1)))
    visible = forecast[:visible_count]
    if visible_count < len(forecast):
        a = forecast[visible_count - 1]
        b = forecast[visible_count]
        local = forecast_p * (len(forecast) - 1) - (visible_count - 1)
        visible.append((lerp(a[0], b[0], local), lerp(a[1], b[1], local)))
    line(draw, visible, rgba(CYAN, 245), 4)
    if forecast_p > 0.1:
        hx, hy = visible[-1]
        ellipse(draw, (hx - 5, hy - 5, hx + 5, hy + 5), fill=rgba(AMBER), outline=rgba(INK), width=1)
    text(draw, (330, 326), "social sentiment", F10, MUTED, anchor="lm")
    text(draw, (610, 326), "sliding-window prediction", F10, CYAN, anchor="rm")
    return image


def frame_tracerail(t: float):
    image = gradient_frame((6, 13, 21), (7, 24, 30))
    draw = ImageDraw.Draw(image, "RGBA")
    for x in range(28, 628, 38):
        line(draw, [(x, 70), (x, 307)], rgba((45, 67, 77), 34), 1)
    for y in range(82, 308, 38):
        line(draw, [(18, y), (622, y)], rgba((45, 67, 77), 34), 1)

    text(draw, (28, 31), "TraceRail", F18, anchor="lm")
    rounded(draw, (492, 18, 612, 44), 13, fill=rgba(TEAL, 24), outline=rgba(TEAL, 125))
    ellipse(draw, (506, 28, 514, 36), fill=rgba(TEAL))
    text(draw, (522, 31), "AGENT SWARM", F10, TEAL, anchor="lm")

    text(draw, (30, 73), "AGENT MODULES", F10, MUTED, anchor="lm")
    text(draw, (284, 73), "DEPLOY RAIL", F10, MUTED, anchor="mm")
    text(draw, (506, 73), "LIVE SWARM", F10, MUTED, anchor="mm")

    modules = [
        ("PLAN", "strategy", CYAN),
        ("SEARCH", "retrieval", AMBER),
        ("ACT", "execution", PURPLE_LIGHT),
    ]
    module_centers = []
    for i, (name, role, color) in enumerate(modules):
        y = 92 + i * 64
        cy = y + 22
        module_centers.append((166, cy, color))
        rounded(draw, (30, y, 166, y + 44), 7, fill=rgba((15, 27, 36), 245), outline=rgba((68, 88, 99), 210))
        rounded(draw, (30, y, 36, y + 44), 3, fill=rgba(color, 220))
        rounded(draw, (47, y + 10, 67, y + 30), 4, fill=rgba(color, 28), outline=rgba(color, 170))
        for dx, dy in ((0, 0), (7, 0), (0, 7), (7, 7)):
            rounded(draw, (51 + dx, y + 14 + dy, 56 + dx, y + 19 + dy), 1, fill=rgba(color, 220))
        text(draw, (78, y + 16), name, F11, anchor="lm")
        text(draw, (78, y + 31), role, F9, MUTED, anchor="lm")
        ellipse(draw, (157, cy - 4, 165, cy + 4), fill=rgba(color, 220))

    hub = (284, 180)
    hub_shape = [(284, 124), (332, 151), (332, 209), (284, 236), (236, 209), (236, 151)]
    hub_inner = [(284, 142), (316, 160), (316, 200), (284, 218), (252, 200), (252, 160)]
    polygon(draw, hub_shape, fill=rgba((13, 30, 39), 250))
    line(draw, hub_shape + [hub_shape[0]], rgba(TEAL, 150), 1)
    polygon(draw, hub_inner, fill=rgba(TEAL, 18))
    line(draw, hub_inner + [hub_inner[0]], rgba(TEAL, 215), 1)
    ellipse(draw, (272, 168, 296, 192), fill=rgba((8, 20, 27)), outline=rgba(CYAN, 220), width=2)
    for angle in (0, 120, 240):
        rad = math.radians(angle)
        x1, y1 = 284 + math.cos(rad) * 12, 180 + math.sin(rad) * 12
        x2, y2 = 284 + math.cos(rad) * 24, 180 + math.sin(rad) * 24
        line(draw, [(x1, y1), (x2, y2)], rgba(CYAN, 210), 2)
        ellipse(draw, (x2 - 3, y2 - 3, x2 + 3, y2 + 3), fill=rgba(CYAN))
    text(draw, (284, 256), "ORCHESTRATOR", F10, TEAL, anchor="mm")

    swarm_nodes = [
        (422, 118, "P1", CYAN),
        (500, 102, "P2", CYAN),
        (568, 140, "S1", AMBER),
        (424, 213, "S2", AMBER),
        (502, 232, "A1", PURPLE_LIGHT),
        (574, 198, "A2", PURPLE_LIGHT),
    ]
    swarm_edges = [(0, 1), (1, 2), (0, 3), (0, 4), (1, 4), (2, 5), (3, 4), (4, 5)]
    for a, b in swarm_edges:
        x1, y1, _, _ = swarm_nodes[a]
        x2, y2, _, _ = swarm_nodes[b]
        line(draw, [(x1, y1), (x2, y2)], rgba((75, 98, 106), 95), 1)

    routing = [smooth(0.05 + i * 0.08, 0.28 + i * 0.08, t) for i in range(3)]
    deployment = [smooth(0.34 + i * 0.055, 0.58 + i * 0.055, t) for i in range(6)]

    for i, (sx, sy, color) in enumerate(module_centers):
        rail = [(sx, sy), (204, sy), (220, 180), (236, 180)]
        line(draw, rail, rgba((77, 98, 107), 110), 2)
        p = routing[i]
        if 0 < p < 1:
            px, py = path_point(rail, p)
            glow(image, (px, py), 14, color, 85)
            draw = ImageDraw.Draw(image, "RGBA")
            rounded(draw, (px - 7, py - 7, px + 7, py + 7), 3, fill=rgba(color), outline=rgba(INK, 220))
        elif p >= 1:
            line(draw, rail, rgba(color, 180), 2)

    hub_active = smooth(0.24, 0.48, t)
    if hub_active > 0:
        glow(image, hub, 34, TEAL, int(70 * hub_active))
        draw = ImageDraw.Draw(image, "RGBA")

    for i, (x, y, label, color) in enumerate(swarm_nodes):
        route = [(332, 180), (366, 180), (390, y), (x, y)]
        line(draw, route, rgba((77, 98, 107), 100), 2)
        p = deployment[i]
        if 0 < p < 1:
            px, py = path_point(route, p)
            glow(image, (px, py), 13, color, 90)
            draw = ImageDraw.Draw(image, "RGBA")
            ellipse(draw, (px - 5, py - 5, px + 5, py + 5), fill=rgba(color))
        online = p >= 0.96
        node_fill = rgba(color, 40 if online else 10)
        node_outline = rgba(color if online else (79, 98, 106), 230 if online else 120)
        if online:
            glow(image, (x, y), 19, color, 48)
            draw = ImageDraw.Draw(image, "RGBA")
            line(draw, route, rgba(color, 140), 2)
        node_shape = [(x, y - 18), (x + 16, y - 9), (x + 16, y + 9), (x, y + 18), (x - 16, y + 9), (x - 16, y - 9)]
        polygon(draw, node_shape, fill=node_fill)
        line(draw, node_shape + [node_shape[0]], node_outline, 1)
        ellipse(draw, (x - 4, y - 4, x + 4, y + 4), fill=rgba(color if online else MUTED, 240 if online else 110))
        text(draw, (x, y + 29), label, F9, INK if online else MUTED, anchor="mm", alpha=255 if online else 125)

    trace_p = smooth(0.72, 0.97, t)
    if trace_p > 0:
        trace_route = [(574, 198), (538, 176), (500, 186), (462, 164), (422, 182), (390, 180), (332, 180)]
        trace_tail = path_slice(trace_route, max(0, trace_p - 0.34), trace_p, 30)
        line(draw, trace_tail, rgba(CYAN, 235), 3)
        tx, ty = path_point(trace_route, trace_p)
        glow(image, (tx, ty), 12, CYAN, 75)

    online_count = sum(p >= 0.96 for p in deployment)
    status = "READY TO DEPLOY" if t < 0.05 else ("DEPLOYING SWARM" if online_count < 6 else "SWARM ONLINE")
    status_color = MUTED if t < 0.05 else (AMBER if online_count < 6 else TEAL)
    text(draw, (30, 330), "3 MODULAR AI AGENTS", F10, MUTED, anchor="lm")
    text(draw, (610, 330), f"{status}  /  {online_count}/6", F10, status_color, anchor="rm")
    return image

def frame_opportunity(t: float):
    image = gradient_frame((10, 17, 24), (13, 24, 31))
    draw = ImageDraw.Draw(image, "RGBA")
    rounded(draw, (30, 22, 610, 67), 10, fill=rgba((18, 29, 38)), outline=rgba((57, 75, 86), 230))
    ellipse(draw, (47, 36, 61, 50), outline=rgba(AMBER), width=2)
    line(draw, [(58, 47), (66, 55)], rgba(AMBER), 2)
    text(draw, (78, 45), "policy fellowships asia", F14, anchor="lm")
    rounded(draw, (530, 29, 598, 60), 7, fill=rgba(AMBER))
    text(draw, (564, 45), "SEARCH", F10, (18, 24, 28), anchor="mm")

    text(draw, (34, 96), "FOUND", F10, MUTED, anchor="lm")
    text(draw, (350, 96), "CATALOGUED", F10, MUTED, anchor="lm")
    line(draw, [(304, 92), (304, 327)], rgba((57, 72, 80), 180), 1)

    roles = [
        ("AI Policy Fellow", "Beijing", "94%"),
        ("Climate Analyst", "Remote", "88%"),
        ("Data Strategy Lead", "Singapore", "82%"),
    ]
    for i, (role, location, score) in enumerate(roles):
        y = 116 + i * 72
        move = smooth(0.16 + i * 0.15, 0.42 + i * 0.15, t)
        rounded(draw, (34, y, 270, y + 52), 7, fill=rgba((18, 31, 39)), outline=rgba((56, 76, 84), 220))
        text(draw, (49, y + 18), role, F12, anchor="lm", alpha=int(255 * (1 - 0.25 * move)))
        text(draw, (49, y + 37), location, F10, MUTED, anchor="lm", alpha=int(255 * (1 - 0.25 * move)))
        text(draw, (251, y + 26), score, F12, AMBER, anchor="rm", alpha=int(255 * (1 - 0.25 * move)))

        if 0 < move < 1:
            x = lerp(250, 340, ease_out(move))
            yy = y + 7 - 8 * math.sin(move * math.pi)
            rounded(draw, (x, yy, x + 96, yy + 38), 7, fill=rgba((25, 37, 42)), outline=rgba(AMBER, 230))
            text(draw, (x + 48, yy + 19), "NORMALIZE", F9, AMBER, anchor="mm")

        row_alpha = int(255 * smooth(0.38 + i * 0.15, 0.57 + i * 0.15, t))
        rounded(draw, (340, y, 606, y + 52), 7, fill=rgba((16, 35, 39), row_alpha), outline=rgba(TEAL, int(row_alpha * 0.65)))
        text(draw, (356, y + 17), role, F12, anchor="lm", alpha=row_alpha)
        text(draw, (356, y + 37), f"{location}  /  fit {score}", F10, MUTED, anchor="lm", alpha=row_alpha)
        rounded(draw, (548, y + 13, 592, y + 39), 6, fill=rgba(TEAL, int(row_alpha * 0.18)), outline=rgba(TEAL, int(row_alpha * 0.7)))
        text(draw, (570, y + 26), "SAVED", F9, TEAL, anchor="mm", alpha=row_alpha)

    progress = smooth(0.05, 0.82, t)
    line(draw, [(34, 326), (34 + 572 * progress, 326)], rgba(AMBER, 230), 3)
    text(draw, (606, 342), f"{int(progress * 3)} / 3 opportunities organized", F10, AMBER, anchor="rm")
    return image


def frame_legacy(t: float):
    image = gradient_frame((8, 17, 20), (12, 24, 26))
    glow(image, (512, 185), 145, TEAL, 26)
    draw = ImageDraw.Draw(image, "RGBA")
    text(draw, (30, 29), "SMS", F11, MUTED, anchor="lm")
    text(draw, (610, 29), "MARKETPLACE", F11, MUTED, anchor="rm")

    rounded(draw, (34, 48, 233, 332), 22, fill=rgba((5, 10, 12)), outline=rgba((68, 85, 87), 240), width=2)
    rounded(draw, (52, 77, 215, 304), 12, fill=rgba((12, 24, 26)))
    rounded(draw, (100, 59, 167, 66), 4, fill=rgba((63, 75, 76)))
    text(draw, (133, 98), "LegacyMarText", F12, anchor="mm")

    first = 1.0
    second = smooth(0.14, 0.36, t)
    confirm = smooth(0.66, 0.82, t)
    for y, value, p, user in [
        (126, "SELL BIKE", first, True),
        (174, "PRICE $120", second, True),
        (246, "Listing is live", confirm, False),
    ]:
        x1, x2 = (92, 199) if user else (67, 183)
        color = TEAL if user else (67, 87, 89)
        yy = y + 12 * (1 - ease_out(p))
        rounded(draw, (x1, yy, x2, yy + 34), 13, fill=rgba(color, int((210 if user else 150) * p)), outline=rgba(color, int(230 * p)))
        text(draw, ((x1 + x2) / 2, yy + 17), value, F12, anchor="mm", alpha=int(255 * p))

    transform = smooth(0.36, 0.64, t)
    line(draw, [(250, 181), (328, 181)], rgba((70, 91, 92), 210), 2)
    polygon(draw, [(328, 181), (317, 174), (317, 188)], fill=rgba(TEAL, int(255 * transform)))
    rounded(draw, (257, 146, 321, 216), 9, fill=rgba((14, 31, 32)), outline=rgba(TEAL, int(90 + 140 * transform)))
    text(draw, (289, 164), "PARSE", F9, TEAL, anchor="mm")
    text(draw, (273, 183), "item", F9, MUTED, anchor="lm")
    text(draw, (307, 183), "bike", F10, anchor="rm", alpha=int(255 * transform))
    text(draw, (273, 202), "price", F9, MUTED, anchor="lm")
    text(draw, (307, 202), "$120", F10, anchor="rm", alpha=int(255 * transform))

    listing = smooth(0.50, 0.75, t)
    x = 352
    rounded(draw, (x, 48, 608, 332), 11, fill=rgba((238, 242, 239), int(255 * max(0.18, listing))), outline=rgba((187, 202, 197), int(255 * listing)))
    rounded(draw, (x + 17, 66, x + 239, 98), 8, fill=rgba((222, 229, 225), int(255 * listing)))
    text(draw, (x + 30, 82), "martext.market", F11, (35, 49, 49), anchor="lm", alpha=int(255 * listing))
    rounded(draw, (x + 177, 72, x + 226, 92), 10, fill=rgba(TEAL, int(60 * listing)))
    text(draw, (x + 201, 82), "LIVE", F9, (20, 104, 84), anchor="mm", alpha=int(255 * listing))

    rounded(draw, (x + 17, 114, x + 239, 236), 8, fill=rgba((207, 224, 218), int(255 * listing)))
    for cx in (x + 73, x + 181):
        ellipse(draw, (cx - 26, 164, cx + 26, 216), outline=rgba((34, 60, 57), int(255 * listing)), width=4)
    line(draw, [(x + 73, 190), (x + 119, 145), (x + 181, 190), (x + 102, 190), (x + 119, 145)], rgba((34, 60, 57), int(255 * listing)), 4)
    line(draw, [(x + 118, 146), (x + 153, 146)], rgba((34, 60, 57), int(255 * listing)), 4)
    text(draw, (x + 20, 268), "Road bike", F16, (24, 37, 37), anchor="lm", alpha=int(255 * listing))
    text(draw, (x + 236, 268), "$120", F18, (20, 123, 97), anchor="rm", alpha=int(255 * listing))
    text(draw, (x + 20, 296), "Posted from SMS", F10, (88, 105, 101), anchor="lm", alpha=int(255 * listing))
    return image


PROJECTS = [
    ("blackboard-search-extension", frame_blackboard),
    ("reddit-stock-trust-filter", frame_research),
    ("tracerail-rail-visualization", frame_tracerail),
    ("schwarzman-opportunity-radar", frame_opportunity),
    ("legacymartext-sms-marketplace", frame_legacy),
]


def render_project(slug, frame_fn):
    rgb_frames = [
        frame_fn(i / max(FRAMES - 1, 1)).resize((W, H), Image.Resampling.LANCZOS).convert("RGB")
        for i in range(FRAMES)
    ]
    poster_path = OUT_DIR / f"{slug}-poster.png"
    rgb_frames[0].save(poster_path, optimize=True)

    gif_frames = [frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=96) for frame in rgb_frames]
    gif_path = OUT_DIR / f"{slug}.gif"
    gif_frames[0].save(
        gif_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=DURATION_MS,
        optimize=True,
        disposal=2,
    )
    return slug, rgb_frames


def contact_sheet(rendered):
    thumb_w, thumb_h = 320, 180
    label_h = 28
    sheet = Image.new("RGB", (thumb_w * 4, (thumb_h + label_h) * len(rendered)), (8, 16, 21))
    draw = ImageDraw.Draw(sheet)
    indices = [0, 11, 23, 35]
    for row, (slug, frames) in enumerate(rendered):
        y = row * (thumb_h + label_h)
        draw.rectangle((0, y, sheet.width, y + label_h), fill=(12, 23, 30))
        draw.text((12, y + 7), slug, font=font(10), fill=INK)
        for col, index in enumerate(indices):
            sheet.paste(frames[index].resize((thumb_w, thumb_h), Image.Resampling.LANCZOS), (col * thumb_w, y + label_h))
    path = VERIFY_DIR / "project-gifs-contact-sheet.png"
    sheet.save(path, optimize=True)
    small = sheet.resize((960, int(sheet.height * 0.75)), Image.Resampling.LANCZOS)
    small.save(VERIFY_DIR / "project-gifs-contact-sheet-small.png", optimize=True)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    VERIFY_DIR.mkdir(parents=True, exist_ok=True)
    rendered = []
    print(f"Rendering {len(PROJECTS)} animations at {W}x{H}, {FRAMES * DURATION_MS / 1000:.2f}s each")
    for slug, frame_fn in PROJECTS:
        rendered.append(render_project(slug, frame_fn))
        print(f"public/images/projects/{slug}.gif")
        print(f"public/images/projects/{slug}-poster.png")
    contact_sheet(rendered)
    print("verification/project-gifs/project-gifs-contact-sheet.png")


if __name__ == "__main__":
    main()

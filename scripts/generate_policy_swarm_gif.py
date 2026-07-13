from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "images"
VERIFY_DIR = ROOT / "verification" / "policy-swarm"

W, H = 640, 360
SCALE = 2
FRAMES = 42
DURATION_MS = 75

BG_TOP = (6, 9, 16)
BG_BOTTOM = (10, 16, 25)
INK = (239, 247, 252)
MUTED = (118, 139, 153)
GRID = (35, 51, 64)
CYAN = (49, 218, 242)
MAGENTA = (244, 91, 207)
AMBER = (255, 173, 66)
VIOLET = (144, 102, 255)
GREEN = (59, 211, 154)

NODES = [
    (284, 181, AMBER, 0),
    (226, 132, CYAN, 1),
    (219, 224, MAGENTA, 1),
    (350, 125, VIOLET, 1),
    (357, 230, GREEN, 1),
    (155, 100, CYAN, 2),
    (143, 178, MAGENTA, 2),
    (160, 273, AMBER, 2),
    (428, 82, VIOLET, 2),
    (455, 162, CYAN, 2),
    (443, 278, GREEN, 2),
    (89, 67, CYAN, 3),
    (74, 145, MAGENTA, 3),
    (88, 239, AMBER, 3),
    (242, 302, MAGENTA, 3),
    (512, 65, VIOLET, 3),
    (545, 132, CYAN, 3),
    (520, 220, GREEN, 3),
    (540, 303, AMBER, 3),
    (604, 93, VIOLET, 4),
    (600, 184, CYAN, 4),
    (611, 271, GREEN, 4),
]

EDGES = [
    (0, 1), (0, 2), (0, 3), (0, 4),
    (1, 5), (1, 6), (1, 3),
    (2, 6), (2, 7), (2, 14), (2, 4),
    (3, 8), (3, 9), (3, 5),
    (4, 9), (4, 10), (4, 14),
    (5, 11), (5, 12), (5, 6),
    (6, 12), (6, 13), (6, 7),
    (7, 13), (7, 14),
    (8, 15), (8, 16), (8, 9),
    (9, 16), (9, 17), (9, 10),
    (10, 17), (10, 18),
    (11, 12), (12, 13), (13, 14),
    (15, 16), (16, 17), (17, 18),
    (15, 19), (16, 19), (16, 20),
    (17, 20), (17, 21), (18, 21),
]


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def lerp(a: float, b: float, progress: float) -> float:
    return a + (b - a) * progress


def smooth(start: float, end: float, value: float) -> float:
    if start == end:
        return float(value >= end)
    progress = clamp((value - start) / (end - start))
    return progress * progress * (3 - 2 * progress)


def sc(value: float) -> int:
    return int(round(value * SCALE))


def rgba(color, alpha=255):
    return tuple(color) + (int(clamp(alpha, 0, 255)),)


def box(rect):
    return tuple(sc(value) for value in rect)


def line(draw, points, fill, width=1):
    draw.line([(sc(x), sc(y)) for x, y in points], fill=fill, width=sc(width), joint="curve")


def ellipse(draw, rect, fill=None, outline=None, width=1):
    draw.ellipse(box(rect), fill=fill, outline=outline, width=sc(width))


def polygon(draw, points, fill=None):
    draw.polygon([(sc(x), sc(y)) for x, y in points], fill=fill)


def make_frame():
    image = Image.new("RGB", (sc(W), sc(H)), BG_TOP)
    draw = ImageDraw.Draw(image, "RGBA")
    for y in range(sc(H)):
        progress = y / max(sc(H) - 1, 1)
        color = tuple(int(lerp(BG_TOP[index], BG_BOTTOM[index], progress)) for index in range(3))
        draw.line((0, y, sc(W), y), fill=rgba(color))
    for y in range(18, H, 18):
        for x in range(18, W, 18):
            alpha = 35 if (x + y) % 54 else 55
            ellipse(draw, (x - 0.7, y - 0.7, x + 0.7, y + 0.7), fill=rgba(GRID, alpha))
    return image


def paste_glow(image, center, radius, color, alpha):
    layer = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    ellipse(draw, (cx - radius, cy - radius, cx + radius, cy + radius), fill=rgba(color, alpha))
    blurred = layer.filter(ImageFilter.GaussianBlur(sc(radius * 0.38)))
    image.paste(blurred, (0, 0), blurred)


def node_point(index):
    return NODES[index][0], NODES[index][1]


def edge_point(edge_index, progress):
    start_index, end_index = EDGES[edge_index]
    x1, y1 = node_point(start_index)
    x2, y2 = node_point(end_index)
    return lerp(x1, x2, progress), lerp(y1, y2, progress)


def quadratic_point(start, control, end, progress):
    inverse = 1 - progress
    return (
        inverse * inverse * start[0] + 2 * inverse * progress * control[0] + progress * progress * end[0],
        inverse * inverse * start[1] + 2 * inverse * progress * control[1] + progress * progress * end[1],
    )


def draw_agent(draw, x, y, angle, color, alpha=255, size=3.2):
    points = [
        (x + math.cos(angle) * size * 1.7, y + math.sin(angle) * size * 1.7),
        (x + math.cos(angle + 2.35) * size, y + math.sin(angle + 2.35) * size),
        (x + math.cos(angle - 2.35) * size, y + math.sin(angle - 2.35) * size),
    ]
    polygon(draw, points, fill=rgba(color, alpha))


def render_frame(t: float):
    image = make_frame()
    draw = ImageDraw.Draw(image, "RGBA")

    injection = smooth(0.05, 0.24, t)
    impact = smooth(0.20, 0.36, t)
    settle = smooth(0.70, 0.94, t)

    # Inactive graph remains visible in the paused poster.
    for start_index, end_index in EDGES:
        start = node_point(start_index)
        end = node_point(end_index)
        line(draw, [start, end], rgba((72, 84, 101), 65), 1)

    # Relationships activate outward from the injected policy seed.
    for edge_index, (start_index, end_index) in enumerate(EDGES):
        depth = max(NODES[start_index][3], NODES[end_index][3])
        active = smooth(0.20 + depth * 0.085, 0.39 + depth * 0.085, t)
        if active <= 0:
            continue
        start = node_point(start_index)
        end = node_point(end_index)
        end_visible = (lerp(start[0], end[0], active), lerp(start[1], end[1], active))
        color = MAGENTA if edge_index % 3 == 0 else CYAN
        line(draw, [start, end_visible], rgba(color, int(80 + 115 * active)), 1.4)

    # Ripple rings make the propagation legible without adding labels.
    if impact > 0:
        for ring in range(3):
            progress = clamp((t - 0.21 - ring * 0.09) / 0.45)
            if progress <= 0 or progress >= 1:
                continue
            radius = 18 + progress * 175
            alpha = int(125 * (1 - progress))
            ellipse(draw, (284 - radius, 181 - radius, 284 + radius, 181 + radius), outline=rgba(AMBER, alpha), width=1)

    # The seed enters from outside the modeled world.
    seed_start = (34, 301)
    seed_control = (105, 192)
    seed_end = node_point(0)
    seed_x, seed_y = quadratic_point(seed_start, seed_control, seed_end, injection)
    if injection < 1:
        path_points = [quadratic_point(seed_start, seed_control, seed_end, step / 28) for step in range(max(2, int(28 * injection)))]
        line(draw, path_points, rgba(AMBER, 145), 2)
    paste_glow(image, (seed_x, seed_y), 12 + 5 * impact, AMBER, 80)
    draw = ImageDraw.Draw(image, "RGBA")
    ellipse(draw, (seed_x - 6, seed_y - 6, seed_x + 6, seed_y + 6), fill=rgba(AMBER), outline=rgba(INK, 220), width=1)

    # Nodes wake in breadth-first layers.
    for index, (x, y, color, depth) in enumerate(NODES):
        active = smooth(0.18 + depth * 0.085, 0.37 + depth * 0.085, t)
        base_alpha = 105 + int(active * 130)
        radius = 3.4 + active * (2.2 if index else 4.0)
        if active > 0.15:
            paste_glow(image, (x, y), 7 + 6 * active, color, int(28 + active * 35))
            draw = ImageDraw.Draw(image, "RGBA")
        ellipse(draw, (x - radius, y - radius, x + radius, y + radius), fill=rgba(color, base_alpha), outline=rgba(INK, int(40 + active * 135)), width=1)

    # Thirty-two independent agents traverse different relationships, then orbit their destination cluster.
    for agent in range(32):
        edge_index = (agent * 7 + 5) % len(EDGES)
        delay = 0.26 + (agent % 8) * 0.035
        travel = smooth(delay, min(0.88, delay + 0.34), t)
        start_index, end_index = EDGES[edge_index]
        x1, y1 = node_point(start_index)
        x2, y2 = node_point(end_index)
        if travel < 1:
            x, y = edge_point(edge_index, travel)
            angle = math.atan2(y2 - y1, x2 - x1)
        else:
            orbit = 7 + (agent % 4) * 2.5
            theta = agent * 1.71 + settle * math.tau * (0.65 + (agent % 3) * 0.12)
            x = x2 + math.cos(theta) * orbit
            y = y2 + math.sin(theta) * orbit
            angle = theta + math.pi / 2
        color = CYAN if agent % 3 else MAGENTA
        alpha = int(90 + 165 * smooth(delay - 0.08, delay + 0.08, t))
        draw_agent(draw, x, y, angle, color, alpha=alpha, size=2.4 + (agent % 3) * 0.35)

    # Final equilibrium is a quiet shared halo around the model core.
    if settle > 0:
        radius = 11 + 7 * settle
        ellipse(draw, (284 - radius, 181 - radius, 284 + radius, 181 + radius), outline=rgba(GREEN, int(180 * settle)), width=2)
        for index in range(6):
            theta = index * math.tau / 6 + settle * 0.7
            x = 284 + math.cos(theta) * 24
            y = 181 + math.sin(theta) * 24
            ellipse(draw, (x - 2, y - 2, x + 2, y + 2), fill=rgba(GREEN, int(220 * settle)))

    return image


def save_animation():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    VERIFY_DIR.mkdir(parents=True, exist_ok=True)
    frames = [
        render_frame(index / max(FRAMES - 1, 1)).resize((W, H), Image.Resampling.LANCZOS)
        for index in range(FRAMES)
    ]
    poster_path = OUT_DIR / "policy-swarm-poster.png"
    gif_path = OUT_DIR / "policy-swarm.gif"
    frames[0].save(poster_path, optimize=True)
    palette_frames = [frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=96) for frame in frames]
    palette_frames[0].save(
        gif_path,
        save_all=True,
        append_images=palette_frames[1:],
        duration=DURATION_MS,
        optimize=True,
        disposal=2,
    )

    indices = [0, 12, 25, 41]
    sheet = Image.new("RGB", (W * 2, H * 2), BG_TOP)
    for slot, frame_index in enumerate(indices):
        x = (slot % 2) * W
        y = (slot // 2) * H
        sheet.paste(frames[frame_index], (x, y))
    sheet.save(VERIFY_DIR / "policy-swarm-contact-sheet.png", optimize=True)
    print(f"{poster_path.relative_to(ROOT)}")
    print(f"{gif_path.relative_to(ROOT)}")


if __name__ == "__main__":
    save_animation()

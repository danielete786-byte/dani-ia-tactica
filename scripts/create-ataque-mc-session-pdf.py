#!/usr/bin/env python3
import json
import math
import os
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path(sys.argv[1]).resolve()
OUTPUT = Path(sys.argv[2]).resolve()
SESSION = json.loads((ASSETS / "session.json").read_text(encoding="utf-8"))

PAGE_W, PAGE_H = landscape(A4)
GREEN = colors.HexColor("#203127")
GREEN_SOFT = colors.HexColor("#e5eee7")
GREEN_LINE = colors.HexColor("#789582")
GOLD = colors.HexColor("#b57c19")
GOLD_SOFT = colors.HexColor("#f7ebc9")
INK = colors.HexColor("#26372d")
MUTED = colors.HexColor("#66716a")
LINE = colors.HexColor("#d4d9d5")
WHITE = colors.white


def register_fonts():
    candidates = [
        ("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        ("DejaVu-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    for name, path in candidates:
        if os.path.exists(path):
            pdfmetrics.registerFont(TTFont(name, path))
    return ("DejaVu", "DejaVu-Bold")


FONT, FONT_BOLD = register_fonts()


def pstyle(size=9, leading=None, color=INK, bold=False, align=TA_LEFT):
    return ParagraphStyle(
        name=f"s-{size}-{bold}-{align}",
        fontName=FONT_BOLD if bold else FONT,
        fontSize=size,
        leading=leading or size * 1.25,
        textColor=color,
        alignment=align,
        spaceAfter=0,
        spaceBefore=0,
    )


def paragraph(c, text, x, y_top, width, height, style):
    value = str(text).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")
    item = Paragraph(value, style)
    _, h = item.wrap(width, height)
    item.drawOn(c, x, y_top - h)
    return h


def header(c, page_number):
    c.setFillColor(GREEN)
    c.rect(0, PAGE_H - 48, PAGE_W, 48, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - 52, PAGE_W, 4, stroke=0, fill=1)
    c.setFont(FONT_BOLD, 13)
    c.setFillColor(WHITE)
    c.drawString(42, PAGE_H - 31, "DanIA Táctica")
    c.setFont(FONT, 9)
    c.drawRightString(PAGE_W - 42, PAGE_H - 29, SESSION["team"])
    c.setStrokeColor(LINE)
    c.line(42, 27, PAGE_W - 42, 27)
    c.setFont(FONT, 7.5)
    c.setFillColor(MUTED)
    c.drawString(42, 14, "Sesión: ataque organizado y distribución de los MC")
    c.drawRightString(PAGE_W - 42, 14, f"Página {page_number}")


def field(c, x, y, w, h, label_text, value, fill=WHITE, value_size=8.3):
    c.setFillColor(fill)
    c.setStrokeColor(LINE)
    c.rect(x, y, w, h, stroke=1, fill=1)
    c.setFillColor(GOLD)
    c.setFont(FONT_BOLD, 7.2)
    c.drawString(x + 8, y + h - 13, label_text.upper())
    paragraph(c, value, x + 8, y + h - 18, w - 16, h - 23, pstyle(value_size, value_size * 1.22))


def title(c, text, subtitle=""):
    paragraph(c, text, 48, PAGE_H - 80, PAGE_W - 96, 48, pstyle(25, 28, GREEN, True))
    if subtitle:
        paragraph(c, subtitle, 48, PAGE_H - 116, PAGE_W - 96, 28, pstyle(10, 13, MUTED))


def draw_timeline(c, y):
    blocks = [
        ("0-8", "Pases", 8), ("8-28", "Tarea 1", 20), ("28-31", "Agua", 3),
        ("31-55", "Tarea 2", 24), ("55-58", "Agua", 3), ("58-86", "Tarea 3", 28), ("86-90", "Cierre", 4),
    ]
    x = 45
    total_w = PAGE_W - 90
    for top, bottom, mins in blocks:
        w = total_w * mins / 90
        c.setFillColor(GOLD_SOFT)
        c.setStrokeColor(WHITE)
        c.rect(x, y + 20, w, 22, stroke=1, fill=1)
        c.setFillColor(GREEN_SOFT)
        c.rect(x, y, w, 20, stroke=1, fill=1)
        c.setFillColor(INK)
        c.setFont(FONT_BOLD, 7.5)
        c.drawCentredString(x + w / 2, y + 28, top)
        c.setFont(FONT_BOLD, 7.2)
        c.drawCentredString(x + w / 2, y + 7, bottom)
        x += w


def page_summary(c):
    header(c, 1)
    title(c, "Sesión - Ataque organizado y distribución de los MC", "23 jugadores, incluidos 3 porteros · campo chico · miércoles 16/09/2026")
    kpis = [("90", "minutos"), ("23", "jugadores"), ("3", "porteros"), ("1", "entrenador"), ("45 × 32", "campo chico")]
    x, y, w, h = 48, PAGE_H - 166, (PAGE_W - 96) / 5, 38
    for value, label_text in kpis:
        c.setFillColor(GREEN_SOFT)
        c.setStrokeColor(GREEN_LINE)
        c.rect(x, y, w, h, stroke=1, fill=1)
        c.setFillColor(GOLD)
        c.setFont(FONT_BOLD, 15)
        c.drawCentredString(x + w / 2, y + 19, value)
        c.setFillColor(INK)
        c.setFont(FONT, 7.5)
        c.drawCentredString(x + w / 2, y + 7, label_text)
        x += w

    paragraph(c, "Objetivo de la sesión", 50, y - 25, PAGE_W - 100, 24, pstyle(16, 19, GREEN, True))
    paragraph(c, SESSION["mainObjective"] + " " + SESSION["secondaryObjectives"], 50, y - 48, PAGE_W - 100, 38, pstyle(9, 12, INK))

    grid_top = y - 74
    row_h = 40
    col_w = (PAGE_W - 96) / 2
    rows = [
        (("Equipo", SESSION["team"]), ("Día y fecha", f'{SESSION["day"]} {SESSION["date"]}')),
        (("Convocatoria", f'{SESSION["arrivalTime"]} · {SESSION["arrivalInstruction"]}'), ("Lugar", f'{SESSION["venue"]} · {SESSION["field"]}')),
        (("Porteros", SESSION["availableGoalkeepers"]), ("Disponibles", "23: 20 jugadores de campo + 3 porteros")),
        (("Metodología", SESSION["methodology"]), ("Carga", SESSION["load"])),
    ]
    for idx, row in enumerate(rows):
        yy = grid_top - (idx + 1) * row_h
        field(c, 48, yy, col_w, row_h, row[0][0], row[0][1], value_size=7.5)
        field(c, 48 + col_w, yy, col_w, row_h, row[1][0], row[1][1], value_size=7.5)

    timeline_y = 58
    c.setFont(FONT_BOLD, 13)
    c.setFillColor(GREEN)
    c.drawString(48, timeline_y + 50, "Distribución de los 90 minutos")
    draw_timeline(c, timeline_y)
    c.setFillColor(GOLD_SOFT)
    c.setStrokeColor(GOLD)
    c.rect(48, 36, PAGE_W - 96, 18, stroke=1, fill=1)
    c.setFillColor(GREEN)
    c.setFont(FONT_BOLD, 11)
    c.drawCentredString(PAGE_W / 2, 42, "MIRA, PERFÍLATE Y CAMBIA")
    c.showPage()


def draw_warmup_visual(c, x, y, w, h):
    c.setFillColor(GREEN_SOFT)
    c.setStrokeColor(GREEN_LINE)
    c.roundRect(x, y, w, h, 10, stroke=1, fill=1)
    groups = [
        (x + 70, y + 110, 3), (x + 185, y + 110, 3), (x + 300, y + 110, 3),
        (x + 415, y + 110, 3), (x + 530, y + 110, 3),
        (x + 190, y + 45, 4), (x + 420, y + 45, 4),
    ]
    for idx, (cx, cy, count) in enumerate(groups, 1):
        radius = 22 if count == 3 else 25
        points = []
        for n in range(count):
            import math
            angle = -math.pi / 2 + n * (2 * math.pi / count)
            points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
        c.setStrokeColor(GOLD)
        for p1, p2 in zip(points, points[1:] + points[:1]):
            c.line(p1[0], p1[1], p2[0], p2[1])
        for n, (px, py) in enumerate(points):
            c.setFillColor(colors.HexColor("#d93636") if (idx + n) % 2 else colors.HexColor("#243e78"))
            c.circle(px, py, 7, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(FONT_BOLD, 7)
        c.drawCentredString(cx, cy - 4, str(idx))
    c.setFillColor(MUTED)
    c.setFont(FONT, 7.5)
    c.drawString(x + 12, y + 10, "Cinco tríos y dos grupos de cuatro · porteros integrados con los pies")


def draw_scene(c, scene_path, x, y, w, h):
    scene = json.loads(Path(scene_path).read_text(encoding="utf-8"))
    board_w = float(scene.get("board", {}).get("w", 800))
    board_h = float(scene.get("board", {}).get("h", 640))
    scale = min(w / board_w, h / board_h)
    origin_x = x + (w - board_w * scale) / 2
    origin_y = y + (h - board_h * scale) / 2

    def px(value):
        return origin_x + float(value) * scale

    def py(value):
        return origin_y + (board_h - float(value)) * scale

    for obj in scene.get("objects", []):
        kind = obj.get("type")
        if kind == "box":
            ow, oh = float(obj.get("w", 0)), float(obj.get("h", 0))
            left = px(float(obj.get("x", 0)) - ow / 2)
            bottom = py(float(obj.get("y", 0)) + oh / 2)
            c.saveState()
            c.setStrokeColor(colors.HexColor(obj.get("fill", "#789582")))
            c.setFillColor(colors.HexColor(obj.get("fill", "#e5eee2")))
            c.setFillAlpha(float(obj.get("opacity", 1)))
            if obj.get("shape") == "outline":
                c.rect(left, bottom, ow * scale, oh * scale, stroke=1, fill=0)
            else:
                c.rect(left, bottom, ow * scale, oh * scale, stroke=0, fill=1)
            c.restoreState()
        elif kind == "arrow":
            x1, y1 = px(obj.get("x1", 0)), py(obj.get("y1", 0))
            x2, y2 = px(obj.get("x2", 0)), py(obj.get("y2", 0))
            c.saveState()
            c.setStrokeColor(colors.HexColor(obj.get("color", "#b57c19")))
            c.setFillColor(colors.HexColor(obj.get("color", "#b57c19")))
            c.setLineWidth(max(.8, float(obj.get("width", 3)) * scale))
            if obj.get("dash") == "dashed":
                c.setDash(5 * scale, 4 * scale)
            elif obj.get("dash") == "dotted":
                c.setDash(1 * scale, 4 * scale)
            c.line(x1, y1, x2, y2)
            if obj.get("head"):
                angle = math.atan2(y2 - y1, x2 - x1)
                size = 8 * scale
                left = (x2 - size * math.cos(angle - .55), y2 - size * math.sin(angle - .55))
                right = (x2 - size * math.cos(angle + .55), y2 - size * math.sin(angle + .55))
                path = c.beginPath()
                path.moveTo(x2, y2)
                path.lineTo(left[0], left[1])
                path.lineTo(right[0], right[1])
                path.close()
                c.drawPath(path, stroke=0, fill=1)
            c.restoreState()
        elif kind == "player":
            cx, cy = px(obj.get("x", 0)), py(obj.get("y", 0))
            radius = max(4.2, float(obj.get("r", 14)) * scale)
            c.setFillColor(colors.HexColor(obj.get("color", "#243e78")))
            c.setStrokeColor(WHITE)
            c.setLineWidth(max(.8, 2 * scale))
            c.circle(cx, cy, radius, stroke=1, fill=1)
            c.setFillColor(WHITE)
            c.setFont(FONT_BOLD, max(3.8, radius * .72))
            c.drawCentredString(cx, cy - radius * .24, str(obj.get("label", "")))
        elif kind == "ball":
            cx, cy = px(obj.get("x", 0)), py(obj.get("y", 0))
            radius = max(3, float(obj.get("size", 17)) * scale / 2)
            c.setFillColor(WHITE)
            c.setStrokeColor(colors.HexColor("#222222"))
            c.circle(cx, cy, radius, stroke=1, fill=1)
            c.setFillColor(colors.HexColor("#222222"))
            c.circle(cx, cy, max(1, radius * .25), stroke=0, fill=1)
        elif kind == "goal":
            cx, cy = px(obj.get("x", 0)), py(obj.get("y", 0))
            size = float(obj.get("size", 80)) * scale
            c.saveState()
            c.translate(cx, cy)
            c.rotate(-float(obj.get("rotation", 0)))
            c.setStrokeColor(GREEN)
            c.setLineWidth(max(1, 2 * scale))
            c.rect(-size / 2, -4 * scale, size, 8 * scale, stroke=1, fill=0)
            c.restoreState()
        elif kind == "text":
            tx, ty = px(obj.get("x", 0)), py(obj.get("y", 0))
            size = max(4.5, float(obj.get("size", 20)) * scale)
            c.setFillColor(colors.HexColor(obj.get("color", "#26372d")))
            c.setFont(FONT_BOLD if obj.get("bold") else FONT, size)
            c.drawString(tx, ty - size * .75, str(obj.get("text", "")))


def page_warmup(c, task):
    header(c, 2)
    title(c, task["title"], f'{task["durationMin"]} minutos · {task["players"]}')
    draw_warmup_visual(c, 50, 290, PAGE_W - 100, 170)
    col_w = (PAGE_W - 100) / 2
    rows = [
        (("Objetivo", task["objective"]), ("Espacio", task["space"])),
        (("Organización", task["organization"]), ("Desarrollo", task["development"])),
        (("Reglas", task["rules"]), ("Rotaciones", task["rotations"])),
        (("Correcciones", task["coachingPoints"]), ("Carga", task["load"] + " " + task["notes"])),
    ]
    top = 270
    row_h = 54
    for idx, row in enumerate(rows):
        yy = top - (idx + 1) * row_h
        field(c, 50, yy, col_w, row_h, row[0][0], row[0][1], value_size=8.0)
        field(c, 50 + col_w, yy, col_w, row_h, row[1][0], row[1][1], value_size=8.0)
    c.setFillColor(GREEN_SOFT)
    c.setStrokeColor(GREEN_LINE)
    c.rect(50, 34, PAGE_W - 100, 24, stroke=1, fill=1)
    c.setFillColor(GREEN)
    c.setFont(FONT_BOLD, 10)
    c.drawCentredString(PAGE_W / 2, 42, "Mirar antes · recibir de lado · moverse después del pase")
    c.showPage()


def page_task(c, task, page_number):
    header(c, page_number)
    compact_subtitles = {
        "ataque-mc-posesion": "20 minutos · 20 jugadores de campo + 3 porteros · dos espacios simultáneos",
        "ataque-mc-progresion": "24 minutos · 5 contra 5 + portero en dos espacios · tercer portero de relevo",
        "ataque-mc-partido": "28 minutos · 8 contra 8 + 2 MC comodines + 2 porteros · tres relevos",
    }
    subtitle = compact_subtitles.get(
        task["diagram"], f'{task["durationMin"]} minutos · {task["players"]}'
    )
    title(c, task["title"], subtitle)
    diagrams = [ASSETS / f'{task["diagram"]}-{i}.json' for i in (1, 2, 3)]
    labels = ["1. ORGANIZAR", "2. CIRCULAR POR LOS MC", "3. CAMBIAR Y PROGRESAR"]
    start_x, gap = 50, 10
    box_w = (PAGE_W - 100 - 2 * gap) / 3
    box_h = 178
    box_y = 290
    for idx, (path, caption) in enumerate(zip(diagrams, labels)):
        x = start_x + idx * (box_w + gap)
        c.setFillColor(WHITE)
        c.setStrokeColor(LINE)
        c.roundRect(x, box_y, box_w, box_h, 7, stroke=1, fill=1)
        c.setFillColor(INK)
        c.setFont(FONT_BOLD, 7.5)
        c.drawString(x + 7, box_y + box_h - 13, caption)
        draw_scene(c, path, x + 5, box_y + 5, box_w - 10, box_h - 24)

    col_w = (PAGE_W - 100) / 2
    rows = [
        (("Objetivo", task["objective"]), ("Espacio", task["space"])),
        (("Organización", task["organization"]), ("Desarrollo", task["development"])),
        (("Reglas", task["rules"]), ("Rotaciones", task["rotations"])),
        (("Correcciones", task["coachingPoints"]), ("Carga y notas", task["load"] + " " + task["notes"])),
    ]
    top = 279
    row_h = 54
    for idx, row in enumerate(rows):
        yy = top - (idx + 1) * row_h
        field(c, 50, yy, col_w, row_h, row[0][0], row[0][1], value_size=7.75)
        field(c, 50 + col_w, yy, col_w, row_h, row[1][0], row[1][1], value_size=7.75)
    c.setFillColor(GOLD_SOFT)
    c.setStrokeColor(GOLD)
    c.rect(50, 34, PAGE_W - 100, 24, stroke=1, fill=1)
    c.setFillColor(GREEN)
    c.setFont(FONT_BOLD, 10)
    cue = "Un MC viene a ayudar · el otro se coloca en diagonal · si cierran un lado, cambiamos"
    c.drawCentredString(PAGE_W / 2, 42, cue)
    c.showPage()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=landscape(A4), pageCompression=1)
    c.setTitle("Sesión - Ataque organizado y distribución de los MC")
    c.setAuthor("DanIA Táctica")
    page_summary(c)
    page_warmup(c, SESSION["tasks"][0])
    for idx, task in enumerate(SESSION["tasks"][1:], 3):
        page_task(c, task, idx)
    c.save()


if __name__ == "__main__":
    main()

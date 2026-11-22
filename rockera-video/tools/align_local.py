"""Alineación aproximada de palabras con el audio, solo con pausas (ffmpeg silencedetect).
Se usa mientras no hay transcripción con tiempos por palabra. Uso: align_local.py audio.mp3 guion.txt salida.json"""
import json, re, subprocess, sys

audio, script_path, out = sys.argv[1:4]
text = open(script_path, encoding="utf-8").read().strip()
tokens = text.split()

def syl(w):
    w = re.sub(r"[^a-záéíóúüñ]", "", w.lower())
    n = 0
    for m in re.finditer(r"[aeiouáéíóúü]+", w):
        c = m.group()
        k = 1
        for a, b in zip(c, c[1:]):
            if (a in "aeoáéó" and b in "aeoáéó") or a in "íú" or b in "íú":
                k += 1
        n += k
    return max(n, 1)

dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                     "-of", "default=nw=1:nk=1", audio]).decode())
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", audio, "-af", "silencedetect=noise=-32dB:d=0.10",
                      "-f", "null", "-"], capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]

# Tramos de voz entre silencios
segs, t = [], 0.0
for s, e in zip(starts, ends):
    if s - t > 0.05:
        segs.append((t, s))
    t = e
if dur - t > 0.05:
    segs.append((t, dur))

S, N = len(segs), len(tokens)
sy = [syl(w) for w in tokens]
pre = [0]
for v in sy:
    pre.append(pre[-1] + v)
voiced = sum(b - a for a, b in segs)
rate = voiced / pre[-1]          # segundos por sílaba

def strong_end(i):               # palabra i cierra frase/pausa natural
    return bool(re.search(r"[.?!:,;]$", tokens[i]))

INF = 1e18
# dp[j][i]: mejor costo de asignar las primeras i palabras a los primeros j tramos
dp = [[INF] * (N + 1) for _ in range(S + 1)]
bk = [[-1] * (N + 1) for _ in range(S + 1)]
dp[0][0] = 0.0
for j in range(1, S + 1):
    d = segs[j - 1][1] - segs[j - 1][0]
    for i in range(j, N + 1):
        for k in range(j - 1, i):
            if dp[j - 1][k] >= INF:
                continue
            exp = rate * (pre[i] - pre[k])
            cost = (d - exp) ** 2
            if i < N and not strong_end(i - 1):
                cost += 0.02          # cortar en medio de una frase cuesta un poco
            c = dp[j - 1][k] + cost
            if c < dp[j][i]:
                dp[j][i] = c
                bk[j][i] = k
# reconstruir
groups, i = [], N
for j in range(S, 0, -1):
    k = bk[j][i]
    groups.append((k, i, j - 1))
    i = k
groups.reverse()

words = []
for k, i, j in groups:
    a, b = segs[j]
    tot = pre[i] - pre[k]
    cur = a
    for w in range(k, i):
        span = (b - a) * sy[w] / tot
        words.append({"text": tokens[w], "startMs": round(cur * 1000), "endMs": round((cur + span) * 1000)})
        cur += span
json.dump({"durationMs": round(dur * 1000), "source": "local-silence-alignment", "words": words},
          open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("tramos", S, "palabras", N, "seg/silaba", round(rate, 3))
for w in words:
    print(f"{w['startMs']/1000:6.2f}-{w['endMs']/1000:6.2f}  {w['text']}")

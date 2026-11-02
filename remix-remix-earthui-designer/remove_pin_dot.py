with open('src/components/EarthGlobeCanvas.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

dot_span = '<span className="w-[4px] h-[4px] rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />'
if dot_span in text:
    text = text.replace(dot_span, '', 1)
    with open('src/components/EarthGlobeCanvas.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Removed globe active pin dot!')
else:
    print('Pin dot not found')

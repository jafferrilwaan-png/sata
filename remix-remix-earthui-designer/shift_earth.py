with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<div className="pointer-events-none relative w-full h-[250px] shrink-0 sm:h-auto sm:fixed sm:inset-0 z-10 flex items-center justify-center">'
replacement = '''<div
        className={`pointer-events-none relative w-full h-[250px] shrink-0 sm:h-auto sm:fixed sm:inset-0 z-10 flex items-center transition-all duration-700 ease-out ${
          isSearchSubmitted
            ? 'sm:justify-start sm:pl-[4vw] lg:pl-[8vw]'
            : 'sm:justify-center'
        }`}
      >'''

if target in text:
    text = text.replace(target, replacement, 1)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print('Earth stage updated!')
else:
    print('Target not found')

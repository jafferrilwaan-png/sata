with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if "const [orbitsRes, incidentsRes] = await Promise.all([" in line:
        new_lines.append("        const [orbitsRes, incidentsRes, firmsRes] = await Promise.all([\n")
    elif "fetch('/api/incidents')," in line:
        new_lines.append("          fetch('/api/incidents'),\n")
        new_lines.append("          fetch('/api/firms'),\n")
    elif "setLiveIncidents(data.incidents);\n" in line:
        new_lines.append(line)
        new_lines.append("          }\n")
        new_lines.append("        }\n")
        new_lines.append("        if (firmsRes && firmsRes.ok && isMounted) {\n")
        new_lines.append("          const firmsData = await firmsRes.json();\n")
        new_lines.append("          if (firmsData?.points && Array.isArray(firmsData.points) && firmsData.points.length > 0) {\n")
        new_lines.append("            setLiveFirmsPoints(firmsData.points);\n")
    elif i == 657: # skip the closing brackets we handled above
        continue
    elif i == 658:
        continue
    else:
        new_lines.append(line)

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('FIRMS sync successfully added to minute loop!')

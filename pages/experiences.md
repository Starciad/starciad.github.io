---
layout: page
label: experiences
section: experiences

title: Experiências
permalink: /experiences/
---

As experiências desempenham um papel importante na trajetória profissional, pois refletem oportunidades de aprendizado, desenvolvimento de habilidades e evolução ao longo do tempo. Nesta página, reúno aquelas que considero mais relevantes em minha trajetória, abrangendo diferentes áreas, atividades e contextos.

Cada experiência representa uma oportunidade de aplicar conhecimentos, enfrentar desafios e adquirir novas perspectivas, contribuindo para meu crescimento pessoal e profissional. Ao apresentá-las, busco registrar parte do caminho que percorri e compartilhar os principais marcos que têm contribuído para minha formação.

{% assign experiences = site.experiences | sort: "title" %}

{% for experience in experiences %}

- [{{ experience.title }}]({{ experience.url | relative_url }})

{% endfor %}

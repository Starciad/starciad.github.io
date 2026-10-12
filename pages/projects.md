---
layout: page
label: projects
section: projects

title: Projetos
permalink: /projects/
---

Transformar conhecimentos teóricos em aplicações práticas é uma maneira de consolidar o aprendizado, explorar novas ideias e desenvolver soluções para diferentes problemas. Mesmo os projetos mais simples podem representar desafios relevantes, incentivar a experimentação e proporcionar novas oportunidades de aprendizado.

Nesta seção, apresento os projetos que desenvolvi ao longo do tempo, sejam eles pessoais, acadêmicos ou profissionais. Cada iniciativa representa uma oportunidade de colocar conhecimentos em prática, experimentar abordagens diferentes e ampliar minhas habilidades, refletindo parte da minha evolução na área de tecnologia.

{% assign projects = site.projects | sort: "date" | reverse %}

{% for project in projects %}

- [{{ project.title }}]({{ project.url | relative_url }}) **({{ project.date | date: "%Y" }})**: {{ project.short_description }}

{% endfor %}

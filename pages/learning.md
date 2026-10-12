---
layout: page
label: learning
section: learning

title: Aprendizagem
permalink: /learning/
---

A construção do conhecimento exige dedicação, tempo e investimento contínuo. Nesta seção, reúno os principais elementos que compõem minha trajetória de aprendizado, abrangendo desde a formação acadêmica até cursos, treinamentos, certificações, livros, artigos, vídeos e outros materiais de estudo.

Mais do que apresentar os conhecimentos que venho adquirindo, este espaço busca registrar parte do meu processo de aprendizagem e os recursos que contribuem para meu desenvolvimento. Acredito que compartilhar essas referências pode ser útil para outras pessoas que também buscam ampliar seus conhecimentos e aprofundar-se em suas respectivas áreas de interesse.

{% assign categories = site.learning | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = category.name %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString }}

{% for item in categoryItems %}

- [{{ item.title }}]({{ item.url | relative_url }})

{% endfor %}

{% endfor %}

---
layout: page
label: technologies
section: technologies

title: Tecnologias
permalink: /technologies/
---

Nesta seção, reúno as tecnologias com as quais tive contato ao longo da minha trajetória, seja em projetos pessoais, acadêmicos ou profissionais. Cada uma delas conta com uma página própria, dedicada a apresentar um pouco da minha experiência, incluindo projetos desenvolvidos, desafios enfrentados e aprendizados adquiridos.

Sinta-se à vontade para explorar as páginas e conhecer um pouco mais sobre as ferramentas e tecnologias que fazem parte da minha jornada na área de tecnologia.

{% assign categories = site.technologies | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = category.name %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString }}

{% for technology in categoryItems %}

- [{{ technology.title }}]({{ technology.url | relative_url }})

{% endfor %}

{% endfor %}

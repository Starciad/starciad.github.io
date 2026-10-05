---
layout: page
identifier: experiences
title: Experiências
permalink: /experiences/
---

{% if site.experiences.size > 0 %}
| Título | Descrição | Data | Ação |
| --- | --- | --- | --- |
{%- for experience in site.experiences %}
| {{ experience.title }} | {{ experience.description }} | {{ experience.date | date: "%d/%m/%Y" }} | [Ver detalhes]({{ experience.url | relative_url }}) |
{%- endfor %}
{% else %}
Nenhuma experiência encontrada.
{% endif %}

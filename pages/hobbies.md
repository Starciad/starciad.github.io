---
layout: page
label: hobbies
section: hobbies

title: Hobbies
permalink: /hobbies/
---

| Título | Ação |
| --- | --- |
{%- for hobby in site.hobbies %}
| {{ hobby.title }} | [Ver detalhes]({{ hobby.url | relative_url }}) |
{%- endfor %}

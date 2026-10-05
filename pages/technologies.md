---
layout: page
label: technologies
section: technologies

title: Tecnologias
permalink: /technologies/
---

{% assign categories = site.technologies | group_by: "category_label" | sort: "name" %}
{% for category in categories %}
## {{ category.name }}

| Tecnologia | Ação |
| --- | --- |
{%- for technology in category.items %}
| {{ technology.title }} | [Ler mais]({{ technology.url | relative_url }}) |
{%- endfor %}
{% endfor %}

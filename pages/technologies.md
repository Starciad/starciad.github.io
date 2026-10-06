---
layout: page
label: technologies
section: technologies

title: Tecnologias
permalink: /technologies/
---

{% assign categories = site.technologies | group_by: "category" | sort: "name" %}
{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}

### {{ categoryString.label }}

| Tecnologia | Ação |
| --- | --- |
{%- for technology in category.items %}
| {{ technology.title }} | [Ler mais]({{ technology.url | relative_url }}) |
{%- endfor %}
{% endfor %}

---
layout: page
label: learning
section: learning

title: Aprendizagem
permalink: /learning/
---

{% assign categories = site.learning | group_by: "category" | sort: "name" %}
{% for category in categories %}
## {{ category.name }}

| Título | Ação |
| --- | --- |
{%- for item in category.items %}
| {{ item.title }} | [Ler mais]({{ item.url | relative_url }}) |
{%- endfor %}
{% endfor %}

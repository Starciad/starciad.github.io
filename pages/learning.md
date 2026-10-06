---
layout: page
label: learning
section: learning

title: Aprendizagem
permalink: /learning/
---

{% assign categories = site.learning | group_by: "category" | sort: "name" %}
{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}

### {{ categoryString.label }}

| Título | Ação |
| --- | --- |
{%- for item in category.items %}
| {{ item.title }} | [Ler mais]({{ item.url | relative_url }}) |
{%- endfor %}
{% endfor %}
